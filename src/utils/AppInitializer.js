/**
 * AppInitializer - Gerenciador de inicialização da aplicação
 */
import { NexoDashApp } from '../core/NexoDashApp.js';
import { LoadingSystem } from '../systems/LoadingSystem.js';
import { ThreeJSSystem } from '../systems/ThreeJSSystem.js';
import { UISystem } from '../systems/UISystem.js';
import { ModuleSystem } from '../systems/ModuleSystem.js';
import { VoiceSystem } from './VoiceSystem.js';
import { LoadingUtils } from './LoadingUtils.js';

export class AppInitializer {
    constructor() {
        this.loadingUtils = new LoadingUtils();
        // Criar VoiceSystem com app temporário (será atualizado posteriormente)
        this.voiceSystem = new VoiceSystem({ getSystem: () => null });
        
        // Expor VoiceSystem globalmente para integração
        window.voiceSystem = this.voiceSystem;
        
        this.setupGlobalFunctions();
        this.setupEventHandlers();
        this.setupDebugMode();
    }

    setupGlobalFunctions() {
        window.app = null;
        window.nextStep = () => {
            const moduleSystem = window.app?.getSystem('module');
            if (moduleSystem?.nextStep) {
                moduleSystem.nextStep();
            } else {
                console.log('ModuleSystem não disponível ainda');
            }
        };
    }

    setupEventHandlers() {
        // Inicialização
        window.addEventListener('load', () => this.initialize());
        
        // Limpeza
        window.addEventListener('beforeunload', () => {
            if (window.app) {
                console.log('🧹 Limpando recursos...');
                window.app.dispose();
            }
        });

        // Tratamento de erros
        window.addEventListener('error', (event) => {
            console.error('❌ Erro global:', event.error);
            this.loadingUtils.showError('Erro inesperado. Verifique o console.');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('❌ Promise rejeitada:', event.reason);
            this.loadingUtils.showError('Erro interno. Verifique o console.');
        });
    }

    async initialize() {
        console.log('📄 Inicializando aplicação...');
        this.loadingUtils.updateStatus('Verificando dependências...');
        this.loadingUtils.updateProgress(10);

        // Timeout de segurança
        const timeout = setTimeout(() => {
            console.warn('⏰ Timeout atingido, tentando continuar...');
            this.loadingUtils.updateStatus('Timeout - tentando continuar...');
            this.loadingUtils.updateProgress(50);
            
            if (window.THREE) {
                this.initializeApplication();
            } else {
                this.loadingUtils.showError('Dependências críticas não carregaram.');
            }
        }, 10000);

        // Verificar dependências
        setTimeout(() => {
            clearTimeout(timeout);
            if (this.loadingUtils.checkDependencies()) {
                this.initializeApplication();
            }
        }, 100);
    }

    async initializeApplication() {
        try {
            console.log('🚀 Inicializando Nexo Dash...');
            this.loadingUtils.updateStatus('Inicializando aplicação...');
            this.loadingUtils.updateProgress(70);

            // Criar e configurar aplicação
            window.app = new NexoDashApp();

            // Atualizar referência do app no VoiceSystem
            this.voiceSystem.app = window.app;
            
            const systems = [
                ['loading', new LoadingSystem(window.app)],
                ['three', new ThreeJSSystem(window.app)],
                ['ui', new UISystem(window.app)],
                ['module', new ModuleSystem(window.app)]
            ];

            systems.forEach(([name, system]) => {
                window.app.registerSystem(name, system);
            });

            this.loadingUtils.updateStatus('Sistemas registrados...');
            this.loadingUtils.updateProgress(85);

            await window.app.initialize();

            this.loadingUtils.updateStatus('Finalizando...');
            this.loadingUtils.updateProgress(95);

            this.loadingUtils.hideLoadingScreen();
            console.log('✅ Nexo Dash inicializado com sucesso!');

        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            this.loadingUtils.showError('Erro ao inicializar. Verifique o console.');
        }
    }

    setupDebugMode() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.debug = {
                getApp: () => window.app,
                getSystem: (name) => window.app?.getSystem(name),
                checkSystems: () => {
                    if (!window.app) {
                        console.log('App não inicializado');
                        return;
                    }
                    ['loading', 'three', 'ui', 'module'].forEach(name => {
                        const system = window.app.getSystem(name);
                        console.log(`${name}: ${system ? '✅' : '❌'}`);
                    });
                },
                testSpeech: (text = 'Teste do laboratório virtual Nexo Dash.') => {
                    console.log('🔊 Testando voz...');
                    this.voiceSystem.speakText(text, 'pt-BR', 1.0, 1.1);
                },
                testDrTuring: (text = 'Testando Dra. Ana Turing!') => {
                    const threeSystem = window.app?.getSystem('three');
                    const drTuring = threeSystem?.getDrTuringManager?.();
                    if (drTuring?.speak3D) {
                        drTuring.speak3D(text, 7000);
                    } else {
                        console.error('Dra. Turing não disponível');
                    }
                },
                forceStartModule: () => {
                    const moduleSystem = window.app?.getSystem('module');
                    if (moduleSystem?.startFirstModule) {
                        moduleSystem.startFirstModule();
                        console.log('🚀 Módulo iniciado');
                    } else {
                        console.error('Sistema de módulos não disponível');
                    }
                },
                checkUI: () => {
                    const uiSystem = window.app?.getSystem('ui');
                    if (uiSystem?.showPanel) {
                        console.log('✅ Sistema UI disponível');
                        uiSystem.showPanel(
                            'Teste Manual',
                            '<p>Teste do sistema UI.</p>',
                            [{ label: 'Fechar', callback: () => uiSystem.hidePanel() }]
                        );
                    } else {
                        console.error('❌ Sistema UI não disponível');
                    }
                }
            };
            
            console.log('🔧 Debug ativo. Comandos: window.debug.*');
            console.log('🔊 testSpeech() | 👩‍🔬 testDrTuring() | 🚀 forceStartModule() | 🖥️ checkUI()');
        }
    }
}
