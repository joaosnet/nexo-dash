/**
 * Teste simples para validar a estrutura da aplicação
 * Execute no console do navegador para verificar a integridade
 */

/**
 * Suite de testes para validação da arquitetura
 */
class NexoDashTestSuite {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }

    /**
     * Adiciona um teste
     */
    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    /**
     * Executa todos os testes
     */
    async runAll() {
        console.log('🧪 Iniciando suite de testes do Nexo Dash...\n');
        
        for (const test of this.tests) {
            await this.runSingleTest(test);
        }
        
        this.printResults();
    }

    /**
     * Executa um teste individual
     */
    async runSingleTest(test) {
        this.results.total++;
        
        try {
            const result = await test.testFn();
            if (result) {
                console.log(`✅ ${test.name}`);
                this.results.passed++;
            } else {
                console.log(`❌ ${test.name} - Falhou`);
                this.results.failed++;
            }
        } catch (error) {
            console.log(`❌ ${test.name} - Erro: ${error.message}`);
            this.results.failed++;
        }
    }

    /**
     * Mostra resultados finais
     */
    printResults() {
        console.log('\n📊 Resultados dos Testes:');
        console.log(`   ✅ Passou: ${this.results.passed}`);
        console.log(`   ❌ Falhou: ${this.results.failed}`);
        console.log(`   📈 Total: ${this.results.total}`);
        console.log(`   🎯 Taxa de Sucesso: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
        
        if (this.results.failed === 0) {
            console.log('\n🎉 Todos os testes passaram! Estrutura modular validada.');
        } else {
            console.log('\n⚠️ Alguns testes falharam. Verifique a implementação.');
        }
    }
}

// Criar instância da suite de testes
const testSuite = new NexoDashTestSuite();

// ================== TESTES DE ESTRUTURA ==================

testSuite.test('Aplicação principal existe', () => {
    return window.app !== null && window.app !== undefined;
});

testSuite.test('Aplicação é uma instância válida', () => {
    return window.app && typeof window.app.getSystem === 'function';
});

testSuite.test('Sistema de Loading registrado', () => {
    const loadingSystem = window.app?.getSystem('loading');
    return loadingSystem && typeof loadingSystem.updateProgress === 'function';
});

testSuite.test('Sistema Three.js registrado', () => {
    const threeSystem = window.app?.getSystem('three');
    return threeSystem && typeof threeSystem.getScene === 'function';
});

testSuite.test('Sistema UI registrado', () => {
    const uiSystem = window.app?.getSystem('ui');
    return uiSystem && typeof uiSystem.showPanel === 'function';
});

testSuite.test('Sistema de Módulos registrado', () => {
    const moduleSystem = window.app?.getSystem('module');
    return moduleSystem && typeof moduleSystem.nextStep === 'function';
});

// ================== TESTES DO THREE.JS ==================

testSuite.test('Scene Three.js existe', () => {
    const threeSystem = window.app?.getSystem('three');
    const scene = threeSystem?.getScene();
    return scene && scene.type === 'Scene';
});

testSuite.test('Camera Three.js configurada', () => {
    const threeSystem = window.app?.getSystem('three');
    const camera = threeSystem?.getCamera();
    return camera && camera.type === 'PerspectiveCamera';
});

testSuite.test('Renderer Three.js ativo', () => {
    const threeSystem = window.app?.getSystem('three');
    const renderer = threeSystem?.getRenderer();
    return renderer && renderer.domElement;
});

testSuite.test('DrTuringManager existe', () => {
    const threeSystem = window.app?.getSystem('three');
    const drTuring = threeSystem?.getDrTuringManager();
    return drTuring && typeof drTuring.speak3D === 'function';
});

testSuite.test('EnvironmentManager existe', () => {
    const threeSystem = window.app?.getSystem('three');
    const environment = threeSystem?.getEnvironmentManager();
    return environment && typeof environment.createProjectStructure === 'function';
});

// ================== TESTES DA UI ==================

testSuite.test('Container Three.js no DOM', () => {
    const container = document.getElementById('threejs-container');
    return container !== null;
});

testSuite.test('Tela de carregamento foi removida', () => {
    const loadingScreen = document.getElementById('loading-screen');
    return !loadingScreen || loadingScreen.style.display === 'none';
});

testSuite.test('Painel de controles está visível', () => {
    const controlsPanel = document.getElementById('controls-panel');
    return controlsPanel && controlsPanel.classList.contains('visible');
});

testSuite.test('Canvas Three.js renderizando', () => {
    const canvas = document.querySelector('#threejs-container canvas');
    return canvas && canvas.width > 0 && canvas.height > 0;
});

// ================== TESTES DE FUNCIONALIDADE ==================

testSuite.test('Sistema de notificações funcional', () => {
    const uiSystem = window.app?.getSystem('ui');
    if (!uiSystem) return false;
    
    try {
        uiSystem.showNotification('Teste', 'info', 1000);
        return true;
    } catch (error) {
        return false;
    }
});

testSuite.test('Progresso dos módulos calculável', () => {
    const moduleSystem = window.app?.getSystem('module');
    if (!moduleSystem) return false;
    
    const progress = moduleSystem.getProgress();
    return typeof progress === 'number' && progress >= 0 && progress <= 100;
});

testSuite.test('Dependências Three.js carregadas', () => {
    return window.THREE && 
           window.THREE.OrbitControls && 
           window.THREE.GLTFLoader &&
           window.THREE.FBXLoader;
});

// ================== TESTES DE PERFORMANCE ==================

testSuite.test('Renderização funcionando', () => {
    const threeSystem = window.app?.getSystem('three');
    const renderer = threeSystem?.getRenderer();
    if (!renderer) return false;
    
    const info = renderer.info;
    return info && typeof info.render.calls === 'number';
});

testSuite.test('Memória sob controle', () => {
    if (!window.performance || !window.performance.memory) {
        return true; // Não disponível em todos os navegadores
    }
    
    const memory = window.performance.memory;
    const memoryMB = memory.usedJSHeapSize / 1024 / 1024;
    return memoryMB < 200; // Menos de 200MB
});

// ================== TESTES DE RESPONSIVIDADE ==================

testSuite.test('Interface responsiva ativa', () => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return true;
    
    // Verificar se adaptações mobile estão ativas
    const panels = document.querySelectorAll('.holographic-panel');
    return Array.from(panels).every(panel => {
        const style = getComputedStyle(panel);
        return parseInt(style.left) <= 16 && parseInt(style.right) <= 16;
    });
});

testSuite.test('Canvas redimensiona corretamente', () => {
    const canvas = document.querySelector('#threejs-container canvas');
    if (!canvas) return false;
    
    return canvas.width === window.innerWidth && 
           canvas.height === window.innerHeight;
});

// ================== FUNÇÃO PRINCIPAL ==================

/**
 * Executa todos os testes
 */
async function runNexoDashTests() {
    // Aguardar inicialização se necessário
    if (!window.app) {
        console.log('⏳ Aguardando inicialização da aplicação...');
        
        let attempts = 0;
        while (!window.app && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.app) {
            console.error('❌ Aplicação não inicializada após 5 segundos');
            return;
        }
    }
    
    // Aguardar mais um pouco para garantir que tudo está carregado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Executar testes
    await testSuite.runAll();
}

// ================== UTILITÁRIOS DE DEBUG ==================

/**
 * Mostra informações do sistema para debug
 */
function showSystemInfo() {
    console.log('🔍 Informações do Sistema Nexo Dash:');
    console.log('');
    
    if (!window.app) {
        console.log('❌ Aplicação não inicializada');
        return;
    }
    
    // Informações da aplicação
    console.log('📱 Aplicação:');
    console.log(`   Nome: ${window.app.constructor.name}`);
    console.log(`   Sistemas registrados: ${Object.keys(window.app.systems || {}).length}`);
    console.log('');
    
    // Sistemas
    const systemNames = ['loading', 'three', 'ui', 'module'];
    console.log('🔧 Sistemas:');
    systemNames.forEach(name => {
        const system = window.app.getSystem(name);
        console.log(`   ${name}: ${system ? '✅' : '❌'}`);
    });
    console.log('');
    
    // Three.js
    const threeSystem = window.app.getSystem('three');
    if (threeSystem) {
        console.log('🎮 Three.js:');
        console.log(`   Scene: ${threeSystem.getScene() ? '✅' : '❌'}`);
        console.log(`   Camera: ${threeSystem.getCamera() ? '✅' : '❌'}`);
        console.log(`   Renderer: ${threeSystem.getRenderer() ? '✅' : '❌'}`);
        console.log(`   DrTuring: ${threeSystem.getDrTuringManager() ? '✅' : '❌'}`);
        console.log(`   Environment: ${threeSystem.getEnvironmentManager() ? '✅' : '❌'}`);
        console.log('');
    }
    
    // Performance
    if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        console.log('📊 Performance:');
        console.log(`   Memória JS: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(1)} MB`);
        console.log(`   Limite JS: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(1)} MB`);
        console.log('');
    }
    
    // Dispositivo
    console.log('📱 Dispositivo:');
    console.log(`   User Agent: ${navigator.userAgent}`);
    console.log(`   Idioma: ${navigator.language}`);
    console.log(`   Resolução: ${screen.width}x${screen.height}`);
    console.log(`   Viewport: ${window.innerWidth}x${window.innerHeight}`);
    console.log(`   WebGL: ${!!window.WebGLRenderingContext ? '✅' : '❌'}`);
    console.log('');
}

/**
 * Força recarregamento dos módulos (desenvolvimento)
 */
function reloadModules() {
    if (window.app) {
        console.log('🔄 Limpando aplicação atual...');
        window.app.dispose();
        window.app = null;
    }
    
    console.log('🔄 Recarregando página...');
    window.location.reload();
}

// ================== EXPOSIÇÃO GLOBAL ==================

// Expor funções globalmente para uso no console
window.nexoDashTests = {
    run: runNexoDashTests,
    info: showSystemInfo,
    reload: reloadModules,
    testSuite: testSuite
};

// Auto-executar testes em desenvolvimento
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Modo de desenvolvimento detectado');
    console.log('📝 Execute nexoDashTests.run() para validar a estrutura');
    console.log('🔍 Execute nexoDashTests.info() para informações do sistema');
    console.log('🔄 Execute nexoDashTests.reload() para recarregar');
}

// Executar testes automaticamente após carregamento completo
window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.location.search.includes('autotest=true')) {
            runNexoDashTests();
        }
    }, 3000);
});

export { runNexoDashTests, showSystemInfo, reloadModules };
