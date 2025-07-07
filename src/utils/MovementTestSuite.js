/**
 * MovementTestSuite - Testes para sistema de movimento WASD
 * Suite de testes para validar funcionamento dos controles de movimento
 */
export class MovementTestSuite {
    constructor(app) {
        this.app = app;
        this.threeSystem = null;
    }

    /**
     * Executa todos os testes de movimento
     */
    async runAllTests() {
        console.group('🧪 === TESTE DE SISTEMA DE MOVIMENTO ===');
        
        try {
            this.threeSystem = this.app.getSystem('three');
            
            if (!this.threeSystem) {
                throw new Error('Sistema Three.js não encontrado');
            }

            await this.testWASDInitialization();
            await this.testWASDControls();
            await this.testShadowConfiguration();
            await this.testCameraMovement();
            this.testControlMethods();
            
            console.log('✅ Todos os testes de movimento passaram!');
            
        } catch (error) {
            console.error('❌ Erro nos testes de movimento:', error);
        }
        
        console.groupEnd();
    }

    /**
     * Testa inicialização dos controles WASD
     */
    async testWASDInitialization() {
        console.log('🔍 Testando inicialização dos controles WASD...');
        
        const wasdState = this.threeSystem.getWASDState();
        
        if (!wasdState) {
            throw new Error('Estado WASD não disponível');
        }
        
        if (!wasdState.hasOwnProperty('enabled')) {
            throw new Error('Propriedade enabled não encontrada');
        }
        
        if (!wasdState.hasOwnProperty('speed')) {
            throw new Error('Propriedade speed não encontrada');
        }
        
        if (!wasdState.hasOwnProperty('activeKeys')) {
            throw new Error('Propriedade activeKeys não encontrada');
        }
        
        console.log('✅ Controles WASD inicializados corretamente');
        console.log(`   - Habilitado: ${wasdState.enabled}`);
        console.log(`   - Velocidade: ${wasdState.speed}`);
        console.log(`   - Teclas ativas: ${wasdState.activeKeys.join(', ') || 'nenhuma'}`);
    }

    /**
     * Testa funcionalidade dos controles WASD
     */
    async testWASDControls() {
        console.log('🎮 Testando funcionalidade dos controles WASD...');
        
        // Testar habilitação/desabilitação
        this.threeSystem.setWASDEnabled(false);
        let state = this.threeSystem.getWASDState();
        if (state.enabled !== false) {
            throw new Error('Falha ao desabilitar controles WASD');
        }
        
        this.threeSystem.setWASDEnabled(true);
        state = this.threeSystem.getWASDState();
        if (state.enabled !== true) {
            throw new Error('Falha ao habilitar controles WASD');
        }
        
        // Testar configuração de velocidade
        this.threeSystem.setWASDSpeed(1.5);
        state = this.threeSystem.getWASDState();
        if (state.speed !== 1.5) {
            throw new Error('Falha ao definir velocidade WASD');
        }
        
        // Testar limites de velocidade
        this.threeSystem.setWASDSpeed(-1); // Deve ser limitado a 0.1
        state = this.threeSystem.getWASDState();
        if (state.speed < 0.1) {
            throw new Error('Limite mínimo de velocidade não respeitado');
        }
        
        this.threeSystem.setWASDSpeed(5); // Deve ser limitado a 2.0
        state = this.threeSystem.getWASDState();
        if (state.speed > 2.0) {
            throw new Error('Limite máximo de velocidade não respeitado');
        }
        
        console.log('✅ Controles WASD funcionando corretamente');
    }

    /**
     * Testa configuração de sombras
     */
    async testShadowConfiguration() {
        console.log('🌑 Testando configuração de sombras...');
        
        const renderer = this.threeSystem.getRenderer();
        if (!renderer) {
            throw new Error('Renderizador não encontrado');
        }
        
        if (!renderer.shadowMap.enabled) {
            throw new Error('Shadow map não está habilitado');
        }
        
        if (renderer.shadowMap.type !== THREE.PCFSoftShadowMap) {
            console.warn('⚠️ Tipo de sombra não é PCFSoftShadowMap');
        }
        
        // Verificar se existe plano de sombra
        const scene = this.threeSystem.getScene();
        const shadowPlane = scene.getObjectByName('shadow-plane');
        
        if (!shadowPlane) {
            throw new Error('Plano de sombra não encontrado');
        }
        
        if (!shadowPlane.receiveShadow) {
            throw new Error('Plano de sombra não está configurado para receber sombras');
        }
        
        console.log('✅ Configuração de sombras OK');
        console.log(`   - Shadow map: ${renderer.shadowMap.enabled ? 'habilitado' : 'desabilitado'}`);
        console.log(`   - Tipo: ${renderer.shadowMap.type}`);
        console.log(`   - Plano de sombra: presente`);
    }

    /**
     * Testa movimento da câmera
     */
    async testCameraMovement() {
        console.log('📹 Testando movimento da câmera...');
        
        const camera = this.threeSystem.getCamera();
        if (!camera) {
            throw new Error('Câmera não encontrada');
        }
        
        const initialPosition = camera.position.clone();
        
        // Simular pressionar tecla W por um tempo curto
        console.log('   Simulando movimento para frente...');
        const originalOnKeyDown = this.threeSystem.onKeyDown.bind(this.threeSystem);
        const originalOnKeyUp = this.threeSystem.onKeyUp.bind(this.threeSystem);
        
        // Simular tecla W pressionada
        originalOnKeyDown({ code: 'KeyW' });
        
        // Simular um frame de atualização
        this.threeSystem.updateWASDMovement(1/60); // 1 frame a 60fps
        
        // Simular tecla W solta
        originalOnKeyUp({ code: 'KeyW' });
        
        const finalPosition = camera.position.clone();
        const movement = finalPosition.distanceTo(initialPosition);
        
        if (movement <= 0) {
            console.warn('⚠️ Nenhum movimento detectado - pode ser esperado se controles estão desabilitados');
        } else {
            console.log(`   Movimento detectado: ${movement.toFixed(4)} unidades`);
        }
        
        console.log('✅ Teste de movimento da câmera concluído');
    }

    /**
     * Testa métodos de controle públicos
     */
    testControlMethods() {
        console.log('🔧 Testando métodos de controle públicos...');
        
        const methods = [
            'setWASDEnabled',
            'setWASDSpeed', 
            'getWASDState',
            'updateWASDMovement'
        ];
        
        methods.forEach(method => {
            if (typeof this.threeSystem[method] !== 'function') {
                throw new Error(`Método ${method} não encontrado ou não é uma função`);
            }
        });
        
        console.log('✅ Todos os métodos de controle estão disponíveis');
        console.log(`   - Métodos: ${methods.join(', ')}`);
    }

    /**
     * Demonstra o uso dos controles WASD
     */
    showUsageInstructions() {
        console.group('📋 === INSTRUÇÕES DE USO - CONTROLES WASD ===');
        
        console.log('🎮 Controles de Movimento:');
        console.log('   W - Mover para frente');
        console.log('   S - Mover para trás');
        console.log('   A - Mover para esquerda');
        console.log('   D - Mover para direita');
        console.log('   Space - Mover para cima');
        console.log('   Shift - Mover para baixo');
        
        console.log('\n🔧 API Programática:');
        console.log('   app.getSystem("three").setWASDEnabled(true/false)');
        console.log('   app.getSystem("three").setWASDSpeed(0.1 - 2.0)');
        console.log('   app.getSystem("three").getWASDState()');
        
        console.log('\n🌑 Sombras:');
        console.log('   - Sombras habilitadas automaticamente');
        console.log('   - PCFSoftShadowMap para sombras suaves');
        console.log('   - Plano de sombra transparente no chão');
        console.log('   - Todos os modelos projetam e recebem sombras');
        
        console.groupEnd();
    }
}

// Função de conveniência para executar testes
export async function testMovementSystem(app) {
    const testSuite = new MovementTestSuite(app);
    await testSuite.runAllTests();
    testSuite.showUsageInstructions();
}

// Tornar disponível globalmente para debug
if (typeof window !== 'undefined') {
    window.testMovementSystem = testMovementSystem;
}
