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
        
        // Sistema de movimento WASD
        this.wasdControls = {
            enabled: true,
            moveSpeed: 0.5,
            keys: {
                w: false,
                a: false,
                s: false,
                d: false,
                shift: false,
                space: false
            },
            velocity: new THREE.Vector3()
        };
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
        
        // Configurações avançadas de sombra
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras mais suaves
        this.renderer.shadowMap.autoUpdate = true;
        
        // Configurações de renderização para melhor qualidade
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.physicallyCorrectLights = true;

        // Adicionar ao DOM
        const container = document.getElementById('threejs-container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        } else {
            console.warn('⚠️ Container threejs-container não encontrado');
        }
        
        console.log('🖼️ Renderizador configurado com sombras avançadas');
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
        // Luz ambiente mais suave
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Luz direcional principal com sombras aprimoradas
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(20, 30, 10);
        directionalLight.castShadow = true;
        
        // Configurações de sombra mais detalhadas
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 100;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        directionalLight.shadow.bias = -0.0005; // Ajuste fino no bias
        directionalLight.shadow.normalBias = 0.02;
        
        this.scene.add(directionalLight);

        // Luz de preenchimento para reduzir sombras muito escuras
        const fillLight = new THREE.PointLight(0x88ccff, 0.4, 50);
        fillLight.position.set(-20, 10, -10);
        fillLight.castShadow = false; // Desativar sombra para a luz de preenchimento
        this.scene.add(fillLight);

        // Luz ambiente colorida para o laboratório
        const labLight = new THREE.PointLight(0x00ff88, 0.6, 30);
        labLight.position.set(0, 8, 0);
        labLight.castShadow = false; // Desativar sombra para a luz do laboratório
        this.scene.add(labLight);

        console.log('💡 Iluminação completa configurada com sombras detalhadas');
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
        
        // Configurar controles WASD
        this.setupWASDControls();
    }

    /**
     * Configura controles de movimento WASD
     */
    setupWASDControls() {
        if (!this.wasdControls.enabled) return;

        // Event listeners para teclas
        window.addEventListener('keydown', (event) => {
            this.onKeyDown(event);
        });

        window.addEventListener('keyup', (event) => {
            this.onKeyUp(event);
        });

        console.log('🎮 Controles WASD configurados');
        console.log('📋 Controles disponíveis:');
        console.log('   W/S: Mover para frente/trás');
        console.log('   A/D: Mover para esquerda/direita');
        console.log('   Shift: Mover para baixo');
        console.log('   Space: Mover para cima');
    }

    /**
     * Manipula tecla pressionada
     * @param {KeyboardEvent} event 
     */
    onKeyDown(event) {
        if (!this.wasdControls.enabled) return;

        switch(event.code) {
            case 'KeyW':
                this.wasdControls.keys.w = true;
                break;
            case 'KeyA':
                this.wasdControls.keys.a = true;
                break;
            case 'KeyS':
                this.wasdControls.keys.s = true;
                break;
            case 'KeyD':
                this.wasdControls.keys.d = true;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.wasdControls.keys.shift = true;
                break;
            case 'Space':
                this.wasdControls.keys.space = true;
                event.preventDefault(); // Evitar scroll da página
                break;
        }
    }

    /**
     * Manipula tecla solta
     * @param {KeyboardEvent} event 
     */
    onKeyUp(event) {
        if (!this.wasdControls.enabled) return;

        switch(event.code) {
            case 'KeyW':
                this.wasdControls.keys.w = false;
                break;
            case 'KeyA':
                this.wasdControls.keys.a = false;
                break;
            case 'KeyS':
                this.wasdControls.keys.s = false;
                break;
            case 'KeyD':
                this.wasdControls.keys.d = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.wasdControls.keys.shift = false;
                break;
            case 'Space':
                this.wasdControls.keys.space = false;
                break;
        }
    }

    /**
     * Atualiza movimento da câmera baseado nas teclas WASD
     * @param {number} deltaTime 
     */
    updateWASDMovement(deltaTime) {
        if (!this.wasdControls.enabled || !this.camera) return;

        const keys = this.wasdControls.keys;
        const speed = this.wasdControls.moveSpeed;
        const velocity = this.wasdControls.velocity;

        // Reset velocity
        velocity.set(0, 0, 0);

        // Obter direções da câmera
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        
        const right = new THREE.Vector3();
        right.crossVectors(direction, this.camera.up).normalize();

        // Calcular movimento baseado nas teclas pressionadas
        if (keys.w) {
            velocity.add(direction.clone().multiplyScalar(speed));
        }
        if (keys.s) {
            velocity.add(direction.clone().multiplyScalar(-speed));
        }
        if (keys.a) {
            velocity.add(right.clone().multiplyScalar(-speed));
        }
        if (keys.d) {
            velocity.add(right.clone().multiplyScalar(speed));
        }
        if (keys.space) {
            velocity.y += speed;
        }
        if (keys.shift) {
            velocity.y -= speed;
        }

        // Aplicar movimento à câmera
        if (velocity.length() > 0) {
            this.camera.position.add(velocity.multiplyScalar(deltaTime * 60));
            
            // Atualizar target dos controles se existir
            if (this.controls && this.controls.target) {
                this.controls.target.add(velocity.clone().multiplyScalar(deltaTime * 60));
                this.controls.update();
            }
        }
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
            
            // Atualizar movimento WASD
            this.updateWASDMovement(deltaTime);
            
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
        console.log('🎬 Loop de animação iniciado com controles WASD');
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
     * Habilita/desabilita controles WASD
     * @param {boolean} enabled 
     */
    setWASDEnabled(enabled) {
        this.wasdControls.enabled = enabled;
        console.log(`🎮 Controles WASD ${enabled ? 'habilitados' : 'desabilitados'}`);
    }

    /**
     * Define a velocidade de movimento WASD
     * @param {number} speed 
     */
    setWASDSpeed(speed) {
        this.wasdControls.moveSpeed = Math.max(0.1, Math.min(2.0, speed));
        console.log(`🏃 Velocidade WASD definida para: ${this.wasdControls.moveSpeed}`);
    }

    /**
     * Obtém o estado atual dos controles WASD
     * @returns {Object}
     */
    getWASDState() {
        return {
            enabled: this.wasdControls.enabled,
            speed: this.wasdControls.moveSpeed,
            activeKeys: Object.keys(this.wasdControls.keys).filter(key => 
                this.wasdControls.keys[key]
            )
        };
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
