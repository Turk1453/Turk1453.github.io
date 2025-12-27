// --- YÜKLEME EKRANI ---
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () => {
    const loading = document.getElementById('loading');
    loading.style.opacity = '0';
    setTimeout(() => loading.remove(), 800);
};

// --- THREE.JS KURULUMU ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02040a);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// IŞIKLAR
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 10, 10);
scene.add(dirLight);

// DÜNYA GRUBU
const group = new THREE.Group();
scene.add(group);
const txLoader = new THREE.TextureLoader(loadingManager);

// KÜRE
const earth = new THREE.Mesh(
    new THREE.SphereGeometry(9, 64, 64),
    new THREE.MeshPhongMaterial({
        map: txLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'),
        bumpMap: txLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png'),
        bumpScale: 0.05,
        specularMap: txLoader.load('https://unpkg.com/three-globe/example/img/earth-water.png'),
        specular: new THREE.Color(0x222222)
    })
);
group.add(earth);

// BULUTLAR
const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(9.1, 64, 64),
    new THREE.MeshPhongMaterial({
        map: txLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'),
        transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
    })
);
group.add(clouds);

// YILDIZLAR
const particles = new THREE.BufferGeometry();
const pCount = 1000;
const pPos = new Float32Array(pCount * 3);
for(let i=0; i<pCount*3; i++) pPos[i] = (Math.random() - 0.5) * 150;
particles.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const starMesh = new THREE.Points(particles, new THREE.PointsMaterial({size: 0.08, color: 0x3b82f6, transparent: true, opacity: 0.5}));
scene.add(starMesh);

// KONUMLANDIRMA
function updateLayout() {
    const width = window.innerWidth;
    if (width > 1200) { camera.position.set(0, 0, 25); group.scale.set(1, 1, 1); } 
    else if (width <= 1200 && width > 768) { camera.position.set(0, 0, 30); group.scale.set(0.9, 0.9, 0.9); } 
    else { camera.position.set(0, 0, 42); group.scale.set(1, 1, 1); }
}

updateLayout();
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateLayout();
});

// ANİMASYON DÖNGÜSÜ
function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.0005; 
    clouds.rotation.y += 0.0007;
    starMesh.rotation.y -= 0.0001;
    renderer.render(scene, camera);
}
animate();

// ==========================================
// MODAL (POP-UP) İŞLEMLERİ
// ==========================================
var modalSwiper; 

function openAppModal() {
    const modal = document.getElementById('appModal');
    modal.style.display = 'flex';
    
    // Modal açılınca Swiper'ı başlat (Sadece 1 kere)
    if (!modalSwiper) {
        modalSwiper = new Swiper(".modalSwiper", {
            effect: "cards",
            grabCursor: true,
            pagination: { el: ".swiper-pagination", dynamicBullets: true },
        });
    }
}

function closeAppModal() {
    document.getElementById('appModal').style.display = 'none';
}

// Modal dışına tıklayınca kapat
window.onclick = function(event) {
    const modal = document.getElementById('appModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// ==========================================
// UI FONKSİYONLARI (MENÜ GEÇİŞLERİ)
// ==========================================
function showSection(id) {
    // Menüleri Aktif Yap
    document.querySelectorAll('.menu-item, .mobile-link').forEach(el => el.classList.remove('active'));
    
    const links = ['home', 'services', 'syncrapy', 'contact'];
    const index = links.indexOf(id);
    
    const desktopItems = document.querySelectorAll('.menu-item');
    if(desktopItems[index]) desktopItems[index].classList.add('active');

    const mobileItems = document.querySelectorAll('.mobile-link');
    if(mobileItems[index]) mobileItems[index].classList.add('active');

    // Kartları Kapat
    document.querySelectorAll('.content-card').forEach(el => {
        el.classList.remove('active-card');
        el.style.opacity = '0'; 
        el.style.transform = 'translateY(30px)';
    });

    // Seçilen Bölümü Aç
    const target = document.getElementById(id);
    if(target) {
        setTimeout(() => {
            target.classList.add('active-card');
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
        }, 100);
    }

    const mobileMenu = document.getElementById('mobileMenu');
    if(mobileMenu) mobileMenu.classList.remove('open');
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}

// ==========================================
// EMAILJS
// ==========================================
(function() {
    emailjs.init("oLOrV3BZ9Wrne5Zub"); 
})();

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const btn = this.querySelector('button');
    const status = document.getElementById('status-text');
    const originalText = btn.innerText;
    
    btn.innerText = 'GÖNDERİLİYOR...'; btn.disabled = true;

    emailjs.sendForm('service_097revx', 'template_k0g89n8', this)
        .then(function() {
            btn.innerText = 'GÖNDERİLDİ ✓'; btn.style.backgroundColor = '#22c55e';
            status.innerText = "Mesajınız başarıyla iletildi."; status.style.display = 'block'; status.style.color = '#22c55e';
            document.getElementById('contact-form').reset();
            setTimeout(() => { btn.innerText = originalText; btn.disabled = false; btn.style.backgroundColor = ''; status.style.display = 'none'; }, 5000);
        }, function(error) {
            btn.innerText = 'HATA'; btn.style.backgroundColor = '#ef4444';
            status.innerText = "Bir hata oluştu."; status.style.display = 'block'; status.style.color = '#ef4444';
            btn.disabled = false;
        });
});

// ==========================================
// ÇOKLU DİL SİSTEMİ (MULTI-LANGUAGE)
// ==========================================

const translations = {
    tr: {
        // --- MENÜ ---
        nav_home: "Genel Bakış",
        nav_services: "Hizmetler",
        nav_projects: "Projeler",
        nav_contact: "İletişim",
        
        // --- HERO ---
        hero_title: "Dijital Geleceği<br>İnşa Ediyoruz.",
        hero_sub: "İşletmeler için yüksek performanslı yazılım mimarileri.",
        btn_projects: "Projeleri İncele",
        
        // --- HİZMETLER ---
        services_title: "Hizmetlerimiz",
        services_sub: "İhtiyacınıza uygun profesyonel çözümler.",
        serv_web_title: "Web Yazılım",
        serv_web_desc: "Python & Django ile güvenli backend mimarileri veya HTML5 ile modern statik siteler.",
        serv_mobile_title: "Mobil Uygulama",
        serv_mobile_desc: "KivyMD ile Android dünyası için hızlı, yerel ve kurumsal mobil çözümler.",
        serv_ui_title: "UI/UX Tasarım",
        serv_ui_desc: "Her ekrana uyum sağlayan, kullanıcı deneyimi odaklı responsive arayüzler.",
        
        // --- PROJELER (GÜNCELLENDİ) ---
        projects_title: "Projelerimiz",
        
        // Blog
        cat_blog_title: "Blog Siteleri",
        cat_blog_desc: "Kişisel ve yazınsal odaklı modern blog tasarımları.",
        
        // Kurumsal
        cat_corp_title: "Kurumsal Siteler",
        cat_corp_desc: "Şirketler için prestijli ve SEO uyumlu web çözümleri.",
        
        // E-Ticaret
        cat_ecom_title: "E-Ticaret",
        cat_ecom_desc: "Sepet yönetimi ve ödeme altyapılı alışveriş sistemi.",
        
        // Emlak
        cat_real_title: "Emlak Portalı",
        cat_real_desc: "Gelişmiş filtreleme ve harita destekli ilan platformu.",
        
        // Yönetim Paneli
        cat_dashboard_title: "Yönetim Paneli",
        cat_dashboard_desc: "İşletmeler için veri analizi ve yönetim arayüzü.",
        
        // Mobil App (Kategori)
        cat_mobile_title: "Mobil Uygulamalar",
        cat_mobile_desc: "Android ve iOS için native performanslı uygulamalar.",

        // Butonlar
        btn_inspect: "İncele",
        btn_view: "Görüntüle",
        btn_shop: "Mağazayı Gez",
        btn_browse: "İlanlara Bak",
        btn_demo: "Demoyu İncele",
        
        // --- İLETİŞİM ---
        contact_title: "Bağlantıya Geç",
        contact_sub: "Projelerinizi ve fikirlerinizi konuşalım.",
        btn_send: "GÖNDER",
        
        // Form Placeholder
        ph_name: "Adınız",
        ph_email: "E-posta Adresiniz",
        ph_msg: "Mesajınız...",

        // --- MODAL (POP-UP) ---
        modal_title: "Mobil Uygulama Vitrini",
        modal_guidance: "Diğer ekranları görmek için kaydırın.",
    },
    en: {
        // ---SYSTEM---
        system_installing: "System Installing",

        // --- MENU ---
        nav_home: "Overview",
        nav_services: "Services",
        nav_projects: "Projects",
        nav_contact: "Contact",
        
        // --- HERO ---
        hero_title: "Building the<br>Digital Future.",
        hero_sub: "High-performance software architectures for businesses.",
        btn_projects: "View Projects",
        
        // --- SERVICES ---
        services_title: "Our Services",
        services_sub: "Professional solutions tailored to your needs.",
        serv_web_title: "Web Development",
        serv_web_desc: "Secure backend architectures with Python & Django or modern static sites with HTML5.",
        serv_mobile_title: "Mobile Apps",
        serv_mobile_desc: "Fast, native, and corporate mobile solutions for Android using KivyMD.",
        serv_ui_title: "UI/UX Design",
        serv_ui_desc: "Responsive interfaces focused on user experience, adapting to every screen.",
        
        // --- PROJECTS (UPDATED) ---
        projects_title: "Our Projects",
        
        // Blog
        cat_blog_title: "Blog Sites",
        cat_blog_desc: "Modern blog designs focused on personal and literary content.",
        
        // Corporate
        cat_corp_title: "Corporate Sites",
        cat_corp_desc: "Prestigious and SEO-friendly web solutions for companies.",
        
        // E-Commerce
        cat_ecom_title: "E-Commerce",
        cat_ecom_desc: "Shopping system with cart management and payment infrastructure.",
        
        // Real Estate
        cat_real_title: "Real Estate Portal",
        cat_real_desc: "Listing platform with advanced filtering and map support.",
        
        // Dashboard
        cat_dashboard_title: "Admin Dashboard",
        cat_dashboard_desc: "Data analysis and management interface for businesses.",
        
        // Mobile App (Category)
        cat_mobile_title: "Mobile Apps",
        cat_mobile_desc: "Native performance applications for Android and iOS.",

        // Buttons
        btn_inspect: "Inspect",
        btn_view: "View",
        btn_shop: "Visit Store",
        btn_browse: "Browse Listings",
        btn_demo: "View Demo",
        
        // --- CONTACT ---
        contact_title: "Get in Touch",
        contact_sub: "Let's talk about your projects and ideas.",
        btn_send: "SEND",
        
        // Form Placeholders
        ph_name: "Your Name",
        ph_email: "Your Email Address",
        ph_msg: "Your Message...",

        // --- MODAL (POP-UP) ---
        modal_title: "Mobile App Showcase",
        modal_guidance: "Swipe to view other screens.",
    }
};
function changeLanguage(lang) {
    // 1. Yazıları Değiştir
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang][key]) {
            // Eğer element input veya textarea ise 'placeholder' değiştir
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                // Değilse normal yazı içeriğini değiştir (HTML destekli)
                element.innerHTML = translations[lang][key];
            }
        }
    });

    // 2. Form Placeholder'larını Özel Olarak Değiştir (HTML'de data-lang veremediğimiz inputlar için)
    const formName = document.querySelector('input[name="user_name"]');
    const formEmail = document.querySelector('input[name="user_email"]');
    const formMsg = document.querySelector('textarea[name="message"]');
    
    if(formName) formName.placeholder = translations[lang]['ph_name'];
    if(formEmail) formEmail.placeholder = translations[lang]['ph_email'];
    if(formMsg) formMsg.placeholder = translations[lang]['ph_msg'];

    // 3. Buton Rengini Güncelle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active-lang');
        if(btn.innerText.toLowerCase() === lang) {
            btn.classList.add('active-lang');
        }
    });

    // 4. Seçimi Kaydet (Sayfa yenilenince hatırlasın)
    localStorage.setItem('selectedLang', lang);
}

// Sayfa yüklendiğinde hafızadaki dili getir
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLang') || 'tr'; // Varsayılan TR
    changeLanguage(savedLang);
});
