// ============================================================
// ★ 이 파일만 수정하시면 됩니다 ★
//
// 수정 방법:
//   큰따옴표(" ") 안의 내용만 바꾸세요.
//   따옴표 자체나 쉼표(,)는 건드리지 마세요.
//
// 저장 후 Netlify에 폴더를 다시 드래그하면 반영됩니다.
// ============================================================

const WEDDING_CONTENT = {

  // ── 메인 화면(봉투 화면) 문구 ────────────────────────────
  // \n을 넣으면 줄바꿈이 됩니다. (영상의 텍스트를 기본값으로 넣어두었습니다)
  heroTopText: "겨울이와 여름이의\n특별한 결혼식에 당신을 초대합니다.",
  heroMiddleText: "The Wedding of\n태혁 & 서아",

  // ── 이름 ─────────────────────────────────────────────────
  groomName: "고태혁",
  brideName: "김서아",
  groomNameEng: "TAE HYEOK",
  brideNameEng: "SEO A",

  // ── 양가 부모님 ───────────────────────────────────────────
  groomFather: "고명덕",
  groomMother: "정효임",
  brideFather: "김일연",
  brideMother: "이명희",

  // ── 결혼식 날짜/시간 ──────────────────────────────────────
  weddingDate: "2026-07-05",        // 형식: YYYY-MM-DD (변경하지 마세요)
  weddingDayDisplay: "2026년 7월 5일 일요일",
  weddingTime: "오후 1시 20분",

  // ── 예식장 ───────────────────────────────────────────────
  venueName: "까사그랑데센트로",
  venueHall: "Eterno Hall (에떼르노홀)",
  venueAddress: "서울 광진구 능동로 87 건대입구역자이엘라 6층",
  venueMapUrl: "https://kko.to/X1Sqw0bkv3",
  naverMapUrl: "https://naver.me/GhbuXbYP",

  // ── 교통 안내 (없으면 빈칸 "") ────────────────────────────
  transportInfo: [
    { icon: "🚇", label: "지하철", detail: "건대입구역 하차 후 5번출구 (도보 2분)" },
    { icon: "🚌", label: "버스", detail: "" },    // 추후 입력
    { icon: "🚗", label: "자가용", detail: "" },  // 추후 입력
  ],

  // ── 초대 문구 ─────────────────────────────────────────────
  // \n 은 줄바꿈입니다
  mainMessage: "서로가 서로의 곁에 머물며\n사랑으로 하나가 되려 합니다.\n\n소중한 분들을 모시고자 하오니\n부디 오셔서 자리를 빛내 주시기 바랍니다.",

  // ── 봉투 편지지 사진 하단 문구 ────────────────────────
  letterText: "서동이 사랑해\n내가 항상 웃게해줄게 ♥",

  // ── 커플 사진 갤러리 (구글 드라이브) ─────────────────────
  //
  // 사진 추가 방법:
  //   1. 구글 드라이브에 사진 업로드
  //   2. 사진 우클릭 → 공유 → "링크가 있는 모든 사용자" 로 변경
  //   3. 공유 링크에서 파일 ID만 복사하세요
  //      예) https://drive.google.com/file/d/[ 이 부분 ]/view?usp=sharing
  //   4. 아래에 줄 추가: "파일ID",
  //
  // ★ 첫 번째 사진이 표지(Hero) 화면에도 사용됩니다.
  couplePhotos: [
    "images/couple.jpg",
    "13F3HG_a216-0pck5jd75002Ixbu53p8Y",
    "17qOcsUixbtVMWWqBz4TTPrQocogFzORd",
  ],

  // ── 계좌번호 (축의금) ─────────────────────────────────────
  // role: 행 왼쪽에 표시되는 역할 (신랑, 아버지, 어머니 등)
  // holder: 예금주 이름
  // 없으면 해당 줄을 통째로 지우세요
  accounts: {
    groom: [
      { role: "신랑", bank: "은행명", number: "계좌번호", holder: "고태혁" },
      { role: "아버지", bank: "은행명", number: "계좌번호", holder: "고명덕" },
      { role: "어머니", bank: "은행명", number: "계좌번호", holder: "정효임" },
    ],
    bride: [
      { role: "신부", bank: "은행명", number: "계좌번호", holder: "김서아" },
      { role: "아버지", bank: "은행명", number: "계좌번호", holder: "김일연" },
      { role: "어머니", bank: "은행명", number: "계좌번호", holder: "이명희" },
    ],
  },

  // ── 연락처 ───────────────────────────────────────────────
  groomPhone: "010-5013-9690",
  bridePhone: "010-5270-5736",
  groomMotherPhone: "",             // 없으면 빈칸 ""
  brideMotherPhone: "",

  // ── 하객 사진 공유 섹션 안내 문구 ─────────────────────────
  guestPhotoMessage: "소중한 순간을 함께 나눠주세요.\n찍어주신 사진을 이곳에 올려주시면\n신랑신부가 소중히 간직하겠습니다.",

  // ── OG 이미지 (카카오톡으로 링크 공유 시 미리보기 이미지) ──
  // 1. Cloudinary에 1200×630 사이즈 이미지를 업로드하세요
  //    (캔바/피그마로 커플 사진 + 날짜 넣은 이미지를 만들면 좋아요)
  // 2. Cloudinary에서 해당 이미지의 URL을 복사해 붙여넣으세요
  ogImageUrl: "",                   // 예: "https://res.cloudinary.com/your-cloud/image/upload/og_image.jpg"
  ogDescription: "2026년 7월 5일 일요일 오후 1시 20분 | 까사그랑데센트로",

};
