/**
 * LoadingUtils - Utilitários para carregamento e inicialização
 */
export class LoadingUtils {
    constructor() {
        this.loadingTips = [
            "💡 Use WASD para navegar no ambiente 3D",
            "🎯 Clique nos elementos 3D para interagir",
            "⚡ Pressione ESC para fechar painéis",
            "🔧 Projeto ensina desenvolvimento Dash/Python",
            "🎨 Ambiente utiliza Three.js para renderização 3D",
            "📚 Cada módulo adiciona nova funcionalidade"
        ];
        this.currentTipIndex = 0;
        this.setupTipRotation();
    }

    setupTipRotation() {
        setInterval(() => this.rotateTips(), 3000);
    }

    updateStatus(status) {
        const element = document.getElementById('loading-status');
        if (element) element.textContent = status;
    }

    updateProgress(percentage) {
        const bar = document.getElementById('loading-bar');
        const percent = document.getElementById('loading-percentage');
        
        if (bar) bar.style.width = `${Math.min(percentage, 100)}%`;
        if (percent) percent.textContent = `${Math.round(percentage)}%`;
    }

    rotateTips() {
        const element = document.getElementById('loading-tips');
        if (!element || this.loadingTips.length === 0) return;

        this.currentTipIndex = (this.currentTipIndex + 1) % this.loadingTips.length;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.textContent = this.loadingTips[this.currentTipIndex];
            element.style.opacity = '0.7';
        }, 300);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9); color: white; padding: 2rem;
            border-radius: 10px; text-align: center; z-index: 10001;
            max-width: 400px; box-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
        `;
        errorDiv.innerHTML = `
            <h3>❌ Erro</h3>
            <p style="margin: 1rem 0;">${message}</p>
            <button onclick="window.location.reload()" style="
                background: white; color: red; border: none; padding: 0.5rem 1rem;
                border-radius: 5px; cursor: pointer; font-weight: bold;
            ">Recarregar</button>
        `;
        document.body.appendChild(errorDiv);
    }

    checkDependencies(retryCount = 0) {
        const maxRetries = 10;
        
        if (retryCount >= maxRetries) {
            console.error('❌ Falha ao carregar dependências');
            this.showError('Erro ao carregar dependências. Recarregue a página.');
            return false;
        }

        const dependencies = {
            THREE: window.THREE,
            OrbitControls: window.THREE?.OrbitControls,
            GLTFLoader: window.THREE?.GLTFLoader,
            FBXLoader: window.THREE?.FBXLoader,
            fflate: window.fflate
        };

        const missing = Object.entries(dependencies)
            .filter(([name, dep]) => !dep)
            .map(([name]) => name);

        if (missing.length > 0) {
            console.log(`⏳ Aguardando: ${missing.join(', ')} (${retryCount + 1}/${maxRetries})`);
            this.updateStatus(`Carregando: ${missing.join(', ')}...`);
            this.updateProgress(20 + (retryCount * 7));
            
            setTimeout(() => this.checkDependencies(retryCount + 1), 200);
            return false;
        }

        console.log('✅ Dependências carregadas!');
        this.updateStatus('Dependências carregadas!');
        this.updateProgress(60);
        return true;
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    this.updateProgress(100);
                }, 500);
            }
        }, 200);
    }
}
