# 편지 봉투 열기 애니메이션 구현 계획 (Envelope Animation Implementation Plan)

사용자께서 요청하신 고급스럽고 정교한 '편지 봉투 열기 애니메이션'의 구현 계획입니다. 참고 영상과 전달해주신 디테일 사항(시퀀스, 레이어, 가속도, 트리거)을 모두 만족할 수 있도록 설계했습니다.

## 1. 구현 목표 (Goal)
- **프리미엄 비주얼**: 은은하고 입체적인 Drop Shadow와 리얼한 봉투 형태(역삼각형 뚜껑, 대각선 이음새)
- **자연스러운 인터랙션 (Trigger)**: 클릭(터치) 또는 아래로 스와이프할 때 애니메이션 시작, 화면 최상단으로 돌아갈 때 역재생(닫힘).
- **정교한 Z-Depth**: 편지지가 봉투 입구(앞면) 보다는 뒤에서 나오면서도, 뒷배경의 'View Details' 텍스트보다는 위로 스크롤되어 가리는 깔끔한 레이어 처리.
- **물리법칙 기반 모션**: 안티그레비티 특유의 쫀득한 `cubic-bezier` 가속도 적용.

## 2. 작업 상세 내역 (Proposed Changes)

### [수정 대상: `index.html`]
초대장 상단 영역(Hero)에 봉투와 편지지 DOM 구조를 새롭게 구축합니다.
- `div.envelope-container` 추가
- 그 내부에 레이어 순서를 지키기 위한 엘리먼트들 배치 (back, letter, front, flap)

### [수정 대상: `css/style.css` & `css/animations.css`]
- **Visual Spec**: 봉투 색상, 그림자, 모양(CSS Clip-path 또는 Border 활용)을 스크린샷 노란 봉투와 동일하게 설정합니다.
- **Layering (가장 중요)**:
  - `z-index: 1` -> 배경 텍스트 (View Details 등)
  - `z-index: 10` -> 봉투 뒷면 (`envelope-back`)
  - `z-index: 20` -> 편지지 (`envelope-letter`)
  - `z-index: 30` -> 봉투 앞면 (`envelope-front`)
  - `z-index: 40` -> 봉투 뚜껑 (`envelope-flap` - 접혀있을 땐 앞면보다 위)
  *이러한 층상 구조(Stacking Context)를 통해 편지지가 앞면 봉투 뒤에서 나오면서 배경보다 위로 올라오도록 구성합니다.*
- **모션 텐션 (Easing)**: `cubic-bezier(0.34, 1.56, 0.64, 1)` 과 같은 탄성 있는 부드러운 가속도를 CSS Transition으로 구현합니다.

### [수정 대상: `js/main.js`]
- **Trigger Logic**: 
  1. `envelope-container`에 `click` 이벤트 리스너 추가.
  2. `touchstart`, `touchmove`, `wheel` 이벤트를 감지하여 봉투가 닫힌 상태에서 스크롤 다운이 감지되면 클래스 `.is-open`을 추가.
  3. 봉투가 열려있고 페이지 스크롤이 최상단(`scrollTop === 0`)일 때 상단으로 스크롤 액션이 들어가면 `.is-open`을 제거하여 역재생(Reverse) 트리거.

## 3. 질문 및 확인 사항 (Open Questions)

> [!IMPORTANT]
> **스크린샷의 배경 텍스트 내용**
> 첨부 스크린샷/영상의 텍스트('겨울이와 여름이의 특별한 결혼식...', 'The Wedding of Kim Winter...')는 하드코딩된 예시인가요, 아니면 `content.js`의 `WEDDING_CONTENT` 데이터와 연동해서 동적으로 그려야 하나요? **동적으로 렌더링해야 한다면, Hero 섹션용 텍스트 필드를 `content.js`에 추가해도 괜찮은지** 확인 부탁드립니다.

> [!NOTE]
> 편지지가 밖으로 다 나오고 나서 스크롤이 자연스럽게 이어져야 할텐데, 편지지 자체의 높이나 크기를 실제 핸드폰 화면 크기에 맞춰서 풀스크린 처럼 띄울지, 아니면 일정 크기로 올라온 후에 본문(초대의 글 등)으로 스크롤이 넘어가게 할지 의도하신 방향이 있다면 알려주세요. (기본적으로 편지지가 위로 올라와 넓게 펼쳐지고, 이후 스크롤이 가능하도록 구현할 예정입니다.)

## 4. 검증 계획 (Verification Plan)
- **로컬 테스트**: 데스크톱 브라우저 및 개발자 툴의 모바일 뷰어에서 터치/스크롤 이벤트를 재현해 봉투가 정상적으로 열리고 닫히는지 확인.
- **Z-Index 검증**: 편지지가 View Details 글씨를 완벽하게 가리며 스크롤되는지 시뮬레이션.

위 계획에 대해 동의하시거나 추가하실 의견이 있다면 알려주세요. 승인해주시면 즉시 개발을 진행하겠습니다!
