/**
 * UISystem - Sistema de interface do usuário
 * Gerencia painéis holográficos e interações da UI
 */
import { UIStyles } from '../utils/UIStyles.js';

export class UISystem {
    constructor(app) {
        this.app = app;
        this.elements = {
            mainPanel: null,
            panelTitle: null,
            panelContent: null,
            panelActions: null
        };
        this.isVisible = false;
        this.uiStyles = new UIStyles();
        
        // Estado do painel para reabertura
        this.panelState = {
            title: '',
            content: '',
            actions: []
        };
        
        // Elementos 3D da interface
        this.ui3D = {
            container: null,
            buttons: [],
            raycaster: null,
            mouse: null,
            hoveredButton: null
        };
    }

    /**
     * Inicializa o sistema de UI
     * @returns {Promise<void>}
     */
    async initialize() {
        this.uiStyles.injectStyles();
        this.setupElements();
        this.setupEventListeners();
        this.setup3DInterface();
        this.create3DControlButtons();
        console.log('✅ Sistema de UI inicializado');
    }

    /**
     * Configura referências aos elementos DOM
     */
    setupElements() {
        // Elementos opcionais - podem não existir no DOM
        this.elements.mainPanel = document.getElementById('main-panel');
        this.elements.panelTitle = document.getElementById('panel-title');
        this.elements.panelContent = document.getElementById('panel-content');
        this.elements.panelActions = document.getElementById('panel-actions');

        // Se os elementos não existem, criar dinamicamente
        if (!this.elements.mainPanel) {
            this.createHolographicPanelStructure();
            console.log('🔧 Painéis holográficos criados dinamicamente');
        }
    }

    /**
     * Configura a interface 3D
     */
    setup3DInterface() {
        const threeSystem = this.app.getSystem('three');
        if (!threeSystem || !threeSystem.getScene()) {
            console.warn('⚠️ Sistema Three.js não disponível para interface 3D');
            return;
        }

        // Configurar raycaster para interações 3D
        this.ui3D.raycaster = new THREE.Raycaster();
        this.ui3D.mouse = new THREE.Vector2();

        // Criar container para elementos 3D da UI
        this.ui3D.container = new THREE.Group();
        this.ui3D.container.name = 'ui-3d-container';
        threeSystem.getScene().add(this.ui3D.container);

        console.log('🎯 Interface 3D configurada');
    }

    /**
     * Cria botões de controle 3D com estilo terminal moderno
     */
    create3DControlButtons() {
        const threeSystem = this.app.getSystem('three');
        if (!threeSystem || !this.ui3D.container) {
            console.warn('⚠️ Não é possível criar botões 3D - sistema não disponível');
            return;
        }

        // Botões posicionados no topo da tela com estilo terminal moderno
        const hologramButton = this.create3DButton({
            text: 'HOLO',
            icon: '👩‍🔬',
            position: { x: -6, y: 6, z: 2 },
            color: 0x00ff88,
            callback: () => this.toggleHologram3D(),
            id: 'hologram-3d-btn'
        });

        const voiceButton = this.create3DButton({
            text: 'VOICE',
            icon: '🔊',
            position: { x: -2, y: 6, z: 2 },
            color: 0x00ccff,
            callback: () => this.toggleVoice3D(),
            id: 'voice-3d-btn'
        });

        const settingsButton = this.create3DButton({
            text: 'CONFIG',
            icon: '⚙️',
            position: { x: 2, y: 6, z: 2 },
            color: 0xffaa00,
            callback: () => this.showSettings3D(),
            id: 'settings-3d-btn'
        });

        const helpButton = this.create3DButton({
            text: 'HELP',
            icon: '❓',
            position: { x: 6, y: 6, z: 2 },
            color: 0xff6b6b,
            callback: () => this.showHelp3D(),
            id: 'help-3d-btn'
        });

        this.ui3D.buttons.push(hologramButton, voiceButton, settingsButton, helpButton);

        // Adicionar event listeners para interação
        this.setup3DInteractions();

        console.log('🎮 Botões de controle 3D estilo terminal criados');
    }

    /**
     * Cria um botão 3D com estilo terminal moderno
     * @param {Object} config - Configuração do botão
     * @returns {THREE.Group}
     */
    create3DButton(config) {
        const { text, icon, position, color, callback, id } = config;
        
        // Grupo do botão
        const buttonGroup = new THREE.Group();
        buttonGroup.name = id;
        buttonGroup.userData = { callback, isUI3DButton: true, originalColor: color };

        // Base do botão estilo terminal (retangular com bordas chanfradas)
        const baseGeometry = new THREE.BoxGeometry(3, 1.2, 0.3);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.9
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        buttonGroup.add(base);

        // Painel superior luminoso
        const panelGeometry = new THREE.BoxGeometry(2.8, 1, 0.05);
        const panelMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.4,
            metalness: 0.3,
            roughness: 0.1,
            transparent: true,
            opacity: 0.8
        });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.z = 0.2;
        buttonGroup.add(panel);

        // Bordas estilo terminal (glow effect)
        const edgeGeometry = new THREE.EdgesGeometry(panelGeometry);
        const edgeMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            linewidth: 3
        });
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        edges.position.z = 0.21;
        buttonGroup.add(edges);

        // Texto principal do botão (estilo terminal)
        const textSprite = this.createTerminalText(text, color);
        textSprite.position.set(-0.5, 0, 0.4);
        buttonGroup.add(textSprite);

        // Ícone do botão
        const iconSprite = this.createTerminalIcon(icon, color);
        iconSprite.position.set(0.8, 0, 0.4);
        buttonGroup.add(iconSprite);

        // Indicador de status (LED)
        const ledGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const ledMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.6,
            metalness: 0.1,
            roughness: 0.1
        });
        const led = new THREE.Mesh(ledGeometry, ledMaterial);
        led.position.set(-1.2, 0.3, 0.25);
        buttonGroup.add(led);

        // Linhas de scan estilo terminal
        const scanLines = this.createScanLines(color);
        scanLines.position.z = 0.22;
        buttonGroup.add(scanLines);

        // Partículas de dados flutuantes
        const dataParticles = this.createDataParticles(color);
        buttonGroup.add(dataParticles);
        
        // Posicionar o botão
        buttonGroup.position.set(position.x, position.y, position.z);
        
        // Adicionar ao container 3D
        this.ui3D.container.add(buttonGroup);
        
        // Animação de terminal (pulsação e scan)
        this.animateTerminalButton(buttonGroup);
        
        return buttonGroup;
    }

    /**
     * Cria texto estilo terminal
     * @param {string} text - Texto a ser exibido
     * @param {number} color - Cor do texto
     * @returns {THREE.Sprite}
     */
    createTerminalText(text, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;

        // Fundo transparente
        context.fillStyle = 'rgba(0, 0, 0, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Texto estilo terminal com fonte monospace
        context.font = 'bold 24px "Courier New", monospace';
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.strokeStyle = '#000000';
        context.lineWidth = 2;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Efeito de brilho
        context.shadowColor = `#${color.toString(16).padStart(6, '0')}`;
        context.shadowBlur = 10;
        
        context.strokeText(text, canvas.width / 2, canvas.height / 2);
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        // Criar sprite
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(2, 0.5, 1);
        
        return sprite;
    }

    /**
     * Cria ícone estilo terminal
     * @param {string} icon - Ícone emoji
     * @param {number} color - Cor de fundo
     * @returns {THREE.Sprite}
     */
    createTerminalIcon(icon, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 64;
        canvas.height = 64;

        // Fundo com cor do terminal
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, `rgba(${(color >> 16) & 255}, ${(color >> 8) & 255}, ${color & 255}, 0.8)`);
        gradient.addColorStop(1, `rgba(${(color >> 16) & 255}, ${(color >> 8) & 255}, ${color & 255}, 0.3)`);
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Ícone
        context.font = 'bold 32px Arial';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(icon, 32, 32);

        // Criar sprite
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.8, 0.8, 1);
        
        return sprite;
    }

    /**
     * Cria linhas de scan estilo terminal
     * @param {number} color - Cor das linhas
     * @returns {THREE.Group}
     */
    createScanLines(color) {
        const group = new THREE.Group();
        
        for (let i = 0; i < 8; i++) {
            const lineGeometry = new THREE.BoxGeometry(2.8, 0.02, 0.01);
            const lineMaterial = new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.4
            });
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.position.y = -0.4 + (i * 0.12);
            group.add(line);
        }
        
        return group;
    }

    /**
     * Cria partículas de dados flutuantes
     * @param {number} color - Cor das partículas
     * @returns {THREE.Points}
     */
    createDataParticles(color) {
        const particleCount = 15;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 4;
            positions[i3 + 1] = (Math.random() - 0.5) * 2;
            positions[i3 + 2] = Math.random() * 0.5 + 0.5;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: color,
            size: 0.04,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(geometry, material);
        return particles;
    }

    /**
     * Animação estilo terminal para botões
     * @param {THREE.Group} buttonGroup - Grupo do botão
     */
    animateTerminalButton(buttonGroup) {
        const originalY = buttonGroup.position.y;
        
        const animate = () => {
            if (buttonGroup && buttonGroup.parent) {
                const time = Date.now() * 0.001;
                
                // Pulsação suave
                buttonGroup.position.y = originalY + Math.sin(time * 2) * 0.02;
                
                // Efeito de scan nas linhas
                buttonGroup.traverse((child) => {
                    if (child.isMesh && child.material && child.material.emissive) {
                        const intensity = 0.3 + Math.sin(time * 3 + child.position.y * 5) * 0.2;
                        child.material.emissiveIntensity = Math.max(0.1, intensity);
                    }
                });
                
                // Movimento das partículas
                const particles = buttonGroup.children.find(child => child.isPoints);
                if (particles) {
                    particles.rotation.z = time * 0.1;
                    const positions = particles.geometry.attributes.position.array;
                    for (let i = 0; i < positions.length; i += 3) {
                        positions[i + 2] = Math.sin(time + i) * 0.1 + 0.5;
                    }
                    particles.geometry.attributes.position.needsUpdate = true;
                }
                
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    /**
     * Cria efeito digital de clique
     * @param {THREE.Group} button - Botão clicado
     */
    createDigitalClickEffect(button) {
        const effectGroup = new THREE.Group();
        
        // Criar múltiplas ondas digitais
        for (let i = 0; i < 3; i++) {
            const waveGeometry = new THREE.RingGeometry(0.5, 0.6, 16);
            const waveMaterial = new THREE.MeshBasicMaterial({
                color: button.userData.originalColor,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            const wave = new THREE.Mesh(waveGeometry, waveMaterial);
            wave.rotation.x = Math.PI / 2;
            wave.position.z = 0.1;
            effectGroup.add(wave);
            
            // Animação de expansão
            const delay = i * 100;
            setTimeout(() => {
                const animateWave = () => {
                    if (wave.scale.x < 3) {
                        wave.scale.x += 0.1;
                        wave.scale.y += 0.1;
                        wave.material.opacity *= 0.95;
                        requestAnimationFrame(animateWave);
                    } else {
                        effectGroup.remove(wave);
                    }
                };
                animateWave();
            }, delay);
        }
        
        // Dados digitais voando
        for (let i = 0; i < 8; i++) {
            const dataSprite = this.createDataBit(button.userData.originalColor);
            const angle = (i / 8) * Math.PI * 2;
            dataSprite.position.set(
                Math.cos(angle) * 0.5,
                Math.sin(angle) * 0.5,
                0.2
            );
            effectGroup.add(dataSprite);
            
            // Animar dados voando para fora
            const animateData = () => {
                dataSprite.position.x += Math.cos(angle) * 0.05;
                dataSprite.position.y += Math.sin(angle) * 0.05;
                dataSprite.material.opacity *= 0.98;
                
                if (dataSprite.material.opacity > 0.1) {
                    requestAnimationFrame(animateData);
                } else {
                    effectGroup.remove(dataSprite);
                }
            };
            setTimeout(() => animateData(), i * 50);
        }
        
        button.add(effectGroup);
        
        // Remover grupo após animação
        setTimeout(() => {
            button.remove(effectGroup);
        }, 2000);
    }

    /**
     * Cria um bit de dados para efeito
     * @param {number} color - Cor do bit
     * @returns {THREE.Sprite}
     */
    createDataBit(color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 32;
        canvas.height = 32;
        
        context.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
        context.font = 'bold 16px "Courier New"';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(Math.random() > 0.5 ? '1' : '0', 16, 16);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(0.2, 0.2, 1);
        
        return sprite;
    }

    /**
     * Adiciona animação de flutuação ao botão
     * @param {THREE.Group} buttonGroup - Grupo do botão
     */
    animateFloating(buttonGroup) {
        const originalY = buttonGroup.position.y;
        const amplitude = 0.1;
        const frequency = 0.002;
        const offset = Math.random() * Math.PI * 2;
        
        const animate = () => {
            const time = Date.now();
            buttonGroup.position.y = originalY + Math.sin(time * frequency + offset) * amplitude;
            buttonGroup.rotation.z = Math.sin(time * frequency * 0.5 + offset) * 0.05;
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    /**
     * Configura interações 3D
     */
    setup3DInteractions() {
        const threeSystem = this.app.getSystem('three');
        if (!threeSystem) return;

        const renderer = threeSystem.getRenderer();
        if (!renderer) return;

        // Mouse move para hover
        renderer.domElement.addEventListener('mousemove', (event) => {
            this.onMouse3DMove(event, threeSystem);
        });

        // Click para interação
        renderer.domElement.addEventListener('click', (event) => {
            this.onMouse3DClick(event, threeSystem);
        });

        console.log('🖱️ Interações 3D configuradas');
    }

    /**
     * Manipula movimento do mouse para efeitos 3D
     * @param {MouseEvent} event - Evento do mouse
     * @param {ThreeJSSystem} threeSystem - Sistema Three.js
     */
    onMouse3DMove(event, threeSystem) {
        const rect = threeSystem.getRenderer().domElement.getBoundingClientRect();
        
        this.ui3D.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.ui3D.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.ui3D.raycaster.setFromCamera(this.ui3D.mouse, threeSystem.getCamera());
        
        const intersects = this.ui3D.raycaster.intersectObjects(this.ui3D.buttons, true);
        
        // Reset previous hover
        if (this.ui3D.hoveredButton) {
            this.resetButtonHover(this.ui3D.hoveredButton);
            this.ui3D.hoveredButton = null;
        }
        
        // Apply hover to new button
        if (intersects.length > 0) {
            const button = this.findButtonParent(intersects[0].object);
            if (button) {
                this.applyButtonHover(button);
                this.ui3D.hoveredButton = button;
                document.body.style.cursor = 'pointer';
            }
        } else {
            document.body.style.cursor = 'default';
        }
    }

    /**
     * Manipula cliques 3D
     * @param {MouseEvent} event - Evento do mouse
     * @param {ThreeJSSystem} threeSystem - Sistema Three.js
     */
    onMouse3DClick(event, threeSystem) {
        this.ui3D.raycaster.setFromCamera(this.ui3D.mouse, threeSystem.getCamera());
        
        const intersects = this.ui3D.raycaster.intersectObjects(this.ui3D.buttons, true);
        
        if (intersects.length > 0) {
            const button = this.findButtonParent(intersects[0].object);
            if (button && button.userData.callback) {
                // Efeito visual de clique
                this.triggerClickEffect(button);
                
                // Executar callback
                button.userData.callback();
                
                console.log(`🎯 Botão 3D clicado: ${button.name}`);
            }
        }
    }

    /**
     * Encontra o botão pai de um objeto intersectado
     * @param {THREE.Object3D} object - Objeto intersectado
     * @returns {THREE.Group|null}
     */
    findButtonParent(object) {
        let current = object;
        while (current) {
            if (current.userData && current.userData.isUI3DButton) {
                return current;
            }
            current = current.parent;
        }
        return null;
    }

    /**
     * Aplica efeito de hover ao botão terminal
     * @param {THREE.Group} button - Botão
     */
    applyButtonHover(button) {
        button.scale.set(1.05, 1.05, 1.05);
        
        button.traverse((child) => {
            if (child.isMesh && child.material && child.material.emissive) {
                child.material.emissiveIntensity = Math.min(1.0, child.material.emissiveIntensity * 1.5);
            }
            if (child.isLineSegments && child.material) {
                child.material.opacity = 1.0;
            }
        });
    }

    /**
     * Remove efeito de hover do botão terminal
     * @param {THREE.Group} button - Botão
     */
    resetButtonHover(button) {
        button.scale.set(1, 1, 1);
        
        button.traverse((child) => {
            if (child.isMesh && child.material && child.material.emissive) {
                child.material.emissiveIntensity = 0.4;
            }
            if (child.isLineSegments && child.material) {
                child.material.opacity = 0.8;
            }
        });
    }

    /**
     * Cria efeito de clique no botão terminal
     * @param {THREE.Group} button - Botão
     */
    triggerClickEffect(button) {
        // Animação de "digital pulse"
        const originalScale = { x: 1.05, y: 1.05, z: 1.05 };
        
        button.scale.set(1.15, 1.15, 1.15);
        
        // Flash intenso
        button.traverse((child) => {
            if (child.isMesh && child.material && child.material.emissive) {
                child.material.emissiveIntensity = 1.0;
            }
        });
        
        // Retornar ao estado normal
        setTimeout(() => {
            button.scale.set(originalScale.x, originalScale.y, originalScale.z);
            button.traverse((child) => {
                if (child.isMesh && child.material && child.material.emissive) {
                    child.material.emissiveIntensity = 0.6;
                }
            });
        }, 100);
        
        // Efeito de dados digitais
        this.createDigitalClickEffect(button);
    }

    /**
     * Cria partículas de clique
     * @param {THREE.Group} button - Botão clicado
     */
    createClickParticles(button) {
        const particleCount = 10;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = button.position.x + (Math.random() - 0.5) * 0.5;
            positions[i3 + 1] = button.position.y + (Math.random() - 0.5) * 0.5;
            positions[i3 + 2] = button.position.z + (Math.random() - 0.5) * 0.5;
            
            velocities.push({
                x: (Math.random() - 0.5) * 0.02,
                y: Math.random() * 0.03 + 0.01,
                z: (Math.random() - 0.5) * 0.02
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: button.userData.originalColor,
            size: 0.1,
            transparent: true,
            opacity: 1
        });
        
        const particles = new THREE.Points(geometry, material);
        this.ui3D.container.add(particles);
        
        // Animar partículas
        let opacity = 1;
        const animateParticles = () => {
            const positions = particles.geometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] += velocities[i].x;
                positions[i3 + 1] += velocities[i].y;
                positions[i3 + 2] += velocities[i].z;
                
                velocities[i].y -= 0.001; // Gravidade
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            
            opacity -= 0.02;
            particles.material.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticles);
            } else {
                this.ui3D.container.remove(particles);
                particles.geometry.dispose();
                particles.material.dispose();
            }
        };
        
        animateParticles();
    }

    /**
     * Toggle do holograma 3D
     */
    toggleHologram3D() {
        const threeSystem = this.app.getSystem('three');
        if (threeSystem && threeSystem.drTuringManager) {
            const isVisible = threeSystem.drTuringManager.toggleHologram();
            
            const message = isVisible ? 'Dra. Turing apareceu!' : 'Dra. Turing desapareceu!';
            const type = isVisible ? 'success' : 'info';
            this.showNotification(message, type, 2000);
        }
    }

    /**
     * Toggle da voz 3D
     */
    toggleVoice3D() {
        const currentState = window.voiceEnabled;
        const newState = !currentState;
        
        if (window.voiceSystem && window.voiceSystem.setEnabled) {
            window.voiceSystem.setEnabled(newState);
        } else {
            window.voiceEnabled = newState;
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        }

        const message = newState ? 'Voz ligada' : 'Voz desligada';
        const type = newState ? 'success' : 'info';
        this.showNotification(message, type, 2000);
    }

    /**
     * Mostra configurações 3D
     */
    showSettings3D() {
        this.showPanel(
            'Configurações do Laboratório',
            `
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <h3 style="color: #00ff88; margin: 0;">⚙️ Controles</h3>
                <p><strong>WASD:</strong> Navegar pela cena</p>
                <p><strong>Mouse:</strong> Olhar ao redor</p>
                <p><strong>Scroll:</strong> Zoom in/out</p>
                
                <h3 style="color: #00ccff; margin: 0;">🎮 Interações 3D</h3>
                <p><strong>Clique nos botões 3D:</strong> Ações rápidas</p>
                <p><strong>Hover nos objetos:</strong> Informações adicionais</p>
                
                <h3 style="color: #ffaa00; margin: 0;">🎨 Qualidade Visual</h3>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button onclick="window.setGraphicsQuality('low')" class="holographic-button" style="flex: 1;">Baixa</button>
                    <button onclick="window.setGraphicsQuality('medium')" class="holographic-button" style="flex: 1;">Média</button>
                    <button onclick="window.setGraphicsQuality('high')" class="holographic-button" style="flex: 1;">Alta</button>
                </div>
            </div>
            `,
            []
        );
    }

    /**
     * Mostra ajuda e guia de uso
     */
    showHelp3D() {
        this.showPanel(
            'Guia de Uso - Nexo Dash',
            `
            <div style="display: flex; flex-direction: column; gap: 20px;">
                <h3 style="color: #ff6b6b; margin: 0;">❓ Bem-vindo ao Laboratório!</h3>
                <p>Esta é uma experiência imersiva para aprender desenvolvimento com Dash Python.</p>
                
                <h3 style="color: #00ff88; margin: 0;">🎯 Objetivos</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>Configurar ambiente de desenvolvimento Python</li>
                    <li>Aprender a estrutura de projetos profissionais</li>
                    <li>Criar dashboards interativos com Dash</li>
                    <li>Trabalhar com dados reais (Heart Disease)</li>
                </ul>
                
                <h3 style="color: #00ccff; margin: 0;">🕹️ Controles</h3>
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px;">
                    <span style="color: #00ff88;">HOLO:</span> <span>Liga/desliga a Dra. Ana Turing</span>
                    <span style="color: #00ccff;">VOICE:</span> <span>Controla narração por voz</span>
                    <span style="color: #ffaa00;">CONFIG:</span> <span>Configurações do laboratório</span>
                    <span style="color: #ff6b6b;">HELP:</span> <span>Este guia de ajuda</span>
                </div>
                
                <h3 style="color: #9c88ff; margin: 0;">🚀 Próximos Passos</h3>
                <p>Comece pelo <strong>Módulo 0: Calibração da Estação</strong> para configurar seu ambiente!</p>
            </div>
            `,
            []
        );
    }

    /**
     * Cria a estrutura completa dos painéis holográficos
     */
    createHolographicPanelStructure() {
        // Criar painel principal
        const mainPanel = document.createElement('div');
        mainPanel.id = 'main-panel';
        mainPanel.className = 'holographic-panel';
        mainPanel.style.cssText = this.uiStyles.getMainPanelStyles();

        // Adicionar elementos decorativos futuristas
        this.addPanelDecorations(mainPanel);

        // Criar título do painel
        const panelTitle = document.createElement('div');
        panelTitle.id = 'panel-title';
        panelTitle.className = 'panel-title';
        panelTitle.style.cssText = this.uiStyles.getPanelTitleStyles();

        // Adicionar decorações ao título
        this.addTitleDecorations(panelTitle);

        // Criar conteúdo do painel
        const panelContent = document.createElement('div');
        panelContent.id = 'panel-content';
        panelContent.className = 'panel-content';
        panelContent.style.cssText = this.uiStyles.getPanelContentStyles();

        // Criar área de ações/botões
        const panelActions = document.createElement('div');
        panelActions.id = 'panel-actions';
        panelActions.className = 'panel-actions';
        panelActions.style.cssText = this.uiStyles.getPanelActionsStyles();

        // Montar estrutura
        mainPanel.appendChild(panelTitle);
        mainPanel.appendChild(panelContent);
        mainPanel.appendChild(panelActions);
        document.body.appendChild(mainPanel);

        // Atualizar referências
        this.elements.mainPanel = mainPanel;
        this.elements.panelTitle = panelTitle;
        this.elements.panelContent = panelContent;
        this.elements.panelActions = panelActions;
    }

    /**
     * Adiciona decorações futuristas ao painel
     * @param {HTMLElement} panel - Elemento do painel
     */
    addPanelDecorations(panel) {
        // Bordas neon principais
        const borderTop = document.createElement('div');
        borderTop.style.cssText = `
            position: absolute;
            top: 0;
            left: 20px;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ffff, #00ffff, transparent);
            box-shadow: 0 0 10px #00ffff;
            z-index: 10;
        `;
        panel.appendChild(borderTop);

        const borderLeft = document.createElement('div');
        borderLeft.style.cssText = `
            position: absolute;
            top: 20px;
            left: 0;
            bottom: 20px;
            width: 2px;
            background: linear-gradient(180deg, transparent, #00ffff, #00ffff, transparent);
            box-shadow: 0 0 10px #00ffff;
            z-index: 10;
        `;
        panel.appendChild(borderLeft);

        const borderRight = document.createElement('div');
        borderRight.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(180deg, #00ffff, #00ffff, transparent);
            box-shadow: 0 0 10px #00ffff;
            z-index: 10;
        `;
        panel.appendChild(borderRight);

        const borderBottom = document.createElement('div');
        borderBottom.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 20px;
            height: 2px;
            background: linear-gradient(90deg, #00ffff, #00ffff, transparent);
            box-shadow: 0 0 10px #00ffff;
            z-index: 10;
        `;
        panel.appendChild(borderBottom);

        // Cantos decorativos
        const cornerTL = document.createElement('div');
        cornerTL.style.cssText = `
            position: absolute;
            top: -1px;
            left: -1px;
            width: 20px;
            height: 20px;
            border: 2px solid #00ffff;
            border-right: none;
            border-bottom: none;
            z-index: 15;
        `;
        panel.appendChild(cornerTL);

        const cornerBR = document.createElement('div');
        cornerBR.style.cssText = `
            position: absolute;
            bottom: -1px;
            right: -1px;
            width: 20px;
            height: 20px;
            border: 2px solid #00ffff;
            border-left: none;
            border-top: none;
            z-index: 15;
        `;
        panel.appendChild(cornerBR);

        // Indicador de status (pequeno quadrado no canto superior direito)
        const statusIndicator = document.createElement('div');
        statusIndicator.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            width: 8px;
            height: 8px;
            background: #00ffff;
            box-shadow: 0 0 10px #00ffff;
            z-index: 20;
            animation: pulse 2s infinite;
        `;
        panel.appendChild(statusIndicator);

        // Adicionar animação de pulse
        if (!document.getElementById('pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Adiciona decorações ao título
     * @param {HTMLElement} title - Elemento do título
     */
    addTitleDecorations(title) {
        // Linha decorativa antes do título
        const beforeLine = document.createElement('div');
        beforeLine.style.cssText = `
            position: absolute;
            top: 50%;
            left: 20px;
            width: 40px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ffff);
            transform: translateY(-50%);
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        `;
        title.appendChild(beforeLine);

        // Linha decorativa depois do título
        const afterLine = document.createElement('div');
        afterLine.style.cssText = `
            position: absolute;
            top: 50%;
            right: 20px;
            width: 40px;
            height: 2px;
            background: linear-gradient(90deg, #00ffff, transparent);
            transform: translateY(-50%);
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        `;
        title.appendChild(afterLine);
    }

    /**
     * Cria container para botões de controle
     */
    createControlButtonsContainer() {
        // Método mantido para compatibilidade, mas agora usa interface 3D
        console.log('🎯 Usando interface 3D em vez de botões 2D');
    }

    /**
     * Configura event listeners globais
     */
    setupEventListeners() {
        // Event listener para fechar painel com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hidePanel();
            }
        });

        // Event listener para cliques fora do painel
        if (this.elements.mainPanel) {
            this.elements.mainPanel.addEventListener('click', (e) => {
                if (e.target === this.elements.mainPanel) {
                    this.hidePanel();
                }
            });
        }
    }

    /**
     * Exibe um painel com título, conteúdo e ações
     * @param {string} title - Título do painel
     * @param {string} content - Conteúdo HTML do painel
     * @param {Array} actions - Array de objetos {label, callback}
     */
    showPanel(title, content, actions = []) {
        if (!this.elements.mainPanel) {
            console.warn('⚠️ Não é possível exibir painel - elemento não encontrado');
            return;
        }

        // Remover botão de reabertura se existir
        this.removeReopenButton();

        // Salvar estado do painel para reabertura
        this.panelState = {
            title: title,
            content: content,
            actions: actions
        };

        // Atualizar título
        if (this.elements.panelTitle) {
            this.elements.panelTitle.textContent = title;
        }

        // Atualizar conteúdo
        if (this.elements.panelContent) {
            this.elements.panelContent.innerHTML = content;
        }

        // Limpar ações anteriores
        if (this.elements.panelActions) {
            this.elements.panelActions.innerHTML = '';

            // Adicionar botão de fechar
            const closeButton = this.createButton('✕ Fechar', () => this.hidePanel());
            closeButton.style.marginLeft = 'auto';
            closeButton.style.backgroundColor = 'rgba(255, 71, 87, 0.2)';
            closeButton.style.borderColor = '#ff4757';
            closeButton.style.color = '#ff4757';

            // Adicionar novas ações
            actions.forEach(action => {
                const button = this.createButton(action.label, action.callback);
                this.elements.panelActions.appendChild(button);
            });

            // Adicionar botão de fechar por último
            this.elements.panelActions.appendChild(closeButton);
        }

        // Exibir painel
        this.elements.mainPanel.style.display = 'flex';
        this.elements.mainPanel.style.flexDirection = 'column';
        this.isVisible = true;

        // Scroll to top
        if (this.elements.panelContent) {
            this.elements.panelContent.scrollTop = 0;
        }

        // Animar entrada
        this.animateShowPanel();

        console.log(`📱 Painel exibido: ${title}`);
    }

    /**
     * Oculta todos os painéis
     */
    hideAllPanels() {
        this.hidePanel();
    }

    /**
     * Oculta o painel principal
     */
    hidePanel() {
        if (!this.elements.mainPanel || !this.isVisible) {
            return;
        }

        this.animateHidePanel(() => {
            this.elements.mainPanel.style.display = 'none';
            this.isVisible = false;
            console.log('📱 Painel ocultado');
            
            // Adicionar botão de reabertura apenas se não existir
            this.createReopenButton();
        });
    }

    /**
     * Remove o botão de reabertura 3D se existir
     */
    removeReopenButton() {
        if (!this.ui3D.container) {
            return;
        }

        const reopenButton = this.ui3D.container.getObjectByName('reopen-3d-button');
        if (reopenButton) {
            // Remover do array de botões
            const buttonIndex = this.ui3D.buttons.indexOf(reopenButton);
            if (buttonIndex > -1) {
                this.ui3D.buttons.splice(buttonIndex, 1);
            }

            // Limpar geometrias e materiais
            reopenButton.traverse((child) => {
                if (child.geometry) {
                    child.geometry.dispose();
                }
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });

            // Remover da cena
            this.ui3D.container.remove(reopenButton);
            console.log('🗑️ Botão 3D de reabertura removido');
        }
    }

    /**
     * Cria o botão de reabertura 3D apenas se não existir
     */
    createReopenButton() {
        // Verificar se já existe
        if (this.ui3D.container && this.ui3D.container.getObjectByName('reopen-3d-button')) {
            return;
        }

        const threeSystem = this.app.getSystem('three');
        if (!threeSystem || !this.ui3D.container) {
            console.warn('⚠️ Sistema Three.js não disponível para botão 3D de reabertura');
            return;
        }

        // Criar botão 3D "PANEL" no topo da tela junto com os outros
        const reopenButton3D = this.create3DButton({
            text: 'PANEL',
            icon: '📋',
            position: { x: 10, y: 6, z: 2 }, // Posição no topo, à direita dos outros
            color: 0x88ff00, // Verde lima para destacar
            callback: () => {
                this.showPanel(
                    this.panelState.title, 
                    this.panelState.content, 
                    this.panelState.actions
                );
            },
            id: 'reopen-3d-button'
        });

        this.ui3D.buttons.push(reopenButton3D);
        console.log('🔄 Botão 3D de reabertura criado');
    }

    /**
     * Cria um botão holográfico
     * @param {string} label - Texto do botão
     * @param {Function} callback - Função a ser chamada no clique
     * @returns {HTMLButtonElement}
     */
    createButton(label, callback) {
        const button = document.createElement('button');
        button.className = 'holographic-button';
        button.textContent = label;
        button.onclick = () => {
            try {
                callback();
            } catch (error) {
                console.error('❌ Erro ao executar callback do botão:', error);
            }
        };

        // Efeitos de hover aprimorados
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.02)';
            button.style.boxShadow = '0 5px 25px rgba(0, 255, 136, 0.6)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.5)';
        });

        return button;
    }

    /**
     * Anima a exibição do painel
     */
    animateShowPanel() {
        if (!this.elements.mainPanel) return;

        this.elements.mainPanel.style.transform = 'translateX(100px) translateY(-50%)';
        this.elements.mainPanel.style.opacity = '0';

        // Force reflow
        this.elements.mainPanel.offsetHeight;

        this.elements.mainPanel.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.elements.mainPanel.style.transform = 'translateX(0) translateY(-50%)';
        this.elements.mainPanel.style.opacity = '1';
    }

    /**
     * Anima a ocultação do painel
     * @param {Function} callback - Função chamada após animação
     */
    animateHidePanel(callback) {
        if (!this.elements.mainPanel) {
            callback();
            return;
        }

        this.elements.mainPanel.style.transition = 'all 0.3s ease-in';
        this.elements.mainPanel.style.transform = 'translateX(100px) translateY(-50%)';
        this.elements.mainPanel.style.opacity = '0';

        setTimeout(callback, 300);
    }

    /**
     * Exibe uma notificação temporária
     * @param {string} message - Mensagem da notificação
     * @param {string} type - Tipo: 'info', 'success', 'warning', 'error'
     * @param {number} duration - Duração em ms
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: ${type === 'warning' ? '#000' : '#fff'};
            padding: 15px 20px;
            border-radius: 8px;
            border: 2px solid ${this.getNotificationBorderColor(type)};
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            font-weight: bold;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remover após duração especificada
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    /**
     * Obtém a cor de fundo da notificação baseada no tipo
     * @param {string} type - Tipo da notificação
     * @returns {string}
     */
    getNotificationColor(type) {
        const colors = {
            info: 'rgba(0, 200, 255, 0.9)',
            success: 'rgba(0, 255, 136, 0.9)',
            warning: 'rgba(255, 193, 7, 0.9)',
            error: 'rgba(255, 71, 87, 0.9)'
        };
        return colors[type] || colors.info;
    }

    /**
     * Obtém a cor da borda da notificação baseada no tipo
     * @param {string} type - Tipo da notificação
     * @returns {string}
     */
    getNotificationBorderColor(type) {
        const colors = {
            info: '#00ccff',
            success: '#00ff88',
            warning: '#ffc107',
            error: '#ff4757'
        };
        return colors[type] || colors.info;
    }

    /**
     * Verifica se o painel está visível
     * @returns {boolean}
     */
    isPanelVisible() {
        return this.isVisible;
    }

    /**
     * Limpa recursos do sistema
     */
    dispose() {
        this.hidePanel();
        
        // Remover botão de reabertura
        this.removeReopenButton();
        
        // Limpar interface 3D
        this.dispose3DInterface();
        
        // Remover estilos
        this.uiStyles.removeStyles();
        
        // Limpar referências
        this.elements = {
            mainPanel: null,
            panelTitle: null,
            panelContent: null,
            panelActions: null
        };
        this.isVisible = false;
        
        console.log('🧹 Sistema UI limpo');
    }

    /**
     * Limpa a interface 3D
     */
    dispose3DInterface() {
        const threeSystem = this.app.getSystem('three');
        if (threeSystem && this.ui3D.container) {
            threeSystem.getScene().remove(this.ui3D.container);
            
            // Limpar geometrias e materiais
            this.ui3D.container.traverse((child) => {
                if (child.geometry) {
                    child.geometry.dispose();
                }
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }
        
        // Limpar referências
        this.ui3D = {
            container: null,
            buttons: [],
            raycaster: null,
            mouse: null,
            hoveredButton: null
        };
        
        console.log('🧹 Interface 3D limpa');
    }

}
