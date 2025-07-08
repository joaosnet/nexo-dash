/**
 * DrTuringManager - Gerenciador da personagem Dra. Ana Turing
 * Responsável por carregar, animar e controlar a Dra. Turing
 */
export class DrTuringManager {
    constructor(threeSystem) {
        this.threeSystem = threeSystem;
        this.scene = threeSystem.getScene();
        this.camera = threeSystem.getCamera();
        
        // Estado da Dra. Turing
        this.model = null;
        this.mixer = null;
        this.animations = {}; // Agora será um objeto com as ações das animações
        this.currentAnimation = null; // Animação atualmente ativa
        this.lighting = null;
        this.speechSystem = null;
        
        // Sistema de carregamento de animações
        this.animationFiles = {
            hello: './assets/dra_ana_turing_realista/hello.fbx',
            talking_1: './assets/dra_ana_turing_realista/talking-1.fbx',
            talking_2: './assets/dra_ana_turing_realista/talking-2.fbx',
            walking: './assets/dra_ana_turing_realista/walking.fbx'
        };
        this.animationsLoaded = 0;
        this.totalAnimations = Object.keys(this.animationFiles).length;
        
        // Configurações
        this.position = { x: -4, y: 0, z: 5 }; // Ajustado de -8 para -4 para centralizar mais
        this.rotation = { x: 0, y: Math.PI / 6, z: 0 }; // Ajustado para olhar mais para a câmera
        this.scale = { x: 2.5, y: 2.5, z: 2.5 };
        
        // Sistema de movimentação espacial
        this.movementSystem = {
            isMoving: false,
            startPosition: { x: 0, y: 0, z: 0 },
            targetPosition: { x: 0, y: 0, z: 0 },
            startRotation: { x: 0, y: 0, z: 0 },
            targetRotation: { x: 0, y: 0, z: 0 },
            progress: 0,
            duration: 3.0, // Duração da movimentação em segundos
            easing: 'easeInOutQuad', // Tipo de easing
            onComplete: null // Callback ao completar movimento
        };
        
        // Pontos predefinidos no ambiente
        this.environmentPoints = {
            home: { x: -4, y: 0, z: 5, rotation: { x: 0, y: Math.PI / 6, z: 0 } }, // Posição inicial
            center: { x: 0, y: 0, z: 3, rotation: { x: 0, y: 0, z: 0 } }, // Centro do laboratório
            computer: { x: 3, y: 0, z: 1, rotation: { x: 0, y: -Math.PI / 4, z: 0 } }, // Próximo ao computador
            whiteboard: { x: -2, y: 0, z: -2, rotation: { x: 0, y: Math.PI / 2, z: 0 } }, // Próximo ao quadro
            server: { x: 4, y: 0, z: -1, rotation: { x: 0, y: -Math.PI / 3, z: 0 } }, // Próximo ao servidor
            presentation: { x: 0, y: 0, z: 0, rotation: { x: 0, y: Math.PI, z: 0 } } // Posição de apresentação
        };
        
        // Timeouts e estados
        this.loadingTimeoutId = null;
        this.isLoading = false;
    }

    /**
     * Inicializa o Dr. Turing Manager
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            console.log('👩‍🔬 Inicializando Dra. Ana Turing...');
            
            await this.loadDrTuring();
            this.setupSpeechSystem();
            this.setupLighting();
            
            console.log('✅ Dra. Ana Turing inicializada');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Dra. Turing:', error);
            this.createPlaceholder();
        }
    }

    /**
     * Mostra o holograma da Dra. Turing
     */
    showHologram() {
        if (this.model) {
            this.model.visible = true;
            if (this.lighting) {
                this.lighting.visible = true;
            }
            
            console.log('👩‍🔬 Holograma da Dra. Turing mostrado');
        }
    }

    /**
     * Oculta o holograma da Dra. Turing
     */
    hideHologram() {
        if (this.model) {
            this.model.visible = false;
            if (this.lighting) {
                this.lighting.visible = false;
            }
            
            console.log('👩‍🔬 Holograma da Dra. Turing ocultado');
        }
    }

    /**
     * Alterna a visibilidade do holograma da Dra. Turing
     */
    toggleHologram() {
        if (this.model) {
            if (this.model.visible) {
                this.hideHologram();
            } else {
                this.showHologram();
            }
            return this.model.visible;
        }
        return false;
    }

    /**
     * Verifica se o holograma está visível
     * @returns {boolean}
     */
    isHologramVisible() {
        return this.model ? this.model.visible : false;
    }

    /**
     * Carrega o modelo da Dra. Turing
     * @returns {Promise<void>}
     */
    async loadDrTuring() {
        if (this.isLoading) return;
        this.isLoading = true;

        // Remover modelo anterior se existir
        this.removePreviousModel();

        console.log('👩‍🔬 Carregando modelo realista da Dra. Turing...');
        
        try {
            // Prioriza o carregamento do modelo FBX realista
            await this.loadFBXModel();
            console.log('✅ Modelo realista da Dra. Turing carregado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao carregar modelo FBX. Tentando fallback para modelo geométrico.', error);
            try {
                this.createGeometricDrTuring();
                console.log('✅ Modelo geométrico de fallback criado com sucesso');
            } catch (geomError) {
                console.error('❌ Erro ao criar modelo geométrico de fallback. Criando placeholder.', geomError);
                this.createPlaceholder();
            }
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Cria modelo geométrico da Dra. Turing
     */
    createGeometricDrTuring() {
        const drTuringGroup = new THREE.Group();
        
        // Corpo (vestido/jaleco científico)
        const bodyGeometry = new THREE.ConeGeometry(1, 3, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9,
            emissive: 0x222244,
            emissiveIntensity: 0.1
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        drTuringGroup.add(body);
        
        // Cabeça
        const headGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: 0xffdbac,
            transparent: true,
            opacity: 0.95
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 3.5;
        drTuringGroup.add(head);
        
        // Cabelo
        const hairGeometry = new THREE.SphereGeometry(0.65, 16, 12);
        const hairMaterial = new THREE.MeshPhongMaterial({
            color: 0x4a3428,
            transparent: true,
            opacity: 0.9
        });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 3.8;
        hair.scale.y = 0.8;
        drTuringGroup.add(hair);
        
        // Óculos
        const glassesGroup = new THREE.Group();
        
        // Armação dos óculos
        const frameGeometry = new THREE.TorusGeometry(0.25, 0.05, 8, 16);
        const frameMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333,
            metalness: 0.8
        });
        
        // Lente esquerda
        const leftFrame = new THREE.Mesh(frameGeometry, frameMaterial);
        leftFrame.position.set(-0.3, 0, 0.5);
        leftFrame.rotation.y = Math.PI / 2;
        glassesGroup.add(leftFrame);
        
        // Lente direita
        const rightFrame = new THREE.Mesh(frameGeometry, frameMaterial);
        rightFrame.position.set(0.3, 0, 0.5);
        rightFrame.rotation.y = Math.PI / 2;
        glassesGroup.add(rightFrame);
        
        // Ponte dos óculos
        const bridgeGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3);
        const bridge = new THREE.Mesh(bridgeGeometry, frameMaterial);
        bridge.rotation.z = Math.PI / 2;
        bridge.position.set(0, 0, 0.5);
        glassesGroup.add(bridge);
        
        glassesGroup.position.y = 3.6;
        drTuringGroup.add(glassesGroup);
        
        // Braços
        for (let i = 0; i < 2; i++) {
            const armGeometry = new THREE.CylinderGeometry(0.15, 0.12, 2);
            const arm = new THREE.Mesh(armGeometry, bodyMaterial);
            arm.position.set(i === 0 ? -1.2 : 1.2, 2.5, 0);
            arm.rotation.z = i === 0 ? Math.PI / 6 : -Math.PI / 6;
            drTuringGroup.add(arm);
        }
        
        // Tablet/Prancheta (representando conhecimento científico)
        const tabletGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.05);
        const tabletMaterial = new THREE.MeshPhongMaterial({
            color: 0x2c3e50,
            emissive: 0x001122,
            emissiveIntensity: 0.3
        });
        const tablet = new THREE.Mesh(tabletGeometry, tabletMaterial);
        tablet.position.set(0.8, 2, 0.8);
        tablet.rotation.y = -Math.PI / 4;
        tablet.rotation.x = -Math.PI / 8;
        drTuringGroup.add(tablet);
        
        // "Tela" do tablet com dados/gráficos
        const screenGeometry = new THREE.BoxGeometry(0.6, 1, 0.01);
        const screenMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            emissive: 0x00ff88,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.8
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 0, 0.03);
        tablet.add(screen);
        
        // Partículas de "dados" ao redor da Dra. Turing
        this.createDataParticles(drTuringGroup);
        
        // Configurar modelo
        drTuringGroup.position.set(this.position.x, this.position.y, this.position.z);
        drTuringGroup.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
        drTuringGroup.scale.set(this.scale.x, this.scale.y, this.scale.z);
        drTuringGroup.name = 'dr-turing-model';
        
        // Inicialmente invisível
        drTuringGroup.visible = false;
        
        // Adicionar à cena
        this.scene.add(drTuringGroup);
        this.model = drTuringGroup;
        
        // Configurar sombras
        drTuringGroup.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Melhorar propriedades do material para sombras
                if (child.material) {
                    child.material.needsUpdate = true;
                    if (child.material.isMeshPhongMaterial || child.material.isMeshStandardMaterial) {
                        child.material.shadowSide = THREE.DoubleSide;
                    }
                }
            }
        });
        
        // Adicionar animação idle
        this.addIdleAnimation();
        
        console.log('✅ Modelo geométrico da Dra. Turing criado');
    }

    /**
     * Cria partículas de dados ao redor da Dra. Turing
     * @param {THREE.Group} group - Grupo da Dra. Turing
     */
    createDataParticles(group) {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 30;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Partículas em órbita ao redor da Dra. Turing
            const radius = 2 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = 1 + Math.random() * 4;
            positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00ffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.name = 'data-particles';
        group.add(particles);
        
        // Animar partículas
        this.animateDataParticles(particles);
    }

    /**
     * Anima partículas de dados
     * @param {THREE.Points} particles - Partículas a animar
     */
    animateDataParticles(particles) {
        const animate = () => {
            if (particles && particles.parent) {
                particles.rotation.y += 0.01;
                particles.rotation.x += 0.005;
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    /**
     * Adiciona animação idle à Dra. Turing
     */
    addIdleAnimation() {
        if (!this.model) return;
        
        const animate = () => {
            if (this.model && this.model.parent && this.model.visible) {
                const time = Date.now() * 0.001;
                
                // Movimento sutil de flutuação
                this.model.position.y = this.position.y + Math.sin(time * 0.5) * 0.1;
                
                // Pequena rotação do tablet
                const tablet = this.model.getObjectByName('tablet');
                if (tablet) {
                    tablet.rotation.y = -Math.PI / 4 + Math.sin(time * 0.3) * 0.1;
                }
                
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    /**
     * Remove modelo anterior da Dra. Turing
     */
    removePreviousModel() {
        // Cancelar timeout pendente
        if (this.loadingTimeoutId) {
            clearTimeout(this.loadingTimeoutId);
            this.loadingTimeoutId = null;
        }
        
        // Remover modelo anterior
        if (this.model) {
            this.scene.remove(this.model);
            this.model = null;
            console.log('🗑️ Modelo anterior da Dra. Turing removido');
        }
        
        // Remover placeholder
        const existingPlaceholder = this.scene.getObjectByName('dr-turing-placeholder');
        if (existingPlaceholder) {
            this.scene.remove(existingPlaceholder);
            console.log('🗑️ Placeholder anterior removido');
        }
        
        // Limpar iluminação anterior
        this.clearLighting();
    }

    /**
     * Carrega modelo FBX principal (SEM animações)
     * @returns {Promise<void>}
     */
    async loadFBXModel() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.FBXLoader();
            
            loader.load(
                './assets/dra_ana_turing_realista/character.fbx',
                (fbx) => {
                    console.log('✅ Modelo FBX base carregado com sucesso!');
                    this.setupFBXModel(fbx);
                    
                    // Agora carregar as animações separadamente
                    this.loadAnimations().then(() => {
                        console.log('🎭 Todas as animações carregadas e integradas!');
                        resolve();
                    }).catch(reject);
                },
                (progress) => {
                    console.log(`📊 Carregamento FBX: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
                },
                (error) => {
                    console.error('❌ Erro ao carregar FBX:', error);
                    reject(error);
                }
            );
        });
    }

    /**
     * Carrega modelo GLB de fallback
     * @returns {Promise<void>}
     */
    async loadGLBModel() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            
            loader.load(
                './assets/dra_ana_turing/Pbr/base_basic_pbr.glb',
                (gltf) => {
                    console.log('✅ Modelo GLB carregado com sucesso!');
                    this.setupGLBModel(gltf.scene);
                    resolve();
                },
                undefined,
                (error) => {
                    console.error('❌ Erro ao carregar GLB:', error);
                    reject(error);
                }
            );
        });
    }

    /**
     * Carrega todas as animações FBX separadamente e adiciona ao mixer
     * @returns {Promise<void>}
     */
    async loadAnimations() {
        console.log('🎯 Iniciando carregamento de animações separadas...');
        
        const loader = new THREE.FBXLoader();
        const loadPromises = [];
        
        // Carregar cada arquivo de animação
        Object.entries(this.animationFiles).forEach(([name, path]) => {
            const promise = new Promise((resolve, reject) => {
                console.log(`📂 Carregando animação: ${name} (${path})`);
                
                loader.load(
                    path,
                    (animFBX) => {
                        // Cada arquivo FBX de animação tem um AnimationClip em animFBX.animations[0]
                        if (animFBX.animations && animFBX.animations.length > 0) {
                            const clip = animFBX.animations[0];
                            const action = this.mixer.clipAction(clip);
                            
                            // Configurar propriedades da animação
                            if (name.includes('talking') || name === 'hello' || name === 'walking') {
                                action.loop = THREE.LoopRepeat;
                            } else {
                                action.loop = THREE.LoopOnce;
                                action.clampWhenFinished = true;
                            }
                            
                            this.animations[name] = action;
                            this.animationsLoaded++;
                            
                            console.log(`✅ Animação '${name}' carregada (${this.animationsLoaded}/${this.totalAnimations})`);
                            resolve();
                        } else {
                            console.warn(`⚠️ Nenhuma animação encontrada em: ${path}`);
                            resolve(); // Não falhar por causa de um arquivo sem animação
                        }
                    },
                    (progress) => {
                        // Progress callback opcional
                    },
                    (error) => {
                        console.error(`❌ Erro ao carregar animação ${name}:`, error);
                        resolve(); // Não falhar por causa de um arquivo que não carregou
                    }
                );
            });
            
            loadPromises.push(promise);
        });
        
        // Aguardar todas as animações carregarem
        await Promise.all(loadPromises);
        
        console.log(`🎭 Sistema de animações configurado com ${Object.keys(this.animations).length} animações:`);
        console.log(`   📋 Animações disponíveis:`, Object.keys(this.animations));
        
        // Iniciar com uma animação padrão se disponível
        if (this.animations.talking_1) {
            this.playAnimation('talking_1');
            console.log('🎬 Iniciando com animação talking_1');
        } else if (Object.keys(this.animations).length > 0) {
            const firstAnim = Object.keys(this.animations)[0];
            this.playAnimation(firstAnim);
            console.log(`🎬 Iniciando com animação: ${firstAnim}`);
        }
    }

    /**
     * Configura modelo FBX
     * @param {THREE.Group} fbx - Modelo FBX carregado
     */
    setupFBXModel(fbx) {
        this.model = fbx;
        this.model.name = 'dr-turing-fbx-model';
        
        // Configuração de materiais aprimorada
        fbx.traverse(child => {
            if (child.isMesh) {
                // Configuração de material para compatibilidade com Three.js
                if (child.material) {
                    child.material.shininess = 30; // Valor padrão seguro
                    child.material.needsUpdate = true;
                    
                    // Remover propriedades não suportadas
                    if (child.material.defines?.HAS_SHININESS_EXPONENT) {
                        delete child.material.defines.HAS_SHININESS_EXPONENT;
                        console.log('⚠️ Removido ShininessExponent não suportado');
                    }
                }
                
                // Otimização de skinning weights
                if (child.geometry?.attributes?.skinWeight) {
                    const weights = child.geometry.attributes.skinWeight;
                    if (weights.itemSize > 4) {
                        console.log('🔧 Otimizando skin weights para 4 influências');
                        const newWeights = new THREE.BufferAttribute(
                            new Float32Array(weights.count * 4),
                            4
                        );
                        for (let i = 0; i < weights.count; i++) {
                            newWeights.setXYZW(i, 
                                weights.getX(i),
                                weights.getY(i),
                                weights.getZ(i),
                                weights.getW(i)
                            );
                        }
                        child.geometry.setAttribute('skinWeight', newWeights);
                    }
                }
            }
        });
        
        // Posicionamento
        this.model.position.set(this.position.x, this.position.y, this.position.z);
        this.model.scale.set(0.02, 0.02, 0.02); // Reduzindo a escala para um tamanho mais apropriado
        this.model.rotation.y = this.rotation.y;
        
        // Inicialmente invisível até que tudo esteja pronto
        this.model.visible = false;

        // Configurar materiais
        this.setupModelMaterials(this.model);
        
        // Configurar animações FBX
        this.setupFBXAnimations(fbx);
        
        // Adicionar à cena
        this.scene.add(this.model);
        
        // Configurar sistemas
        this.setupAnimationSystem();
        this.playInitialSequence();
        
        console.log('🎉 Dra. Ana Turing (FBX) adicionada à cena!');
    }

    /**
     * Configura modelo GLB
     * @param {THREE.Group} scene - Cena do modelo GLB
     */
    setupGLBModel(scene) {
        this.model = scene;
        this.model.name = 'dr-turing-glb-model';
        
        // Posicionamento
        this.model.position.set(this.position.x, this.position.y, this.position.z);
        this.model.scale.set(this.scale.x, this.scale.y, this.scale.z);
        this.model.rotation.y = this.rotation.y;
        
        // Configurar propriedades do modelo
        this.model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        // Adicionar à cena
        this.scene.add(this.model);
        
        // Configurar sistemas
        this.setupAnimationSystem();
        this.playInitialSequence();
        
        console.log('🎉 Dra. Ana Turing (GLB) adicionada à cena!');
    }

    /**
     * Configura materiais do modelo
     * @param {THREE.Group} model - Modelo a configurar
     */
    setupModelMaterials(model) {
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                if (child.material) {
                    // Aplicar cores baseadas no nome
                    const name = child.name.toLowerCase();
                    const materialName = child.material.name?.toLowerCase() || '';
                    
                    if (this.isSkinMaterial(name, materialName)) {
                        this.applySkinMaterial(child.material);
                    } else if (this.isHairMaterial(name, materialName)) {
                        this.applyHairMaterial(child.material);
                    } else if (this.isClothingMaterial(name, materialName)) {
                        this.applyClothingMaterial(child.material);
                    } else if (this.isEyeMaterial(name, materialName)) {
                        this.applyEyeMaterial(child.material);
                    } else {
                        this.applyDefaultMaterial(child.material);
                    }
                    
                    // Propriedades gerais
                    child.material.metalness = 0.1;
                    child.material.roughness = 0.7;
                }
            }
        });
    }

    /**
     * Verifica se é material de pele
     */
    isSkinMaterial(name, materialName) {
        const keywords = ['skin', 'head', 'face', 'body', 'hand', 'arm', 'leg'];
        return keywords.some(keyword => 
            name.includes(keyword) || materialName.includes(keyword)
        );
    }

    /**
     * Verifica se é material de cabelo
     */
    isHairMaterial(name, materialName) {
        const keywords = ['hair'];
        return keywords.some(keyword => 
            name.includes(keyword) || materialName.includes(keyword)
        );
    }

    /**
     * Verifica se é material de roupa
     */
    isClothingMaterial(name, materialName) {
        const keywords = ['cloth', 'shirt', 'dress', 'top', 'jacket'];
        return keywords.some(keyword => 
            name.includes(keyword) || materialName.includes(keyword)
        );
    }

    /**
     * Verifica se é material de olho
     */
    isEyeMaterial(name, materialName) {
        const keywords = ['eye'];
        return keywords.some(keyword => 
            name.includes(keyword) || materialName.includes(keyword)
        );
    }

    /**
     * Aplica material de pele
     */
    applySkinMaterial(material) {
        material.color = new THREE.Color(0xffdbac);
        material.emissive = new THREE.Color(0x000000);
        material.emissiveIntensity = 0;
    }

    /**
     * Aplica material de cabelo
     */
    applyHairMaterial(material) {
        material.color = new THREE.Color(0x2d1b0e);
        material.emissive = new THREE.Color(0x000000);
        material.emissiveIntensity = 0;
    }

    /**
     * Aplica material de roupa
     */
    applyClothingMaterial(material) {
        material.color = new THREE.Color(0xf8f8ff);
        material.emissive = new THREE.Color(0x222244);
        material.emissiveIntensity = 0.1;
    }

    /**
     * Aplica material de olho
     */
    applyEyeMaterial(material) {
        material.color = new THREE.Color(0x4a90e2);
        material.emissive = new THREE.Color(0x001122);
        material.emissiveIntensity = 0.2;
    }

    /**
     * Aplica material padrão
     */
    applyDefaultMaterial(material) {
        material.color = new THREE.Color(0xeeeeee);
        material.emissive = new THREE.Color(0x002244);
        material.emissiveIntensity = 0.05;
    }

    /**
     * Configura o AnimationMixer para o modelo base (SEM carregar animações do modelo)
     * @param {THREE.Group} fbx - Modelo FBX base
     */
    setupFBXAnimations(fbx) {
        // Criar o mixer apenas com o modelo base
        this.mixer = new THREE.AnimationMixer(fbx);
        
        console.log('🎛️ AnimationMixer configurado para o modelo base');
        console.log('📋 Animações do modelo base:', fbx.animations?.length || 0);
        
        // Se o modelo base tem animações próprias, podemos adicioná-las também
        if (fbx.animations && fbx.animations.length > 0) {
            console.log('📦 Adicionando animações do modelo base...');
            fbx.animations.forEach((clip, index) => {
                const action = this.mixer.clipAction(clip);
                const clipName = clip.name.toLowerCase();
                
                // Mapear nomes das animações do modelo base
                if (clipName.includes('idle') || clipName.includes('t-pose') || clipName.includes('rest')) {
                    this.animations.idle = action;
                    action.loop = THREE.LoopRepeat;
                    console.log(`   ✅ Animação base 'idle' encontrada: ${clip.name}`);
                }
            });
        }
        
        // As animações externas serão carregadas por loadAnimations()
    }

    /**
     * Configura sistema de animação procedural
     */
    setupAnimationSystem() {
        // Importar e configurar sistema de animação
        // Este sistema será usado como fallback ou para modelos GLB
        this.animations = this.animations || {
            idle: null,
            speak: null,
            wave: null,
            isPlaying: 'idle'
        };
    }

    /**
     * Configura sistema de fala 3D usando síntese de voz
     */
    setupSpeechSystem() {
        this.speechSystem = {
            isPlaying: false,
            speak: (text, duration = 5000) => this.speak3D(text, duration)
        };
    }

    /**
     * Configura iluminação especial para a Dra. Turing
     */
    setupLighting() {
        if (!this.model) return;

        // Spotlight principal
        const spotlight = new THREE.SpotLight(0xffffff, 2, 20, Math.PI / 6, 0.5, 1);
        spotlight.position.set(this.model.position.x, this.model.position.y + 8, this.model.position.z + 5);
        spotlight.target.position.copy(this.model.position);
        spotlight.castShadow = true;
        spotlight.shadow.mapSize.width = 1024;
        spotlight.shadow.mapSize.height = 1024;
        spotlight.name = 'dr-turing-spotlight';
        
        // Luz de preenchimento
        const fillLight = new THREE.PointLight(0x88ccff, 0.8, 15);
        fillLight.position.set(this.model.position.x - 3, this.model.position.y + 2, this.model.position.z + 3);
        fillLight.name = 'dr-turing-fill-light';
        
        // Luz de contorno
        const rimLight = new THREE.DirectionalLight(0x00ff88, 0.5);
        rimLight.position.set(this.model.position.x + 5, this.model.position.y + 3, this.model.position.z - 5);
        rimLight.target.position.copy(this.model.position);
        rimLight.name = 'dr-turing-rim-light';
        
        this.scene.add(spotlight);
        this.scene.add(spotlight.target);
        this.scene.add(fillLight);
        this.scene.add(rimLight);
        this.scene.add(rimLight.target);
        
        this.lighting = {
            spotlight,
            fillLight,
            rimLight,
            intensifyWhenSpeaking: () => {
                spotlight.intensity = 3;
                fillLight.intensity = 1.2;
                rimLight.intensity = 0.8;
            },
            normalIntensity: () => {
                spotlight.intensity = 2;
                fillLight.intensity = 0.8;
                rimLight.intensity = 0.5;
            }
        };
        
        console.log('💡 Iluminação da Dra. Turing configurada');
    }

    /**
     * Limpa a iluminação
     */
    clearLighting() {
        if (this.lighting) {
            this.scene.remove(this.lighting.spotlight);
            this.scene.remove(this.lighting.fillLight);
            this.scene.remove(this.lighting.rimLight);
            this.lighting = null;
        }
    }

    /**
     * Executa sequência inicial com as novas animações
     */
    playInitialSequence() {
        // Aguardar 1s para garantir que as animações estejam carregadas
        setTimeout(() => {
            this.speak3D(
                'Olá! Bem-vindo ao Nexo Dash! Sou a Dra. Ana Turing, sua mentora nesta jornada fascinante. Juntos, construiremos um dashboard completo para análise de doenças cardíacas usando Python e Dash. Está pronto para esta missão?',
                8000,
                'talking_2' // Usar talking_2 para introdução
            );
            
            setTimeout(() => {
                // Acená-lo após começar a falar
                if (this.animations.hello) {
                    this.playAnimation('hello');
                } else if (this.animations.wave) {
                    this.playAnimation('wave');
                }
            }, 1000);
        }, 1000);
    }

    /**
     * Faz a Dra. Turing falar usando síntese de voz
     * @param {string} text - Texto a ser falado
     * @param {number} duration - Duração em ms (usado para animações)
     */
    /**
     * Faz a Dra. Turing falar usando síntese de voz com animações apropriadas
     * @param {string} text - Texto a ser falado
     * @param {number} duration - Duração em ms (usado para animações)
     * @param {string} talkAnimation - Animação específica para usar (padrão: talking_1)
     */
    async speak3D(text, duration = 5000, talkAnimation = 'talking_1') {
        if (!this.model) return;

        this.speechSystem.isPlaying = true;

        // Escolher animação de fala disponível
        let selectedAnimation = talkAnimation;
        if (!this.animations[selectedAnimation]) {
            // Fallback para outras animações de fala
            if (this.animations.talking_2) {
                selectedAnimation = 'talking_2';
            } else if (this.animations.talking_1) {
                selectedAnimation = 'talking_1';
            } else if (this.animations.hello) {
                selectedAnimation = 'hello';
            } else {
                console.warn('⚠️ Nenhuma animação de fala encontrada');
                selectedAnimation = null;
            }
        }

        // Ativar animação de fala
        if (selectedAnimation) {
            this.playAnimation(selectedAnimation, 0.2);
            console.log(`🎭 Usando animação de fala: ${selectedAnimation}`);
        }
        
        // Intensificar iluminação
        if (this.lighting && this.lighting.intensifyWhenSpeaking) {
            this.lighting.intensifyWhenSpeaking();
        }
        
        // Usar síntese de voz
        if (window.speakText) {
            window.speakText(text, 'pt-BR', 1.0, 1.1);
        }
        
        // Voltar ao normal após duração
        setTimeout(() => {
            this.speechSystem.isPlaying = false;
            
            // Voltar para animação idle ou primeira disponível
            if (this.animations.idle) {
                this.playAnimation('idle', 0.5);
            } else if (Object.keys(this.animations).length > 0) {
                const firstAnim = Object.keys(this.animations)[0];
                this.playAnimation(firstAnim, 0.5);
            }
            
            if (this.lighting && this.lighting.normalIntensity) {
                this.lighting.normalIntensity();
            }
        }, duration);
        
        console.log(`💬 Dra. Turing falando: "${text.substring(0, 50)}..."`);
    }

    /**
     * Cria um balão de fala 3D (DESABILITADO - usando síntese de voz)
     * @param {string} text - Texto do balão
     * @param {number} duration - Duração
     */
    createSpeechBalloon(text, duration) {
        // Função desabilitada - agora usamos síntese de voz
        console.log('💬 Balões de fala desabilitados - usando síntese de voz');
        return;
        
        // Código original comentado para possível uso futuro
        /*
        // Remover balão anterior
        if (this.speechSystem.currentBalloon) {
            this.scene.remove(this.speechSystem.currentBalloon);
        }

        // Criar canvas para o texto
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;

        // Desenhar balão
        this.drawSpeechBalloon(context, text, canvas.width, canvas.height);

        // Criar sprite
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(
            this.model.position.x + 3,
            this.model.position.y + 4,
            this.model.position.z
        );
        sprite.scale.set(6, 3, 1);
        
        this.scene.add(sprite);
        this.speechSystem.currentBalloon = sprite;

        // Remover após duração
        setTimeout(() => {
            if (sprite.parent) {
                this.scene.remove(sprite);
            }
            this.speechSystem.currentBalloon = null;
        }, duration);
        */
    }

    /**
     * Desenha o balão de fala no canvas (DESABILITADO - usando síntese de voz)
     * @param {CanvasRenderingContext2D} context - Contexto do canvas
     * @param {string} text - Texto a desenhar
     * @param {number} width - Largura do canvas
     * @param {number} height - Altura do canvas
     */
    drawSpeechBalloon(context, text, width, height) {
        // Função desabilitada - agora usamos síntese de voz
        console.log('💬 Função de desenho de balão desabilitada');
        return;
        
        // Código original comentado para possível uso futuro
        /*
        // Fundo
        context.fillStyle = 'rgba(255, 255, 255, 0.95)';
        context.fillRect(0, 0, width, height);
        
        // Borda
        context.strokeStyle = '#00ff88';
        context.lineWidth = 4;
        context.strokeRect(0, 0, width, height);

        // Texto
        context.fillStyle = '#000';
        context.font = 'bold 18px Arial';
        context.textAlign = 'left';
        
        // Quebrar texto em linhas
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        const maxWidth = width - 40;
        
        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = context.measureText(testLine);
            if (metrics.width > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });
        lines.push(currentLine);

        // Desenhar linhas
        const lineHeight = 22;
        const startY = 30;
        lines.forEach((line, index) => {
            context.fillText(line, 20, startY + (index * lineHeight));
        });

        // Ícone da Dra. Turing
        context.font = '24px Arial';
        context.fillText('👩‍🔬', width - 50, 30);
        */
    }

    /**
     * Função profissional para trocar animações com transições suaves
     * @param {string} animationName - Nome da animação a ser executada
     * @param {number} fadeDuration - Duração da transição em segundos (padrão: 0.3)
     * @param {boolean} resetTime - Se deve resetar o tempo da animação (padrão: true)
     */
    playAnimation(animationName, fadeDuration = 0.3, resetTime = true) {
        if (!this.animations || !this.animations[animationName]) {
            console.warn(`⚠️ Animação '${animationName}' não encontrada. Disponíveis:`, Object.keys(this.animations || {}));
            return false;
        }
        
        const newAction = this.animations[animationName];
        
        // Se já está tocando a mesma animação, não fazer nada
        if (this.currentAnimation === newAction) {
            return true;
        }
        
        console.log(`🎬 Transicionando para animação: ${animationName}`);
        
        // Parar animação atual com fade out
        if (this.currentAnimation) {
            this.currentAnimation.fadeOut(fadeDuration);
        }
        
        // Preparar nova animação
        if (resetTime) {
            newAction.reset();
        }
        
        // Iniciar nova animação com fade in
        newAction
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(fadeDuration)
            .play();
        
        this.currentAnimation = newAction;
        
        return true;
    }

    /**
     * Para todas as animações
     */
    stopAllAnimations() {
        if (this.animations) {
            Object.values(this.animations).forEach(action => {
                action.stop();
            });
        }
        this.currentAnimation = null;
        console.log('⏹️ Todas as animações paradas');
    }

    /**
     * Verifica se uma animação específica está tocando
     * @param {string} animationName - Nome da animação
     * @returns {boolean}
     */
    isAnimationPlaying(animationName) {
        if (!this.animations || !this.animations[animationName]) {
            return false;
        }
        return this.currentAnimation === this.animations[animationName] && this.currentAnimation.isRunning();
    }

    /**
     * Lista todas as animações disponíveis
     * @returns {string[]}
     */
    getAvailableAnimations() {
        return Object.keys(this.animations || {});
    }

    /**
     * Cria um placeholder da Dra. Turing
     */
    createPlaceholder() {
        console.log('🎭 Criando placeholder da Dra. Turing...');
        
        // Criar grupo placeholder
        const group = new THREE.Group();
        group.name = 'dr-turing-placeholder';
        
        // Corpo principal
        const bodyGeometry = new THREE.CapsuleGeometry ? 
            new THREE.CapsuleGeometry(0.6, 2, 8) : 
            new THREE.CylinderGeometry(0.6, 0.6, 2, 8);
        
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xf8f8ff,
            shininess: 30
        });
        
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        body.castShadow = true;
        group.add(body);
        
        // Cabeça
        const headGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: 0xffdbac,
            shininess: 20
        });
        
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.5;
        head.castShadow = true;
        group.add(head);
        
        // Posicionar e adicionar à cena
        group.position.set(this.position.x, this.position.y, this.position.z);
        group.scale.set(this.scale.x, this.scale.y, this.scale.z);
        group.rotation.y = this.rotation.y;
        
        this.scene.add(group);
        this.model = group;
        
        // Configurar sistemas básicos
        this.setupAnimationSystem();
        this.setupLighting();
        this.playInitialSequence();
        
        console.log('🎭 Placeholder da Dra. Turing criado');
    }

    /**
     * Move a Dra. Turing para um ponto específico do ambiente
     * @param {string} pointName - Nome do ponto ('home', 'center', 'computer', etc.)
     * @param {number} duration - Duração da movimentação em segundos (padrão: 3.0)
     * @param {string} easing - Tipo de easing (padrão: 'easeInOutQuad')
     * @param {Function} onComplete - Callback ao completar movimento
     * @returns {boolean} - true se o movimento foi iniciado, false caso contrário
     */
    moveToPoint(pointName, duration = 3.0, easing = 'easeInOutQuad', onComplete = null) {
        if (!this.model || this.movementSystem.isMoving) {
            console.warn('⚠️ Não é possível mover: modelo não carregado ou já em movimento');
            return false;
        }
        
        const targetPoint = this.environmentPoints[pointName];
        if (!targetPoint) {
            console.warn(`⚠️ Ponto '${pointName}' não encontrado. Pontos disponíveis:`, Object.keys(this.environmentPoints));
            return false;
        }
        
        console.log(`🚶‍♀️ Dra. Turing movendo para: ${pointName}`);
        
        // Configurar sistema de movimento
        this.movementSystem.isMoving = true;
        this.movementSystem.startPosition = { ...this.model.position };
        this.movementSystem.targetPosition = { x: targetPoint.x, y: targetPoint.y, z: targetPoint.z };
        this.movementSystem.startRotation = { ...this.model.rotation };
        this.movementSystem.targetRotation = { ...targetPoint.rotation };
        this.movementSystem.progress = 0;
        this.movementSystem.duration = duration;
        this.movementSystem.easing = easing;
        this.movementSystem.onComplete = onComplete;
        
        // Iniciar animação de walking se disponível
        if (this.animations.walking) {
            this.playAnimation('walking', 0.3);
        }
        
        return true;
    }
    
    /**
     * Move a Dra. Turing para uma posição específica (coordenadas customizadas)
     * @param {Object} targetPos - Posição alvo {x, y, z}
     * @param {Object} targetRot - Rotação alvo {x, y, z} (opcional)
     * @param {number} duration - Duração da movimentação em segundos
     * @param {Function} onComplete - Callback ao completar movimento
     * @returns {boolean} - true se o movimento foi iniciado
     */
    moveToPosition(targetPos, targetRot = null, duration = 3.0, onComplete = null) {
        if (!this.model || this.movementSystem.isMoving) {
            console.warn('⚠️ Não é possível mover: modelo não carregado ou já em movimento');
            return false;
        }
        
        console.log(`🚶‍♀️ Dra. Turing movendo para posição customizada:`, targetPos);
        
        // Configurar sistema de movimento
        this.movementSystem.isMoving = true;
        this.movementSystem.startPosition = { ...this.model.position };
        this.movementSystem.targetPosition = { ...targetPos };
        this.movementSystem.startRotation = { ...this.model.rotation };
        this.movementSystem.targetRotation = targetRot || { ...this.model.rotation };
        this.movementSystem.progress = 0;
        this.movementSystem.duration = duration;
        this.movementSystem.easing = 'easeInOutQuad';
        this.movementSystem.onComplete = onComplete;
        
        // Iniciar animação de walking se disponível
        if (this.animations.walking) {
            this.playAnimation('walking', 0.3);
        }
        
        return true;
    }
    
    /**
     * Para o movimento atual da Dra. Turing
     */
    stopMovement() {
        if (this.movementSystem.isMoving) {
            this.movementSystem.isMoving = false;
            console.log('⏹️ Movimento da Dra. Turing interrompido');
            
            // Voltar para animação idle se estava caminhando
            if (this.isAnimationPlaying('walking')) {
                const firstAnim = Object.keys(this.animations)[0];
                if (firstAnim && firstAnim !== 'walking') {
                    this.playAnimation(firstAnim, 0.5);
                }
            }
        }
    }
    
    /**
     * Função de easing para suavizar movimentos
     * @param {number} t - Progresso (0-1)
     * @param {string} type - Tipo de easing
     * @returns {number} - Valor interpolado
     */
    easeFunction(t, type = 'easeInOutQuad') {
        switch (type) {
            case 'linear':
                return t;
            case 'easeInQuad':
                return t * t;
            case 'easeOutQuad':
                return t * (2 - t);
            case 'easeInOutQuad':
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            case 'easeInCubic':
                return t * t * t;
            case 'easeOutCubic':
                return (--t) * t * t + 1;
            case 'easeInOutCubic':
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            default:
                return t;
        }
    }
    
    /**
     * Interpolação linear entre dois valores
     * @param {number} start - Valor inicial
     * @param {number} end - Valor final
     * @param {number} progress - Progresso (0-1)
     * @returns {number} - Valor interpolado
     */
    lerp(start, end, progress) {
        return start + (end - start) * progress;
    }
    
    /**
     * Atualiza o sistema de movimentação
     * @param {number} deltaTime - Delta time em segundos
     */
    updateMovement(deltaTime) {
        if (!this.movementSystem.isMoving || !this.model) return;
        
        // Atualizar progresso
        this.movementSystem.progress += deltaTime / this.movementSystem.duration;
        
        if (this.movementSystem.progress >= 1.0) {
            // Movimento concluído
            this.movementSystem.progress = 1.0;
            this.movementSystem.isMoving = false;
            
            // Aplicar posição final exata
            this.model.position.set(
                this.movementSystem.targetPosition.x,
                this.movementSystem.targetPosition.y,
                this.movementSystem.targetPosition.z
            );
            this.model.rotation.set(
                this.movementSystem.targetRotation.x,
                this.movementSystem.targetRotation.y,
                this.movementSystem.targetRotation.z
            );
            
            console.log('✅ Dra. Turing chegou ao destino');
            
            // Voltar para animação padrão após o movimento
            setTimeout(() => {
                if (this.isAnimationPlaying('walking')) {
                    const firstAnim = Object.keys(this.animations)[0];
                    if (firstAnim && firstAnim !== 'walking') {
                        this.playAnimation(firstAnim, 0.5);
                    }
                }
            }, 500);
            
            // Executar callback se fornecido
            if (this.movementSystem.onComplete) {
                this.movementSystem.onComplete();
                this.movementSystem.onComplete = null;
            }
            
            return;
        }
        
        // Aplicar easing
        const easedProgress = this.easeFunction(this.movementSystem.progress, this.movementSystem.easing);
        
        // Interpolação de posição
        this.model.position.x = this.lerp(
            this.movementSystem.startPosition.x,
            this.movementSystem.targetPosition.x,
            easedProgress
        );
        this.model.position.y = this.lerp(
            this.movementSystem.startPosition.y,
            this.movementSystem.targetPosition.y,
            easedProgress
        );
        this.model.position.z = this.lerp(
            this.movementSystem.startPosition.z,
            this.movementSystem.targetPosition.z,
            easedProgress
        );
        
        // Interpolação de rotação
        this.model.rotation.x = this.lerp(
            this.movementSystem.startRotation.x,
            this.movementSystem.targetRotation.x,
            easedProgress
        );
        this.model.rotation.y = this.lerp(
            this.movementSystem.startRotation.y,
            this.movementSystem.targetRotation.y,
            easedProgress
        );
        this.model.rotation.z = this.lerp(
            this.movementSystem.startRotation.z,
            this.movementSystem.targetRotation.z,
            easedProgress
        );
    }

    /**
     * Atualiza o sistema (chamado no loop de animação)
     * @param {number} deltaTime - Delta time em segundos
     */
    update(deltaTime) {
        // Atualizar mixer de animações FBX
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
        
        // Atualizar sistema de movimentação
        this.updateMovement(deltaTime);
        
        // Atualizar outras animações procedurais aqui
    }

    /**
     * Manipulador de mudança de módulo com animações e movimentações específicas
     * @param {Object} module - Dados do módulo
     */
    onModuleChange(module) {
        const reaction = () => {
            switch (module.index) {
                case 0: // Início - mover para centro + cumprimento
                    this.moveToPoint('center', 2.5, 'easeInOutQuad', () => {
                        this.speak3D('Bem-vindo ao Laboratório Nexo Dash! Vamos começar nossa jornada.', 4000, 'talking_1');
                        setTimeout(() => {
                            if (this.animations.hello) {
                                this.playAnimation('hello');
                            }
                        }, 1500);
                    });
                    break;
                    
                case 1: // Projeto - mover para quadro/apresentação
                    this.moveToPoint('presentation', 3.0, 'easeInOutCubic', () => {
                        this.speak3D('Perfeito! Agora vamos projetar o blueprint 3D do nosso sistema.', 4000, 'talking_2');
                    });
                    break;
                    
                case 2: // Implementação - mover para computador
                    this.moveToPoint('computer', 2.0, 'easeInOutQuad', () => {
                        this.speak3D('Excelente! Hora de codificar. Vamos ao computador criar nosso servidor Dash.', 4000, 'talking_1');
                    });
                    break;
                    
                case 3: // Dados - mover para servidor
                    this.moveToPoint('server', 2.5, 'easeInOutQuad', () => {
                        this.speak3D('Agora vamos conectar com o servidor de dados. Seguindo protocolos de segurança.', 4000, 'talking_2');
                    });
                    break;
                    
                case 4: // Visualização - voltar para centro
                    this.moveToPoint('center', 2.0, 'easeInOutQuad', () => {
                        this.speak3D('Momento de criar visualizações incríveis! Observe a magia dos dados.', 4000, 'talking_1');
                        setTimeout(() => {
                            if (this.animations.hello) {
                                this.playAnimation('hello');
                            }
                        }, 2000);
                    });
                    break;
                    
                case 5: // Deploy - mover para whiteboard
                    this.moveToPoint('whiteboard', 3.0, 'easeInOutCubic', () => {
                        this.speak3D('Chegou a hora do deploy! Vamos revisar nossa arquitetura final.', 4000, 'talking_2');
                    });
                    break;
                    
                default:
                    // Para módulos não específicos, fazer um passeio pelo laboratório
                    const points = ['center', 'computer', 'home'];
                    const randomPoint = points[Math.floor(Math.random() * points.length)];
                    
                    this.moveToPoint(randomPoint, 2.0, 'easeInOutQuad', () => {
                        this.speak3D('Continuando nossa jornada pelo laboratório...', 3000, 'talking_1');
                    });
                    break;
            }
        };

        setTimeout(reaction, 1000);
    }

    /**
     * Limpa recursos do sistema
     */
    dispose() {
        // Parar timeouts
        if (this.loadingTimeoutId) {
            clearTimeout(this.loadingTimeoutId);
        }
        
        // Remover modelo da cena
        if (this.model) {
            this.scene.remove(this.model);
        }
        
        // Limpar iluminação
        this.clearLighting();
        
        // Limpar animações
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
        
        this.model = null;
        this.mixer = null;
        this.animations = null;
        this.lighting = null;
        this.speechSystem = null;
        
        console.log('🧹 Dr. Turing Manager limpo');
    }

    /**
     * Função de debug para testar animações (APENAS PARA DESENVOLVIMENTO)
     * Execute no console: window.app.getSystem('ThreeJSSystem').drTuringManager.debugAnimations()
     */
    debugAnimations() {
        console.log('🎭 DEBUG: Sistema de Animações da Dra. Turing');
        console.log('📊 Status do Sistema:');
        console.log(`   - Modelo carregado: ${!!this.model}`);
        console.log(`   - Mixer ativo: ${!!this.mixer}`);
        console.log(`   - Total de animações: ${Object.keys(this.animations || {}).length}`);
        console.log(`   - Animação atual: ${this.currentAnimation?.getClip?.()?.name || 'Nenhuma'}`);
        
        console.log('📋 Animações Disponíveis:');
        Object.keys(this.animations || {}).forEach(name => {
            const action = this.animations[name];
            const isPlaying = action.isRunning();
            const weight = action.getEffectiveWeight();
            console.log(`   - ${name}: ${isPlaying ? '▶️ Tocando' : '⏸️ Parada'} (peso: ${weight.toFixed(2)})`);
        });
        
        console.log('🎮 Comandos de Teste:');
        console.log('   drTuring.playAnimation("hello") - Animação de cumprimento');
        console.log('   drTuring.playAnimation("talking_1") - Fala modo 1');
        console.log('   drTuring.playAnimation("talking_2") - Fala modo 2');
        console.log('   drTuring.playAnimation("walking") - Caminhada');
        console.log('   drTuring.speak3D("Olá!", 3000, "talking_1") - Falar com animação');
        console.log('   drTuring.stopAllAnimations() - Parar tudo');
        
        // Tornar disponível globalmente para debug
        window.drTuring = this;
        
        return {
            model: !!this.model,
            mixer: !!this.mixer,
            animations: Object.keys(this.animations || {}),
            currentAnimation: this.currentAnimation?.getClip?.()?.name || null
        };
    }
    
    /**
     * Função de debug para testar sistema de movimentação (APENAS PARA DESENVOLVIMENTO)
     * Execute no console: window.app.getSystem('ThreeJSSystem').drTuringManager.debugMovement()
     */
    debugMovement() {
        console.log('🚶‍♀️ DEBUG: Sistema de Movimentação da Dra. Turing');
        console.log('📊 Status do Sistema:');
        console.log(`   - Modelo carregado: ${!!this.model}`);
        console.log(`   - Em movimento: ${this.movementSystem.isMoving}`);
        if (this.model) {
            console.log(`   - Posição atual: x=${this.model.position.x.toFixed(2)}, y=${this.model.position.y.toFixed(2)}, z=${this.model.position.z.toFixed(2)}`);
            console.log(`   - Rotação atual: x=${this.model.rotation.x.toFixed(2)}, y=${this.model.rotation.y.toFixed(2)}, z=${this.model.rotation.z.toFixed(2)}`);
        }
        
        if (this.movementSystem.isMoving) {
            console.log(`   - Progresso: ${(this.movementSystem.progress * 100).toFixed(1)}%`);
            console.log(`   - Destino: x=${this.movementSystem.targetPosition.x}, y=${this.movementSystem.targetPosition.y}, z=${this.movementSystem.targetPosition.z}`);
        }
        
        console.log('📍 Pontos Disponíveis:');
        Object.entries(this.environmentPoints).forEach(([name, point]) => {
            console.log(`   - ${name}: x=${point.x}, y=${point.y}, z=${point.z}`);
        });
        
        console.log('🎮 Comandos de Movimentação:');
        console.log('   drTuring.moveToPoint("center") - Mover para centro');
        console.log('   drTuring.moveToPoint("computer") - Mover para computador');
        console.log('   drTuring.moveToPoint("whiteboard") - Mover para quadro');
        console.log('   drTuring.moveToPoint("server") - Mover para servidor');
        console.log('   drTuring.moveToPoint("home") - Voltar para casa');
        console.log('   drTuring.stopMovement() - Parar movimento atual');
        
        console.log('🎭 Demonstrações:');
        console.log('   drTuring.demonstrateMovement() - Demo completa de movimentação');
        console.log('   drTuring.tourLaboratory() - Passeio narrado pelo laboratório');
        console.log('   drTuring.moveToPosition({x: 2, y: 0, z: 3}) - Posição customizada');
        
        // Tornar disponível globalmente para debug
        window.drTuring = this;
        
        return {
            model: !!this.model,
            isMoving: this.movementSystem.isMoving,
            currentPosition: this.model ? { ...this.model.position } : null,
            availablePoints: Object.keys(this.environmentPoints)
        };
    }
    
    /**
     * Demonstração do sistema de movimentação
     */
    demonstrateMovement() {
        console.log('🎬 Iniciando demonstração de movimentação...');
        
        if (this.movementSystem.isMoving) {
            console.log('⚠️ Já em movimento. Pare o movimento atual primeiro: drTuring.stopMovement()');
            return false;
        }
        
        const sequence = [
            { point: 'center', message: 'Movendo para o centro do laboratório...', duration: 2.0 },
            { point: 'computer', message: 'Indo para a estação de desenvolvimento...', duration: 2.5 },
            { point: 'server', message: 'Verificando o servidor de dados...', duration: 2.0 },
            { point: 'whiteboard', message: 'Analisando o quadro holográfico...', duration: 2.5 },
            { point: 'home', message: 'Retornando para a base de operações...', duration: 3.0 }
        ];
        
        let currentIndex = 0;
        
        const executeNext = () => {
            if (currentIndex >= sequence.length) {
                console.log('✅ Demonstração concluída!');
                this.speak3D('Demonstração de movimentação concluída com sucesso!', 3000, 'talking_1');
                return;
            }
            
            const step = sequence[currentIndex];
            console.log(`🚶‍♀️ ${step.message}`);
            
            this.moveToPoint(step.point, step.duration, 'easeInOutQuad', () => {
                currentIndex++;
                setTimeout(executeNext, 1000); // Pausa entre movimentos
            });
        };
        
        executeNext();
        return true;
    }
    
    /**
     * Passeio pelo laboratório com narração
     */
    tourLaboratory() {
        console.log('🏛️ Iniciando tour guiado pelo laboratório...');
        
        if (this.movementSystem.isMoving) {
            console.log('⚠️ Já em movimento. Pare o movimento atual primeiro: drTuring.stopMovement()');
            return false;
        }
        
        const tour = [
            { 
                point: 'center', 
                message: 'Bem-vindos ao coração do laboratório! Aqui processamos dados em tempo real.',
                animation: 'hello',
                duration: 2.0
            },
            { 
                point: 'computer', 
                message: 'Esta é nossa estação de desenvolvimento. Aqui codificamos o futuro.',
                animation: 'talking_2',
                duration: 2.5
            },
            { 
                point: 'server', 
                message: 'Nosso servidor de dados. Potência computacional para análises complexas.',
                animation: 'talking_1',
                duration: 2.0
            },
            { 
                point: 'whiteboard', 
                message: 'O quadro holográfico mostra nossas descobertas e insights.',
                animation: 'talking_2',
                duration: 2.5
            },
            { 
                point: 'home', 
                message: 'E aqui é minha base de operações. Pronta para nossa próxima missão!',
                animation: 'hello',
                duration: 3.0
            }
        ];
        
        let currentIndex = 0;
        
        const executeNext = () => {
            if (currentIndex >= tour.length) {
                console.log('✅ Tour concluído!');
                return;
            }
            
            const step = tour[currentIndex];
            console.log(`🏛️ Visitando: ${step.point}`);
            
            this.moveToPoint(step.point, step.duration, 'easeInOutCubic', () => {
                // Falar sobre o local
                this.speak3D(step.message, 4000, step.animation);
                
                currentIndex++;
                setTimeout(executeNext, 5000); // Tempo para narração
            });
        };
        
        executeNext();
        return true;
    }
}
