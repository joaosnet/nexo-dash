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
        this.controlButtonsContainer = null; // Add this line
    }

    /**
     * Inicializa o sistema de UI
     * @returns {Promise<void>}
     */
    async initialize() {
        this.uiStyles.injectStyles();
        this.setupElements();
        this.setupEventListeners();
        this.createControlButtonsContainer(); // Add this line
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
        this.controlButtonsContainer = document.createElement('div');
        this.controlButtonsContainer.id = 'control-buttons-container';
        this.controlButtonsContainer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 150;
        `;
        document.body.appendChild(this.controlButtonsContainer);
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
            
            // Adicionar botão de reabertura
            if (!document.getElementById('reopen-hologram-button')) {
                const reopenBtn = document.createElement('button');
                reopenBtn.id = 'reopen-hologram-button';
                reopenBtn.className = 'reopen-hologram-button holographic-button';
                reopenBtn.textContent = 'Abrir Painel';
                reopenBtn.onclick = () => this.showPanel(
                    this.elements.panelTitle?.textContent || 'Nexo Dash',
                    this.elements.panelContent?.innerHTML || '',
                    Array.from(this.elements.panelActions?.children || [])
                        .filter(b => b.id !== 'reopen-hologram-button')
                        .map(b => ({
                            label: b.textContent,
                            callback: b.onclick
                        }))
                );
                document.body.appendChild(reopenBtn);
            }
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
        if (document.getElementById('hologram-control-btn')) return;

        const hologramButton = document.createElement('button');
        hologramButton.id = 'hologram-control-btn';
        hologramButton.className = 'holographic-button hologram-control';
        hologramButton.innerHTML = '👩‍🔬 Mostrar Holograma';

        // Event listener para toggle do holograma
        hologramButton.addEventListener('click', () => {
            const threeSystem = this.app.getSystem('three');
            if (threeSystem && threeSystem.drTuringManager) {
                const isVisible = threeSystem.drTuringManager.toggleHologram();
                this.updateHologramButtonState(isVisible);
                
                const message = isVisible ? 'Dra. Turing apareceu!' : 'Dra. Turing desapareceu!';
                const type = isVisible ? 'success' : 'info';
                this.showNotification(message, type, 2000);
            }
        });

        this.addButtonHoverEffects(hologramButton);
        // Replace document.body.appendChild with:
        if (this.controlButtonsContainer) {
            this.controlButtonsContainer.appendChild(hologramButton);
        } else {
            document.body.appendChild(hologramButton);
        }
        console.log('🎮 Botão de controle do holograma criado');
    }

    /**
     * Cria o botão de controle da voz (ligar/desligar)
     * Integrado com o VoiceSystem global
     */
    createVoiceControlButton() {
        if (document.getElementById('voice-control-btn')) return;

        const voiceControlButton = document.createElement('button');
        voiceControlButton.id = 'voice-control-btn';
        voiceControlButton.className = 'holographic-button voice-control';
        voiceControlButton.innerHTML = '🔊 Voz Ativa';

        // Função para alternar estado da voz (usa VoiceSystem)
        const toggleVoice = () => {
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

            this.updateVoiceButtonState(newState);
            
            const message = newState ? 'Voz ligada' : 'Voz desligada';
            const type = newState ? 'success' : 'info';
            this.showNotification(message, type, 2000);
        };

        voiceControlButton.addEventListener('click', toggleVoice);
        this.addButtonHoverEffects(voiceControlButton);
        // Replace document.body.appendChild with:
        if (this.controlButtonsContainer) {
            this.controlButtonsContainer.appendChild(voiceControlButton);
        } else {
            document.body.appendChild(voiceControlButton);
        }

        console.log('🎤 Botão de controle de voz criado (integrado com VoiceSystem)');
    }

    /**
     * Adiciona efeitos hover padrão a um botão
     * @param {HTMLElement} button - Elemento do botão
     */
    addButtonHoverEffects(button) {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.05)';
            button.style.boxShadow = '0 5px 25px rgba(0, 255, 136, 0.6)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
            button.style.boxShadow = '';
        });
    }

    /**
     * Atualiza o estado visual do botão de controle de voz
     * @param {boolean} enabled - Se a voz está habilitada
     */
    updateVoiceButtonState(enabled) {
        const voiceButton = document.getElementById('voice-control-btn');
        if (!voiceButton) return;

        const styles = enabled ? {
            text: '🔊 Desligar Voz',
            background: 'rgba(0, 200, 255, 0.2)',
            borderColor: '#00ccff',
            color: '#00ccff',
            boxShadow: '0 0 15px rgba(0, 200, 255, 0.3)'
        } : {
            text: '🔇 Ligar Voz',
            background: 'rgba(255, 71, 87, 0.2)',
            borderColor: '#ff4757',
            color: '#ff4757',
            boxShadow: '0 0 15px rgba(255, 71, 87, 0.3)'
        };

        voiceButton.innerHTML = styles.text;
        voiceButton.style.background = styles.background;
        voiceButton.style.borderColor = styles.borderColor;
        voiceButton.style.color = styles.color;
        voiceButton.style.boxShadow = styles.boxShadow;
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
            hologramButton.style.display = 'none'; // Hide button when hologram is visible
        } else {
            // Holograma oculto - atualizar texto do botão
            hologramButton.innerHTML = '👩‍🔬 Mostrar Holograma';
            hologramButton.style.borderColor = '#00ff88';
            hologramButton.style.color = '#00ff88';
            hologramButton.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.3)';
            hologramButton.style.display = 'block';
        }

        // Garantir que o botão esteja visível
        hologramButton.style.display = 'block';
    }

    /**
     * Limpa recursos do sistema
     */
    dispose() {
        this.hidePanel();
        
        // Remover botões de controle
        const hologramButton = document.getElementById('hologram-control-btn');
        const voiceControlButton = document.getElementById('voice-control-btn');
        
        [hologramButton, voiceControlButton].forEach(button => {
            if (button && button.parentNode) {
                button.parentNode.removeChild(button);
            }
        });
        
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
     * Cria o controle de voz
     */
    createVoiceControl() {
        const voiceButton = this.createControlButton('🎤', () => {
            if (!this.app.voiceSystem.initialized) {
                this.app.voiceSystem.setupVoiceSystem();
            }
            this.app.voiceSystem.setEnabled(!this.app.voiceSystem.isVoiceEnabled());
            this.showNotification(`Voz ${this.app.voiceSystem.isVoiceEnabled() ? 'ativada' : 'desativada'}`);
            
            // Forçar primeiro clique como interação do usuário
            document.body.click();
        });
        return voiceButton;
    }
}
