const App = {
    init: () => {
        App.rain.setup();
    },
    rain: {
        maxDrops: 600,
        drops: [],
        setup: () => {
            const canvas = document.getElementById('rain');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const width = canvas.width = window.innerWidth;
            const height = canvas.height = window.innerHeight;

            for (let i = 0; i < App.rain.maxDrops; i++) {
                App.rain.drops.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    length: Math.random() * 40 + 10,
                    speed: Math.random() * 5 + 2,
                    thickness: 1.5
                });
            }

            let targetWind = 0;
            let currentWind = 0;
            let maxWindIntensity = 1;

            window.addEventListener('mousemove', (e) => {
                const centerX = window.innerWidth / 2;
                const distanceFromCenter = e.clientX - centerX;
                targetWind = (distanceFromCenter / centerX) * maxWindIntensity;
            });

            const draw = () => {
                ctx.clearRect(0, 0, width, height);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.lineCap = 'round';

                currentWind += (targetWind - currentWind) * 0.05;

                ctx.beginPath();

                const sun = document.querySelector('.sun');
                const ySunPosition = ((sun.getBoundingClientRect()).top) + window.scrollY - window.innerHeight;

                const progress = window.scrollY / ySunPosition;

                const clampedProgress = Math.max(0, Math.min(1, progress));

                let remainingDropsQuantity = Math.round(App.rain.maxDrops - (App.rain.maxDrops * clampedProgress));

                const speedMultiplier = 1 - (clampedProgress * 0.7);

                for (let i = 0; i < remainingDropsQuantity; i++) {
                    const drop = App.rain.drops[i];

                    const currentSpeed = drop.speed * speedMultiplier;

                    const velocityX = currentWind * maxWindIntensity * currentSpeed;
                    const velocityY = currentSpeed;

                    const tiltX = (velocityX / velocityY) * drop.length;

                    ctx.moveTo(drop.x, drop.y);
                    ctx.lineTo(drop.x + tiltX, drop.y + drop.length);
                    ctx.lineWidth = drop.thickness;

                    drop.x += velocityX;
                    drop.y += velocityY;

                    if (drop.y > height) {
                        drop.y = -drop.length;
                        drop.x = Math.random() * width;
                    } else if (drop.x < -drop.length) {
                        drop.x = width + drop.length;
                    } else if (drop.x > width + drop.length) {
                        drop.x = -drop.length;
                    }
                }

                ctx.stroke();
                requestAnimationFrame(draw);
            }
            draw();
        }
    }
}


App.init();
