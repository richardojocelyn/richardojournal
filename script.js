document.addEventListener('contextmenu', event => event.preventDefault());

// Blokir Shortcut Keyboard Bahaya
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

// Jebakan Debugger
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
    gsap.to(blur, { 
        x: e.clientX, 
        y: e.clientY, 
        duration: 0.3, 
        ease: "power2.out" 
    });

    gsap.to(aura, { 
        x: e.clientX, 
        y: e.clientY, 
        duration: 1.2, 
        ease: "power3.out" 
    });
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
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%", 
                toggleActions: "play none none reverse" 
            }
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
        gsap.to(card, {
            rotationY: x * 15, 
            rotationX: -y * 15, 
            transformPerspective: 1000,
            duration: 0.5,
            ease: "power1.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.8, ease: "power3.out" });
    });
});

// ==========================================
// TRADINGVIEW LIVE TICKER ENGINE
// ==========================================
function initTradingViewTicker() {
    const container = document.getElementById("ticker-container");

    // Biar gak ke-render dobel pas ganti tab
    if (container && container.innerHTML === "") { 
        container.className = "tradingview-widget-container";
        
        // STYLING TAMBAHAN: Paksa lebar 100% layar (100vw) biar edge-to-edge
        container.style.width = "100vw";
        container.style.overflow = "hidden";
        container.innerHTML = `<div class="tradingview-widget-container__widget"></div>`;

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.async = true;

        // JSON Konfigurasi Pair TradingView
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
            "displayMode": "regular", // <-- INI KUNCINYA: Ganti dari adaptive jadi regular
            "colorTheme": "dark",
            "locale": "en"
        });

        container.appendChild(script);
    }
}

// --- SNIPER SCROLL PROGRESS ---
gsap.to("#scroll-progress", {
    width: "100%",
    ease: "none",
    scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3 // Bikin pergerakannya smooth ngikutin scroll
    }
});

// --- BACKGROUND MASSIVE RIGHT-SCROLL (ONCE) ---
// --- BACKGROUND MASSIVE RIGHT-SCROLL (CINEMATIC INFINITE) ---
window.addEventListener('load', () => {
    // 1. Kita bikin mesin utamanya: Jalan ke kanan SUPER LAMBAT dan INFINITE (Gigi 1)
    let bgAnim = gsap.fromTo("#bg-massive-text", 
        { xPercent: -50 }, 
        { 
            xPercent: 0, 
            duration: 150, // Durasi normalnya 150 detik (Sangat pelan)
            ease: "none", 
            repeat: -1 
        }
    );

    // 2. MAGIC-NYA DI SINI: Kita manipulasi "Waktu" dari mesin di atas!
    // Awalnya kita paksa jalan 40x lipat lebih cepet (Gigi 6), terus di-rem halus ke kecepatan normal (1x).
    gsap.fromTo(bgAnim, 
        { timeScale: 40 }, // Awal mula gaspol 40x lebih cepat
        { 
            timeScale: 1, // Turun pelan-pelan sampai kecepatan asli (1x)
            duration: 8,  // Proses ngeremnya butuh waktu 8 detik
            ease: "power3.out" // Efek rem hidrolik yang mulus banget
        }
    );
});
function openModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// PENTING: Pastiin lu udah nangkep tombolnya! 
// (Sesuaikan 'pay-button' dengan ID tombol di HTML lu)
const payButton = document.getElementById('pay-button'); 

payButton.onclick = async function () {
    // 1. Alarm pertama: Tombol jalan gak?
    console.log("🚀 Tombol dipencet! Minta token ke backend...");
    
    // Biar text tombol berubah pas loading (opsional)
    payButton.innerText = "Loading..."; 

    try {
        const response = await fetch('/api/checkout', { method: 'POST' });
        const data = await response.json();

        // 2. Alarm kedua: Dapet apa dari Vercel?
        console.log("📦 Balasan dari server:", data);

        if (data.token) {
            // Balikin text tombol
            payButton.innerText = "PROCEED TO PAYMENT"; 
            
            // Panggil popup Midtrans
            window.snap.pay(data.token, {
                onSuccess: function(result) {
                    console.log("ANJAY MABAR SUKSES!");
                    window.location.href = '/success.html';
                },
                onPending: function(result) {
                    alert("Selesaikan pembayaran lu dulu di M-Banking/ATM ya, Cad!");
                },
                onError: function(result) {
                    alert("Waduh, pembayaran gagal! Coba lagi bro.");
                },
                onClose: function() {
                    console.log("Popup ditutup sebelum kelar bayar.");
                }
            });
        } else {
            // Kalau token ga ada, pasti error!
            payButton.innerText = "PROCEED TO PAYMENT"; 
            alert("❌ Gagal dapet token! Cek tulisan merah di Inspect Element (Console).");
        }
    } catch (error) {
        payButton.innerText = "PROCEED TO PAYMENT"; 
        console.error("🔥 Error parah:", error);
        alert("Server lagi puyeng, gagal nyambung ke checkout.js!");
    }
};

// Jangan lupa baris ini biar scriptnya otomatis jalan pas web dibuka
document.addEventListener("DOMContentLoaded", initTradingViewTicker);