/* 
 * Nexo Dash - Script Principal
 * Coordena a inicialização e funcionamento da aplicação
 */

/**
 * Função principal de inicialização da aplicação
 */
async function initializeApplication() {
    try {
        AppState.log('Starting application initialization');
        LoadingSystem.updateProgress(0, 'Inicializando sistema...');
        
        // Aguardar um pouco para mostrar a tela de carregamento
        await delay(500);

        // Inicializar Three.js
        await ThreeJSSystem.init();

        // Inicializar Pyodide (pode falhar, mas continuamos)
        await PyodideSystem.init();

        // Marcar como inicializado
        AppState.isInitialized = true;
        LoadingSystem.updateProgress(5, 'Inicialização completa!');

        // Aguardar um pouco antes de ocultar loading
        await delay(1000);

        // Ocultar tela de carregamento
        LoadingSystem.hide();

        // Aguardar a transição terminar e mostrar primeiro módulo
        setTimeout(() => {
            ModuleSystem.startFirstModule();
        }, 1500);

        AppState.log('Application initialized successfully');

    } catch (error) {
        console.error('Erro durante inicialização:', error);
        AppState.log(`Initialization error: ${error.message}`, 'error');
        LoadingSystem.showError('Erro na inicialização, mas continuando...');
        
        // Mesmo com erro, tentar continuar
        setTimeout(() => {
            LoadingSystem.hide();
            setTimeout(() => {
                UISystem.showPanel(
                    'Erro de Inicialização',
                    '<p>Houve um problema durante a inicialização, mas o ambiente básico está funcionando.</p>',
                    [{
                        label: 'Continuar Mesmo Assim',
                        callback: () => ModuleSystem.startFirstModule()
                    }]
                );
            }, 1500);
        }, 2000);
    }
}

/**
 * Configura o sistema de tradução automática
 */
function setupTranslation() {
    // Detectar idioma do navegador
    const userLang = navigator.language || navigator.userLanguage;
    AppState.log(`Language detected: ${userLang}`);
    
    // AutoTranslate.js será configurado aqui quando estiver totalmente carregado
    // Por enquanto, mantemos o conteúdo em português
}

/**
 * Configura event listeners globais
 */
function setupGlobalEventListeners() {
    // Prevenir context menu em desenvolvimento
    if (AppConfig.debug.enableLogging) {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // ESC - Fechar painel
        if (e.key === 'Escape') {
            UISystem.hidePanel();
        }
        
        // F11 - Toggle fullscreen
        if (e.key === 'F11') {
            e.preventDefault();
            toggleFullscreen();
        }
        
        // Ctrl/Cmd + Enter - Próximo passo (debug)
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && AppConfig.debug.enableLogging) {
            ModuleSystem.nextStep();
        }
    });

    // Resize handler
    window.addEventListener('resize', () => {
        if (ThreeJSSystem.onWindowResize) {
            ThreeJSSystem.onWindowResize();
        }
    });

    AppState.log('Global event listeners configured');
}

/**
 * Toggle fullscreen
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            AppState.log(`Error attempting to enable fullscreen: ${err.message}`, 'error');
        });
    } else {
        document.exitFullscreen();
    }
}

/**
 * Limpa recursos quando a página for fechada
 */
function setupCleanup() {
    window.addEventListener('beforeunload', () => {
        AppState.log('Cleaning up resources');
        
        if (ThreeJSSystem.dispose) {
            ThreeJSSystem.dispose();
        }
        
        AppState.reset();
    });
}

/**
 * Utility: Promise delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Funções globais para interação (backwards compatibility)
 */
function nextStep() {
    ModuleSystem.nextStep();
}

function nextModule() {
    ModuleSystem.nextModule();
}

function load3DBlueprint() {
    ModuleSystem.load3DBlueprint();
}

/**
 * Função de debug para desenvolvimento
 */
function debugInfo() {
    if (AppConfig.debug.enableLogging) {
        console.group('Nexo Dash Debug Info');
        console.log('AppState:', AppState);
        console.log('Current Module:', AppState.currentModule);
        console.log('Current Step:', ModuleSystem.currentStep);
        console.log('Progress:', ModuleSystem.getProgress());
        console.log('Three.js Ready:', AppState.isReady());
        console.log('Pyodide Ready:', PyodideSystem.isReady());
        console.groupEnd();
    }
}

/**
 * Inicialização quando a página carregar
 */
window.addEventListener('load', () => {
    AppState.log('Page loaded, starting initialization');
    setupTranslation();
    setupGlobalEventListeners();
    setupCleanup();
    initializeApplication();
});

/**
 * Inicialização quando o DOM estiver pronto (fallback)
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AppState.log('DOM ready');
    });
} else {
    AppState.log('DOM already ready');
}

// Disponibilizar funções de debug globalmente em desenvolvimento
if (AppConfig.debug.enableLogging) {
    window.debugInfo = debugInfo;
    window.AppState = AppState;
    window.ModuleSystem = ModuleSystem;
    window.UISystem = UISystem;
    window.ThreeJSSystem = ThreeJSSystem;
    window.PyodideSystem = PyodideSystem;
}
