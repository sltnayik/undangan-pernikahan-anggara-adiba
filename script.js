const TANGGAL_PERNIKAHAN = 'April 9, 2026 10:00:00';

const revealElements = document.querySelectorAll('.reveal');
const btnOpen = document.getElementById('btn-open');
const detailsSection = document.getElementById('invitation-details');
const bgMusic = document.getElementById('bg-music');
const audioToggle = document.getElementById('audio-toggle');
const musicStatus = document.getElementById('music-status');
const displayDateElements = document.querySelectorAll('.display-date-event');
const btnWish = document.getElementById('btn-wish');
const wishList = document.getElementById('wish-list');
const countdownEl = document.getElementById('countdown');
const heroImage = document.querySelector('.hero-image');

function activateReveal(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(activateReveal, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px',
  });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('active'));
}

const dateObj = new Date(TANGGAL_PERNIKAHAN);
const tanggalFormatIndo = dateObj.toLocaleDateString('id-ID', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

displayDateElements.forEach((element) => {
  element.textContent = tanggalFormatIndo;
});

function setMusicStatus(text) {
  if (musicStatus) {
    musicStatus.textContent = `Musik: ${text}`;
    musicStatus.style.display = 'inline-flex';
  }
}

function setAudioToggleState() {
  if (!(bgMusic instanceof HTMLAudioElement) || !(audioToggle instanceof HTMLElement)) return;

  if (bgMusic.paused) {
    audioToggle.textContent = 'Putar Musik';
    audioToggle.setAttribute('aria-pressed', 'false');
    setMusicStatus('Mati');
  } else {
    audioToggle.textContent = 'Matikan Musik';
    audioToggle.setAttribute('aria-pressed', 'true');
    setMusicStatus('Hidup');
  }
}

btnOpen?.addEventListener('click', () => {
  detailsSection?.classList.add('show');
  document.body.classList.remove('locked-scroll');
  btnOpen.style.display = 'none';

  if (audioToggle instanceof HTMLElement) {
    audioToggle.style.display = 'inline-flex';
  }

  if (bgMusic instanceof HTMLMediaElement) {
    setMusicStatus('Memuat...');
    bgMusic.play()
      .then(() => setAudioToggleState())
      .catch(() => {
        setMusicStatus('Siap diputar');
        setAudioToggleState();
      });
  }

  createConfettiBurst(24);

  window.setTimeout(() => {
    detailsSection?.scrollIntoView({ behavior: 'smooth' });
  }, 140);
});

const countdownTarget = dateObj.getTime();
let timerInterval;

function updateCountdown() {
  const distance = countdownTarget - Date.now();
  const formatNumber = (value) => String(value).padStart(2, '0');

  if (distance <= 0) {
    if (timerInterval) clearInterval(timerInterval);
    if (countdownEl) {
      countdownEl.innerHTML = '<div class="time-box" style="grid-column:1 / -1;"><span>Hari Ini</span><p>Acara Sedang Berlangsung</p></div>';
    }
    return;
  }

  document.getElementById('days').textContent = formatNumber(Math.floor(distance / (1000 * 60 * 60 * 24)));
  document.getElementById('hours').textContent = formatNumber(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  document.getElementById('minutes').textContent = formatNumber(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
  document.getElementById('seconds').textContent = formatNumber(Math.floor((distance % (1000 * 60)) / 1000));
}

timerInterval = window.setInterval(updateCountdown, 1000);
updateCountdown();

btnWish?.addEventListener('click', () => {
  const ucapan = window.prompt('Masukkan pesan atau doa singkat untuk mempelai (maksimal 120 karakter):');
  if (!ucapan?.trim()) return;

  const item = document.createElement('div');
  item.className = 'wish-item reveal active';
  item.textContent = `Doa: ${ucapan.trim().slice(0, 120)}`;
  wishList?.prepend(item);
  createConfettiBurst(14);
});

document.querySelectorAll('.photo-placeholder').forEach((photo) => {
  photo.addEventListener('click', () => {
    const nama = photo.parentElement?.querySelector('h3')?.textContent || 'Mempelai';
    window.alert(`Terima kasih sudah mampir. Ini adalah profil ${nama}. Semoga doa baik Anda menjadi berkah untuk kami.`);
  });
});

document.querySelectorAll('.btn-copy').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.getAttribute('data-account');
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      const originalText = button.textContent;
      button.textContent = 'Tersalin';
      button.classList.add('copied');

      window.setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 1400);
    } catch (error) {
      button.textContent = 'Gagal';
      window.setTimeout(() => {
        button.textContent = 'Salin';
      }, 1400);
    }
  });
});

audioToggle?.addEventListener('click', () => {
  if (!(bgMusic instanceof HTMLAudioElement)) return;

  if (bgMusic.paused) {
    setMusicStatus('Memutar...');
    bgMusic.play()
      .then(() => setAudioToggleState())
      .catch(() => {
        setMusicStatus('Gagal diputar');
        setAudioToggleState();
      });
  } else {
    bgMusic.pause();
    setAudioToggleState();
  }
});

setAudioToggleState();

function createConfettiBurst(total) {
  const colors = ['#f0b89a', '#b77d5f', '#d7aa7a', '#f3d7c2', '#9c6b56'];

  for (let index = 0; index < total; index += 1) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
    confetti.style.opacity = `${0.7 + Math.random() * 0.3}`;
    document.body.appendChild(confetti);

    window.setTimeout(() => confetti.remove(), 2600);
  }
}

function spawnFloatingHeart() {
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.textContent = '\u2661';
  heart.style.left = `${18 + Math.random() * 64}%`;
  heart.style.animationDuration = `${4.5 + Math.random() * 2}s`;
  document.body.appendChild(heart);

  window.setTimeout(() => heart.remove(), 6000);
}

function spawnPetal() {
  const petal = document.createElement('div');
  petal.className = 'floating-petal';
  const size = 10 + Math.random() * 18;
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.width = `${size}px`;
  petal.style.height = `${size}px`;
  petal.style.animationDuration = `${8 + Math.random() * 7}s`;
  petal.style.opacity = `${0.35 + Math.random() * 0.5}`;
  petal.style.transform = `rotate(${Math.random() * 360}deg)`;
  document.body.appendChild(petal);

  window.setTimeout(() => petal.remove(), 18000);
}

window.setInterval(spawnFloatingHeart, 3400);
window.setInterval(spawnPetal, 850);

window.addEventListener('pointermove', (event) => {
  if (!heroImage) return;

  const offsetX = ((event.clientX / window.innerWidth) - 0.5) * 12;
  const offsetY = ((event.clientY / window.innerHeight) - 0.5) * 12;
  heroImage.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});

window.addEventListener('mouseleave', () => {
  if (heroImage) {
    heroImage.style.transform = 'translate(0, 0)';
  }
});
