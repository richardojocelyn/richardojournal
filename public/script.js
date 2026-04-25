document.addEventListener('contextmenu', event => event.preventDefault());

// // Blokir Shortcut Keyboard Bahaya
document.onkeydown = function(e) {
    const key = e.key.toLowerCase(); 
    
    if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && key === 'i') || // Inspect
        (e.ctrlKey && e.shiftKey && key === 'c') || // Inspect element
        (e.ctrlKey && e.shiftKey && key === 'j') || // Console
        (e.ctrlKey && key === 'u') ||               // View Source
        (e.ctrlKey && key === 's')                  // Save Page As
    ) {
        e.preventDefault();
        return false;
    }
};

// ⚠️ MATIKAN DULU SEMENTARA PAS LAGI NGE-TEST BIAR WEB LU GAK FREEZE!
setInterval(function() {
    debugger;
}, 100);

// Lenis Smooth Scroll Engine
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Super Smooth Anchor Link
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        
        lenis.scrollTo(target, {
            duration: 2, 
            easing: (t) => 1 - Math.pow(1 - t, 4) 
        });
    });
});

// Kursor Cahaya
const blur = document.getElementById('cursor-blur');
const aura = document.getElementById('cursor-aura');

document.addEventListener('mousemove', (e) => {
    gsap.to(blur, { x: e.clientX, y: e.clientY, duration: 0.3, ease: "power2.out" });
    gsap.to(aura, { x: e.clientX, y: e.clientY, duration: 1.2, ease: "power3.out" });
});

document.addEventListener('mousedown', () => {
    gsap.to([blur, aura], { scale: 1.5, opacity: 0.5, duration: 0.2 });
});
document.addEventListener('mouseup', () => {
    gsap.to([blur, aura], { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.3)" });
});

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(blur, { scale: 2, backgroundColor: "rgba(0, 229, 255, 0.3)", duration: 0.3 });
        gsap.to(aura, { scale: 1.2, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(blur, { scale: 1, backgroundColor: "rgba(168, 85, 247, 0.2)", duration: 0.3 });
        gsap.to(aura, { scale: 1, duration: 0.3 });
    });
});

// GSAP Reveal Animations
gsap.registerPlugin(ScrollTrigger);

const reveals = document.querySelectorAll('.reveal');
reveals.forEach((el, i) => {
    gsap.fromTo(el, 
        { opacity: 0, y: 50 }, 
        {
            opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
        }
    );
});

// Efek 3D Tilt Mac Mockup
const tiltElements = document.querySelectorAll('.tilt-element');
tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        gsap.to(card, { rotationY: x * 15, rotationX: -y * 15, transformPerspective: 1000, duration: 0.5, ease: "power1.out" });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.8, ease: "power3.out" });
    });
});

// TradingView Engine
function initTradingViewTicker() {
    const container = document.getElementById("ticker-container");
    if (container && container.innerHTML === "") { 
        container.className = "tradingview-widget-container";
        container.style.width = "100vw";
        container.style.overflow = "hidden";
        container.innerHTML = `<div class="tradingview-widget-container__widget"></div>`;

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.async = true;

        script.innerHTML = JSON.stringify({
            "symbols": [
                { "proName": "VANTAGE:NAS100FT", "title": "NQ FUTURES" },
                { "proName": "VANTAGE:SP500FT", "title": "S&P FUTURES" },
                { "proName": "OANDA:GBPUSD", "title": "GBP/USD" },
                { "proName": "OANDA:XAUUSD", "title": "Gold" },
                { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
                { "proName": "BINANCE:BTCUSDT", "title": "Bitcoin" }
            ],
            "showSymbolLogo": true,
            "isTransparent": true,
            "displayMode": "regular", 
            "colorTheme": "dark",
            "locale": "en"
        });
        container.appendChild(script);
    }
}

gsap.to("#scroll-progress", {
    width: "100%", ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 }
});

window.addEventListener('load', () => {
    let bgAnim = gsap.fromTo("#bg-massive-text", 
        { xPercent: -50 }, { xPercent: 0, duration: 150, ease: "none", repeat: -1 }
    );
    gsap.fromTo(bgAnim, { timeScale: 40 }, { timeScale: 1, duration: 8, ease: "power3.out" });
});

function openModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}


gsap.registerPlugin(ScrollTrigger);

const orb = document.getElementById('dynamic-orb');
const grid = document.querySelector('.bg-grid');

// Logic buat ganti "Mood" setiap section
const sections = [
    { id: "#home", color: "rgba(168, 85, 247, 0.2)", x: "20%", y: "10%", rotation: 0 },
    { id: "#features", color: "rgba(34, 197, 94, 0.2)", x: "70%", y: "40%", rotation: 15 },
    { id: "#dashboard", color: "rgba(0, 229, 255, 0.2)", x: "10%", y: "60%", rotation: -10 },
    { id: "#accounts", color: "rgba(234, 179, 8, 0.2)", x: "50%", y: "80%", rotation: 5 }
];

const masterBg = document.getElementById('master-bg');

document.querySelectorAll('section').forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: "top center",
        onEnter: () => updateBackground(section),
        onEnterBack: () => updateBackground(section)
    });
});

function updateBackground(section) {
    const type = section.getAttribute('data-bg-type');
    const value = section.getAttribute('data-bg-value');

    if (type === 'grid') {
        masterBg.style.backgroundImage = 'none';
        masterBg.className = 'bg-grid-pattern';
        masterBg.style.backgroundColor = '#020005';
    } 
    else if (type === 'image') {
        masterBg.className = '';
        masterBg.style.backgroundImage = value; // Ini bakal ngambil URL gambar lu
        masterBg.style.backgroundSize = 'cover';
        masterBg.style.backgroundPosition = 'center';
    } 
    else if (type === 'glow') {
        masterBg.className = '';
        masterBg.style.backgroundImage = 'none';
        masterBg.style.backgroundColor = value === 'cyan' ? '#001a1d' : '#1a001a';
    }
}

gsap.to(masterBg, {
    yPercent: -10, // Gambar background gerak dikit pas di scroll
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true
    }
});