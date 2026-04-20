// main.js
// content.js의 WEDDING_CONTENT를 읽어 화면의 모든 텍스트를 채웁니다.

document.addEventListener('DOMContentLoaded', () => {
  const C = WEDDING_CONTENT;

  // ── 페이지 제목 + OG 태그 ────────────────────────────────
  const pageTitle = `${C.groomName} ♥ ${C.brideName} 결혼합니다`;
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
    const imgUrl = (C.heroPhoto.includes('/') || C.heroPhoto.includes('.')) ? C.heroPhoto : `https://lh3.googleusercontent.com/d/${C.heroPhoto}`;
    windowImgCont.innerHTML = `<img src="${imgUrl}" alt="Couple">`;
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
  const parents = `${C.groomFather} · ${C.groomMother}의 아들 ${C.groomName}\n${C.brideFather} · ${C.brideMother}의 딸 ${C.brideName}`;
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

      const monthNames = ['January','February','March','April','May','June',
                          'July','August','September','October','November','December'];
      const monthNamesKo = ['1월','2월','3월','4월','5월','6월',
                            '7월','8월','9월','10월','11월','12월'];

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

  // ── 연애 타임라인 ─────────────────────────────────────────
  const timelineSubtitleEl = document.getElementById('timeline-subtitle');
  if (timelineSubtitleEl && C.timelineSubtitle) {
    timelineSubtitleEl.innerHTML = C.timelineSubtitle.replace(/\n/g, '<br>');
  }

  const timelineList = document.getElementById('timeline-list');
  if (timelineList && Array.isArray(C.timeline)) {
    let photoSide = 'left';

    C.timeline.forEach(item => {
      // 마일스톤 항목
      if (item.type === 'milestone') {
        const el = document.createElement('div');
        el.className = 'tl-milestone';
        el.innerHTML = `
          <div class="tl-milestone-badge">${item.badge || item.date || ''}</div>
          <div class="tl-milestone-body">
            <div class="tl-milestone-title">${item.icon ? item.icon + ' ' : ''}${item.title}</div>
            <div class="tl-milestone-desc">${item.description.replace(/\n/g, '<br>')}</div>
          </div>`;
        timelineList.appendChild(el);
        return; // 좌우 교차에 영향 없음
      }

      // 날짜 배지
      const badge = document.createElement('div');
      badge.className = 'tl-date-badge';
      badge.innerHTML = `<span class="tl-date-badge-inner">${item.date}</span>`;
      timelineList.appendChild(badge);

      // 사진 HTML
      let photoContent = '';
      if (item.photo) {
        const photoUrl = (item.photo.includes('/') || item.photo.includes('.'))
          ? item.photo
          : `https://lh3.googleusercontent.com/d/${item.photo}`;
        photoContent = `<img src="${photoUrl}" alt="${item.title}" class="tl-img" loading="lazy">`;
      } else {
        photoContent = `<div class="tl-img-placeholder">📷</div>`;
      }

      const side = photoSide;
      const div = document.createElement('div');
      div.className = `tl-row tl-photo-${side}`;

      const photoCol = `<div class="tl-photo-col">${photoContent}</div>`;
      const lineCol  = `<div class="tl-line-col"><div class="tl-dot"></div></div>`;
      const textCol  = `<div class="tl-text-col">
        <div class="tl-title-row">
          ${item.icon ? `<span class="tl-icon">${item.icon}</span>` : ''}
          <span class="tl-title">${item.title}</span>
        </div>
        <p class="tl-desc">${item.description.replace(/\n/g, '<br>')}</p>
      </div>`;

      div.innerHTML = side === 'left'
        ? photoCol + lineCol + textCol
        : textCol + lineCol + photoCol;

      timelineList.appendChild(div);
      photoSide = photoSide === 'left' ? 'right' : 'left';
    });
  }

  // ── 하객 사진 안내 문구 ───────────────────────────────────
  setMultiline('guest-photo-message', C.guestPhotoMessage);

  // ── 계좌번호 (탭 방식) ───────────────────────────────────
  const accountsList = document.getElementById('accounts-list');
  const accs = C.accounts;

  // 탭 바
  const tabBar = document.createElement('div');
  tabBar.className = 'account-tab-bar';
  tabBar.innerHTML = `
    <button class="account-tab active" data-side="groom">신랑측에게</button>
    <button class="account-tab" data-side="bride">신부측에게</button>`;
  accountsList.appendChild(tabBar);

  // 탭 패널 생성
  ['groom', 'bride'].forEach(side => {
    const panel = document.createElement('div');
    panel.className = 'account-panel';
    panel.dataset.side = side;
    if (side !== 'groom') panel.style.display = 'none';

    (accs[side] || []).forEach(acc => {
      if (!acc.number) return;
      const row = document.createElement('div');
      row.className = 'account-row';
      row.innerHTML = `
        <div class="account-left">
          <span class="account-role">${acc.role}</span>
          <span class="account-holder-name">${acc.holder}</span>
        </div>
        <div class="account-right">
          <span class="account-bank">${acc.bank}</span>
          <span class="account-number">${acc.number}</span>
        </div>
        <button class="copy-btn" data-number="${acc.number}">복사하기</button>`;
      panel.appendChild(row);
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
    });
  });

  // 복사 버튼 이벤트
  accountsList.addEventListener('click', e => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    navigator.clipboard.writeText(btn.dataset.number).then(() => {
      btn.textContent = '복사됨!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '복사하기';
        btn.classList.remove('copied');
      }, 2000);
    });
  });

  // ── 연락처 ───────────────────────────────────────────────
  const contactList = document.getElementById('contact-list');
  const contacts = [
    { label: `신랑 ${C.groomName}`, phone: C.groomPhone },
    { label: `신부 ${C.brideName}`, phone: C.bridePhone },
    { label: `신랑 어머니 ${C.groomMother}`, phone: C.groomMotherPhone },
    { label: `신부 어머니 ${C.brideMother}`, phone: C.brideMotherPhone },
  ];
  contacts.forEach(ct => {
    if (!ct.phone) return;
    const div = document.createElement('div');
    div.className = 'contact-item';
    div.innerHTML = `
      <span class="contact-label">${ct.label}</span>
      <a href="tel:${ct.phone.replace(/-/g, '')}" class="contact-call-btn">📞 ${ct.phone}</a>`;
    contactList.appendChild(div);
  });

  // ── 푸터 ─────────────────────────────────────────────────
  document.getElementById('footer-names').textContent =
    `${C.groomName} ♥ ${C.brideName} · ${C.weddingDayDisplay}`;

  // ── 봉투 애니메이션 트리거 ───────────────────────────────
  const envelopeScene = document.getElementById('envelope-scene');
  if (envelopeScene) {
    let isOpen = false;
    let isAnimating = false;
    
    // 처음 로딩 시 스크롤 잠금
    if (window.scrollY === 0) {
      document.body.style.overflow = 'hidden';
    }
    
    const openEnvelope = () => {
      if (isOpen || isAnimating) return;
      isOpen = true;
      isAnimating = true;
      envelopeScene.classList.add('is-open');
      
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
      
      envelopeScene.classList.remove('is-open');
      
      const bottomText = document.getElementById('hero-bottom-text');
      if (bottomText) bottomText.classList.remove('fade-out');

      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        isAnimating = false;
      }, 2200);
    };

    // 1. 클릭/터치하여 열기
    envelopeScene.addEventListener('click', openEnvelope);

    // 2. 모바일 스와이프(터치) 감지하여 열기
    let startY = 0;
    window.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    }, { passive: true });
    
    window.addEventListener('touchmove', (e) => {
      // 1. 봉투가 열리기 전(첫 화면)에는 브라우저 네이티브 바운스(전체 화면 스크롤) 방지
      if (!isOpen) {
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

// ── 화면 페이드인 (로딩 오버레이 → phone-frame 전환) ────────
// window load + 폰트 렌더링 완료 + 안정화 대기 후 로딩 화면을 제거합니다.
window.addEventListener('load', async () => {
  // 1) 웹폰트가 완전히 적용될 때까지 대기
  await document.fonts.ready;

  // 2) 첫 레이아웃·페인트가 완전히 안정화되도록 추가 대기
  await new Promise(resolve => setTimeout(resolve, 700));

  // 3) 페인트 사이클 시작점에서 전환 (프레임 찢김 방지)
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
  const btn   = document.getElementById('bgm-btn');
  const iconOn  = btn.querySelector('.bgm-icon-on');
  const iconOff = btn.querySelector('.bgm-icon-off');
  if (!audio || !btn) return;

  let userPaused = false; // 사용자가 직접 끈 경우

  function setPlaying(playing) {
    if (playing) {
      iconOn.style.display  = '';
      iconOff.style.display = 'none';
      btn.classList.add('is-playing');
      btn.setAttribute('aria-label', '음악 끄기');
    } else {
      iconOn.style.display  = 'none';
      iconOff.style.display = '';
      btn.classList.remove('is-playing');
      btn.setAttribute('aria-label', '음악 켜기');
    }
  }

  // 초기 상태: 재생 중(자동재생 시도 전이므로 on 아이콘 표시)
  setPlaying(true);

  // 자동 재생 시도 (로딩 완료 후)
  function tryAutoplay() {
    audio.volume = 0.6;
    audio.play().then(() => {
      setPlaying(true);
    }).catch(() => {
      // 브라우저가 자동재생을 차단 → 첫 터치/클릭 시 재생
      setPlaying(false);
      const playOnInteraction = () => {
        if (!userPaused) {
          audio.play().then(() => setPlaying(true)).catch(() => {});
        }
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('click', playOnInteraction);
      };
      document.addEventListener('touchstart', playOnInteraction, { once: true });
      document.addEventListener('click', playOnInteraction, { once: true });
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
        setPlaying(true);
      }).catch(() => {});
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

