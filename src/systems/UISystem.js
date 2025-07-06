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
     * Cria botões de controle 3D flutuantes
     */
    create3DControlButtons() {
        const threeSystem = this.app.getSystem('three');
        if (!threeSystem || !this.ui3D.container) {
            console.warn('⚠️ Não é possível criar botões 3D - sistema não disponível');
            return;
        }

        // Botão do holograma - posicionado no canto superior direito do campo de visão
        const hologramButton = this.create3DButton({
            text: '👩‍🔬',
            position: { x: 8, y: 4, z: 2 },
            color: 0x00ff88,
            callback: () => this.toggleHologram3D(),
            id: 'hologram-3d-btn'
        });

        // Botão de voz - posicionado abaixo do botão do holograma
        const voiceButton = this.create3DButton({
            text: '🔊',
            position: { x: 8, y: 2, z: 2 },
            color: 0x00ccff,
            callback: () => this.toggleVoice3D(),
            id: 'voice-3d-btn'
        });

        // Botão de configurações - posicionado ainda mais abaixo
        const settingsButton = this.create3DButton({
            text: '⚙️',
            position: { x: 8, y: 0, z: 2 },
            color: 0xffaa00,
            callback: () => this.showSettings3D(),
            id: 'settings-3d-btn'
        });

        this.ui3D.buttons.push(hologramButton, voiceButton, settingsButton);

        // Adicionar event listeners para interação
        this.setup3DInteractions();

        console.log('🎮 Botões de controle 3D criados');
    }

    /**
     * Cria um botão 3D
     * @param {Object} config - Configuração do botão
     * @returns {THREE.Group}
     */
    create3DButton(config) {
        const { text, position, color, callback, id } = config;
        
        // Grupo do botão
        const buttonGroup = new THREE.Group();
        buttonGroup.name = id;
        buttonGroup.userData = { callback, isUI3DButton: true, originalColor: color };

        // Geometria da base do botão (hexágono)
        const shape = new THREE.Shape();
        const radius = 0.8;
        for (let i = 0; i <= 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) {
                shape.moveTo(x, y);
            } else {
                shape.lineTo(x, y);
            }
        }

        const extrudeSettings = {
            depth: 0.2,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 0.05,
            bevelThickness: 0.05
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        // Material com efeito holográfico
        const material = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            emissive: new THREE.Color(color).multiplyScalar(0.3),
            shininess: 100
        });

        const buttonMesh = new THREE.Mesh(geometry, material);
        buttonMesh.castShadow = true;
        buttonMesh.receiveShadow = true;
        
        // Texto 3D do botão
        const textSprite = this.create3DText(text);
        textSprite.position.set(0, 0, 0.3);
        
        // Efeito de partículas ao redor do botão
        const particles = this.createButtonParticles(color);
        
        // Adicionar elementos ao grupo
        buttonGroup.add(buttonMesh);
        buttonGroup.add(textSprite);
        buttonGroup.add(particles);
        
        // Posicionar o botão
        buttonGroup.position.set(position.x, position.y, position.z);
        
        // Adicionar ao container 3D
        this.ui3D.container.add(buttonGroup);
        
        // Animação de flutuação sutil
        this.animateFloating(buttonGroup);
        
        return buttonGroup;
    }

    /**
     * Cria texto 3D para botões
     * @param {string} text - Texto a ser exibido
     * @returns {THREE.Sprite}
     */
    create3DText(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;

        // Desenhar texto
        context.fillStyle = 'rgba(255, 255, 255, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 72px Arial';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 64, 64);

        // Criar sprite
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(1.5, 1.5, 1);
        
        return sprite;
    }

    /**
     * Cria partículas ao redor do botão
     * @param {number} color - Cor das partículas
     * @returns {THREE.Points}
     */
    createButtonParticles(color) {
        const particleCount = 20;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const radius = 1.5 + Math.random() * 0.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 2;
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: color,
            size: 0.05,
            transparent: true,
            opacity: 0.6
        });
        
        const particles = new THREE.Points(geometry, material);
        return particles;
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
     * Aplica efeito de hover ao botão
     * @param {THREE.Group} button - Botão
     */
    applyButtonHover(button) {
        button.scale.set(1.1, 1.1, 1.1);
        
        button.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.emissive.setHex(button.userData.originalColor).multiplyScalar(0.5);
            }
        });
    }

    /**
     * Remove efeito de hover do botão
     * @param {THREE.Group} button - Botão
     */
    resetButtonHover(button) {
        button.scale.set(1, 1, 1);
        
        button.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.emissive.setHex(button.userData.originalColor).multiplyScalar(0.3);
            }
        });
    }

    /**
     * Cria efeito de clique no botão
     * @param {THREE.Group} button - Botão
     */
    triggerClickEffect(button) {
        // Animação de "pulse"
        const originalScale = { x: 1.1, y: 1.1, z: 1.1 };
        
        button.scale.set(1.3, 1.3, 1.3);
        
        // Retornar ao tamanho normal
        setTimeout(() => {
            button.scale.set(originalScale.x, originalScale.y, originalScale.z);
        }, 150);
        
        // Efeito de partículas
        this.createClickParticles(button);
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
     * Cria a estrutura completa dos painéis holográficos
     */
    createHolographicPanelStructure() {
        // Criar painel principal
        const mainPanel = document.createElement('div');
        mainPanel.id = 'main-panel';
        mainPanel.className = 'holographic-panel';
        mainPanel.style.cssText = this.uiStyles.getMainPanelStyles();

        // Criar título do painel
        const panelTitle = document.createElement('div');
        panelTitle.id = 'panel-title';
        panelTitle.className = 'panel-title';
        panelTitle.style.cssText = this.uiStyles.getPanelTitleStyles();

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
     * Remove o botão de reabertura se existir
     */
    removeReopenButton() {
        const reopenBtn = document.getElementById('reopen-hologram-button');
        if (reopenBtn && reopenBtn.parentNode) {
            reopenBtn.parentNode.removeChild(reopenBtn);
            console.log('🗑️ Botão de reabertura removido');
        }
    }

    /**
     * Cria o botão de reabertura apenas se não existir
     */
    createReopenButton() {
        // Verificar se já existe
        if (document.getElementById('reopen-hologram-button')) {
            return;
        }

        const reopenBtn = document.createElement('button');
        reopenBtn.id = 'reopen-hologram-button';
        reopenBtn.className = 'reopen-hologram-button holographic-button';
        reopenBtn.textContent = 'Abrir Painel';
        
        // Estilizar o botão
        reopenBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 200;
            padding: 12px 20px;
            background: rgba(0, 255, 136, 0.2);
            border: 2px solid #00ff88;
            color: #00ff88;
            border-radius: 8px;
            font-family: 'Orbitron', monospace;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        `;

        // Salvar o estado atual do painel para reabertura
        const currentTitle = this.elements.panelTitle?.textContent || 'Nexo Dash';
        const currentContent = this.elements.panelContent?.innerHTML || '';
        
        // Configurar evento de clique
        reopenBtn.onclick = () => {
            this.showPanel(currentTitle, currentContent, []);
        };

        // Adicionar efeitos hover inline
        reopenBtn.addEventListener('mouseenter', () => {
            reopenBtn.style.transform = 'translateY(-2px) scale(1.05)';
            reopenBtn.style.boxShadow = '0 5px 25px rgba(0, 255, 136, 0.6)';
        });

        reopenBtn.addEventListener('mouseleave', () => {
            reopenBtn.style.transform = 'translateY(0) scale(1)';
            reopenBtn.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.3)';
        });

        document.body.appendChild(reopenBtn);
        console.log('🔄 Botão de reabertura criado');
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
