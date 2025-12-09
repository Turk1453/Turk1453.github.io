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

// ==========================================
// 3 KATMANLI RESPONSIVE KONUMLANDIRMA (GÜNCEL)
// ==========================================
function updateLayout() {
    const width = window.innerWidth;

    if (width > 1200) {
        // --- 1. MASAÜSTÜ (> 1200px) ---
        // Yazılar Ortada, Dünya SAĞDA (Arka plan gibi)
        camera.position.set(0, 0, 25);
        group.position.set(0, 0, 0);
        group.scale.set(1, 1, 1);
    } 
    else if (width <= 1200 && width > 768) {
        // --- 2. TABLET (768px - 1200px) ---
        // Dünya ortada ve aşağıda
        camera.position.set(0, 0, 30); 
        group.position.set(0, 0, 0);
        group.scale.set(0.9, 0.9, 0.9); 
    } 
    else {
        // --- 3. MOBİL (< 768px) ---
        camera.position.set(0, 0, 42); 
        group.position.set(0, 0, 0); 
        group.scale.set(1, 1, 1);
    }
}

// Başlangıçta ve ekran değişince çalıştır
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

// UI FONKSİYONLARI
function showSection(id) {
    document.querySelectorAll('.menu-item, .mobile-link').forEach(el => el.classList.remove('active'));
    
    const links = ['home', 'services', 'syncrapy', 'contact'];
    const index = links.indexOf(id);
    
    const desktopItems = document.querySelectorAll('.menu-item');
    if(desktopItems[index]) desktopItems[index].classList.add('active');

    const mobileItems = document.querySelectorAll('.mobile-link');
    if(mobileItems[index]) mobileItems[index].classList.add('active');

    document.querySelectorAll('.content-card').forEach(el => el.classList.remove('active-card'));
    const target = document.getElementById(id);
    setTimeout(() => target.classList.add('active-card'), 50);

    document.getElementById('mobileMenu').classList.remove('open');
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
}

// ==========================================
// EMAIL GÖNDERİMİ (EMAILJS)
// ==========================================

// 1. EmailJS'i Başlat (Kendi Public Key'ini buraya yaz)
(function() {
    emailjs.init("oLOrV3BZ9Wrne5Zub"); 
})();

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Sayfanın yenilenmesini engelle

    const btn = this.querySelector('button');
    const status = document.getElementById('status-text');
    
    // Butonu yükleniyor moduna al
    const originalText = btn.innerText;
    btn.innerText = 'GÖNDERİLİYOR...';
    btn.disabled = true;

    // EmailJS ile gönder
    // service_id, template_id, form_elementi
    emailjs.sendForm('service_097revx', 'template_k0g89n8', this)
        .then(function() {
            // BAŞARILI
            btn.innerText = 'GÖNDERİLDİ ✓';
            btn.style.backgroundColor = '#22c55e'; // Yeşil yap
            status.innerText = "Mesajınız başarıyla iletildi. En kısa sürede döneceğim!";
            status.style.display = 'block';
            status.style.color = '#22c55e';
            
            // Formu temizle
            document.getElementById('contact-form').reset();

            // 3 saniye sonra butonu eski haline getir
            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
                btn.style.backgroundColor = ''; // Rengi sıfırla
                status.style.display = 'none';
            }, 5000);

        }, function(error) {
            // HATA
            console.log('FAILED...', error);
            btn.innerText = 'HATA OLUŞTU';
            btn.style.backgroundColor = '#ef4444'; // Kırmızı yap
            status.innerText = "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
            status.style.display = 'block';
            status.style.color = '#ef4444';
            btn.disabled = false;
        });
});

// ==========================================
// PORTFOLYO SEKMELERİ (TABS) MANTIĞI
// ==========================================
function openTab(evt, tabName) {
    // 1. Tüm sekme içeriklerini gizle
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active-content");
    }

    // 2. Tüm butonların aktifliğini kaldır
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active-tab");
    }

    // 3. Tıklanan sekmeyi göster ve butonunu aktif yap
    document.getElementById(tabName).classList.add("active-content");
    evt.currentTarget.classList.add("active-tab");
}


// ==========================================
// SWIPER SLIDER BAŞLATMA (Portfolyo İçin)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    
    var portfolioSwiper = new Swiper(".portfolioSwiper", {
        effect: "coverflow", // Platform efekti
        grabCursor: true,
        centeredSlides: true, // Aktif olan ortada
        slidesPerView: "auto", // Sığdığı kadar göster
        loop: true, // Sonsuz döngü
        
        // Coverflow (Platform) Ayarları
        coverflowEffect: {
            rotate: 30,   // Dönüş açısı
            stretch: 0,
            depth: 200,   // Derinlik
            modifier: 1,
            slideShadows: true, // Gölgeler açık
        },
        
        // Sayfalama ve Oklar
        pagination: { el: ".swiper-pagination", clickable: true },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },

        // ÖNEMLİ: Sekme içinde olduğu için gizlenip açılınca bozulmaması için
        observer: true,
        observeParents: true,
    });

});
