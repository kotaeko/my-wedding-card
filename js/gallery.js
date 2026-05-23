// gallery.js
// 로컬 갤러리 — 메인 폴라로이드 + 썸네일 가로 스크롤 미리보기 + 라이트박스 연동 + 복사 방지

let allPhotos = [];
let lbIndex   = 0;
let currentActiveIndex = 0;

// 메인 사진 변경 및 썸네일 활성화 상태/가로스크롤 동기화 함수
function setActivePhoto(index, isInitial = false) {
  if (allPhotos.length === 0) return;
  currentActiveIndex = (index + allPhotos.length) % allPhotos.length;
  lbIndex = currentActiveIndex; // 라이트박스 인덱스 동기화

  const mainImg = document.getElementById('gallery-main-img');
  if (mainImg) {
    const targetUrl = allPhotos[currentActiveIndex];
    // 이미 같은 이미지가 활성화된 상태라면 깜빡임 방지를 위해 트랜지션 스킵
    if (mainImg.getAttribute('data-current-src') !== targetUrl) {
      mainImg.style.opacity = '0';
      mainImg.setAttribute('data-current-src', targetUrl);

      // 이미지가 다운로드 및 디코딩 완료된 후 페이드인 되도록 처리하여 백색 깜빡임(Flicker) 및 버벅임(Stutter) 원천 차단
      const tempImg = new Image();
      tempImg.src = targetUrl;
      tempImg.decoding = 'async';

      // 브라우저의 비동기 디코딩 API(decode) 활용으로 백그라운드 스레드에서 압축 해제 후 메모리 적재
      if (typeof tempImg.decode === 'function') {
        tempImg.decode()
          .then(() => {
            if (mainImg.getAttribute('data-current-src') === targetUrl) {
              mainImg.src = targetUrl;
              mainImg.style.opacity = '1';
            }
          })
          .catch(() => {
            if (mainImg.getAttribute('data-current-src') === targetUrl) {
              mainImg.src = targetUrl;
              mainImg.style.opacity = '1';
            }
          });
      } else {
        // 구형 브라우저용 폴백 (onload)
        tempImg.onload = () => {
          if (mainImg.getAttribute('data-current-src') === targetUrl) {
            mainImg.src = targetUrl;
            mainImg.style.opacity = '1';
          }
        };
      }
    }
  }

  // 썸네일 아이템 활성화 상태 업데이트 및 자동 스크롤 센터링
  const thumbs = document.querySelectorAll('.thumb-item');
  thumbs.forEach((thumb, idx) => {
    if (idx === currentActiveIndex) {
      thumb.classList.add('active');
      // 활성화된 썸네일이 화면 중앙으로 오도록 부드럽게 스크롤 (초기화 단계에서는 스크롤 스킵)
      if (!isInitial) {
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    } else {
      thumb.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const mainCard  = document.getElementById('gallery-main-card');
  const thumbsRow = document.getElementById('gallery-thumbs-scroll');
  const emptyMsg  = document.getElementById('gallery-empty');

  const checkImageExists = async (url) => {
    try {
      // HTTP HEAD 메서드를 활용하여 데이터 본문 없이 신속하게 실존 여부 확인
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (e) {
      // CORS 또는 로컬 개발 환경 오동작 시 기존 가벼운 이미지 온로드 방식으로 안전한 폴백 제공
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    }
  };

  // 최대 50장까지 비동기 병렬 확인하며 썸네일 생성
  const initGallery = async () => {
    const checks = [];
    for (let i = 1; i <= 50; i++) {
      const url = `images/갤러리/${i}.jpg`;
      checks.push(checkImageExists(url).then(exists => ({ index: i, url, exists })));
    }

    const results = await Promise.all(checks);
    let hasPhotos = false;

    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      if (item.exists) {
        hasPhotos = true;
        allPhotos.push(item.url);
        
        const thumb = document.createElement('div');
        thumb.className = 'thumb-item';
        
        const img = document.createElement('img');
        // data-src 속성에 경로만 기록해 두고 실제 노출 직전에만 로드 유발
        img.setAttribute('data-src', item.url);
        img.alt       = `사진 미리보기 ${item.index}`;
        img.decoding  = 'async';
        img.draggable = false;
        preventSave(img);
        
        thumb.appendChild(img);

        // IntersectionObserver를 이용한 썸네일 가로 트랙 내 초정밀 개별 지연 로딩
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const lazyImg = entry.target;
                lazyImg.src = lazyImg.getAttribute('data-src');
                obs.unobserve(lazyImg);
              }
            });
          }, {
            root: thumbsRow,
            rootMargin: '0px 150px 0px 150px' // 가로 스크롤 시 화면 진입 150px 전에 안전 로드 시작
          });
          observer.observe(img);
        } else {
          // 폴백: 구형 브라우저는 즉시 이미지 로드
          img.src = item.url;
        }
        
        const currentIndex = allPhotos.length - 1;
        thumb.addEventListener('click', () => {
          setActivePhoto(currentIndex);
        });
        
        if (thumbsRow) {
          thumbsRow.appendChild(thumb);
        }
      } else {
        break; // 연속성이 끊어지면 탐색 중단 (1.jpg, 2.jpg... 순서 준수)
      }
    }

    if (!hasPhotos) {
      if (emptyMsg) emptyMsg.style.display = 'block';
      if (mainCard) mainCard.style.display = 'none';
      if (thumbsRow) thumbsRow.parentElement.style.display = 'none';
    } else {
      // 첫 번째 사진을 기본 활성화 (처음 로드할 때는 스크롤이동 스킵)
      setActivePhoto(0, true);
      
      // 메인 큰 사진 클릭 시 라이트박스 실행
      if (mainCard) {
        mainCard.addEventListener('click', () => {
          openLightbox(currentActiveIndex);
        });
        preventSave(mainCard);

        // ── 메인 사진 터치 스와이프 (슬라이딩) 제스처 추가 ──
        let swipeStartX = 0;
        let swipeStartY = 0;
        
        mainCard.addEventListener('touchstart', e => {
          if (e.touches.length === 1) {
            swipeStartX = e.touches[0].clientX;
            swipeStartY = e.touches[0].clientY;
          }
        }, { passive: true });

        mainCard.addEventListener('touchend', e => {
          if (e.changedTouches.length === 1) {
            const dx = e.changedTouches[0].clientX - swipeStartX;
            const dy = e.changedTouches[0].clientY - swipeStartY;
            
            // 가로 스와이프가 충분히 길고, 세로 스크롤 시도가 아닐 때만 동작
            if (Math.abs(dx) > 40 && Math.abs(dy) < 50) {
              if (dx < 0) {
                setActivePhoto(currentActiveIndex + 1); // 왼쪽으로 쓸기 -> 다음 사진
              } else {
                setActivePhoto(currentActiveIndex - 1); // 오른쪽으로 쓸기 -> 이전 사진
              }
            }
          }
        }, { passive: true });
      }
    }
  };

  // Window load 이후 초기 안정화(1초)를 추가로 거친 뒤 갤러리 탐색을 시작하여 리소스 충돌 차단
  if (document.readyState === 'complete') {
    setTimeout(initGallery, 1000);
  } else {
    window.addEventListener('load', () => {
      // 1000ms 대기하여 오버레이 페이드아웃 및 봉투 로딩이 완벽하게 정착된 후 탐색 시작
      setTimeout(initGallery, 1000);
    });
  }
});

// ── 라이트박스 (전체화면 감상) ──────────────────────────────────

function openLightbox(index) {
  lbIndex = (index + allPhotos.length) % allPhotos.length;
  setActivePhoto(lbIndex); // 메인 슬라이더 페이지와 실시간 동기화

  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');

  img.src = allPhotos[lbIndex];
  if (cap) cap.textContent = `${lbIndex + 1} / ${allPhotos.length}`;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function lbGoTo(index) {
  openLightbox(index);
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('lightbox-img').src = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const lb  = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');

  if (img) {
    img.draggable = false;
    preventSave(img);
    img.addEventListener('touchmove', e => {
      if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });
  }

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', () => lbGoTo(lbIndex - 1));
  document.getElementById('lightbox-next')?.addEventListener('click', () => lbGoTo(lbIndex + 1));

  lb?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    const isOpen = lb?.classList.contains('active');
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  isOpen && lbGoTo(lbIndex - 1);
    if (e.key === 'ArrowRight') isOpen && lbGoTo(lbIndex + 1);
  });

  // 터치 스와이프 (라이트박스)
  let lbTouchX = 0;
  lb?.addEventListener('touchstart', e => {
    if (e.touches.length === 1) lbTouchX = e.touches[0].clientX;
  }, { passive: true });
  lb?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - lbTouchX;
    if (Math.abs(dx) > 50) lbGoTo(dx < 0 ? lbIndex + 1 : lbIndex - 1);
  }, { passive: true });
});

// ── 저장 및 캡처 방지 ───────────────────────────────────────────
function preventSave(el) {
  el.addEventListener('contextmenu', e => e.preventDefault());
  el.addEventListener('dragstart',   e => e.preventDefault());
}

window.openLightbox = openLightbox;

