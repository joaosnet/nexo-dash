/**
 * NexoDashApp - Classe principal da aplicação
 * Gerencia o ciclo de vida e coordena todos os sistemas
 */
export class NexoDashApp {
    constructor() {
        this.state = {
            currentModule: 0,
            isInitialized: false,
            scene: null,
            camera: null,
            renderer: null,
            controls: null,
            animationId: null,
            drTuring: null,
            drTuringMixer: null,
            drTuringAnimations: null,
            drTuringLighting: null,
            drTuringSpeech3D: null,
            lastTime: 0,
            cameraOrbit: null
        };

        this.systems = new Map();
        this.moduleSystem = null;
        this.config = {
            debug: false,
            maxRetries: 5, // Reduzido de 10 para 5
            loadingTimeout: 3000 // Reduzido de 8000ms para 3000ms
        };
    }

    /**
     * Inicializa a aplicação
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            console.log('🚀 Inicializando Nexo Dash...');
            
            // Verificar dependências primeiro
            await this.checkDependencies();
            
            // Inicializar apenas sistemas essenciais primeiro
            await this.initializeCoreSystemsOnly();
            
            // Marcar como inicializado
            this.state.isInitialized = true;
            
            console.log('✅ Nexo Dash inicializado com sucesso!');
            
            // Inicializar sistemas adicionais em background
            this.initializeAdditionalSystems();
            
        } catch (error) {
            console.error('❌ Erro durante inicialização:', error);
            throw error;
        }
    }

    /**
     * Verifica se todas as dependências estão carregadas
     * @returns {Promise<boolean>}
     */
    async checkDependencies() {
        const dependencies = {
            THREE: () => typeof THREE !== 'undefined',
            GLTFLoader: () => typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined',
            FBXLoader: () => typeof THREE !== 'undefined' && typeof THREE.FBXLoader !== 'undefined',
            OrbitControls: () => typeof THREE !== 'undefined' && typeof THREE.OrbitControls !== 'undefined',
            fflate: () => typeof fflate !== 'undefined'
        };

        let retryCount = 0;
        const maxRetries = this.config.maxRetries;

        while (retryCount < maxRetries) {
            const results = {};
            let allLoaded = true;

            for (const [name, checker] of Object.entries(dependencies)) {
                results[name] = checker();
                if (!results[name] && name === 'THREE') {
                    allLoaded = false;
                    break;
                }
            }

            if (allLoaded || results.THREE) {
                console.log('✅ Dependências verificadas:', results);
                return true;
            }

            console.log(`⏳ Aguardando dependências (${retryCount + 1}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, 150)); // Reduzido de 300ms para 150ms
            retryCount++;
        }

        throw new Error('Dependências não carregadas após ' + maxRetries + ' tentativas');
    }

    /**
     * Inicializa apenas sistemas essenciais para carregamento rápido
     * @returns {Promise<void>}
     */
    async initializeCoreSystemsOnly() {
        const loadingSystem = this.systems.get('loading');
        
        if (loadingSystem) {
            loadingSystem.updateProgress(1, 'Inicializando sistemas essenciais...');
            await loadingSystem.initialize();
        }

        const threeSystem = this.systems.get('three');
        if (threeSystem) {
            loadingSystem.updateProgress(2, 'Configurando renderização...');
            await threeSystem.initializeFast(); // Método otimizado
        }

        const uiSystem = this.systems.get('ui');
        if (uiSystem) {
            loadingSystem.updateProgress(3, 'Configurando interface...');
            await uiSystem.initialize();
        }

        loadingSystem.updateProgress(4, 'Sistemas essenciais carregados!');
    }

    /**
     * Inicializa sistemas adicionais em background
     */
    async initializeAdditionalSystems() {
        try {
            // Aguardar um pouco para não bloquear a UI
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const moduleSystem = this.systems.get('module');
            if (moduleSystem) {
                console.log('🔧 Inicializando sistema de módulos em background...');
                await moduleSystem.initialize();
            }

            // Completar inicialização do ThreeJS (modelos 3D, etc.)
            const threeSystem = this.systems.get('three');
            if (threeSystem && threeSystem.completeInitialization) {
                console.log('🎬 Completando inicialização 3D em background...');
                await threeSystem.completeInitialization();
            }

            console.log('✅ Sistemas adicionais inicializados');
            
        } catch (error) {
            console.warn('⚠️ Erro ao inicializar sistemas adicionais:', error);
        }
    }

    /**
     * Registra todos os sistemas da aplicação
     * @returns {Promise<void>}
     */
    async registerSystems() {
        const { LoadingSystem } = await import('../systems/LoadingSystem.js');
        const { ThreeJSSystem } = await import('../systems/ThreeJSSystem.js');
        const { UISystem } = await import('../systems/UISystem.js');
        const { ModuleSystem } = await import('../systems/ModuleSystem.js');

        this.systems.set('loading', new LoadingSystem(this));
        this.systems.set('three', new ThreeJSSystem(this));
        this.systems.set('ui', new UISystem(this));
        this.systems.set('modules', new ModuleSystem(this));
        
        // Referência rápida para o sistema de módulos
        this.moduleSystem = this.systems.get('modules');
    }

    /**
     * Registra um sistema individual
     * @param {string} name - Nome do sistema
     * @param {Object} system - Instância do sistema
     */
    registerSystem(name, system) {
        if (!system) {
            throw new Error(`Sistema ${name} não pode ser null ou undefined`);
        }
        
        this.systems.set(name, system);
        console.log(`✅ Sistema registrado: ${name}`);
        
        // Atualizar referência rápida se for o sistema de módulos
        if (name === 'module' || name === 'modules') {
            this.moduleSystem = system;
        }
    }

    /**
     * Inicializa todos os sistemas registrados
     * @returns {Promise<void>}
     */
    async initializeSystems() {
        const loadingSystem = this.systems.get('loading');
        
        loadingSystem.updateProgress(0, 'Inicializando sistemas...');

        // Inicializar sistemas em ordem
        const systemOrder = ['loading', 'three', 'ui', 'modules'];
        
        for (let i = 0; i < systemOrder.length; i++) {
            const systemName = systemOrder[i];
            const system = this.systems.get(systemName);
            
            if (system && typeof system.initialize === 'function') {
                console.log(`Inicializando sistema: ${systemName}`);
                loadingSystem.updateProgress(i + 1, `Inicializando ${systemName}...`);
                await system.initialize();
            }
        }

        loadingSystem.updateProgress(systemOrder.length, 'Inicialização completa!');
    }

    /**
     * Obtém um sistema específico
     * @param {string} name - Nome do sistema
     * @returns {Object|null}
     */
    getSystem(name) {
        return this.systems.get(name) || null;
    }

    /**
     * Obtém o estado atual da aplicação
     * @returns {Object}
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Atualiza o estado da aplicação
     * @param {Object} newState - Novo estado
     */
    setState(newState) {
        Object.assign(this.state, newState);
    }

    /**
     * Inicia o primeiro módulo
     */
    startFirstModule() {
        if (this.moduleSystem) {
            this.moduleSystem.startFirstModule();
        }
    }

    /**
     * Função para limpeza de recursos
     */
    dispose() {
        if (this.state.animationId) {
            cancelAnimationFrame(this.state.animationId);
        }

        // Limpar todos os sistemas
        for (const [name, system] of this.systems) {
            if (system && typeof system.dispose === 'function') {
                console.log(`Limpando sistema: ${name}`);
                system.dispose();
            }
        }

        this.systems.clear();
        console.log('🧹 Recursos da aplicação limpos');
    }
}
