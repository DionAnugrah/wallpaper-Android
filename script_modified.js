window.addEventListener('load', () => {
const canvas = document.getElementById('wallpaper');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 200;

const colors = ['#00a8ff', '#0097e6', '#0077b6', '#00d2d3', '#00b4d8'];

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 4 + 1,
    speedX: Math.random() * 2 - 1,
    speedY: Math.random() * 2 - 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: Math.random() * 0.6 + 0.4
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(0, 168, 255, 0.05)';
  ctx.lineWidth = 1;

  const gridSize = 50;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const distance = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);

      if (distance < 120) {
        ctx.beginPath();
        const dynamicOpacity = 0.3 + (1 - distance / 120) * 0.7;
        const dynamicHue = document.body.classList.contains('golden-background')
          ? 45 + Math.sin(Date.now() * 0.001) * 15
          : 200 + (distance / 120 * 100);

        ctx.strokeStyle = `hsla(${dynamicHue}, 100%, 60%, ${dynamicOpacity})`;
        ctx.lineWidth = 0.5 + (1 - distance / 120) * 1.5;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const elements = document.querySelectorAll('.element');

const elementStatus = {
  'D': false,
  'I': false,
  'O': false,
  'N': false
};

function checkAllActive() {
  const allActive = Object.values(elementStatus).every(status => status);
  const body = document.body;

  if (allActive) {
    body.classList.add('golden-background');
    changeParticlesToGold();
  } else {
    body.classList.remove('golden-background');
    resetParticlesColor();
  }
}

function changeParticlesToGold() {
  const goldenColors = ['#FFD700', '#FFDF00', '#FFcc00', '#F5D76E'];
  particles.forEach(p => {
    p.color = goldenColors[Math.floor(Math.random() * goldenColors.length)];
  });
}

function resetParticlesColor() {
  particles.forEach(p => {
    p.color = colors[Math.floor(Math.random() * colors.length)];
  });
}

elements.forEach(element => {
  element.addEventListener('click', function () {
    const isActive = this.classList.toggle('active');

    const symbolElement = this.querySelector('.element-symbol');
    const nameElement = this.querySelector('.element-name');
    const indexElement = this.querySelector('.element-index');
    const number_Element = this.querySelector('.element-number');

    const original = this.getAttribute('data-original');
    const transform = this.getAttribute('data-transform');
    const original_name = this.getAttribute('data-name');
    const transform_name = this.getAttribute('data-name-transform');
    const original_index = this.getAttribute('data-index');
    const transform_index = this.getAttribute('data-transform-index');
    const original_number = this.getAttribute('data-original-number');
    const transform_number = this.getAttribute('data-transform-number');

    symbolElement.textContent = isActive ? transform : original;
    nameElement.textContent = isActive ? transform_name : original_name;
    indexElement.textContent = isActive ? transform_index : original_index;
    number_Element.textContent = isActive ? transform_number : original_number;

    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.backgroundColor = isActive
      ? 'rgba(255, 204, 0, 0.5)'
      : 'rgba(0, 168, 255, 0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.left = '50%';
    ripple.style.top = '50%';

    this.appendChild(ripple);

    const duration = 800;
    const startTime = performance.now();

    function animateRipple(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const scale = 1 + progress * 15;
      const opacity = 1 - progress;

      ripple.style.transform = `translate(-50%, -50%) scale(${scale})`;
      ripple.style.opacity = opacity;

      if (progress < 1) {
        requestAnimationFrame(animateRipple);
      } else {
        ripple.remove();
      }
    }

    requestAnimationFrame(animateRipple);

    const symbol = this.getAttribute('data-original');
    elementStatus[symbol] = !elementStatus[symbol];

    checkAllActive();
  });
});

animate();

});