// countdown.js
// 결혼식까지 남은 날수를 표시합니다.

document.addEventListener('DOMContentLoaded', () => {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  function update() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const wedding = new Date(WEDDING_CONTENT.weddingDate);
    wedding.setHours(0, 0, 0, 0);

    const diff = Math.round((wedding - today) / (1000 * 60 * 60 * 24));

    if (diff > 0) {
      countdownEl.innerHTML = `<span class="countdown-number">D-${diff}</span>`;
    } else if (diff === 0) {
      countdownEl.innerHTML = `<span class="countdown-today">오늘입니다! 🎊</span>`;
    } else {
      countdownEl.innerHTML = `<span class="countdown-past">D+${Math.abs(diff)}</span>`;
    }
  }

  update();
});
