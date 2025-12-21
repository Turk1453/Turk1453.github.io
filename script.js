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
