document.addEventListener('DOMContentLoaded', () => {
    
    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const hoverElements = document.querySelectorAll('a, .pill-btn, .service-item, .logo-placeholder');

    if (cursor) {
        let mouseX = 0;
        let mouseY = 0;
        let isCursorMoving = false;

        function updateCursor() {
            cursor.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
            isCursorMoving = false;
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isCursorMoving) {
                isCursorMoving = true;
                requestAnimationFrame(updateCursor);
            }
        }, { passive: true });

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
            });
        });

        // Hide cursor on desktop when mouse leaves window
        document.addEventListener('mouseout', (e) => {
            if (e.relatedTarget === null) {
                cursor.style.opacity = '0';
            }
        });

        document.addEventListener('mouseover', () => {
            cursor.style.opacity = '1';
        });
    }

    // Add subtle parallax effect to the hero services
    // REMOVED — Spline handles its own mouse tracking for the robot head.

    // Hack to remove the Spline logo watermark
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer) {
        const removeLogo = setInterval(() => {
            if (splineViewer.shadowRoot) {
                const logo = splineViewer.shadowRoot.querySelector('#logo');
                if (logo) {
                    logo.remove();
                    clearInterval(removeLogo);
                }
            }
        }, 100); // Check rapidly right after page load
        
        // Stop checking after a few seconds so it doesn't run forever
        setTimeout(() => clearInterval(removeLogo), 10000);
    }

    // ===========================
    // Smooth Scroll for Nav Links
    // ===========================
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ===========================
    // Stagger Testimonials
    // ===========================
    const staggerData = [
        { quote: "Our AI workflows are 5x faster since partnering with them.", by: "Alex, CEO at TechCorp", img: "https://i.pravatar.cc/150?img=1" },
        { quote: "I'm confident my data is safe with their platform. Can't say that about others.", by: "Dan, CTO at SecureNet", img: "https://i.pravatar.cc/150?img=2" },
        { quote: "We were lost before we found this team. Can't thank them enough!", by: "Stephanie, COO at InnovateCo", img: "https://i.pravatar.cc/150?img=3" },
        { quote: "Their AI products make planning for the future seamless.", by: "Marie, CFO at FuturePlanning", img: "https://i.pravatar.cc/150?img=4" },
        { quote: "If I could give 11 stars, I'd give 12.", by: "Andre, Head of Design at CreativeSolutions", img: "https://i.pravatar.cc/150?img=5" },
        { quote: "SO HAPPY WE FOUND THEM! Saved us 100+ hours so far.", by: "Jeremy, Product Manager at TimeWise", img: "https://i.pravatar.cc/150?img=6" },
        { quote: "Took some convincing, but now we're never going back.", by: "Pam, Marketing Director at BrandBuilders", img: "https://i.pravatar.cc/150?img=7" },
        { quote: "Their in-depth analytics are incredible. The ROI is easily 100X.", by: "Daniel, Data Scientist at AnalyticsPro", img: "https://i.pravatar.cc/150?img=8" },
        { quote: "It's just the best. Period.", by: "Fernando, UX Designer at UserFirst", img: "https://i.pravatar.cc/150?img=9" },
        { quote: "I switched 5 years ago and never looked back.", by: "Andy, DevOps Engineer at CloudMasters", img: "https://i.pravatar.cc/150?img=10" },
        { quote: "I've been searching for a solution like this for YEARS.", by: "Pete, Sales Director at RevenueRockets", img: "https://i.pravatar.cc/150?img=11" },
        { quote: "So simple and intuitive, the team was up to speed in 10 minutes.", by: "Marina, HR Manager at TalentForge", img: "https://i.pravatar.cc/150?img=12" },
    ];

    let staggerList = [...staggerData];
    const container = document.getElementById('stagger-testimonials');

    function getCardSize() {
        return window.innerWidth >= 640 ? 340 : 270;
    }

    function renderStagger() {
        if (!container) return;
        container.innerHTML = '';
        const cardSize = getCardSize();
        const count = staggerList.length;

        staggerList.forEach((item, i) => {
            const position = count % 2 === 1
                ? i - (count + 1) / 2
                : i - count / 2;
            const isCenter = position === 0;

            const card = document.createElement('div');
            card.className = 'stagger-card' + (isCenter ? ' is-center' : '');
            card.style.width = cardSize + 'px';
            card.style.height = cardSize + 'px';

            const offsetX = (cardSize / 1.5) * position;
            const offsetY = isCenter ? -65 : (position % 2 ? 15 : -15);
            const rotate = isCenter ? 0 : (position % 2 ? 2.5 : -2.5);

            card.style.transform = `translate(-50%, -50%) translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotate}deg)`;

            card.innerHTML = `
                <span class="stagger-card-slash"></span>
                <img src="${item.img}" alt="${item.by.split(',')[0]}" class="stagger-card-avatar" loading="lazy">
                <h3 class="stagger-card-quote">"${item.quote}"</h3>
                <p class="stagger-card-by">- ${item.by}</p>
            `;

            card.addEventListener('click', () => handleStaggerMove(position));
            container.appendChild(card);
        });
    }

    function handleStaggerMove(steps) {
        const arr = [...staggerList];
        if (steps > 0) {
            for (let i = 0; i < steps; i++) {
                const item = arr.shift();
                arr.push(item);
            }
        } else if (steps < 0) {
            for (let i = 0; i < Math.abs(steps); i++) {
                const item = arr.pop();
                arr.unshift(item);
            }
        }
        staggerList = arr;
        renderStagger();
    }

    const staggerPrev = document.getElementById('stagger-prev');
    const staggerNext = document.getElementById('stagger-next');
    if (staggerPrev) staggerPrev.addEventListener('click', () => handleStaggerMove(-1));
    if (staggerNext) staggerNext.addEventListener('click', () => handleStaggerMove(1));

    renderStagger();
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(renderStagger, 150);
    }, { passive: true });

    // ===========================
    // Scroll Fade for 3D Model
    // ===========================
    const splineContainer = document.querySelector('.spline-container');
    if (splineContainer) {
        let isScrolling = false;
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(() => {
                    const maxScroll = window.innerHeight;
                    const scrollY = window.scrollY;
                    const newOpacity = Math.max(0, 1 - (scrollY / maxScroll));
                    splineContainer.style.opacity = newOpacity;
                    isScrolling = false;
                });
            }
        }, { passive: true });
    }

});
