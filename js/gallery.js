// gallery.js
// Google Drive 갤러리 — 폴라로이드 그리드 + 라이트박스 + 확대/다운로드 방지

let allPhotos = [];
let lbIndex   = 0;

document.addEventListener('DOMContentLoaded', () => {
  const C = WEDDING_CONTENT;
  const container = document.getElementById('gallery-grid');
  const emptyMsg  = document.getElementById('gallery-empty');

  if (!C.couplePhotos || C.couplePhotos.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    return;
  }

  allPhotos = C.couplePhotos.map(driveUrl);

  // 폴라로이드 그리드
  const grid = document.createElement('div');
  grid.className = 'polaroid-grid';

  allPhotos.forEach((url, i) => {
    const card = document.createElement('div');
    card.className = 'polaroid-card';

    const img = document.createElement('img');
    img.src       = url;
    img.alt       = `사진 ${i + 1}`;
    img.loading   = i < 6 ? 'eager' : 'lazy';
    img.draggable = false;
    preventSave(img);

    card.appendChild(img);
    card.addEventListener('click', () => openLightbox(i));
    grid.appendChild(card);
  });

  container.appendChild(grid);
});

// ── 라이트박스 ──────────────────────────────────────────────

function openLightbox(index) {
  lbIndex = (index + allPhotos.length) % allPhotos.length;
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

// ── 저장 방지 ─────────────────────────────────────────────
function preventSave(el) {
  el.addEventListener('contextmenu', e => e.preventDefault());
  el.addEventListener('dragstart',   e => e.preventDefault());
}

// ── Google Drive URL ──────────────────────────────────────
function driveUrl(fileId) {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

window.openLightbox = openLightbox;
window.driveUrl     = driveUrl;
