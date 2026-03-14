import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개",
  description: "나의 투자 일지 소개",
};

/** 소개 페이지 */
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">소개</h1>

      <div className="prose max-w-none">
        <p>
          <strong>나의 투자 일지</strong>는 개인 투자 경험을 솔직하게 기록하는
          블로그입니다. 수익이든 손실이든, 매매의 이유와 결과를 복기하며
          더 나은 투자자로 성장하기 위한 공간입니다.
        </p>

        <h2>기록하는 내용</h2>
        <ul>
          <li>
            <strong>매매일지</strong> — 매수/매도 시점, 판단 근거, 결과 복기
          </li>
          <li>
            <strong>포트폴리오</strong> — 보유 종목 변화, 비중 조절, 리밸런싱
          </li>
          <li>
            <strong>투자 복기</strong> — 잘한 점, 실수한 점, 배운 교훈
          </li>
          <li>
            <strong>투자 공부</strong> — 읽은 책, 배운 개념, 전략 정리
          </li>
        </ul>

        <h2>투자 원칙</h2>
        <ul>
          <li>감정이 아닌 근거로 매매한다</li>
          <li>모든 매매는 기록으로 남긴다</li>
          <li>실수에서 배우고, 같은 실수를 반복하지 않는다</li>
          <li>장기적 관점을 유지한다</li>
        </ul>

        <blockquote>
          이 블로그의 모든 글은 개인적인 투자 기록이며, 투자 권유가 아닙니다.
          투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.
        </blockquote>
      </div>
    </div>
  );
}
