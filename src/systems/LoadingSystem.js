/**
 * LoadingSystem - Sistema de gerenciamento de carregamento
 * Responsável por exibir o progresso de carregamento e transições
 */
export class LoadingSystem {
    constructor(app) {
        this.app = app;
        this.currentStep = 0;
        this.totalSteps = 4;
        this.steps = [
            'Inicializando sistema...',
            'Carregando three.js...',
            'Configurando ambiente 3D...',
            'Finalizando...'
        ];
        this.elements = {
            screen: null,
            bar: null,
            status: null
        };
    }

    /**
     * Inicializa o sistema de carregamento
     * @returns {Promise<void>}
     */
    async initialize() {
        this.setupElements();
        console.log('✅ Sistema de carregamento inicializado');
    }

    /**
     * Configura os elementos DOM do sistema de carregamento
     */
    setupElements() {
        this.elements.screen = document.getElementById('loading-screen');
        this.elements.bar = document.getElementById('loading-bar');
        this.elements.status = document.getElementById('loading-status');

        if (!this.elements.screen) {
            console.warn('⚠️ Tela de carregamento não encontrada');
        }
    }

    /**
     * Atualiza o progresso do carregamento
     * @param {number} step - Passo atual (0-totalSteps)
     * @param {string|null} message - Mensagem personalizada
     */
    updateProgress(step, message = null) {
        this.currentStep = step;
        const progress = Math.min((step / this.totalSteps) * 100, 100);
        
        if (this.elements.bar) {
            this.elements.bar.style.width = progress + '%';
        }
        
        if (this.elements.status) {
            this.elements.status.textContent = message || this.steps[step] || 'Carregando...';
        }

        console.log(`📊 Progresso: ${progress.toFixed(1)}% - ${message || this.steps[step]}`);
    }

    /**
     * Oculta a tela de carregamento com animação
     * @returns {Promise<void>}
     */
    async hide() {
        return new Promise((resolve) => {
            if (!this.elements.screen) {
                resolve();
                return;
            }

            this.elements.screen.style.opacity = '0';
            this.elements.screen.style.transition = 'opacity 1s ease-out';
            
            setTimeout(() => {
                if (this.elements.screen) {
                    this.elements.screen.style.display = 'none';
                }
                console.log('🎬 Tela de carregamento ocultada');
                resolve();
            }, 1000);
        });
    }

    /**
     * Mostra a tela de carregamento
     */
    show() {
        if (this.elements.screen) {
            this.elements.screen.style.display = 'flex';
            this.elements.screen.style.opacity = '1';
            console.log('🎬 Tela de carregamento exibida');
        }
    }

    /**
     * Limpa recursos do sistema
     */
    dispose() {
        this.elements = {
            screen: null,
            bar: null,
            status: null
        };
    }
}
