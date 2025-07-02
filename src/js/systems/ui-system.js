/* 
 * Nexo Dash - Sistema de Interface
 * Gerencia painéis holográficos e interações UI
 */

const UISystem = {
    /**
     * Mostra um painel holográfico
     * @param {string} title - Título do painel
     * @param {string} content - Conteúdo HTML do painel
     * @param {Array} actions - Lista de ações (botões)
     */
    showPanel(title, content, actions = []) {
        const panel = document.getElementById('main-panel');
        const titleEl = document.getElementById('panel-title');
        const contentEl = document.getElementById('panel-content');
        const actionsEl = document.getElementById('panel-actions');

        if (!panel || !titleEl || !contentEl || !actionsEl) {
            AppState.log('Panel elements not found', 'error');
            return;
        }

        // Definir conteúdo
        titleEl.textContent = title;
        contentEl.innerHTML = content;
        
        // Limpar ações anteriores
        actionsEl.innerHTML = '';
        
        // Adicionar novas ações
        actions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'holographic-button';
            button.textContent = action.label;
            button.onclick = action.callback;
            actionsEl.appendChild(button);
        });

        // Mostrar painel
        panel.style.display = 'block';
        
        // Scroll para o topo do conteúdo
        contentEl.scrollTop = 0;
        
        AppState.log(`Panel shown: ${title}`);
    },

    /**
     * Oculta o painel principal
     */
    hidePanel() {
        const panel = document.getElementById('main-panel');
        if (panel) {
            panel.style.display = 'none';
            AppState.log('Panel hidden');
        }
    },

    /**
     * Cria um modal personalizado
     * @param {string} title - Título do modal
     * @param {string} content - Conteúdo HTML
     * @param {Array} buttons - Lista de botões
     */
    showModal(title, content, buttons = []) {
        // Remover modal existente
        this.closeModal();
        
        const modal = document.createElement('div');
        modal.id = 'custom-modal';
        modal.className = 'modal-overlay';
        
        const buttonHtml = buttons.map(btn => 
            `<button class="modal-button" onclick="${btn.callback}">${btn.label}</button>`
        ).join('');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="UISystem.closeModal()">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${buttonHtml}
                </div>
            </div>
        `;
        
        // Adicionar estilos
        this.addModalStyles();
        
        document.body.appendChild(modal);
        
        // Fechar com ESC
        this.setupModalKeyboard(modal);
        
        AppState.log(`Modal shown: ${title}`);
    },

    /**
     * Fecha modal atual
     */
    closeModal() {
        const modal = document.getElementById('custom-modal');
        if (modal) {
            modal.remove();
            AppState.log('Modal closed');
        }
    },

    /**
     * Adiciona estilos do modal
     */
    addModalStyles() {
        if (document.getElementById('modal-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                backdrop-filter: blur(5px);
            }
            
            .modal-content {
                background: linear-gradient(135deg, rgba(0, 255, 136, 0.95), rgba(0, 200, 255, 0.9));
                border: 4px solid #00ff88;
                border-radius: 20px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 0 50px rgba(0, 255, 136, 0.8);
                color: #000;
                font-family: Arial, sans-serif;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 2px solid #00ff88;
            }
            
            .modal-header h2 {
                margin: 0;
                font-size: 24px;
            }
            
            .modal-close {
                background: #ff4757;
                color: white;
                border: none;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                font-size: 18px;
                cursor: pointer;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .modal-footer {
                padding: 20px;
                text-align: center;
                border-top: 2px solid #00ff88;
            }
            
            .modal-button {
                background: rgba(0, 255, 136, 0.3);
                border: 2px solid #00ff88;
                color: #000;
                padding: 10px 20px;
                margin: 5px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            }
            
            .modal-button:hover {
                background: rgba(0, 255, 136, 0.5);
            }
        `;
        
        document.head.appendChild(style);
    },

    /**
     * Configura eventos de teclado para modal
     */
    setupModalKeyboard(modal) {
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        
        document.addEventListener('keydown', handleKeydown);
    },

    /**
     * Mostra notificação temporária
     * @param {string} message - Mensagem
     * @param {string} type - Tipo: 'info', 'success', 'warning', 'error'
     * @param {number} duration - Duração em ms
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Adicionar estilos
        this.addNotificationStyles();
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remover automaticamente
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
        
        AppState.log(`Notification: ${message} (${type})`);
    },

    /**
     * Adiciona estilos das notificações
     */
    addNotificationStyles() {
        if (document.getElementById('notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 10px;
                color: white;
                font-weight: bold;
                z-index: 3000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-info {
                background: linear-gradient(135deg, #00ff88, #00ccff);
                border: 2px solid #00ff88;
            }
            
            .notification-success {
                background: linear-gradient(135deg, #2ed573, #26de81);
                border: 2px solid #2ed573;
            }
            
            .notification-warning {
                background: linear-gradient(135deg, #ffa502, #ff7675);
                border: 2px solid #ffa502;
            }
            
            .notification-error {
                background: linear-gradient(135deg, #ff4757, #ff3838);
                border: 2px solid #ff4757;
            }
        `;
        
        document.head.appendChild(style);
    },

    /**
     * Cria indicador de carregamento inline
     * @param {HTMLElement} container - Container onde inserir
     */
    showInlineLoader(container) {
        if (!container) return;
        
        const loader = document.createElement('div');
        loader.className = 'inline-loader';
        loader.innerHTML = `
            <div class="loader-spinner"></div>
            <span>Carregando...</span>
        `;
        
        // Adicionar estilos se necessário
        this.addLoaderStyles();
        
        container.appendChild(loader);
        return loader;
    },

    /**
     * Remove indicador de carregamento inline
     */
    hideInlineLoader(container) {
        if (!container) return;
        
        const loader = container.querySelector('.inline-loader');
        if (loader) {
            loader.remove();
        }
    },

    /**
     * Adiciona estilos do loader
     */
    addLoaderStyles() {
        if (document.getElementById('loader-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'loader-styles';
        style.textContent = `
            .inline-loader {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                color: #00ff88;
            }
            
            .loader-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid #00ff88;
                border-top: 2px solid transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 10px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
    },

    /**
     * Utilitário para criar elementos com atributos
     * @param {string} tag - Tag HTML
     * @param {Object} attributes - Atributos
     * @param {string} content - Conteúdo
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    }
};

// Disponibilizar globalmente
window.UISystem = UISystem;
