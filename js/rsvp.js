// rsvp.js
// 참석 의사 전달 모달 + Firebase Firestore 저장

document.addEventListener('DOMContentLoaded', async () => {
  const openBtn   = document.getElementById('rsvp-open-btn');
  const modal     = document.getElementById('rsvp-modal');
  const closeBtn  = document.getElementById('rsvp-close');
  const submitBtn = document.getElementById('rsvp-submit-btn');
  const statusEl  = document.getElementById('rsvp-status');

  // ── 모달 열기/닫기 ──────────────────────────────────────
  openBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // ── 토글 버튼 그룹 ──────────────────────────────────────
  function initToggleGroup(groupId, multiSelect = false) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.addEventListener('click', e => {
      const btn = e.target.closest('.toggle-btn');
      if (!btn) return;
      if (!multiSelect) {
        group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      }
      btn.classList.toggle('active');
    });
  }

  initToggleGroup('rsvp-side');
  initToggleGroup('rsvp-attend');
  initToggleGroup('rsvp-meal');

  // 참석 선택 시 인원/동행인 필드 토글
  document.getElementById('rsvp-attend').addEventListener('click', e => {
    const btn = e.target.closest('.toggle-btn');
    if (!btn) return;
    const isAttending = btn.dataset.value === '참석';
    document.getElementById('rsvp-headcount-wrap').style.display = isAttending ? '' : 'none';
    document.getElementById('rsvp-companion-wrap').style.display = isAttending ? '' : 'none';
  });

  // ── Firebase 설정 여부 확인 ──────────────────────────────
  if (!FIREBASE_CONFIG.apiKey) {
    submitBtn.addEventListener('click', () => {
      setStatus('Firebase 설정이 완료되지 않아 저장되지 않습니다.', 'error');
    });
    return;
  }

  // Firebase SDK 동적 로드
  const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
  const { getFirestore, collection, addDoc, serverTimestamp } =
    await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

  const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
  const db = getFirestore(app);

  // ── 제출 ────────────────────────────────────────────────
  submitBtn.addEventListener('click', async () => {
    const name = document.getElementById('rsvp-name').value.trim();
    if (!name) { setStatus('성함을 입력해 주세요.', 'error'); return; }

    const attendBtn = document.querySelector('#rsvp-attend .toggle-btn.active');
    if (!attendBtn) { setStatus('참석 여부를 선택해 주세요.', 'error'); return; }

    const sideBtn    = document.querySelector('#rsvp-side .toggle-btn.active');
    const mealBtn    = document.querySelector('#rsvp-meal .toggle-btn.active');

    const data = {
      name,
      phone:      document.getElementById('rsvp-phone').value.trim(),
      side:       sideBtn ? sideBtn.dataset.value : '',
      attendance: attendBtn.dataset.value,
      headcount:  document.getElementById('rsvp-headcount').value || '',
      companion:  document.getElementById('rsvp-companion').value.trim(),
      meal:       mealBtn ? mealBtn.dataset.value : '미정',
      createdAt:  serverTimestamp(),
    };

    submitBtn.disabled = true;
    setStatus('전송 중...', 'info');

    try {
      await addDoc(collection(db, 'rsvp'), data);
      setStatus('전달되었습니다. 감사합니다 💕', 'success');
      setTimeout(closeModal, 2000);
    } catch (err) {
      console.error('RSVP 저장 실패:', err);
      setStatus('오류가 발생했습니다. 다시 시도해 주세요.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  function setStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = `rsvp-status ${type}`;
  }
});
