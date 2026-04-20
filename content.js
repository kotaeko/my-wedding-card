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
  mainMessage: "그냥 매일 손 잡고 걸을 수 있는 여유로운 저녁이 있는 것\n지친 하루의 끝마다 돌아와 꼭 함께하는 것\n잠시 마주앉아 서로 이야길 들어줄 수 있는 것\n네가 늘 있는 것\n<strong>- 슌 '내 꿈은 당신과 나태하게 사는 것' -</strong>\n\n우리는 앞으로의 모든 날도 이렇게 걸어가려 합니다.\n내 꿈은 당신과 나태하게 사는 것 그 꿈을 함께 살아가겠습니다.",


  // ── 표지(Hero) 사진 ───────────────────────────────────────
  // 봉투를 열었을 때 나타나는 첫 번째 사진입니다.
  // 갤러리와 무관하게 별도로 관리됩니다.
  heroPhoto: "images/couple.webp",

  // ── 커플 사진 갤러리 (구글 드라이브) ─────────────────────
  //
  // 사진 추가 방법:
  //   1. 구글 드라이브에 사진 업로드
  //   2. 사진 우클릭 → 공유 → "링크가 있는 모든 사용자" 로 변경
  //   3. 공유 링크에서 파일 ID만 복사하세요
  //      예) https://drive.google.com/file/d/[ 이 부분 ]/view?usp=sharing
  //   4. 아래에 줄 추가: "파일ID",
  couplePhotos: [
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

  // ── 연애 타임라인 서브타이틀 ─────────────────────────────
  // \n은 줄바꿈입니다
  timelineSubtitle: "저희 연애의 타임라인입니다\n행복한 추억이 가득한 N년",

  // ── 연애 타임라인 ─────────────────────────────────────────
  //
  // 일반 항목:
  //   date:        배지에 표시할 날짜/장소 (예: "19년 5월, 캠퍼스")
  //   icon:        이모지 (없으면 빈칸 "")
  //   title:       이벤트 제목
  //   description: 짧은 설명 (\n으로 줄바꿈 가능)
  //   photo:       구글 드라이브 파일 ID (없으면 빈칸 "")
  //
  // 마일스톤 항목 (중앙에 강조 표시):
  //   type: "milestone"
  //   badge:       골드 배지에 표시될 텍스트 (예: "연애 기간 2,553일")
  //   icon:        이모지
  //   title:       제목
  //   description: 설명
  timeline: [
    {
      date: "어린 시절",
      icon: "🌱",
      title: "운명의 짝꿍을 기다리던 어린시절",
      description: "설명을 입력해주세요",
      photo: "",
    },
    {
      date: "00년 0월, 첫만남",
      icon: "",
      title: "첫만남",
      description: "처음 만난 날의\n설명을 입력해주세요",
      photo: "",
    },
    {
      type: "milestone",
      badge: "연애 기간 0,000일",
      icon: "🥂",
      title: "행복했던 N년",
      description: "우리의 소중한 시간",
    },
    {
      date: "00년 0월, 프로포즈",
      icon: "💍",
      title: "프로포즈",
      description: "영원을 약속한 날의\n설명을 입력해주세요",
      photo: "",
    },
    {
      date: "26년 7월 5일, 결혼",
      icon: "🤵👰",
      title: "웨딩데이",
      description: "이제는 둘이 아닌\n하나로 걷기 시작하는 날",
      photo: "",
    },
  ],

  // ── OG 이미지 (카카오톡으로 링크 공유 시 미리보기 이미지) ──
  // 1. Cloudinary에 1200×630 사이즈 이미지를 업로드하세요
  //    (캔바/피그마로 커플 사진 + 날짜 넣은 이미지를 만들면 좋아요)
  // 2. Cloudinary에서 해당 이미지의 URL을 복사해 붙여넣으세요
  ogImageUrl: "",                   // 예: "https://res.cloudinary.com/your-cloud/image/upload/og_image.jpg"
  ogDescription: "2026년 7월 5일 일요일 오후 1시 20분 | 까사그랑데센트로",

};
