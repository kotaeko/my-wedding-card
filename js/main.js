// main.js
// content.js의 WEDDING_CONTENT를 읽어 화면의 모든 텍스트를 채웁니다.

document.addEventListener('DOMContentLoaded', () => {
  const C = WEDDING_CONTENT;
  let triggerBGM = () => {}; // BGM 자동 재생 트리거용 함수 예약

  // ── 페이지 제목 + OG 태그 ────────────────────────────────
  const pageTitle = C.ogTitle || `${C.groomName} ♥ ${C.brideName} 결혼합니다`;
  document.getElementById('page-title').textContent = pageTitle;
  document.getElementById('og-title').setAttribute('content', pageTitle);

  const ogDesc = C.ogDescription || `${C.weddingDayDisplay} ${C.weddingTime} | ${C.venueName}`;
  document.getElementById('og-description').setAttribute('content', ogDesc);

  if (C.ogImageUrl) {
    document.getElementById('og-image').setAttribute('content', C.ogImageUrl);
  }

  // ── 봉투 편지지 상단 (Letter Top) 세팅 ──────────────────────────────
  const groomNameEl = document.getElementById('letter-groom-name');
  if (groomNameEl) groomNameEl.textContent = C.groomName;

  const brideNameEl = document.getElementById('letter-bride-name');
  if (brideNameEl) brideNameEl.textContent = C.brideName;

  // 창에 보이는 이미지 설정
  const windowImgCont = document.getElementById('letter-window-img');
  if (windowImgCont && C.heroPhoto) {
    windowImgCont.innerHTML = `
      <img src="${C.heroPhoto}" alt="Couple" style="-webkit-touch-callout: none; -webkit-user-drag: none; user-select: none;">
      <div class="photo-overlay"></div>
    `;
  }

  // 달력 렌더링 (Mon ~ Sun)
  const calendarCont = document.getElementById('letter-calendar');
  if (calendarCont && C.weddingDate) {
    const wDate = new Date(C.weddingDate);
    if (!isNaN(wDate.getTime())) {
      const dayOfWeek = wDate.getDay();
      const jsDayToIso = dayOfWeek === 0 ? 7 : dayOfWeek;
      const mondayOffset = jsDayToIso - 1;

      const mondayDate = new Date(wDate);
      mondayDate.setDate(wDate.getDate() - mondayOffset);

      const row = document.createElement('div');
      row.className = 'calendar-row';
      const daysLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      for (let i = 0; i < 7; i++) {
        const curDate = new Date(mondayDate);
        curDate.setDate(mondayDate.getDate() + i);
        const isWeddingDay = (curDate.getTime() === wDate.getTime());

        const colDiv = document.createElement('div');
        colDiv.className = 'cal-col';
        colDiv.innerHTML = `
          <div class="cal-day-label">${daysLabel[i]}</div>
          <div class="cal-date-num ${isWeddingDay ? 'is-wedding' : ''}">${curDate.getDate()}</div>
        `;
        row.appendChild(colDiv);
      }
      calendarCont.appendChild(row);
    }
  }

  // 하단 날짜 (예: 30 May 2026)
  const letterDateEl = document.getElementById('letter-date');
  if (letterDateEl && C.weddingDate) {
    const wDate = new Date(C.weddingDate);
    if (!isNaN(wDate.getTime())) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      letterDateEl.textContent = `${wDate.getDate()} ${months[wDate.getMonth()]} ${wDate.getFullYear()}`;
    }
  }

  // ── 초대의 글 ────────────────────────────────────────────
  const groomShort = C.groomName.length === 3 ? C.groomName.substring(1) : C.groomName;
  const brideShort = C.brideName.length === 3 ? C.brideName.substring(1) : C.brideName;
  const parents = `${C.groomFather} · ${C.groomMother}의 아들 ${groomShort}\n${C.brideFather} · ${C.brideMother}의 딸 ${brideShort}`;
  setMultiline('invitation-parents', parents);
  setMultiline('invitation-message', C.mainMessage);

  // ── 월간 달력 (예식 안내 섹션) ──────────────────────────
  const monthlyCal = document.getElementById('monthly-calendar');
  if (monthlyCal && C.weddingDate) {
    const wDate = new Date(C.weddingDate);
    if (!isNaN(wDate.getTime())) {
      const year = wDate.getFullYear();
      const month = wDate.getMonth();
      const wDay = wDate.getDate();

      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      const monthNamesKo = ['1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'];

      // 해당 월의 1일 요일(0=일)과 마지막 날
      const firstDay = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();
      // 월요일 시작 오프셋: 일(0)→6, 월(1)→0, ... 토(6)→5
      const firstDayOffset = (firstDay + 6) % 7;

      let html = `
        <div class="mcal-header">
          <span class="mcal-year">${year}</span>
          <span class="mcal-month">${monthNamesKo[month]}</span>
        </div>
        <div class="mcal-grid">
          <div class="mcal-dow">월</div>
          <div class="mcal-dow">화</div>
          <div class="mcal-dow">수</div>
          <div class="mcal-dow">목</div>
          <div class="mcal-dow">금</div>
          <div class="mcal-dow sat">토</div>
          <div class="mcal-dow sun">일</div>`;

      // 1일 전 빈 칸
      for (let i = 0; i < firstDayOffset; i++) {
        html += `<div class="mcal-cell empty"></div>`;
      }
      // 날짜 (0=월, 5=토, 6=일)
      for (let d = 1; d <= lastDate; d++) {
        const dow = (firstDayOffset + d - 1) % 7;
        let cls = 'mcal-cell';
        if (dow === 6) cls += ' sun';
        if (dow === 5) cls += ' sat';
        if (d === wDay) cls += ' wedding-day';
        html += `<div class="${cls}">${d}</div>`;
      }

      html += `</div>
        `;
      monthlyCal.innerHTML = html;
    }
  }

  // ── 예식 안내 ────────────────────────────────────────────
  const datetimeEl = document.getElementById('info-datetime');
  if (datetimeEl) datetimeEl.textContent = `${C.weddingDayDisplay}  ${C.weddingTime}`;
  const placeEl = document.getElementById('info-place');
  if (placeEl) placeEl.textContent = `${C.venueName}  ${C.venueHall}`;

  // ── 오시는 길 ────────────────────────────────────────────
  document.getElementById('map-address').textContent = C.venueAddress;

  const transportList = document.getElementById('transport-list');
  C.transportInfo.forEach(item => {
    if (!item.detail) return;
    const div = document.createElement('div');
    div.className = 'transport-item';
    div.innerHTML = `<span class="transport-icon">${item.icon}</span>
      <span class="transport-label">${item.label}</span>
      <span class="transport-detail">${item.detail}</span>`;
    transportList.appendChild(div);
  });

  const parkingNoticeEl = document.getElementById('parking-notice');
  if (parkingNoticeEl && C.parkingNotice) {
    parkingNoticeEl.textContent = C.parkingNotice;
  }
  // ── 연애 타임라인 ─────────────────────────────────────────
  const timelineSubtitleEl = document.getElementById('timeline-subtitle');
  if (timelineSubtitleEl && C.timelineSubtitle) {
    timelineSubtitleEl.innerHTML = parseHighlight(C.timelineSubtitle);
  }

  // 타임라인 라이트박스 열기/닫기 함수 정의 및 이벤트 바인딩
  const tlLb  = document.getElementById('tl-lightbox');
  const tlImg = document.getElementById('tl-lightbox-img');

  function openTimelineLightbox(photoUrl) {
    if (!tlLb || !tlImg) return;
    tlImg.src = photoUrl;
    tlLb.classList.add('active');
    document.body.style.overflow = 'hidden'; // 바디 스크롤 차단
  }

  function closeTimelineLightbox() {
    if (!tlLb || !tlImg) return;
    tlLb.classList.remove('active');
    document.body.style.overflow = ''; // 바디 스크롤 재개
    tlImg.src = '';
  }

  // ✕ 버튼 클릭 시 닫기
  document.getElementById('tl-lightbox-close')?.addEventListener('click', closeTimelineLightbox);

  // 배경(여백 및 오버레이) 클릭 시 닫기
  tlLb?.addEventListener('click', e => {
    if (e.target === e.currentTarget || e.target.classList.contains('photo-overlay')) {
      closeTimelineLightbox();
    }
  });

  // ESC 키 누를 시 닫기
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && tlLb?.classList.contains('active')) {
      closeTimelineLightbox();
    }
  });

  // 이미지 및 오버레이 저장/다운로드/드래그 방지 헬퍼
  function tlPreventSave(el) {
    el.addEventListener('contextmenu', e => e.preventDefault());
    el.addEventListener('dragstart',   e => e.preventDefault());
  }

  if (tlImg) {
    tlPreventSave(tlImg);
    // 확대 방지 (터치 핀치 확대 차단)
    tlImg.addEventListener('touchmove', e => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
  }
  
  const tlOverlay = tlLb?.querySelector('.photo-overlay');
  if (tlOverlay) {
    tlPreventSave(tlOverlay);
  }

  const timelineList = document.getElementById('timeline-list');
  if (timelineList && Array.isArray(C.timeline)) {
    let photoSide = 'left';

    C.timeline.forEach(item => {
      // 마일스톤 항목 (중앙 강조) - 디자인 통일성을 위해 렌더링하지 않고 건너뜁니다.
      if (item.type === 'milestone') {
        return; // 좌우 교차에 영향 없이 조용히 넘어갑니다.
      }

      const side = photoSide;
      const div = document.createElement('div');
      div.className = `tl-row tl-photo-${side}`;

      // 사진 컬럼 생성 (이벤트 리스너 바인딩을 위해 DOM API 활용)
      const photoCol = document.createElement('div');
      photoCol.className = 'tl-photo-col';

      if (item.photo) {
        const img = document.createElement('img');
        img.src = item.photo;
        img.alt = item.title;
        img.className = 'tl-img';
        img.loading = 'lazy';
        
        // 클릭 시 크게 띄우는 기능 연동
        img.addEventListener('click', () => {
          openTimelineLightbox(item.photo);
        });
        
        // 메인 이미지 우클릭/드래그 저장 및 확대 방지 적용
        tlPreventSave(img);

        photoCol.appendChild(img);
      } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'tl-img-placeholder';
        placeholder.textContent = '📷';
        photoCol.appendChild(placeholder);
      }

      const lineCol = document.createElement('div');
      lineCol.className = 'tl-line-col';
      lineCol.innerHTML = '<div class="tl-dot"></div>';

      const textCol = document.createElement('div');
      textCol.className = 'tl-text-col';
      textCol.innerHTML = `
        ${item.date ? `<span class="tl-date-sub">${parseHighlight(item.date)}</span>` : ''}
        <div class="tl-title-row">
          ${item.icon ? `<span class="tl-icon">${item.icon}</span>` : ''}
          <span class="tl-title">${parseHighlight(item.title)}</span>
        </div>
        <p class="tl-desc">${parseHighlight(item.description)}</p>
      `;

      if (side === 'left') {
        div.appendChild(photoCol);
        div.appendChild(lineCol);
        div.appendChild(textCol);
      } else {
        div.appendChild(textCol);
        div.appendChild(lineCol);
        div.appendChild(photoCol);
      }

      timelineList.appendChild(div);
      photoSide = photoSide === 'left' ? 'right' : 'left';
    });
  }

  // ── 축하의 마음 및 연락처 (아코디언 토글 방식) ─────────────
  const accountsList = document.getElementById('accounts-list');
  const accs = C.accounts;

  // 탭 바 생성
  const tabBar = document.createElement('div');
  tabBar.className = 'account-tab-bar';
  tabBar.innerHTML = `
    <button class="account-tab active" data-side="groom">신랑측</button>
    <button class="account-tab" data-side="bride">신부측</button>`;
  accountsList.appendChild(tabBar);

  // 탭 패널 및 아코디언 카드 생성
  ['groom', 'bride'].forEach(side => {
    const panel = document.createElement('div');
    panel.className = 'account-panel';
    panel.dataset.side = side;
    if (side !== 'groom') panel.style.display = 'none';

    (accs[side] || []).forEach(acc => {
      if (!acc.number) return;

      // 이름 기준 연락처 매칭
      let phone = "";
      if (side === 'groom') {
        if (acc.role === "신랑" || acc.holder === C.groomName) phone = C.groomPhone;
        else if (acc.role === "아버지" || acc.holder === C.groomFather) phone = C.groomFatherPhone;
        else if (acc.role === "어머니" || acc.holder === C.groomMother) phone = C.groomMotherPhone;
      } else if (side === 'bride') {
        if (acc.role === "신부" || acc.holder === C.brideName) phone = C.bridePhone;
        else if (acc.role === "아버지" || acc.holder === C.brideFather) phone = C.brideFatherPhone;
        else if (acc.role === "어머니" || acc.holder === C.brideMother) phone = C.brideMotherPhone;
      }

      const card = document.createElement('div');
      card.className = 'profile-accordion-card';

      let detailsHtml = '';
      
      // 계좌 번호 줄
      detailsHtml += `
        <div class="info-detail-item">
          <div class="info-detail-left">
            <span class="info-detail-label">🏦 계좌번호</span>
            <span class="info-detail-val">${acc.bank} <span class="num-highlight">${acc.number}</span></span>
          </div>
          <button class="action-btn copy-account-btn" data-bank="${acc.bank}" data-number="${acc.number}">계좌 복사</button>
        </div>
      `;

      // 휴대폰 번호 줄 (데이터가 있을 때만 노출)
      if (phone) {
        detailsHtml += `
          <div class="info-detail-item">
            <div class="info-detail-left">
              <span class="info-detail-label">📱 연락처</span>
              <span class="info-detail-val">${phone}</span>
            </div>
            <button class="action-btn copy-phone-btn" data-phone="${phone}">번호 복사</button>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="profile-header">
          <div class="profile-meta">
            <span class="profile-role">${acc.role}</span>
            <span class="profile-name">${acc.holder}</span>
          </div>
          <button class="toggle-trigger-btn" aria-label="상세 정보 보기">
            <svg class="toggle-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
        <div class="profile-details">
          <div class="profile-details-inner">
            ${detailsHtml}
          </div>
        </div>
      `;

      panel.appendChild(card);
    });

    accountsList.appendChild(panel);
  });

  // 탭 전환
  tabBar.addEventListener('click', e => {
    const tab = e.target.closest('.account-tab');
    if (!tab) return;
    tabBar.querySelectorAll('.account-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    accountsList.querySelectorAll('.account-panel').forEach(p => {
      p.style.display = p.dataset.side === tab.dataset.side ? 'block' : 'none';
      // 탭 전환 시 기존 열려있던 아코디언 카드들을 부드럽게 닫아 레이아웃 흔들림 방지
      p.querySelectorAll('.profile-accordion-card').forEach(card => {
        card.classList.remove('is-active');
        const details = card.querySelector('.profile-details');
        if (details) details.style.maxHeight = '0px';
      });
    });
  });

  // 아코디언 토글 핸들링
  accountsList.addEventListener('click', e => {
    const header = e.target.closest('.profile-header');
    if (!header) return;
    
    const card = header.closest('.profile-accordion-card');
    if (!card) return;

    const details = card.querySelector('.profile-details');
    const isActive = card.classList.contains('is-active');

    // 다른 모든 열려있는 카드 닫기 (아코디언 동작)
    card.parentElement.querySelectorAll('.profile-accordion-card').forEach(otherCard => {
      if (otherCard !== card && otherCard.classList.contains('is-active')) {
        otherCard.classList.remove('is-active');
        const otherDetails = otherCard.querySelector('.profile-details');
        if (otherDetails) otherDetails.style.maxHeight = '0px';
      }
    });

    if (isActive) {
      card.classList.remove('is-active');
      if (details) details.style.maxHeight = '0px';
    } else {
      card.classList.add('is-active');
      if (details) details.style.maxHeight = details.scrollHeight + 'px';
    }
  });

  // 복사 기능 통합 핸들러
  accountsList.addEventListener('click', e => {
    // 1) 계좌 복사
    const copyAccBtn = e.target.closest('.copy-account-btn');
    if (copyAccBtn) {
      const copyText = `${copyAccBtn.dataset.bank} ${copyAccBtn.dataset.number}`;
      navigator.clipboard.writeText(copyText).then(() => {
        copyAccBtn.textContent = '복사됨!';
        copyAccBtn.classList.add('copied');
        setTimeout(() => {
          copyAccBtn.textContent = '계좌 복사';
          copyAccBtn.classList.remove('copied');
        }, 2000);
      });
      return;
    }

    // 2) 휴대폰 번호 복사
    const copyPhoneBtn = e.target.closest('.copy-phone-btn');
    if (copyPhoneBtn) {
      const copyText = copyPhoneBtn.dataset.phone;
      navigator.clipboard.writeText(copyText).then(() => {
        copyPhoneBtn.textContent = '복사됨!';
        copyPhoneBtn.classList.add('copied');
        setTimeout(() => {
          copyPhoneBtn.textContent = '번호 복사';
          copyPhoneBtn.classList.remove('copied');
        }, 2000);
      });
    }
  });

  // ── 푸터 ─────────────────────────────────────────────────
  document.getElementById('footer-names').textContent =
    `${C.groomName} ♥ ${C.brideName} · ${C.weddingDayDisplay}`;

  // ── 봉투 애니메이션 트리거 ───────────────────────────────
  const envelopeScene = document.getElementById('envelope-scene');
  if (envelopeScene) {
    let isOpen = false;
    let isAnimating = false;
    let isDraggingEnvelope = false; // 봉투 드래그 중 여부

    // 처음 로딩 시 스크롤 잠금
    if (window.scrollY === 0) {
      document.body.style.overflow = 'hidden';
    }

    const openEnvelope = () => {
      if (isOpen || isAnimating) return;
      isOpen = true;
      isAnimating = true;
      envelopeScene.classList.add('is-open', 'is-animating');

      const bottomText = document.getElementById('hero-bottom-text');
      if (bottomText) bottomText.classList.add('fade-out');

      // 봉투가 내려가기 시작하면 즉시(600ms 후) 본문 스크롤을 허용하여 자연스럽게 이어지도록 함
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 600);

      // 전체 트랜지션(2.2s) 완료 후 DOM에서 제거 — Safari GPU 캐시 버그 차단
      // 800ms(애니메이션 도중)에 하면 리플로우가 발생하므로 완료 후로 이동
      setTimeout(() => {
        if (isOpen) {
          const envFront = document.getElementById('envelope-front');
          const envBack = document.getElementById('envelope-back');
          if (envFront) envFront.style.display = 'none';
          if (envBack) envBack.style.display = 'none';
        }
      }, 2300);

      // 애니메이션 전체(2.2s) 종료 플래그
      setTimeout(() => {
        isAnimating = false;
        envelopeScene.classList.remove('is-animating');
      }, 2200);
    };

    const closeEnvelope = () => {
      if (!isOpen || isAnimating) return;
      isOpen = false;
      isAnimating = true;

      // 닫기(올리기) 시작 전, 숨겨두었던 봉투 레이어를 다시 표시
      const envFront = document.getElementById('envelope-front');
      const envBack = document.getElementById('envelope-back');
      if (envFront) {
        envFront.style.display = '';
        envFront.offsetHeight; // Force reflow (디스플레이 전환 후 트랜지션 적용을 위해)
      }
      if (envBack) {
        envBack.style.display = '';
        envBack.offsetHeight;
      }

      envelopeScene.classList.add('is-animating');
      envelopeScene.classList.remove('is-open');

      const bottomText = document.getElementById('hero-bottom-text');
      if (bottomText) bottomText.classList.remove('fade-out');

      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        isAnimating = false;
        envelopeScene.classList.remove('is-animating');
      }, 2200);
    };

    // 1. 클릭/터치하여 열기
    envelopeScene.addEventListener('click', openEnvelope);

    // 2. 모바일 스와이프(터치) 감지하여 열기
    let startY = 0;
    window.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      if (!isOpen) {
        isDraggingEnvelope = true;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      // 1. 봉투가 열리기 전(첫 화면)이거나 봉투를 드래그 중인 동안에는 네이티브 스크롤 방지
      if (isDraggingEnvelope || !isOpen) {
        if (e.cancelable) {
          e.preventDefault();
        }
      } else if (window.scrollY <= 0 && e.touches[0].clientY > startY) {
        // 열려있는 상태에서 맨 위에서 아래로 당길 때도 바운스 방지
        if (e.cancelable) {
          e.preventDefault();
        }
      }

      if (isAnimating) return; // 애니메이션 도중에는 터치 무시

      let currentY = e.touches[0].clientY;
      if (!isOpen) {
        // 위로 올리든 아래로 내리든(봉투 내리기) 20px 이상 드래그하면 봉투 애니메이션 실행
        if (Math.abs(startY - currentY) > 20) {
          openEnvelope();
        }
      } else {
        if (currentY - startY > 20 && window.scrollY <= 10) { // 화면을 아래로 쓸어내림 -> 봉투 닫기(올리기)
          closeEnvelope();
        }
      }
    }, { passive: false });

    window.addEventListener('touchend', () => {
      isDraggingEnvelope = false;
    }, { passive: true });

    window.addEventListener('touchcancel', () => {
      isDraggingEnvelope = false;
    }, { passive: true });

    // 3. 데스크톱 휠 감지
    window.addEventListener('wheel', (e) => {
      if (!isOpen && !isAnimating && e.deltaY > 0) {
        openEnvelope();
      }
    }, { passive: true });

    // 4. 강제 스크롤 이벤트 발생 시
    window.addEventListener('scroll', () => {
      if (!isOpen && window.scrollY > 10 && !isAnimating) {
        document.body.style.overflow = '';
        openEnvelope();
      }
      else if (isOpen && window.scrollY === 0 && !isAnimating) {
        closeEnvelope();
      }
    }, { passive: true });
  }

  // ── 스크롤 페이드인 초기화 ────────────────────────────────
  initFadeIn();
});

// ── 이미지 사전 다운로드 및 GPU 디코딩 ────────────────────────────
// 이미지가 화면에 그려지기 전에 GPU 메모리에 미리 로드하여 스터터 현상을 원천 차단합니다.
function preloadAndDecodeImage(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve();
      return;
    }
    const img = new Image();
    img.src = src;
    img.decode()
      .then(() => resolve(img))
      .catch(() => {
        // 디코딩 실패 시에도 로더가 무한 대기하지 않도록 무조건 처리 완료 처리
        resolve();
      });
  });
}

// ── 화면 페이드인 (로딩 오버레이 → phone-frame 전환) ────────
// 웹폰트 + 중요 이미지(메인 사진 & 리본)가 로드 및 디코딩 완료된 시점에 화면을 표시합니다.
window.addEventListener('load', async () => {
  // 1) 웹폰트 대기 시작
  const fontPromise = document.fonts.ready;

  // 2) 메인 사진 및 리본 이미지 디코딩 병렬 처리
  const C = WEDDING_CONTENT;
  const imagePromises = [];
  if (C.heroPhoto) {
    imagePromises.push(preloadAndDecodeImage(C.heroPhoto));
  }
  imagePromises.push(preloadAndDecodeImage('images/ribbon.webp'));

  // 3) 최소 시각 로딩 시간 확보 (너무 순식간에 지나가지 않도록 800ms)
  const delayPromise = new Promise(resolve => setTimeout(resolve, 800));

  // 모든 조건이 완료되면 페이드 오버레이 해제
  await Promise.all([fontPromise, ...imagePromises, delayPromise]);

  // 4) 페인트 사이클 시작점에서 전환 (프레임 찢김 방지)
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.add('fade-out');
      // 페이드아웃(0.9s) 완료 후 DOM에서 완전 제거
      setTimeout(() => overlay.remove(), 1000);
    }
  });
});
// ── 유틸 함수 ──────────────────────────────────────────────

// 마크다운 형식(*텍스트* 또는 **텍스트**)을 감지하여 형광펜 클래스(.tl-highlight)를 가진 span 태그로 감싸고, \n을 <br>로 변환
function parseHighlight(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<span class="tl-highlight">$1</span>')
    .replace(/\*(.*?)\*/g, '<span class="tl-highlight">$1</span>')
    .replace(/\n/g, '<br>');
}

// 줄바꿈(\n)을 <br>로 변환해서 출력
function setMultiline(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = text.replace(/\n/g, '<br>');
}

// 스크롤 시 fade-in 동작
function initFadeIn() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ── BGM 컨트롤 ──────────────────────────────────────────────
(function initBGM() {
  const audio = document.getElementById('bgm');
  const btn = document.getElementById('bgm-btn');
  if (!audio || !btn) return;

  const iconOn = btn.querySelector('.bgm-icon-on');
  const iconOff = btn.querySelector('.bgm-icon-off');

  let bgmStarted = false;
  let userPaused = false; // 사용자가 직접 끈 경우
  let playPending = false;

  function setPlaying(playing) {
    if (playing) {
      iconOn.style.display = '';
      iconOff.style.display = 'none';
      btn.classList.add('is-playing');
      btn.setAttribute('aria-label', '음악 끄기');
    } else {
      iconOn.style.display = 'none';
      iconOff.style.display = '';
      btn.classList.remove('is-playing');
      btn.setAttribute('aria-label', '음악 켜기');
    }
  }

  // BGM 재생 함수
  function playAudio() {
    if (bgmStarted || userPaused || playPending) return Promise.resolve();
    audio.volume = 0.4;
    playPending = true;
    return audio.play().then(() => {
      bgmStarted = true;
      playPending = false;
      setPlaying(true);
      removeInteractionListeners();
    }).catch((err) => {
      playPending = false;
      throw err;
    });
  }

  // 외부(예: 봉투 열기 이벤트)에서 사용할 수 있도록 트리거 바인딩
  triggerBGM = () => {
    playAudio().catch(() => {});
  };

  const interactionEvents = ['click', 'touchstart', 'touchend', 'pointerup', 'keydown'];

  function handleInteraction() {
    triggerBGM();
  }

  function addInteractionListeners() {
    interactionEvents.forEach(event => {
      document.addEventListener(event, handleInteraction);
    });
  }

  function removeInteractionListeners() {
    interactionEvents.forEach(event => {
      document.removeEventListener(event, handleInteraction);
    });
  }

  // 초기 상태: 일단 재생 중인 상태의 아이콘을 보여줌
  setPlaying(true);

  // 사용자 제스처 이벤트 리스너를 즉시 등록
  addInteractionListeners();

  // 자동 재생 시도 (로딩 완료 후)
  function tryAutoplay() {
    if (bgmStarted) return;
    audio.volume = 0.4;
    audio.play().then(() => {
      bgmStarted = true;
      setPlaying(true);
      removeInteractionListeners();
    }).catch(() => {
      // 브라우저가 자동재생을 차단했을 때만 아이콘을 OFF로 변경
      setPlaying(false);
    });
  }

  // 로딩 오버레이 제거 시점(body.loaded)에 맞춰 재생
  const observer = new MutationObserver(() => {
    if (document.body.classList.contains('loaded')) {
      observer.disconnect();
      setTimeout(tryAutoplay, 800); // 로딩 페이드아웃(0.9s)과 맞춤
    }
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // 버튼 토글
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // 봉투 open 이벤트 전파 방지
    if (audio.paused) {
      audio.play().then(() => {
        userPaused = false;
        bgmStarted = true;
        setPlaying(true);
        removeInteractionListeners();
      }).catch(() => { });
    } else {
      audio.pause();
      userPaused = true;
      setPlaying(false);
    }
  });
})();

// Ctrl+휠 확대 방지
document.addEventListener('wheel', e => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });

// 터치 핀치 확대 방지 (터치 노트북 포함)
document.addEventListener('touchmove', e => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

// 키보드 단축키 확대 방지 (Ctrl +, Ctrl -)
document.addEventListener('keydown', e => {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
    e.preventDefault();
  }
});

