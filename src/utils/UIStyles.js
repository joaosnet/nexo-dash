/**
 * UIStyles - Estilos CSS para o sistema de UI holográfico
 */
export class UIStyles {
    constructor() {
        this.stylesInjected = false;
    }

    /**
     * Injeta todos os estilos CSS necessários
     */
    injectStyles() {
        if (this.stylesInjected) return;

        this.injectPanelStyles();
        this.injectButtonStyles();
        this.injectResponsiveStyles();
        
        this.stylesInjected = true;
        console.log('🎨 Estilos UI injetados');
    }

    /**
     * Injeta estilos dos painéis holográficos
     */
    injectPanelStyles() {
        const scrollStyle = document.createElement('style');
        scrollStyle.id = 'panel-scroll-styles';
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
    }

    /**
     * Injeta estilos dos botões holográficos
     */
    injectButtonStyles() {
        const buttonStyles = document.createElement('style');
        buttonStyles.id = 'holographic-button-styles';
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

            /* Estilos específicos para botões de controle */
            #hologram-control-btn {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 1001;
                min-width: 160px;
                backdrop-filter: blur(10px);
            }

            #voice-control-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1001;
                min-width: 140px;
                backdrop-filter: blur(10px);
            }
        `;
        document.head.appendChild(buttonStyles);
    }

    /**
     * Injeta estilos responsivos
     */
    injectResponsiveStyles() {
        const responsiveStyles = document.createElement('style');
        responsiveStyles.id = 'responsive-ui-styles';
        responsiveStyles.textContent = `
            /* Responsividade para tablets */
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
                #hologram-control-btn {
                    bottom: 10px !important;
                    left: 10px !important;
                    padding: 10px 16px !important;
                    font-size: 0.9rem !important;
                    min-width: 140px !important;
                }
                #voice-control-btn {
                    bottom: 10px !important;
                    right: 10px !important;
                    padding: 10px 16px !important;
                    font-size: 0.9rem !important;
                    min-width: 140px !important;
                }
            }

            /* Responsividade para smartphones */
            @media (max-width: 480px) {
                .panel-actions {
                    flex-direction: column;
                    align-items: stretch;
                }
                .holographic-button {
                    width: 100%;
                }
                #hologram-control-btn {
                    bottom: 90px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: calc(80% - 20px) !important;
                    max-width: 200px !important;
                    right: auto !important;
                }
                #voice-control-btn {
                    bottom: 20px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: calc(80% - 20px) !important;
                    max-width: 200px !important;
                    right: auto !important;
                }
            }
        `;
        document.head.appendChild(responsiveStyles);
    }

    /**
     * Obtém estilos inline para painéis principais
     */
    getMainPanelStyles() {
        return `
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
    }

    /**
     * Obtém estilos inline para títulos de painel
     */
    getPanelTitleStyles() {
        return `
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
    }

    /**
     * Obtém estilos inline para conteúdo de painel
     */
    getPanelContentStyles() {
        return `
            padding: 25px;
            overflow-y: auto;
            max-height: 400px;
            flex: 1;
            background: rgba(0, 0, 0, 0.2);
        `;
    }

    /**
     * Obtém estilos inline para ações de painel
     */
    getPanelActionsStyles() {
        return `
            padding: 20px 25px;
            border-top: 1px solid rgba(0, 255, 136, 0.2);
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
            background: rgba(0, 255, 136, 0.05);
        `;
    }

    /**
     * Remove todos os estilos injetados
     */
    removeStyles() {
        const styleIds = [
            'panel-scroll-styles',
            'holographic-button-styles', 
            'responsive-ui-styles'
        ];
        
        styleIds.forEach(id => {
            const element = document.getElementById(id);
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        
        this.stylesInjected = false;
        console.log('🎨 Estilos UI removidos');
    }
}
