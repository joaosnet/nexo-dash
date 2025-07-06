/**
 * UISystem - Sistema de interface do usuário
 * Gerencia painéis holográficos e interações da UI
 */
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
    }

    /**
     * Inicializa o sistema de UI
     * @returns {Promise<void>}
     */
    async initialize() {
        this.setupElements();
        this.setupEventListeners();
        this.createHologramControlButton();
        this.createVoiceControlButton();
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
     * Cria a estrutura completa dos painéis holográficos
     */
    createHolographicPanelStructure() {
        // Criar painel principal
        const mainPanel = document.createElement('div');
        mainPanel.id = 'main-panel';
        mainPanel.className = 'holographic-panel';
        mainPanel.style.cssText = `
            position: fixed;
            top: 50%;
            right: 2rem;
            transform: translateY(-50%);
            width: 450px;
            max-width: calc(100vw - 4rem);
            max-height: calc(100vh - 4rem);
            background: rgba(0, 255, 136, 0.1);
            border: 2px solid rgba(0, 255, 136, 0.3);
            border-radius: 15px;
            backdrop-filter: blur(15px);
            padding: 0;
            color: #00ff88;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 1.1rem;
            line-height: 1.6;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.2), inset 0 0 30px rgba(0, 255, 136, 0.05);
            z-index: 1000;
            opacity: 0;
            transform: translateY(-50%) translateX(100px);
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            display: none;
            overflow: hidden;
        `;

        // Criar título do painel
        const panelTitle = document.createElement('div');
        panelTitle.id = 'panel-title';
        panelTitle.className = 'panel-title';
        panelTitle.style.cssText = `
            color: #00ccff;
            margin: 0;
            padding: 20px 25px 15px 25px;
            font-size: 1.4rem;
            font-weight: bold;
            text-shadow: 0 0 15px #00ccff;
            text-align: center;
            border-bottom: 1px solid rgba(0, 255, 136, 0.2);
            background: rgba(0, 255, 136, 0.05);
        `;

        // Criar conteúdo do painel
        const panelContent = document.createElement('div');
        panelContent.id = 'panel-content';
        panelContent.className = 'panel-content';
        panelContent.style.cssText = `
            padding: 25px;
            overflow-y: auto;
            max-height: 400px;
            flex: 1;
            background: rgba(0, 0, 0, 0.2);
        `;

        // Estilo do scroll personalizado
        const scrollStyle = document.createElement('style');
        scrollStyle.textContent = `
            .panel-content::-webkit-scrollbar {
                width: 8px;
            }
            .panel-content::-webkit-scrollbar-track {
                background: rgba(0, 255, 136, 0.1);
                border-radius: 4px;
            }
            .panel-content::-webkit-scrollbar-thumb {
                background: rgba(0, 255, 136, 0.3);
                border-radius: 4px;
            }
            .panel-content::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 255, 136, 0.5);
            }
        `;
        document.head.appendChild(scrollStyle);

        // Criar área de ações/botões
        const panelActions = document.createElement('div');
        panelActions.id = 'panel-actions';
        panelActions.className = 'panel-actions';
        panelActions.style.cssText = `
            padding: 20px 25px;
            border-top: 1px solid rgba(0, 255, 136, 0.2);
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
            background: rgba(0, 255, 136, 0.05);
        `;

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

        // Criar estilos globais para botões holográficos
        const buttonStyles = document.createElement('style');
        buttonStyles.textContent = `
            .holographic-button {
                background: rgba(0, 255, 136, 0.2);
                border: 2px solid #00ff88;
                color: #00ff88;
                padding: 12px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: bold;
                font-family: inherit;
                margin: 0;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
                text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
                position: relative;
                overflow: hidden;
                min-width: 120px;
                text-align: center;
            }

            .holographic-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
            }

            .holographic-button:hover {
                background: rgba(0, 255, 136, 0.3);
                box-shadow: 0 0 25px rgba(0, 255, 136, 0.6), inset 0 0 20px rgba(0, 255, 136, 0.1);
                transform: translateY(-2px) scale(1.02);
                border-color: #00ccff;
                color: #00ccff;
                text-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
            }

            .holographic-button:hover::before {
                left: 100%;
            }

            .holographic-button:active {
                transform: translateY(0) scale(0.98);
                box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
            }

            .holographic-panel h1, .holographic-panel h2, .holographic-panel h3 {
                color: #00ccff;
                text-shadow: 0 0 10px #00ccff;
                margin-top: 0;
            }

            .holographic-panel p {
                margin-bottom: 15px;
                text-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
            }

            .holographic-panel ul {
                margin: 15px 0;
                padding-left: 20px;
            }

            .holographic-panel li {
                margin-bottom: 8px;
                text-shadow: 0 0 3px rgba(0, 255, 136, 0.2);
            }

            .holographic-panel li::marker {
                color: #00ccff;
            }

            .holographic-panel code {
                background: rgba(0, 255, 136, 0.1);
                color: #00ccff;
                padding: 2px 6px;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                border: 1px solid rgba(0, 255, 136, 0.2);
            }

            .holographic-panel strong {
                color: #00ccff;
                text-shadow: 0 0 8px rgba(0, 204, 255, 0.5);
            }

            .holographic-panel em {
                color: #88ffcc;
                font-style: italic;
            }

            /* Responsividade */
            @media (max-width: 768px) {
                #main-panel {
                    right: 1rem !important;
                    left: 1rem !important;
                    width: auto !important;
                    transform: translateY(-50%) !important;
                }
                .holographic-button {
                    padding: 10px 16px;
                    font-size: 0.9rem;
                    min-width: 100px;
                }
                .panel-title {
                    font-size: 1.2rem !important;
                    padding: 15px 20px 12px 20px !important;
                }
                .panel-content {
                    padding: 20px !important;
                    font-size: 1rem !important;
                }
                /* Botão do holograma em mobile */
                #hologram-control-btn {
                    bottom: 10px !important;
                    left: 10px !important;
                    padding: 10px 16px !important;
                    font-size: 0.9rem !important;
                    min-width: 140px !important;
                }
                /* Botão de controle de voz em mobile */
                #voice-control-btn {
                    bottom: 10px !important;
                    right: 10px !important;
                    padding: 10px 16px !important;
                    font-size: 0.9rem !important;
                    min-width: 140px !important;
                }
            }

            @media (max-width: 480px) {
                .panel-actions {
                    flex-direction: column;
                    align-items: stretch;
                }
                .holographic-button {
                    width: 100%;
                }
                /* Botão do holograma em mobile pequeno */
                #hologram-control-btn {
                    bottom: 70px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: calc(50% - 25px) !important;
                    max-width: 150px !important;
                }
                /* Botão de controle de voz em mobile pequeno */
                #voice-control-btn {
                    bottom: 10px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: calc(50% - 25px) !important;
                    max-width: 150px !important;
                }
            }
        `;
        document.head.appendChild(buttonStyles);
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
        });
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
     * Cria o botão de controle do holograma da Dra. Turing
     */
    createHologramControlButton() {
        // Verificar se o botão já existe
        if (document.getElementById('hologram-control-btn')) {
            return;
        }

        const hologramButton = document.createElement('button');
        hologramButton.id = 'hologram-control-btn';
        hologramButton.className = 'holographic-button hologram-control';
        hologramButton.innerHTML = '👩‍🔬 Mostrar Holograma';

        // Estilos específicos para o botão do holograma
        hologramButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 255, 136, 0.2);
            border: 2px solid #00ff88;
            color: #00ff88;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
            z-index: 1001;
            min-width: 160px;
            text-align: center;
            backdrop-filter: blur(10px);
        `;

        // Event listener para toggle do holograma
        hologramButton.addEventListener('click', () => {
            const threeSystem = this.app.getSystem('three');
            if (threeSystem && threeSystem.drTuringManager) {
                const isVisible = threeSystem.drTuringManager.toggleHologram();
                this.updateHologramButtonState(isVisible);

                // Exibir notificação
                if (isVisible) {
                    this.showNotification('Dra. Turing apareceu!', 'success', 2000);
                } else {
                    this.showNotification('Dra. Turing desapareceu!', 'info', 2000);
                }
            }
        });

        // Efeitos hover
        hologramButton.addEventListener('mouseenter', () => {
            hologramButton.style.transform = 'translateY(-2px) scale(1.05)';
            hologramButton.style.boxShadow = '0 5px 25px rgba(0, 255, 136, 0.6)';
        });

        hologramButton.addEventListener('mouseleave', () => {
            hologramButton.style.transform = 'translateY(0) scale(1)';
        });

        // Adicionar ao DOM
        document.body.appendChild(hologramButton);

        console.log('🎮 Botão de controle do holograma criado');
    }

    /**
     * Cria o botão de controle da voz (ligar/desligar)
     */
    createVoiceControlButton() {
        // Verificar se o botão já existe
        if (document.getElementById('voice-control-btn')) {
            return;
        }

        // Estado da voz (inicialmente ligada)
        let voiceEnabled = true;

        const voiceControlButton = document.createElement('button');
        voiceControlButton.id = 'voice-control-btn';
        voiceControlButton.className = 'holographic-button voice-control';
        voiceControlButton.innerHTML = '🔊 Desligar Voz';
        
        // Estilos específicos para o botão de controle de voz
        voiceControlButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 200, 255, 0.2);
            border: 2px solid #00ccff;
            color: #00ccff;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 0 0 15px rgba(0, 200, 255, 0.3);
            text-shadow: 0 0 10px rgba(0, 200, 255, 0.5);
            z-index: 1001;
            min-width: 140px;
            text-align: center;
            backdrop-filter: blur(10px);
        `;

        // Event listener para toggle da voz
        voiceControlButton.addEventListener('click', () => {
            voiceEnabled = !voiceEnabled;
            
            if (voiceEnabled) {
                // Voz ligada
                voiceControlButton.innerHTML = '🔊 Desligar Voz';
                voiceControlButton.style.background = 'rgba(0, 200, 255, 0.2)';
                voiceControlButton.style.borderColor = '#00ccff';
                voiceControlButton.style.color = '#00ccff';
                voiceControlButton.style.boxShadow = '0 0 15px rgba(0, 200, 255, 0.3)';
                
                // Habilitar voz globalmente
                window.voiceEnabled = true;
                
                // Parar qualquer síntese em andamento e falar confirmação
                if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                    setTimeout(() => {
                        if (window.speakText) {
                            window.speakText('Voz reativada!', 'pt-BR', 1.0, 1.0);
                        }
                    }, 100);
                }
                
                this.showNotification('Voz ligada', 'success', 2000);
            } else {
                // Voz desligada
                voiceControlButton.innerHTML = '� Ligar Voz';
                voiceControlButton.style.background = 'rgba(255, 71, 87, 0.2)';
                voiceControlButton.style.borderColor = '#ff4757';
                voiceControlButton.style.color = '#ff4757';
                voiceControlButton.style.boxShadow = '0 0 15px rgba(255, 71, 87, 0.3)';
                
                // Desabilitar voz globalmente
                window.voiceEnabled = false;
                
                // Parar qualquer síntese em andamento
                if (window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                }
                
                this.showNotification('Voz desligada', 'info', 2000);
            }
        });

        // Efeitos hover
        voiceControlButton.addEventListener('mouseenter', () => {
            voiceControlButton.style.transform = 'translateY(-2px) scale(1.05)';
            voiceControlButton.style.boxShadow = voiceEnabled 
                ? '0 5px 25px rgba(0, 200, 255, 0.6)'
                : '0 5px 25px rgba(255, 71, 87, 0.6)';
        });

        voiceControlButton.addEventListener('mouseleave', () => {
            voiceControlButton.style.transform = 'translateY(0) scale(1)';
        });

        // Adicionar ao DOM
        document.body.appendChild(voiceControlButton);

        // Configurar estado inicial da voz
        window.voiceEnabled = true;

        console.log('🎤 Botão de controle de voz criado');
    }

    /**
     * Atualiza o estado visual do botão de controle do holograma
     * @param {boolean} isVisible - Se o holograma está visível
     */
    updateHologramButtonState(isVisible) {
        const hologramButton = document.getElementById('hologram-control-btn');
        if (!hologramButton) return;

        if (isVisible) {
            // Holograma visível - atualizar texto do botão
            hologramButton.innerHTML = '👩‍🔬 Ocultar Holograma';
            hologramButton.style.borderColor = '#ff4757';
            hologramButton.style.color = '#ff4757';
            hologramButton.style.boxShadow = '0 0 15px rgba(255, 71, 87, 0.3)';
        } else {
            // Holograma oculto - atualizar texto do botão
            hologramButton.innerHTML = '👩‍🔬 Mostrar Holograma';
            hologramButton.style.borderColor = '#00ff88';
            hologramButton.style.color = '#00ff88';
            hologramButton.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.3)';
        }

        // Garantir que o botão esteja visível
        hologramButton.style.display = 'block';
    }

    /**
     * Limpa recursos do sistema
     */
    dispose() {
        this.hidePanel();
        
        // Remover botão de controle do holograma
        const hologramButton = document.getElementById('hologram-control-btn');
        if (hologramButton && hologramButton.parentNode) {
            hologramButton.parentNode.removeChild(hologramButton);
        }
        
        // Remover botão de controle de voz
        const voiceControlButton = document.getElementById('voice-control-btn');
        if (voiceControlButton && voiceControlButton.parentNode) {
            voiceControlButton.parentNode.removeChild(voiceControlButton);
        }
        
        this.elements = {
            mainPanel: null,
            panelTitle: null,
            panelContent: null,
            panelActions: null
        };
        this.isVisible = false;
    }
}
