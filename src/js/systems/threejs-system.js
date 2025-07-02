/* 
 * Nexo Dash - Sistema Three.js Principal
 * Coordena todos os componentes 3D
 */

const ThreeJSSystem = {
    /**
     * Inicializa o sistema Three.js completo
     */
    async init() {
        return new Promise((resolve) => {
            try {
                LoadingSystem.updateProgress(1, 'Carregando three.js...');
                
                this.initializeCore();
                this.setupLighting();
                this.setupControls();
                this.createLaboratoryEnvironment();
                this.loadDrTuring();
                this.setupEventListeners();
                this.startAnimationLoop();

                resolve();
            } catch (error) {
                console.error('Erro ao inicializar Three.js:', error);
                AppState.log(`ThreeJS initialization error: ${error.message}`, 'error');
                resolve(); // Continuar mesmo com erro
            }
        });
    },

    /**
     * Inicializa os componentes centrais do Three.js
     */
    initializeCore() {
        // Criar cena
        AppState.scene = new THREE.Scene();
        AppState.scene.background = new THREE.Color(AppConfig.threejs.backgroundColor);

        // Configurar câmera
        const aspect = window.innerWidth / window.innerHeight;
        const config = AppConfig.threejs.camera;
        AppState.camera = new THREE.PerspectiveCamera(config.fov, aspect, config.near, config.far);
        AppState.camera.position.set(
            config.initialPosition.x, 
            config.initialPosition.y, 
            config.initialPosition.z
        );

        // Criar renderizador
        AppState.renderer = new THREE.WebGLRenderer({ 
            antialias: AppConfig.threejs.antialias 
        });
        AppState.renderer.setSize(window.innerWidth, window.innerHeight);
        
        if (AppConfig.threejs.shadowMapEnabled) {
            AppState.renderer.shadowMap.enabled = true;
            AppState.renderer.shadowMap.type = THREE[AppConfig.threejs.shadowMapType];
        }

        // Adicionar renderizador ao DOM
        const container = document.getElementById('threejs-container');
        if (container) {
            container.appendChild(AppState.renderer.domElement);
        }

        AppState.log('ThreeJS core initialized');
    },

    /**
     * Configura a iluminação da cena
     */
    setupLighting() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        AppState.scene.add(ambientLight);

        // Luz direcional principal
        const directionalLight = new THREE.DirectionalLight(0x00ff88, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        AppState.scene.add(directionalLight);

        AppState.log('Lighting setup completed');
    },

    /**
     * Configura os controles de órbita
     */
    setupControls() {
        AppState.controls = new THREE.OrbitControls(AppState.camera, AppState.renderer.domElement);
        AppState.controls.enableDamping = true;
        AppState.controls.dampingFactor = 0.05;
        AppState.controls.maxPolarAngle = Math.PI / 2;
        
        AppState.log('Orbit controls configured');
    },

    /**
     * Cria o ambiente do laboratório
     */
    createLaboratoryEnvironment() {
        // Delegar para o sistema de laboratório
        if (typeof LaboratorySystem !== 'undefined') {
            LaboratorySystem.createEnvironment();
        } else {
            // Fallback básico
            this.createBasicPlatform();
        }
    },

    /**
     * Cria plataforma básica (fallback)
     */
    createBasicPlatform() {
        const config = AppConfig.laboratory.platform;
        
        const platformGeometry = new THREE.CylinderGeometry(
            config.radius, config.radius, config.height, config.segments
        );
        const platformMaterial = new THREE.MeshLambertMaterial({
            color: config.color,
            transparent: true,
            opacity: config.opacity,
            emissive: config.emissive
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = -0.1;
        platform.receiveShadow = true;
        AppState.scene.add(platform);

        // Grid básico
        const gridConfig = AppConfig.laboratory.grid;
        const gridHelper = new THREE.GridHelper(gridConfig.size, gridConfig.divisions, gridConfig.color, gridConfig.color);
        gridHelper.material.opacity = gridConfig.opacity;
        gridHelper.material.transparent = true;
        AppState.scene.add(gridHelper);
    },

    /**
     * Carrega o modelo da Dra. Turing
     */
    loadDrTuring() {
        LoadingSystem.updateProgress(2, 'Configurando ambiente 3D...');
        
        // Delegar para o sistema da Dra. Turing
        if (typeof DrTuringSystem !== 'undefined') {
            DrTuringSystem.load();
        } else {
            // Fallback - criar placeholder
            this.createDrTuringPlaceholder();
        }
    },

    /**
     * Cria placeholder para a Dra. Turing
     */
    createDrTuringPlaceholder() {
        const config = AppConfig.drTuring;
        const group = new THREE.Group();
        
        // Corpo principal
        const bodyGeometry = new THREE.CapsuleGeometry(0.6, 2, 8, 16);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: config.materials.clothing
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        body.castShadow = true;
        group.add(body);
        
        // Cabeça
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: config.materials.skin
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.5;
        head.castShadow = true;
        group.add(head);
        
        // Posicionar
        group.position.set(config.position.x, config.position.y, config.position.z);
        group.scale.set(config.scale.x, config.scale.y, config.scale.z);
        group.rotation.y = config.rotation.y;
        
        AppState.scene.add(group);
        AppState.drTuring = group;
        
        AppState.log('Dr. Turing placeholder created');
    },

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        AppState.log('Event listeners configured');
    },

    /**
     * Inicia o loop de animação
     */
    startAnimationLoop() {
        this.animate();
        AppState.log('Animation loop started');
    },

    /**
     * Loop principal de animação
     */
    animate() {
        AppState.animationId = requestAnimationFrame(this.animate.bind(this));
        
        // Animar núcleo central se existir
        const core = AppState.scene.getObjectByName('laboratory-core');
        if (core) {
            core.rotation.y += 0.01;
            core.position.y = 2 + Math.sin(Date.now() * 0.001) * 0.2;
        }

        // Atualizar controles
        if (AppState.controls) {
            AppState.controls.update();
        }

        // Renderizar
        if (AppState.renderer && AppState.scene && AppState.camera) {
            AppState.renderer.render(AppState.scene, AppState.camera);
        }
    },

    /**
     * Manipula redimensionamento da janela
     */
    onWindowResize() {
        if (AppState.camera && AppState.renderer) {
            AppState.camera.aspect = window.innerWidth / window.innerHeight;
            AppState.camera.updateProjectionMatrix();
            AppState.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    },

    /**
     * Método público para fazer a Dra. Turing falar
     */
    drTuringSpeak3D(text, duration = 5000) {
        if (AppState.drTuringSpeech3D && AppState.drTuringSpeech3D.speak) {
            AppState.drTuringSpeech3D.speak(text, duration);
        } else {
            AppState.log(`Dr. Turing speech: ${text}`);
        }
    },

    /**
     * Limpa recursos do Three.js
     */
    dispose() {
        if (AppState.animationId) {
            cancelAnimationFrame(AppState.animationId);
        }
        
        if (AppState.renderer) {
            AppState.renderer.dispose();
        }
        
        if (AppState.scene) {
            AppState.scene.clear();
        }
        
        AppState.log('ThreeJS system disposed');
    }
};

// Disponibilizar globalmente
window.ThreeJSSystem = ThreeJSSystem;
