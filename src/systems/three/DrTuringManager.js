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
        this.animations = null;
        this.activeAction = null; // Nova propriedade para controle da ação ativa
        this.lighting = null;
        this.speechSystem = null;
        
        // Configurações
        this.position = { x: -4, y: 0, z: 5 }; // Ajustado de -8 para -4 para centralizar mais
        this.rotation = { x: 0, y: Math.PI / 6, z: 0 }; // Ajustado para olhar mais para a câmera
        this.scale = { x: 2.5, y: 2.5, z: 2.5 };
        
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
                this.lighting.spotlight.visible = true;
                this.lighting.fillLight.visible = true;
                this.lighting.rimLight.visible = true;
            }
            
            // Reiniciar animações quando mostrar
            this.addIdleAnimation();
            
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
                this.lighting.spotlight.visible = false;
                this.lighting.fillLight.visible = false;
                this.lighting.rimLight.visible = false;
            }
            
            // Parar animações quando ocultar
            this.stopProceduralAnimations();
            
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
        
        // Remover animação anterior se existir
        if (this.idleAnimationId) {
            cancelAnimationFrame(this.idleAnimationId);
        }
        
        const animate = () => {
            if (this.model && this.model.parent && this.model.visible) {
                this.updateProceduralAnimations();
                this.idleAnimationId = requestAnimationFrame(animate);
            }
        };
        
        // Iniciar animação
        animate();
        console.log('🎭 Animação idle iniciada');
    }

    /**
     * Para todas as animações procedurais
     */
    stopProceduralAnimations() {
        if (this.idleAnimationId) {
            cancelAnimationFrame(this.idleAnimationId);
            this.idleAnimationId = null;
        }
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
     * Carrega modelo FBX
     * @returns {Promise<void>}
     */
    async loadFBXModel() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.FBXLoader();
            
            loader.load(
                './assets/dra_ana_turing_realista/character-2.fbx',
                (fbx) => {
                    console.log('✅ Modelo FBX carregado com sucesso!');
                    this.setupFBXModel(fbx);
                    resolve();
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
     * Configura todas as animações encontradas no modelo FBX.
     * @param {THREE.Group} fbx - Modelo FBX
     */
    setupFBXAnimations(fbx) {
        if (!fbx.animations || fbx.animations.length === 0) {
            console.warn('⚠️ Nenhum clipe de animação encontrado no modelo FBX.');
            return;
        }
        
        this.mixer = new THREE.AnimationMixer(fbx);
        this.animations = {};

        console.log('🎭 Encontrando e configurando animações...');
        console.log(`📊 Total de animações encontradas: ${fbx.animations.length}`);
        
        fbx.animations.forEach((clip, index) => {
            const action = this.mixer.clipAction(clip);
            const clipName = clip.name.toLowerCase();
            
            // Mapeia ações baseadas em nomes de arquivos/clips
            // Usa o nome do clipe sem extensão como chave
            const actionKey = clipName.split('.')[0].replace(/[^a-z0-9]/gi, '_');

            this.animations[actionKey] = action;
            console.log(` -> [${index}] Ação '${actionKey}' registrada (nome original: '${clip.name}')`);

            // Configura animações que não devem se repetir
            if (!clipName.includes('idle') && !clipName.includes('breathing') && !clipName.includes('walking')) {
                action.loop = THREE.LoopOnce;
                action.clampWhenFinished = true;
                console.log(`   └─ Configurada como LoopOnce`);
            } else {
                console.log(`   └─ Configurada como LoopRepeat`);
            }
        });

        console.log('🎯 Animações disponíveis:', Object.keys(this.animations));

        // Define a ação inicial como 'idle' ou a primeira da lista
        this.activeAction = this.animations.idle || this.animations.breathing || Object.values(this.animations)[0];
        if (this.activeAction) {
            this.activeAction.play();
        }
        
        console.log('✅ Sistema de animação configurado. Ação ativa:', this.activeAction ? this.activeAction.getClip().name : 'Nenhuma');
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
     * Executa sequência inicial
     */
    playInitialSequence() {
        // Mostrar o holograma primeiro
        this.showHologram();
        
        setTimeout(() => {
            this.speak3D(
                'Olá! Bem-vindo ao Nexo Dash! Sou a Dra. Ana Turing. Vamos começar?',
                6000,
                'talking_2' // Usa uma animação de fala diferente para a introdução
            );
            
            setTimeout(() => {
                const helloAnimation = this.getAvailableAnimation('hello', ['wave', 'greeting', 'talk']);
                if (helloAnimation) {
                    this.playAnimation(helloAnimation, 0.5);
                }
            }, 1500); // Acena um pouco depois de começar a falar
        }, 1000);
    }

    /**
     * Faz a Dra. Turing falar usando síntese de voz
     * @param {string} text - Texto a ser falado
     * @param {number} duration - Duração em ms (usado para animações)
     * @param {string} speechAnimation - Nome da animação de fala a usar (padrão: 'talking_1')
     */
    async speak3D(text, duration = 5000, speechAnimation = 'talking_1') {
        if (!this.model) return;

        this.speechSystem.isPlaying = true;
        
        // Usar sistema de fallback para encontrar animação de fala
        const availableAnimation = this.getAvailableAnimation(speechAnimation, [
            'talking_2', 'talking_1', 'talk', 'speak', 'idle', 'breathing'
        ]);
        
        if (availableAnimation) {
            this.playAnimation(availableAnimation, 0.3); // Transição suave para a animação de fala
        }
        
        if (this.lighting && this.lighting.intensifyWhenSpeaking) {
            this.lighting.intensifyWhenSpeaking();
        }
        
        if (window.speakText) {
            window.speakText(text, 'pt-BR', 1.0, 1.1);
        }
        
        // Volta para a animação 'idle' após a fala terminar
        setTimeout(() => {
            this.speechSystem.isPlaying = false;
            const idleAnimation = this.getAvailableAnimation('idle', ['breathing', 'rest']);
            if (idleAnimation) {
                this.playAnimation(idleAnimation, 1.0); // Transição longa e suave de volta para 'idle'
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
     * Executa uma transição suave para uma nova animação.
     * @param {string} actionName - O nome da animação para a qual transicionar (ex: 'hello', 'talking_1').
     * @param {number} duration - A duração da transição em segundos.
     */
    playAnimation(actionName, duration = 0.5) {
        if (!this.animations || !this.animations[actionName]) {
            console.warn(`⚠️ Animação '${actionName}' não encontrada`);
            return;
        }

        const nextAction = this.animations[actionName];

        if (!nextAction || this.activeAction === nextAction) {
            return;
        }

        // Ações que tocam uma vez precisam ser resetadas antes de tocar novamente
        if (nextAction.loop === THREE.LoopOnce) {
            nextAction.reset();
        }
        
        nextAction.play();
        
        // Fazer crossfade apenas se há uma ação ativa anterior
        if (this.activeAction) {
            this.activeAction.crossFadeTo(nextAction, duration, true);
        }
        
        this.activeAction = nextAction;
        
        console.log(`🔄 Transicionando para animação: ${actionName}`);
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
     * Manipulador de mudança de módulo, com reações animadas.
     * @param {Object} module - Dados do módulo
     */
    onModuleChange(module) {
        const reaction = () => {
            switch (module.index) {
                case 0: // Início do projeto
                    this.speak3D('Olá! Vamos começar nossa jornada de análise de dados.', 4000, 'talking_2');
                    // Após a fala começar, ela acena.
                    setTimeout(() => {
                        const helloAnimation = this.getAvailableAnimation('hello', ['wave', 'greeting']);
                        if (helloAnimation) {
                            this.playAnimation(helloAnimation, 0.5);
                        }
                    }, 1000);
                    break;
                case 1: // Segundo passo
                    this.speak3D('Ótimo! Agora, vamos importar as bibliotecas necessárias para nosso trabalho.', 5000, 'talking_1');
                    break;
                case 2: // Terceiro passo
                     this.speak3D('Excelente. Com os dados carregados, o próximo passo é a limpeza e pré-processamento.', 6000, 'talking_2');
                    // Ela assume uma postura de "caminhada no lugar", como se estivesse pensando ou explicando.
                    setTimeout(() => {
                        const walkingAnimation = this.getAvailableAnimation('walking', ['walk', 'think', 'idle']);
                        if (walkingAnimation) {
                            this.playAnimation(walkingAnimation, 0.5);
                        }
                    }, 500);
                    break;
                // Adicione mais casos para outros módulos conforme necessário
                default:
                    this.speak3D('Continuando nosso progresso.', 3000, 'talking_1');
                    break;
            }
        };

        setTimeout(reaction, 1000);
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
        
        // Verificar se o modelo existe e está visível
        if (this.model && this.model.visible) {
            // Garantir que as animações procedurais estão funcionando
            this.updateProceduralAnimations();
        }
    }

    /**
     * Atualiza animações procedurais
     */
    updateProceduralAnimations() {
        if (!this.model) return;
        
        const time = Date.now() * 0.001;
        
        // Movimento sutil de flutuação (mais visível para debug)
        const baseY = this.position.y;
        const floatAmount = 0.2; // Aumentado para ser mais visível
        this.model.position.y = baseY + Math.sin(time * 0.8) * floatAmount;
        
        // Rotação sutil no eixo Y
        const baseRotationY = this.rotation.y;
        const rotationAmount = 0.1;
        this.model.rotation.y = baseRotationY + Math.sin(time * 0.3) * rotationAmount;
        
        // Animar tablet se existir
        const tablet = this.model.getObjectByName('tablet');
        if (tablet) {
            tablet.rotation.y = -Math.PI / 4 + Math.sin(time * 0.4) * 0.15;
            tablet.rotation.x = -Math.PI / 8 + Math.sin(time * 0.6) * 0.05;
        }
        
        // Animar partículas se existirem
        const particles = this.model.getObjectByName('data-particles');
        if (particles) {
            particles.rotation.y += 0.015;
            particles.rotation.x += 0.008;
        }
    }

    /**
     * Limpa recursos do sistema (versão melhorada)
     */
    dispose() {
        // Parar animações procedurais
        this.stopProceduralAnimations();
        
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
        this.activeAction = null;
        this.lighting = null;
        this.speechSystem = null;
        this.idleAnimationId = null;
        
        console.log('🧹 Dr. Turing Manager limpo');
    }

    /**
     * Obtém uma animação com fallback inteligente
     * @param {string} preferredAnimation - Animação preferida
     * @param {string[]} fallbacks - Lista de fallbacks em ordem de preferência
     * @returns {string|null} Nome da animação encontrada ou null
     */
    getAvailableAnimation(preferredAnimation, fallbacks = []) {
        if (!this.animations) return null;
        
        // Tentar animação preferida primeiro
        if (this.animations[preferredAnimation]) {
            return preferredAnimation;
        }
        
        // Tentar fallbacks
        for (const fallback of fallbacks) {
            if (this.animations[fallback]) {
                console.log(`🔄 Usando fallback '${fallback}' para '${preferredAnimation}'`);
                return fallback;
            }
        }
        
        // Se nada funcionar, usar primeira animação disponível
        const firstAnimation = Object.keys(this.animations)[0];
        if (firstAnimation) {
            console.log(`⚠️ Usando primeira animação disponível '${firstAnimation}' para '${preferredAnimation}'`);
            return firstAnimation;
        }
        
        console.warn(`❌ Nenhuma animação encontrada para '${preferredAnimation}'`);
        return null;
    }
}
