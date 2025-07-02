/* 
 * Nexo Dash - Sistema de Carregamento
 * Gerencia a tela de loading e progresso da inicialização
 */

const LoadingSystem = {
    currentStep: 0,
    totalSteps: AppConfig.loading.totalSteps,
    steps: AppConfig.loading.steps,

    /**
     * Atualiza o progresso do carregamento
     * @param {number} step - Passo atual (0-5)
     * @param {string} message - Mensagem opcional personalizada
     */
    updateProgress(step, message = null) {
        this.currentStep = step;
        const progress = (step / this.totalSteps) * 100;
        const progressBar = document.getElementById('loading-bar');
        const statusText = document.getElementById('loading-status');
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        
        if (statusText) {
            statusText.textContent = message || this.steps[step] || 'Carregando...';
        }
        
        AppState.log(`Loading progress: ${progress}% - ${statusText?.textContent}`);
    },

    /**
     * Oculta a tela de carregamento com transição suave
     */
    hide() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 1s ease-out';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                AppState.log('Loading screen hidden');
            }, 1000);
        }
    },

    /**
     * Mostra mensagem de erro no carregamento
     * @param {string} errorMessage - Mensagem de erro
     */
    showError(errorMessage) {
        const statusText = document.getElementById('loading-status');
        if (statusText) {
            statusText.textContent = `Erro: ${errorMessage}`;
            statusText.style.color = '#ff4757';
        }
        AppState.log(`Loading error: ${errorMessage}`, 'error');
    },

    /**
     * Força conclusão do carregamento (para casos de erro)
     */
    forceComplete() {
        this.updateProgress(this.totalSteps, 'Carregamento concluído');
        setTimeout(() => this.hide(), 1000);
    }
};

// Disponibilizar globalmente
window.LoadingSystem = LoadingSystem;
