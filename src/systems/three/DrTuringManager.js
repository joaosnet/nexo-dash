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
        this.lighting = null;
        this.speechSystem = null;
        
        // Configurações
        this.position = { x: -8, y: 0, z: 5 };
        this.rotation = { x: 0, y: Math.PI / 4, z: 0 };
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
                this.lighting.visible = true;
            }
            
            // Notificar UISystem sobre mudança
            const uiSystem = this.threeSystem.app.getSystem('ui');
            if (uiSystem) {
                uiSystem.updateHologramButtonState(true);
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
            
            // Notificar UISystem sobre mudança
            const uiSystem = this.threeSystem.app.getSystem('ui');
            if (uiSystem) {
                uiSystem.updateHologramButtonState(false);
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

        // Verificar suporte a FBX
        const hasFBXSupport = this.checkFBXSupport();
        
        try {
            if (hasFBXSupport) {
                console.log('🎯 Tentando carregar modelo FBX realista...');
                await this.loadFBXModel();
            } else {
                console.log('⚠️ FBXLoader não disponível, usando modelo GLB...');
                await this.loadGLBModel();
            }
        } catch (error) {
            console.error('❌ Erro ao carregar modelo:', error);
            this.createPlaceholder();
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Verifica se há suporte para carregamento FBX
     * @returns {boolean}
     */
    checkFBXSupport() {
        return (
            typeof THREE !== 'undefined' && 
            typeof THREE.FBXLoader !== 'undefined' && 
            typeof fflate !== 'undefined'
        );
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
                './assets/dra_ana_turing_realista/character.fbx',
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
        
        // Posicionamento
        this.model.position.set(this.position.x, this.position.y, this.position.z);
        this.model.scale.set(0.05, 0.05, 0.05); // Modelos FBX são maiores
        this.model.rotation.y = this.rotation.y;
        
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
     * Configura animações FBX
     * @param {THREE.Group} fbx - Modelo FBX
     */
    setupFBXAnimations(fbx) {
        if (fbx.animations && fbx.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(fbx);
            
            const animationActions = {};
            
            fbx.animations.forEach((clip, index) => {
                const action = this.mixer.clipAction(clip);
                const clipName = clip.name.toLowerCase();
                
                if (clipName.includes('idle') || clipName.includes('breathing') || index === 0) {
                    animationActions.idle = action;
                    action.loop = THREE.LoopRepeat;
                    action.play();
                } else if (clipName.includes('talk') || clipName.includes('speak')) {
                    animationActions.speak = action;
                    action.loop = THREE.LoopRepeat;
                } else if (clipName.includes('wave') || clipName.includes('hello')) {
                    animationActions.wave = action;
                    action.loop = THREE.LoopOnce;
                }
            });
            
            this.animations = {
                ...animationActions,
                isPlaying: 'idle'
            };
            
            console.log('🎭 Animações FBX configuradas');
        }
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
        setTimeout(() => {
            this.speak3D(
                'Olá! Bem-vindo ao Nexo Dash! Sou a Dra. Ana Turing, sua mentora nesta jornada fascinante. Juntos, construiremos um dashboard completo para análise de doenças cardíacas usando Python e Dash. Está pronto para esta missão?',
                8000
            );
            
            setTimeout(() => {
                this.playAnimation('wave');
            }, 1000);
        }, 2000);
    }

    /**
     * Faz a Dra. Turing falar usando síntese de voz
     * @param {string} text - Texto a ser falado
     * @param {number} duration - Duração em ms (usado para animações)
     */
    async speak3D(text, duration = 5000) {
        if (!this.model) return;

        this.speechSystem.isPlaying = true;

        // Ativar animação de fala
        this.playAnimation('speak');
        
        // Intensificar iluminação
        if (this.lighting && this.lighting.intensifyWhenSpeaking) {
            this.lighting.intensifyWhenSpeaking();
        }
        
        // Usar síntese de voz em vez de balões de fala
        if (window.speakText) {
            window.speakText(text, 'pt-BR', 1.0, 1.1);
        }
        
        // Forçar voz feminina mesmo que seleção automática falhe
        const currentVoice = window.speechSynthesis.getVoices().find(v => 
            v.name === utterance.voice?.name
        );
        
        if (!currentVoice || 
            (!currentVoice.name.includes('Francisca') && 
             !currentVoice.name.includes('Maria') && 
             currentVoice.gender !== 'female')) {
            utterance.voice = this.app.voiceSystem.selectBestVoice(window.speechSynthesis.getVoices(), 'pt-BR');
        }
        
        // Voltar ao normal após duração
        setTimeout(() => {
            this.speechSystem.isPlaying = false;
            this.playAnimation('idle');
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
     * Executa uma animação
     * @param {string} animationType - Tipo de animação
     */
    playAnimation(animationType = 'idle') {
        if (!this.animations) return;

        if (this.mixer && this.animations[animationType]) {
            // Parar animações atuais
            Object.values(this.animations).forEach(action => {
                if (action && typeof action.stop === 'function') {
                    action.stop();
                }
            });

            // Executar nova animação
            const targetAction = this.animations[animationType];
            if (targetAction) {
                targetAction.reset();
                targetAction.play();
                this.animations.isPlaying = animationType;
                console.log(`🎭 Reproduzindo animação: ${animationType}`);
            }
        } else {
            console.log(`🎭 Animação procedural: ${animationType}`);
            // Executar animações procedurais aqui se necessário
        }
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
     * Atualiza o sistema (chamado no loop de animação)
     * @param {number} deltaTime - Delta time em segundos
     */
    update(deltaTime) {
        // Atualizar mixer de animações FBX
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
        
        // Atualizar outras animações procedurais aqui
    }

    /**
     * Manipulador de mudança de módulo
     * @param {Object} module - Dados do módulo
     */
    onModuleChange(module) {
        // Reações da Dra. Turing baseadas no módulo
        const moduleReactions = {
            0: () => this.speak3D('Vamos começar! Primeiro, vamos calibrar sua estação de trabalho.', 4000),
            1: () => this.speak3D('Perfeito! Agora vamos carregar o blueprint 3D do nosso projeto.', 4000),
            2: () => this.speak3D('Excelente! Hora de criar o núcleo do nosso servidor Dash.', 4000)
        };

        const reaction = moduleReactions[module.index];
        if (reaction) {
            setTimeout(reaction, 1000);
        }
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
}
