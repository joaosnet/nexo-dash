/**
 * EnvironmentManager - Gerenciador do ambiente 3D
 * Responsável por criar e gerenciar o laboratório virtual e elementos do ambiente
 */
export class EnvironmentManager {
    constructor(threeSystem) {
        this.threeSystem = threeSystem;
        this.scene = threeSystem.getScene();
        this.camera = threeSystem.getCamera();
        
        // Estado do ambiente
        this.laboratoryElements = new Map();
        this.blueprintGroup = null;
        this.particleSystems = [];
        
        // Sistemas de interação
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.interactionEnabled = false;
    }

    /**
     * Inicializa o Environment Manager
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            console.log('🌍 Inicializando ambiente 3D...');
            
            this.createLaboratoryPlatform();
            await this.loadLaboratoryModels();
            this.createDecorativeElements();
            this.setupInteractionSystem();
            
            console.log('✅ Ambiente 3D inicializado');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar ambiente:', error);
            throw error;
        }
    }

    /**
     * Cria a plataforma base do laboratório
     */
    createLaboratoryPlatform() {
        // Plataforma circular holográfica
        const platformGeometry = new THREE.CylinderGeometry(8, 8, 0.2, 32);
        const platformMaterial = new THREE.MeshLambertMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.3,
            emissive: 0x004422
        });
        
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = -0.1;
        platform.receiveShadow = true;
        platform.name = 'laboratory-platform';
        this.scene.add(platform);
        
        this.laboratoryElements.set('platform', platform);

        // Grid holográfico
        const gridHelper = new THREE.GridHelper(16, 16, 0x00ff88, 0x00ff88);
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        gridHelper.name = 'laboratory-grid';
        this.scene.add(gridHelper);
        
        this.laboratoryElements.set('grid', gridHelper);

        // Núcleo central inicial
        this.createCentralCore();
        
        console.log('🏗️ Plataforma do laboratório criada');
    }

    /**
     * Cria o núcleo central do laboratório
     */
    createCentralCore() {
        const coreGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const coreMaterial = new THREE.MeshLambertMaterial({
            color: 0x00ccff,
            transparent: true,
            opacity: 0.8,
            emissive: 0x002244
        });
        
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.y = 2;
        core.name = 'laboratory-core';
        this.scene.add(core);
        
        this.laboratoryElements.set('core', core);
        
        // Adicionar animação rotacional
        this.addCoreAnimation(core);
    }

    /**
     * Adiciona animação ao núcleo central
     * @param {THREE.Mesh} core - Núcleo a animar
     */
    addCoreAnimation(core) {
        const animateCore = () => {
            if (core && core.parent) {
                core.rotation.y += 0.01;
                core.position.y = 2 + Math.sin(Date.now() * 0.001) * 0.2;
                requestAnimationFrame(animateCore);
            }
        };
        animateCore();
    }

    /**
     * Carrega modelos 3D do laboratório
     * @returns {Promise<void>}
     */
    async loadLaboratoryModels() {
        // Usar GLTFLoader diretamente já que está disponível globalmente
        if (!window.THREE.GLTFLoader) {
            console.warn('⚠️ GLTFLoader não disponível');
            return;
        }

        const modelsToLoad = [
            {
                name: 'server',
                path: './assets/servidor/scene.gltf',
                position: { x: 0, y: 1.5, z: 0 },
                scale: { x: 0.8, y: 0.8, z: 0.8 },
                replaces: 'laboratory-core'
            },
            {
                name: 'gpu',
                path: './assets/gpu_nvidia/Pbr/base_basic_pbr.glb',
                position: { x: 6, y: 1, z: -3 },
                scale: { x: 1.5, y: 1.5, z: 1.5 },
                rotation: { y: Math.PI / 4 }
            },
            {
                name: 'python-icon',
                path: './assets/icon_3d_python/Pbr/base_basic_pbr.glb',
                position: { x: -6, y: 2, z: -3 },
                scale: { x: 1.2, y: 1.2, z: 1.2 }
            },
            {
                name: 'toolbox',
                path: './assets/tool_box/Pbr/base_basic_pbr.glb',
                position: { x: 6, y: 0.5, z: 3 },
                scale: { x: 1.8, y: 1.8, z: 1.8 },
                rotation: { y: -Math.PI / 6 }
            }
        ];

        const loadPromises = modelsToLoad.map(modelConfig => 
            this.loadSingleModel(modelConfig).catch(error => {
                console.warn(`⚠️ Erro ao carregar modelo ${modelConfig.name}:`, error);
                return null;
            })
        );

        await Promise.allSettled(loadPromises);
        console.log('🏗️ Modelos do laboratório carregados');
    }

    /**
     * Carrega um modelo individual
     * @param {Object} config - Configuração do modelo
     * @returns {Promise<THREE.Object3D|null>}
     */
    async loadSingleModel(config) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            
            loader.load(
                config.path,
                (gltf) => {
                    const model = gltf.scene;
                    
                    // Configurar posição, escala e rotação
                    if (config.position) {
                        model.position.set(config.position.x, config.position.y, config.position.z);
                    }
                    if (config.scale) {
                        model.scale.set(config.scale.x, config.scale.y, config.scale.z);
                    }
                    if (config.rotation) {
                        model.rotation.set(
                            config.rotation.x || 0,
                            config.rotation.y || 0,
                            config.rotation.z || 0
                        );
                    }
                    
                    model.name = `laboratory-${config.name}`;
                    
                    // Configurar materiais e sombras
                    this.setupModelMaterials(model, config.name);
                    
                    // Substituir modelo anterior se especificado
                    if (config.replaces) {
                        const oldModel = this.scene.getObjectByName(config.replaces);
                        if (oldModel) {
                            this.scene.remove(oldModel);
                            this.laboratoryElements.delete(config.replaces);
                        }
                    }
                    
                    this.scene.add(model);
                    this.laboratoryElements.set(config.name, model);
                    
                    // Adicionar animações específicas
                    this.addModelAnimation(model, config.name);
                    
                    console.log(`✅ Modelo ${config.name} carregado`);
                    resolve(model);
                },
                undefined,
                reject
            );
        });
    }

    /**
     * Configura materiais do modelo
     * @param {THREE.Object3D} model - Modelo a configurar
     * @param {string} modelName - Nome do modelo
     */
    setupModelMaterials(model, modelName) {
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                if (child.material) {
                    // Configurações específicas por modelo
                    switch (modelName) {
                        case 'server':
                            child.material.emissive = new THREE.Color(0x002244);
                            child.material.emissiveIntensity = 0.1;
                            break;
                        case 'gpu':
                            child.material.color = new THREE.Color(0x00ff00);
                            child.material.emissive = new THREE.Color(0x004400);
                            child.material.emissiveIntensity = 0.3;
                            child.material.metalness = 0.8;
                            child.material.roughness = 0.2;
                            break;
                        case 'python-icon':
                            child.material.color = new THREE.Color(0x3776ab);
                            child.material.emissive = new THREE.Color(0x001144);
                            child.material.emissiveIntensity = 0.2;
                            child.material.metalness = 0.3;
                            child.material.roughness = 0.4;
                            break;
                        case 'toolbox':
                            child.material.color = new THREE.Color(0xff6b47);
                            child.material.emissive = new THREE.Color(0x442200);
                            child.material.emissiveIntensity = 0.15;
                            child.material.metalness = 0.6;
                            child.material.roughness = 0.3;
                            break;
                    }
                }
            }
        });
    }

    /**
     * Adiciona animações específicas para modelos
     * @param {THREE.Object3D} model - Modelo a animar
     * @param {string} modelName - Nome do modelo
     */
    addModelAnimation(model, modelName) {
        const animations = {
            gpu: () => {
                const animateGPU = () => {
                    if (model && model.parent) {
                        model.rotation.y += 0.015;
                        model.position.y = 1 + Math.sin(Date.now() * 0.0012) * 0.15;
                        requestAnimationFrame(animateGPU);
                    }
                };
                animateGPU();
            },
            'python-icon': () => {
                const animatePython = () => {
                    if (model && model.parent) {
                        model.rotation.y += 0.008;
                        model.position.y = 2 + Math.sin(Date.now() * 0.0015) * 0.12;
                        requestAnimationFrame(animatePython);
                    }
                };
                animatePython();
            },
            toolbox: () => {
                const animateToolbox = () => {
                    if (model && model.parent) {
                        model.rotation.y += 0.005;
                        requestAnimationFrame(animateToolbox);
                    }
                };
                animateToolbox();
            },
            server: () => {
                const animateServer = () => {
                    if (model && model.parent) {
                        model.rotation.y += 0.01;
                        model.position.y = 1.5 + Math.sin(Date.now() * 0.0008) * 0.1;
                        requestAnimationFrame(animateServer);
                    }
                };
                animateServer();
            }
        };

        const animation = animations[modelName];
        if (animation) {
            animation();
        }
    }

    /**
     * Cria elementos decorativos
     */
    createDecorativeElements() {
        this.createHolographicParticles();
        this.createFloatingElements();
        console.log('✨ Elementos decorativos criados');
    }

    /**
     * Cria sistema de partículas holográficas
     */
    createHolographicParticles() {
        const particleCount = 50;
        const particles = new THREE.Group();
        particles.name = 'holographic-particles';
        
        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.02, 4, 4);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0x00ff88 : 0x00ccff,
                transparent: true,
                opacity: 0.6
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Posição aleatória
            const radius = 5 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
            particle.position.y = 1 + Math.random() * 4;
            particle.position.z = radius * Math.sin(phi) * Math.sin(theta);
            
            particle.userData = {
                originalPosition: particle.position.clone(),
                speed: 0.001 + Math.random() * 0.002,
                phase: Math.random() * Math.PI * 2
            };
            
            particles.add(particle);
        }
        
        this.scene.add(particles);
        this.particleSystems.push(particles);
        
        // Animar partículas
        this.animateParticles(particles);
    }

    /**
     * Anima sistema de partículas
     * @param {THREE.Group} particleGroup - Grupo de partículas
     */
    animateParticles(particleGroup) {
        const animateParticles = () => {
            if (particleGroup && particleGroup.parent) {
                particleGroup.children.forEach((particle) => {
                    const time = Date.now() * particle.userData.speed;
                    const phase = particle.userData.phase;
                    
                    // Movimento orbital suave
                    particle.position.x = particle.userData.originalPosition.x + Math.sin(time + phase) * 0.5;
                    particle.position.y = particle.userData.originalPosition.y + Math.cos(time * 0.7 + phase) * 0.3;
                    particle.position.z = particle.userData.originalPosition.z + Math.cos(time + phase) * 0.5;
                    
                    // Fade in/out
                    particle.material.opacity = 0.3 + Math.sin(time * 2 + phase) * 0.3;
                });
                
                requestAnimationFrame(animateParticles);
            }
        };
        animateParticles();
    }

    /**
     * Cria elementos flutuantes decorativos
     */
    createFloatingElements() {
        // Implementar elementos flutuantes adicionais
        console.log('🎈 Elementos flutuantes criados');
    }

    /**
     * Cria a estrutura do projeto em 3D
     */
    createProjectStructure() {
        // Remover blueprint anterior se existir
        if (this.blueprintGroup) {
            this.scene.remove(this.blueprintGroup);
        }

        this.blueprintGroup = new THREE.Group();
        this.blueprintGroup.name = 'project-blueprint';

        // Criar base holográfica
        this.createBlueprintBase();

        // Estrutura do projeto
        const projectStructure = [
            { 
                name: 'app/', 
                position: [-4, 4, 0], 
                color: 0x00ff88, 
                type: 'folder',
                description: 'Código principal da aplicação'
            },
            { 
                name: 'data/', 
                position: [0, 4, 0], 
                color: 0xff4757, 
                type: 'folder',
                description: 'Datasets e arquivos de dados'
            },
            { 
                name: 'utils/', 
                position: [4, 4, 0], 
                color: 0x3742fa, 
                type: 'folder',
                description: 'Funções utilitárias'
            },
            { 
                name: 'tests/', 
                position: [-4, 1.5, 0], 
                color: 0xffa502, 
                type: 'folder',
                description: 'Testes automatizados'
            },
            { 
                name: 'main.py', 
                position: [0, 1.5, 0], 
                color: 0x2ed573, 
                type: 'file',
                description: 'Arquivo principal da aplicação'
            },
            { 
                name: 'pyproject.toml', 
                position: [4, 1.5, 0], 
                color: 0xff6348, 
                type: 'file',
                description: 'Configuração do projeto'
            }
        ];

        projectStructure.forEach((item, index) => {
            this.createBlueprintItem(item, index);
        });

        this.scene.add(this.blueprintGroup);
        this.enableInteraction();
        
        console.log('🗂️ Estrutura do projeto 3D criada');
    }

    /**
     * Cria base do blueprint
     */
    createBlueprintBase() {
        // Base circular
        const baseGeometry = new THREE.CylinderGeometry(7, 7, 0.2, 32);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.2,
            emissive: 0x00ff88,
            emissiveIntensity: 0.1
        });
        
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.2;
        this.blueprintGroup.add(base);

        // Anéis holográficos
        for (let i = 1; i <= 3; i++) {
            const ringGeometry = new THREE.RingGeometry(2 * i, 2 * i + 0.1, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ff88,
                transparent: true,
                opacity: 0.3 / i,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = 0.1;
            this.blueprintGroup.add(ring);
        }
    }

    /**
     * Cria item do blueprint
     * @param {Object} item - Configuração do item
     * @param {number} index - Índice do item
     */
    createBlueprintItem(item, index) {
        // Geometria baseada no tipo
        const size = item.type === 'folder' ? [2, 1.5, 2] : [1.5, 2, 0.5];
        const geometry = new THREE.BoxGeometry(...size);
        
        const material = new THREE.MeshPhongMaterial({
            color: item.color,
            transparent: true,
            opacity: 0.7,
            emissive: item.color,
            emissiveIntensity: 0.15
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...item.position);
        mesh.userData = { 
            name: item.name, 
            type: item.type,
            description: item.description,
            index: index
        };
        mesh.name = `blueprint-item-${index}`;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        this.blueprintGroup.add(mesh);
        
        // Criar label
        this.createItemLabel(item, index);
    }

    /**
     * Cria label para item do blueprint
     * @param {Object} item - Item do blueprint
     * @param {number} index - Índice do item
     */
    createItemLabel(item, index) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        // Fundo
        context.fillStyle = 'rgba(0, 255, 136, 0.9)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Texto
        context.fillStyle = '#000';
        context.font = 'bold 20px Arial';
        context.textAlign = 'center';
        context.fillText(item.name, canvas.width / 2, 40);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(item.position[0], item.position[1] - 2.5, item.position[2]);
        sprite.scale.set(3, 0.75, 1);
        sprite.name = `blueprint-label-${index}`;
        
        this.blueprintGroup.add(sprite);
    }

    /**
     * Configura sistema de interação
     */
    setupInteractionSystem() {
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        
        // Event listeners
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('click', (event) => this.onMouseClick(event));
        
        console.log('🖱️ Sistema de interação configurado');
    }

    /**
     * Manipula movimento do mouse
     * @param {MouseEvent} event - Evento do mouse
     */
    onMouseMove(event) {
        if (!this.interactionEnabled) return;
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        if (this.blueprintGroup) {
            const intersects = this.raycaster.intersectObjects(this.blueprintGroup.children, true);
            
            // Reset all objects
            this.blueprintGroup.children.forEach(child => {
                if (child.isMesh && child.material) {
                    child.material.emissiveIntensity = 0.15;
                    child.scale.set(1, 1, 1);
                }
            });
            
            // Highlight hovered object
            if (intersects.length > 0) {
                const hoveredObject = intersects[0].object;
                if (hoveredObject.isMesh && hoveredObject.userData.name) {
                    hoveredObject.material.emissiveIntensity = 0.4;
                    hoveredObject.scale.set(1.1, 1.1, 1.1);
                    document.body.style.cursor = 'pointer';
                    return;
                }
            }
            
            document.body.style.cursor = 'default';
        }
    }

    /**
     * Manipula clique do mouse
     * @param {MouseEvent} event - Evento do mouse
     */
    onMouseClick(event) {
        if (!this.interactionEnabled) return;
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        if (this.blueprintGroup) {
            const intersects = this.raycaster.intersectObjects(this.blueprintGroup.children, true);
            
            if (intersects.length > 0) {
                const clickedObject = intersects[0].object;
                if (clickedObject.userData.name) {
                    this.handleBlueprintItemClick(clickedObject);
                }
            }
        }
    }

    /**
     * Manipula clique em item do blueprint
     * @param {THREE.Object3D} object - Objeto clicado
     */
    handleBlueprintItemClick(object) {
        const item = object.userData;
        console.log(`🖱️ Clicou em: ${item.name}`);
        
        // Efeito visual de clique
        this.animateClick(object);
        
        // Notificar outros sistemas
        const app = this.threeSystem.app;
        const uiSystem = app.getSystem('ui');
        
        if (uiSystem) {
            uiSystem.showNotification(
                `Explorando: ${item.name} - ${item.description}`,
                'info',
                3000
            );
        }
        
        // Reação da Dra. Turing
        const drTuringManager = this.threeSystem.getDrTuringManager();
        if (drTuringManager) {
            this.triggerDrTuringReaction(item, drTuringManager);
        }
    }

    /**
     * Anima clique em objeto
     * @param {THREE.Object3D} object - Objeto a animar
     */
    animateClick(object) {
        const originalScale = { x: object.scale.x, y: object.scale.y, z: object.scale.z };
        const duration = 300;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (progress < 0.5) {
                const scale = 1 + (progress * 0.4);
                object.scale.set(scale, scale, scale);
            } else {
                const scale = 1.2 - ((progress - 0.5) * 0.4);
                object.scale.set(scale, scale, scale);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                object.scale.set(originalScale.x, originalScale.y, originalScale.z);
            }
        };
        
        animate();
    }

    /**
     * Dispara reação da Dra. Turing
     * @param {Object} item - Item do blueprint
     * @param {DrTuringManager} drTuringManager - Manager da Dra. Turing
     */
    triggerDrTuringReaction(item, drTuringManager) {
        const reactions = {
            'app/': 'Excelente escolha! A pasta app/ é o coração da nossa aplicação Dash.',
            'data/': 'Perfeito! Os dados são fundamentais para qualquer análise.',
            'main.py': 'Muito bem! O main.py é nosso ponto de partida.',
            'pyproject.toml': 'Ótima observação! Este é o arquivo de configuração moderno do Python.',
            'utils/': 'Inteligente! As funções utilitárias tornam nosso código mais limpo.',
            'tests/': 'Fantástico! Os testes garantem a qualidade do código.'
        };

        const reaction = reactions[item.name];
        if (reaction && drTuringManager) {
            setTimeout(() => {
                drTuringManager.speak3D(reaction, 4000);
            }, 500);
        }
    }

    /**
     * Foca a câmera no blueprint
     */
    focusCameraOnBlueprint() {
        if (!this.blueprintGroup) return;
        
        // Configuração de câmera otimizada para blueprint
        const targetPos = { x: 6, y: 8, z: 10 };
        const targetLookAt = { x: 0, y: 2.5, z: 0 };
        
        const startTime = Date.now();
        const duration = 3000;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing suave
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            // Interpolar posição da câmera
            this.camera.position.x = this.camera.position.x + (targetPos.x - this.camera.position.x) * easedProgress * 0.1;
            this.camera.position.y = this.camera.position.y + (targetPos.y - this.camera.position.y) * easedProgress * 0.1;
            this.camera.position.z = this.camera.position.z + (targetPos.z - this.camera.position.z) * easedProgress * 0.1;
            
            // Fazer câmera olhar para o centro do blueprint
            this.camera.lookAt(targetLookAt.x, targetLookAt.y, targetLookAt.z);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
        
        console.log('📷 Câmera focada no blueprint');
    }

    /**
     * Habilita interação com o blueprint
     */
    enableInteraction() {
        this.interactionEnabled = true;
        console.log('🖱️ Interação com blueprint habilitada');
    }

    /**
     * Desabilita interação com o blueprint
     */
    disableInteraction() {
        this.interactionEnabled = false;
        document.body.style.cursor = 'default';
        console.log('🖱️ Interação com blueprint desabilitada');
    }

    /**
     * Atualiza o ambiente (chamado no loop de animação)
     * @param {number} deltaTime - Delta time em segundos
     */
    update(deltaTime) {
        // Atualizar sistemas de partículas e animações do ambiente
        // Implementar atualizações necessárias aqui
    }

    /**
     * Limpa recursos do sistema
     */
    dispose() {
        // Remover event listeners
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('click', this.onMouseClick);
        
        // Limpar elementos do laboratório
        this.laboratoryElements.forEach((element, name) => {
            if (element.parent) {
                this.scene.remove(element);
            }
        });
        this.laboratoryElements.clear();
        
        // Limpar blueprint
        if (this.blueprintGroup && this.blueprintGroup.parent) {
            this.scene.remove(this.blueprintGroup);
        }
        
        // Limpar sistemas de partículas
        this.particleSystems.forEach(system => {
            if (system.parent) {
                this.scene.remove(system);
            }
        });
        this.particleSystems = [];
        
        this.interactionEnabled = false;
        
        console.log('🧹 Environment Manager limpo');
    }
}
