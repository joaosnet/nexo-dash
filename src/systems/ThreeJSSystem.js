/**
 * ThreeJSSystem - Sistema de renderização 3D
 * Gerencia a cena 3D, câmera, iluminação e modelos
 */
export class ThreeJSSystem {
    constructor(app) {
        this.app = app;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animationId = null;
        
        // Subsistemas
        this.drTuringManager = null;
        this.environmentManager = null;
    }

    /**
     * Inicialização rápida - apenas o essencial para mostrar a cena
     * @returns {Promise<void>}
     */
    async initializeFast() {
        try {
            // Criar cena, câmera e renderizador rapidamente
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupBasicLighting(); // Iluminação simples
            this.setupControls();
            
            // Configurar responsividade
            this.setupResponsiveness();
            
            // Iniciar loop de animação
            this.startAnimationLoop();
            
            // Salvar referências no estado da aplicação
            this.app.setState({
                scene: this.scene,
                camera: this.camera,
                renderer: this.renderer,
                controls: this.controls,
                animationId: this.animationId
            });
            
            console.log('⚡ Sistema Three.js inicializado rapidamente');
            
        } catch (error) {
            console.error('❌ Erro na inicialização rápida do Three.js:', error);
            throw error;
        }
    }

    /**
     * Completa a inicialização com recursos pesados
     * @returns {Promise<void>}
     */
    async completeInitialization() {
        try {
            const loadingSystem = this.app.getSystem('loading');
            
            // Configurar iluminação completa
            this.setupFullLighting();
            
            // Inicializar subsistemas se disponíveis
            try {
                await this.initializeSubsystems();
            } catch (error) {
                console.warn('⚠️ Subsistemas não disponíveis, continuando sem eles:', error);
            }
            
            console.log('✅ Inicialização completa do Three.js finalizada');
            
        } catch (error) {
            console.warn('⚠️ Erro na inicialização completa (não crítico):', error);
        }
    }

    /**
     * Inicializa o sistema Three.js (método original, mantido para compatibilidade)
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            const loadingSystem = this.app.getSystem('loading');
            
            loadingSystem.updateProgress(1, 'Carregando three.js...');
            
            // Criar cena, câmera e renderizador
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupLighting();
            this.setupControls();
            
            loadingSystem.updateProgress(2, 'Configurando ambiente 3D...');
            
            // Inicializar subsistemas
            await this.initializeSubsystems();
            
            // Configurar responsividade
            this.setupResponsiveness();
            
            // Iniciar loop de animação
            this.startAnimationLoop();
            
            // Salvar referências no estado da aplicação
            this.app.setState({
                scene: this.scene,
                camera: this.camera,
                renderer: this.renderer,
                controls: this.controls,
                animationId: this.animationId
            });
            
            console.log('✅ Sistema Three.js inicializado');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Three.js:', error);
            throw error;
        }
    }

    /**
     * Configura a cena 3D
     */
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a1a);
        this.scene.fog = new THREE.Fog(0x0a0a1a, 50, 200);
        console.log('🎬 Cena 3D criada');
    }

    /**
     * Configura a câmera
     */
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        console.log('📹 Câmera configurada');
    }

    /**
     * Configura o renderizador
     */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        // Adicionar ao DOM
        const container = document.getElementById('threejs-container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        } else {
            console.warn('⚠️ Container threejs-container não encontrado');
        }
        
        console.log('🖼️ Renderizador configurado');
    }

    /**
     * Configura iluminação básica para carregamento rápido
     */
    setupBasicLighting() {
        // Apenas luz ambiente para início rápido
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Uma luz direcional simples
        const directionalLight = new THREE.DirectionalLight(0x00ff88, 0.8);
        directionalLight.position.set(5, 10, 5);
        this.scene.add(directionalLight);

        console.log('⚡ Iluminação básica configurada');
    }

    /**
     * Configura iluminação completa
     */
    setupFullLighting() {
        // Remove luzes básicas se existirem
        const lightsToRemove = [];
        this.scene.traverse((child) => {
            if (child.isLight) {
                lightsToRemove.push(child);
            }
        });
        lightsToRemove.forEach(light => this.scene.remove(light));

        // Configurar iluminação completa
        this.setupLighting();
    }

    /**
     * Configura a iluminação da cena
     */
    setupLighting() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Luz direcional principal
        const directionalLight = new THREE.DirectionalLight(0x00ff88, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);

        // Luz de preenchimento
        const fillLight = new THREE.PointLight(0x88ccff, 0.6, 30);
        fillLight.position.set(-10, 5, -5);
        this.scene.add(fillLight);

        console.log('💡 Iluminação completa configurada');
    }

    /**
     * Configura os controles de órbita
     */
    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;
        this.controls.target.set(0, 2, 0);
        this.controls.update();
        
        console.log('🎮 Controles configurados');
    }

    /**
     * Inicializa os subsistemas
     * @returns {Promise<void>}
     */
    async initializeSubsystems() {
        try {
            // Importar e inicializar subsistemas dinamicamente
            const [{ DrTuringManager }, { EnvironmentManager }] = await Promise.all([
                import('./three/DrTuringManager.js').catch(() => ({ DrTuringManager: null })),
                import('./three/EnvironmentManager.js').catch(() => ({ EnvironmentManager: null }))
            ]);

            // Configurar FBXLoader global para suprimir avisos específicos
            if (window.THREE?.FBXLoader) {
                THREE.FBXLoader.prototype.onWarning = function(warning) {
                    if (!warning.includes('ShininessExponent') && !warning.includes('more than 4 skinning weights')) {
                        console.warn('FBXLoader:', warning);
                    }
                };
            }

            if (EnvironmentManager) {
                this.environmentManager = new EnvironmentManager(this);
                await this.environmentManager.initialize().catch(err => {
                    console.warn('⚠️ Erro ao inicializar EnvironmentManager:', err);
                });
            }

            if (DrTuringManager) {
                this.drTuringManager = new DrTuringManager(this);
                await this.drTuringManager.initialize().catch(err => {
                    console.warn('⚠️ Erro ao inicializar DrTuringManager:', err);
                });
            }

            console.log('🔧 Subsistemas Three.js inicializados');

        } catch (error) {
            console.warn('⚠️ Alguns subsistemas não puderam ser carregados:', error);
            // Não falhar se os subsistemas não estiverem disponíveis
        }
    }

    /**
     * Configura responsividade da janela
     */
    setupResponsiveness() {
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }

    /**
     * Manipula redimensionamento da janela
     */
    onWindowResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    }

    /**
     * Inicia o loop de animação
     */
    startAnimationLoop() {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            
            // Calcular delta time
            const currentTime = performance.now();
            const deltaTime = (currentTime - (this.app.state.lastTime || currentTime)) / 1000;
            this.app.setState({ lastTime: currentTime });
            
            // Atualizar subsistemas
            if (this.drTuringManager) {
                this.drTuringManager.update(deltaTime);
            }
            
            if (this.environmentManager) {
                this.environmentManager.update(deltaTime);
            }
            
            // Atualizar controles
            if (this.controls) {
                this.controls.update();
            }
            
            // Renderizar cena
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }
        };
        
        animate();
        console.log('🎬 Loop de animação iniciado');
    }

    /**
     * Para o loop de animação
     */
    stopAnimationLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Obtém a cena
     * @returns {THREE.Scene}
     */
    getScene() {
        return this.scene;
    }

    /**
     * Obtém a câmera
     * @returns {THREE.Camera}
     */
    getCamera() {
        return this.camera;
    }

    /**
     * Obtém o renderizador
     * @returns {THREE.WebGLRenderer}
     */
    getRenderer() {
        return this.renderer;
    }

    /**
     * Obtém o Dr. Turing Manager
     * @returns {DrTuringManager}
     */
    getDrTuringManager() {
        return this.drTuringManager;
    }

    /**
     * Obtém o Environment Manager
     * @returns {EnvironmentManager}
     */
    getEnvironmentManager() {
        return this.environmentManager;
    }

    /**
     * Faz a Dra. Turing falar (método público para outros sistemas)
     * @param {string} text - Texto a ser falado
     * @param {number} duration - Duração em ms
     */
    drTuringSpeak3D(text, duration = 5000) {
        if (this.drTuringManager && this.drTuringManager.speak3D) {
            this.drTuringManager.speak3D(text, duration);
        } else {
            console.warn('⚠️ Dr. Turing Manager não disponível para falar');
        }
    }

    /**
     * Executa animação da Dra. Turing
     * @param {string} animationType - Tipo de animação
     */
    playDrTuringAnimation(animationType = 'idle') {
        if (this.drTuringManager && this.drTuringManager.playAnimation) {
            this.drTuringManager.playAnimation(animationType);
        } else {
            console.warn('⚠️ Dr. Turing Manager não disponível para animações');
        }
    }

    /**
     * Limpa recursos do sistema
     */
    dispose() {
        // Parar animação
        this.stopAnimationLoop();
        
        // Limpar subsistemas
        if (this.drTuringManager) {
            this.drTuringManager.dispose();
        }
        if (this.environmentManager) {
            this.environmentManager.dispose();
        }
        
        // Limpar Three.js
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.scene) {
            this.scene.clear();
        }
        
        // Remover event listeners
        window.removeEventListener('resize', this.onWindowResize);
        
        console.log('🧹 Sistema Three.js limpo');
    }
}
