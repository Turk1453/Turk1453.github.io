// --- UI MANTIĞI ---
        function showSection(id) {
            // Menü aktiflik
            document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
            // Basit döngü ile menüyü bulup active yapalım (Manuel index eşleşmesi yerine)
            const menuItems = document.querySelectorAll('.menu-item');
            if(id === 'home') menuItems[0].classList.add('active');
            if(id === 'services') menuItems[1].classList.add('active');
            if(id === 'syncrapy') menuItems[2].classList.add('active');
            if(id === 'contact') menuItems[3].classList.add('active');

            // İçerik değiştirme
            document.querySelectorAll('.content-card').forEach(el => el.classList.remove('active-card'));
            const target = document.getElementById(id);
            setTimeout(() => target.classList.add('active-card'), 50);

            // Mobilde menüyü kapat
            document.getElementById('mobileMenu').classList.remove('open');
        }

        function toggleMobileMenu() {
            document.getElementById('mobileMenu').classList.toggle('open');
        }

        // --- 3D SAHNE ---
        const loadingManager = new THREE.LoadingManager();
        loadingManager.onLoad = () => {
            const loading = document.getElementById('loading');
            loading.style.opacity = '0';
            setTimeout(() => loading.remove(), 800);
        };

        const scene = new THREE.Scene();
        // Arka plan rengini CSS ile aynı yaptık (Entegre görünüm)
        scene.background = new THREE.Color(0x02040a); 

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl'), antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Işıklar
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(10, 10, 10);
        scene.add(dirLight);

        // Dünya
        const group = new THREE.Group();
        scene.add(group);
        const txLoader = new THREE.TextureLoader(loadingManager);

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

        // Nokta Bulutu (Cyber Effect) - Kurumsal dokunuş
        const particles = new THREE.BufferGeometry();
        const pCount = 800;
        const pPos = new Float32Array(pCount * 3);
        for(let i=0; i<pCount*3; i++) pPos[i] = (Math.random() - 0.5) * 100;
        particles.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({size: 0.05, color: 0x3b82f6, transparent: true, opacity: 0.4});
        const starMesh = new THREE.Points(particles, pMat);
        scene.add(starMesh);

        // Kamera
        camera.position.z = 25;

        // Loop
        function animate() {
            requestAnimationFrame(animate);
            earth.rotation.y += 0.0005; // Çok yavaş ve asil dönüş
            starMesh.rotation.y -= 0.0002;
            renderer.render(scene, camera);
        }
        animate();

        // Responsive
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
