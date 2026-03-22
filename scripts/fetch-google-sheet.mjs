import { createSign } from "node:crypto";
import { readFile } from "node:fs/promises";

const [, , spreadsheetId, credentialsPath] = process.argv;

if (!spreadsheetId || !credentialsPath) {
  console.error("Usage: node scripts/fetch-google-sheet.mjs <spreadsheetId> <credentialsPath>");
  process.exit(1);
}

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signJwt(header, payload, privateKey) {
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  const signature = signer
    .sign(privateKey)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${signingInput}.${signature}`;
}

async function getAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const jwt = signJwt(
    { alg: "RS256", typ: "JWT" },
    {
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: credentials.token_uri,
      exp: now + 3600,
      iat: now,
    },
    credentials.private_key,
  );

  const response = await fetch(credentials.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function sheetsGet(path, token) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Sheets request failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function main() {
  const credentials = JSON.parse(await readFile(credentialsPath, "utf8"));
  const token = await getAccessToken(credentials);
  const sheet = await sheetsGet("?includeGridData=false", token);

  const result = {
    spreadsheetId: sheet.spreadsheetId,
    title: sheet.properties?.title,
    locale: sheet.properties?.locale,
    timeZone: sheet.properties?.timeZone,
    sheets: [],
  };

  for (const tab of sheet.sheets ?? []) {
    const title = tab.properties?.title;
    const values = await sheetsGet(`/values/${encodeURIComponent(title)}?majorDimension=ROWS`, token);
    result.sheets.push({
      properties: tab.properties,
      rowCount: values.values?.length ?? 0,
      columnCount: Math.max(0, ...(values.values ?? []).map((row) => row.length)),
      values: values.values ?? [],
    });
  }

  process.stdout.write(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
