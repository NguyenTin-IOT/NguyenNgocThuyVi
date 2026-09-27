// ========================================================
// HAPPY BIRTHDAY WEBSITE - NGUYỄN NGỌC THÚY VI
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Audio Elements ---
    const audios = {
        happybirthday: document.getElementById('audio-happybirthday'),
        home: document.getElementById('audio-home'),
        gallery: document.getElementById('audio-gallery'),
        wishes: document.getElementById('audio-wishes')
    };

    let currentAudio = null;
    let isMuted = false;

    const musicToggleBtn = document.getElementById('music-toggle-btn');
    musicToggleBtn.addEventListener('click', () => {
        if (!currentAudio) return;
        if (isMuted) {
            currentAudio.play().catch(e => console.log(e));
            musicToggleBtn.classList.remove('muted');
            musicToggleBtn.querySelector('.music-icon').textContent = '🎵';
            isMuted = false;
        } else {
            currentAudio.pause();
            musicToggleBtn.classList.add('muted');
            musicToggleBtn.querySelector('.music-icon').textContent = '🔇';
            isMuted = true;
        }
    });

    function playMusic(audioKey) {
        // Stop current audio if playing
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        currentAudio = audios[audioKey];
        if (currentAudio && !isMuted) {
            currentAudio.volume = 0.7;
            
            // Tự động tìm đường dẫn nhạc dự phòng nếu trình duyệt lỗi đường dẫn
            currentAudio.onerror = function() {
                if (!this.dataset.fallback) {
                    this.dataset.fallback = "true";
                    const currentSrc = this.getAttribute('src');
                    this.src = currentSrc.startsWith('../') ? currentSrc.replace('../', '') : '../' + currentSrc;
                    this.play().catch(e => console.log(e));
                }
            };

            currentAudio.play().then(() => {
                musicToggleBtn.classList.remove('hidden');
            }).catch(err => {
                console.log("Autoplay blocked or waiting for user interaction", err);
            });
        }
    }

    // --- Screen Navigation Logic ---
    const screens = {
        login: document.getElementById('screen-login'),
        waiting: document.getElementById('screen-waiting'),
        candle: document.getElementById('screen-candle'),
        home: document.getElementById('screen-home'),
        wishes: document.getElementById('screen-wishes'),
        gallery: document.getElementById('screen-gallery')
    };

    function switchScreen(targetScreenKey) {
        Object.keys(screens).forEach(key => {
            if (key === targetScreenKey) {
                screens[key].classList.add('active');
            } else {
                screens[key].classList.remove('active');
            }
        });
    }

    // ========================================================
    // TRANG 1: DANG NHAP (LOGIN VERIFICATION)
    // ========================================================
    const loginForm = document.getElementById('login-form');
    const fullnameInput = document.getElementById('fullname');
    const dobInput = document.getElementById('dob');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginError.classList.add('hidden');

        // Chuẩn hóa chuỗi nhập vào: Unicode NFC, chữ thường, thay thuý -> thúy
        let nameVal = fullnameInput.value.trim().toLowerCase().normalize('NFC').replace(/\s+/g, ' ');
        nameVal = nameVal.replace(/thuý/g, 'thúy');

        // Hàm bỏ dấu tiếng Việt để hỗ trợ người dùng gõ không dấu
        const removeAccents = (str) => {
            return str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D');
        };

        const nameNoAccent = removeAccents(nameVal);

        const validNamesAccented = [
            "nguyễn ngọc thúy vi",
            "thúy vi",
            "vi"
        ];

        const validNamesUnaccented = [

            "nguyen ngoc thuy vi",
            "thuy vi",
            "vi"
        ];

        const isNameValid = validNamesAccented.includes(nameVal) || validNamesUnaccented.includes(nameNoAccent);

        const dobVal = dobInput.value.trim().replace(/\s+/g, '');
        const validDOBs = [
            "28/09/2005", "28/9/2005", "28-09-2005", "28.09.2005", 
            "28092005", "28/09/05", "28/9/05", "28-9-2005", "28.9.2005"
        ];

        const isDobValid = validDOBs.includes(dobVal);

        if (isNameValid && isDobValid) {
            // Start audio immediately to unlock browser audio policy
            playMusic('happybirthday');
            
            // Go to Waiting Screen
            switchScreen('waiting');
            startWaitingCountdown();
        } else {
            loginError.textContent = "Thông tin chưa chính xác rồi, bạn kiểm tra và thử lại nhé! ❤️";
            loginError.classList.remove('hidden');
        }
    });

    // ========================================================
    // TRANG 2: TRANG CHO (20s COUNTDOWN)
    // ========================================================
    function startWaitingCountdown() {
        let timeLeft = 15;
        const countdownNumber = document.getElementById('countdown-number');
        const progressCircle = document.getElementById('countdown-progress');
        const circumference = 2 * Math.PI * 45; // ~283

        countdownNumber.textContent = timeLeft;

        const timer = setInterval(() => {
            timeLeft--;
            countdownNumber.textContent = timeLeft;
            
            // Update circular progress
            const offset = circumference - (timeLeft / 15) * circumference;
            progressCircle.style.strokeDashoffset = offset;

            if (timeLeft <= 0) {
                clearInterval(timer);
                // Switch to Candle Screen
                switchScreen('candle');
            }
        }, 1000);
    }

    // ========================================================
    // TRANG 3: THOI NEN (CANDLE BLOWING)
    // ========================================================
    const flame = document.getElementById('flame');
    const smoke = document.getElementById('smoke');

    flame.addEventListener('click', blowCandle);

    function blowCandle() {
        // Hide flame & show smoke puff
        flame.style.display = 'none';
        smoke.classList.remove('hidden');

        // Trigger confetti burst
        createConfettiBurst();

        // After 1.5 seconds, transition to Home screen and change music
        setTimeout(() => {
            playMusic('home');
            switchScreen('home');
        }, 1500);
    }

    // ========================================================
    // TRANG 4: TRANG CHU MENU NAVIGATION
    // ========================================================
    const cardWishes = document.getElementById('card-wishes');
    const cardGallery = document.getElementById('card-gallery');
    const btnBackWishes = document.getElementById('btn-back-wishes');
    const btnBackGallery = document.getElementById('btn-back-gallery');

    cardWishes.addEventListener('click', () => {
        playMusic('wishes');
        switchScreen('wishes');
    });

    cardGallery.addEventListener('click', () => {
        playMusic('gallery');
        switchScreen('gallery');
    });

    btnBackWishes.addEventListener('click', () => {
        playMusic('home');
        switchScreen('home');
    });

    btnBackGallery.addEventListener('click', () => {
        playMusic('home');
        switchScreen('home');
    });

    // ========================================================
    // TRANG 6: GALLERY & LIGHTBOX
    // ========================================================
    const imagesList = [
        { src: '1.jpg', title: 'Khoảnh khắc đáng yêu 🌸' },
        { src: '2.jpeg', title: 'Nụ cười rạng rỡ 💖' },
        { src: '3.jpeg', title: 'Thúy Vi xinh xắn ✨' },
        { src: '4.jpeg', title: 'Kỷ niệm tuyệt đẹp 🎂' },
        { src: '5.png', title: 'Bức ảnh kiệt tác 👑' }
    ];

    const galleryGrid = document.getElementById('gallery-grid');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImgIndex = 0;

    function renderGallery() {
        galleryGrid.innerHTML = '';
        imagesList.forEach((imgObj, idx) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'gallery-item';
            itemDiv.innerHTML = `
                <img src="${imgObj.src}" alt="${imgObj.title}" loading="lazy">
                <div class="item-overlay">
                    <span>${imgObj.title}</span>
                </div>
            `;
            itemDiv.addEventListener('click', () => openLightbox(idx));
            galleryGrid.appendChild(itemDiv);
        });
    }

    renderGallery();

    function openLightbox(index) {
        currentImgIndex = index;
        lightboxImg.src = imagesList[currentImgIndex].src;
        lightboxCaption.textContent = imagesList[currentImgIndex].title;
        lightboxModal.classList.remove('hidden');
    }

    lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.add('hidden');
    });

    lightboxPrev.addEventListener('click', () => {
        currentImgIndex = (currentImgIndex - 1 + imagesList.length) % imagesList.length;
        lightboxImg.src = imagesList[currentImgIndex].src;
        lightboxCaption.textContent = imagesList[currentImgIndex].title;
    });

    lightboxNext.addEventListener('click', () => {
        currentImgIndex = (currentImgIndex + 1) % imagesList.length;
        lightboxImg.src = imagesList[currentImgIndex].src;
        lightboxCaption.textContent = imagesList[currentImgIndex].title;
    });

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.classList.add('hidden');
        }
    });

    // ========================================================
    // PARTICLE & CONFETTI CANVAS ANIMATION
    // ========================================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ['#ff758c', '#ff7eb3', '#ffe57f', '#a8edf0', '#ffffff'];

    class Particle {
        constructor(x, y, isBurst = false) {
            this.x = x || Math.random() * width;
            this.y = y || Math.random() * height;
            this.radius = isBurst ? Math.random() * 5 + 2 : Math.random() * 3 + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.vx = isBurst ? (Math.random() - 0.5) * 10 : (Math.random() - 0.5) * 1;
            this.vy = isBurst ? (Math.random() - 0.5) * 10 : -Math.random() * 1.5 - 0.5;
            this.alpha = 1;
            this.decay = isBurst ? Math.random() * 0.02 + 0.01 : 0;
            this.isBurst = isBurst;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.isBurst) {
                this.alpha -= this.decay;
            } else {
                if (this.y < 0) {
                    this.y = height;
                    this.x = Math.random() * width;
                }
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize background floating particles
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }

    function createConfettiBurst() {
        for (let i = 0; i < 120; i++) {
            particles.push(new Particle(width / 2, height / 2 + 50, true));
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();
            if (p.isBurst && p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
});
