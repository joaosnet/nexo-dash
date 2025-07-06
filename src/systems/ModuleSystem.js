/**
 * ModuleSystem - Sistema de módulos educacionais
 * Gerencia a progressão através dos módulos de aprendizado
 */
export class ModuleSystem {
    constructor(app) {
        this.app = app;
        this.currentStep = 0;
        this.modules = [];
    this.moduleDefinitions = null;
        this.modules = [];
    
    }

    /**
     * Inicializa o sistema de módulos
     * @returns {Promise<void>}
     */
    async initialize() {
        // Carregar definições dos módulos
        const { ModuleDefinitions } = await import('../data/ModuleDefinitions.js');
        this.moduleDefinitions = ModuleDefinitions;
        this.modules = ModuleDefinitions.modules;
        
        console.log(`✅ Sistema de módulos inicializado com ${this.modules.length} módulos`);
        
        // Iniciar demonstração automática após 3 segundos
        setTimeout(() => {
            this.startDemo();
        }, 3000);
    }

    /**
     * Inicia o primeiro módulo
     */
    startFirstModule() {
        console.log('🚀 Iniciando primeiro módulo...');
        const appState = this.app.getState();
        console.log('📊 Estado atual da app:', appState);
        this.app.setState({ currentModule: 0 });
        this.currentStep = 0;
        console.log('🎯 Chamando showCurrentStep...');
        this.showCurrentStep();
        console.log('✅ Primeiro módulo iniciado');
    }

    /**
     * Volta para o passo anterior
     */
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showCurrentStep();
        } else {
            // Se está no primeiro passo, voltar para o módulo anterior
            const appState = this.app.getState();
            if (appState.currentModule > 0) {
                const newModuleIndex = appState.currentModule - 1;
                this.app.setState({ currentModule: newModuleIndex });
                const previousModule = this.modules[newModuleIndex];
                this.currentStep = previousModule.steps.length - 1; // Último passo do módulo anterior
                this.showCurrentStep();
            }
        }
    }

    /**
     * Avança para o próximo passo
     */
    nextStep() {
        this.currentStep++;
        const appState = this.app.getState();
        const currentModule = this.modules[appState.currentModule];
        
        if (this.currentStep < currentModule.steps.length) {
            this.showCurrentStep();
        } else {
            this.nextModule();
        }
    }

    /**
     * Avança para o próximo módulo
     */
    nextModule() {
        const appState = this.app.getState();
        const newModuleIndex = appState.currentModule + 1;
        
        this.app.setState({ currentModule: newModuleIndex });
        this.currentStep = 0;
        
        if (newModuleIndex < this.modules.length) {
            this.showCurrentStep();
            this.onModuleChange(newModuleIndex);
        } else {
            this.showCompletion();
        }
    }

    /**
     * Exibe o passo atual
     */
    showCurrentStep() {
        console.log('📖 showCurrentStep chamado');
        const appState = this.app.getState();
        console.log('📊 Estado atual:', appState);
        const currentModule = this.modules[appState.currentModule];
        console.log('📚 Módulo atual:', currentModule);
        const currentStep = currentModule.steps[this.currentStep];
        console.log('📋 Passo atual:', currentStep);
        
        if (!currentStep) {
            console.error('❌ Passo não encontrado:', this.currentStep);
            return;
        }

        const uiSystem = this.app.getSystem('ui');
        console.log('🖥️ Sistema UI:', uiSystem);
        if (uiSystem) {
            // Processar ações dos botões para incluir contexto do ModuleSystem
            const processedActions = this.processStepActions(currentStep.actions || []);
            console.log('🔘 Ações processadas:', processedActions);
            
            console.log('🖼️ Tentando mostrar painel...');
            uiSystem.showPanel(
                currentStep.title,
                currentStep.content,
                processedActions
            );
            console.log('✅ Painel solicitado');
        } else {
            console.error('❌ Sistema UI não disponível');
        }

        console.log(`📖 Exibindo: Módulo ${appState.currentModule}, Passo ${this.currentStep}`);
    }

    /**
     * Processa as ações dos botões, adicionando contexto necessário
     * @param {Array} actions - Array de ações
     * @returns {Array} - Array de ações processadas
     */
    processStepActions(actions) {
        // Se não há ações definidas, criar uma ação padrão de "Próximo"
        if (!actions || actions.length === 0) {
            return [
                {
                    label: 'Próximo',
                    callback: () => this.nextStep()
                }
            ];
        }

        return actions.map(action => ({
            label: action.label,
            callback: () => {
                try {
                    if (typeof action.callback === 'function') {
                        // Chamar a função original com contexto do module system como 'this'
                        action.callback.call(this);
                    } else if (typeof action.callback === 'string') {
                        // Executar método do ModuleSystem se for uma string
                        if (typeof this[action.callback] === 'function') {
                            this[action.callback]();
                        } else {
                            console.error('❌ Método não encontrado:', action.callback);
                            // Fallback: avançar para próximo passo
                            this.nextStep();
                        }
                    } else {
                        // Fallback: avançar para próximo passo
                        this.nextStep();
                    }
                } catch (error) {
                    console.error('❌ Erro ao executar ação do botão:', error);
                    // Fallback: avançar para próximo passo
                    this.nextStep();
                }
            }
        }));
    }

    /**
     * Chamado quando há mudança de módulo
     * @param {number} moduleIndex - Índice do novo módulo
     */
    onModuleChange(moduleIndex) {
        const currentModule = this.modules[moduleIndex];
        
        // Notificar outros sistemas sobre mudança de módulo
        this.notifyModuleChange(currentModule);
        
        // Executar efeitos especiais baseados no módulo
        this.executeModuleEffects(moduleIndex, currentModule);
        
        console.log(`🔄 Módulo alterado para: ${currentModule.title}`);
    }

    /**
     * Notifica outros sistemas sobre a mudança de módulo
     * @param {Object} module - Dados do módulo atual
     */
    notifyModuleChange(module) {
        // Notificar sistema Three.js
        const threeSystem = this.app.getSystem('three');
        if (threeSystem && threeSystem.drTuringManager) {
            threeSystem.drTuringManager.onModuleChange(module);
        }

        // Notificar sistema de UI
        const uiSystem = this.app.getSystem('ui');
        if (uiSystem) {
            uiSystem.showNotification(
                `Iniciando: ${module.title}`,
                'info',
                3000
            );
        }
    }

    /**
     * Executa efeitos especiais baseados no módulo
     * @param {number} moduleIndex - Índice do módulo
     * @param {Object} module - Dados do módulo
     */
    executeModuleEffects(moduleIndex, module) {
        switch (moduleIndex) {
            case 1: // Módulo 1: Blueprint do Projeto
                this.executeBlueprint3DEffects();
                break;
            case 2: // Módulo 2: Núcleo do Servidor
                this.executeServerCoreEffects();
                break;
            default:
                // Efeitos padrão
                this.executeDefaultModuleEffects();
        }
    }

    /**
     * Executa efeitos do módulo Blueprint 3D
     */
    executeBlueprint3DEffects() {
        console.log('🎯 Executando efeitos do blueprint 3D...');
        
        const threeSystem = this.app.getSystem('three');
        if (threeSystem && threeSystem.environmentManager) {
            console.log('✅ Carregando blueprint automaticamente...');
            
            // Carregar modelos básicos primeiro, depois blueprint
            setTimeout(async () => {
                // Carregar servidor primeiro (modelo básico)
                await threeSystem.environmentManager.loadBasicLabModels();
                
                // Depois carregar blueprint 3D
                threeSystem.environmentManager.createProjectStructure();
                
                // Focar câmera após criação
                setTimeout(() => {
                    threeSystem.environmentManager.focusCameraOnBlueprint();
                }, 1000);
            }, 500);
        } else {
            console.error('❌ Sistema Three.js ou EnvironmentManager não disponível para blueprint');
        }
    }

    /**
     * Executa efeitos do módulo Server Core
     */
    executeServerCoreEffects() {
        console.log('🔧 Executando efeitos do núcleo do servidor...');
        
        // Carregar modelos avançados do laboratório no módulo 2
        const threeSystem = this.app.getSystem('three');
        if (threeSystem && threeSystem.environmentManager) {
            console.log('🚀 Carregando modelos avançados do laboratório...');
            
            setTimeout(async () => {
                await threeSystem.environmentManager.loadAdvancedLabModels();
                console.log('✅ Modelos avançados carregados com sucesso!');
            }, 1000);
        }
    }

    /**
     * Executa efeitos padrão de módulo
     */
    executeDefaultModuleEffects() {
        console.log('✨ Executando efeitos padrão do módulo...');
    }

    /**
     * Carrega o blueprint 3D (método público para callbacks)
     */
    load3DBlueprint() {
        console.log('🗂️ Carregando blueprint 3D...');
        
        const threeSystem = this.app.getSystem('three');
        if (threeSystem && threeSystem.environmentManager) {
            console.log('✅ Sistema Three.js encontrado, carregando blueprint...');
            
            // Carregar modelos básicos primeiro, depois blueprint
            setTimeout(async () => {
                // Carregar servidor primeiro (modelo básico)
                await threeSystem.environmentManager.loadBasicLabModels();
                
                // Criar a estrutura do projeto 3D
                threeSystem.environmentManager.createProjectStructure();
                
                // Focar câmera no blueprint após um pequeno delay
                setTimeout(() => {
                    threeSystem.environmentManager.focusCameraOnBlueprint();
                    console.log('📷 Blueprint 3D carregado e câmera posicionada');
                }, 500);
                
                // Avançar para o próximo passo
                setTimeout(() => {
                    this.nextStep();
                }, 3000);
            }, 500);
        } else {
            console.error('❌ Sistema Three.js ou EnvironmentManager não encontrado');
        }
    }

    /**
     * Método para compatibilidade com o index.html original
     */
    loadProjectBlueprint() {
        return this.load3DBlueprint();
    }

    /**
     * Exibe módulos futuros
     */
    showUpcomingModules() {
        const uiSystem = this.app.getSystem('ui');
        if (!uiSystem) return;

        const upcomingContent = this.generateUpcomingModulesContent();
        
        uiSystem.showPanel(
            'Próximos Módulos',
            upcomingContent,
            [
                { 
                    label: 'Explorar Ambiente', 
                    callback: () => uiSystem.hidePanel() 
                },
                { 
                    label: 'Começar Módulo 2', 
                    callback: () => this.showComingSoon() 
                }
            ]
        );
    }

    /**
     * Gera conteúdo HTML para módulos futuros
     * @returns {string}
     */
    generateUpcomingModulesContent() {
        const appState = this.app.getState();
        const currentModuleIndex = appState.currentModule;
        
        let content = `
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                <p><strong>Jornada de Desenvolvimento</strong></p>
            </div>
            <p>Aqui estão os próximos módulos que implementaremos:</p>
            <ul>
        `;

        // Listar módulos futuros
        for (let i = currentModuleIndex + 1; i < this.modules.length; i++) {
            const module = this.modules[i];
            content += `<li><strong>Módulo ${i}:</strong> ${module.title}</li>`;
        }

        content += `
            </ul>
            <div style="background: rgba(0,255,136,0.1); padding: 1rem; border-radius: 5px; margin-top: 1rem;">
                <p><em>🎯 Cada módulo adiciona uma nova funcionalidade ao dashboard e uma nova peça à arquitetura 3D!</em></p>
            </div>
        `;

        return content;
    }

    /**
     * Exibe mensagem de "em breve"
     */
    showComingSoon() {
        const uiSystem = this.app.getSystem('ui');
        if (!uiSystem) return;

        uiSystem.showPanel(
            'Em Desenvolvimento',
            `
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
                    <p><strong>Módulos Futuros em Desenvolvimento</strong></p>
                    <p>Os próximos módulos estão sendo preparados e estarão disponíveis em breve!</p>
                    <p>Por enquanto, explore o ambiente 3D e familiarize-se com a estrutura do projeto.</p>
                </div>
            `,
            [
                { 
                    label: 'Fechar', 
                    callback: () => uiSystem.hidePanel() 
                }
            ]
        );
    }

    /**
     * Exibe tela de conclusão
     */
    showCompletion() {
        const uiSystem = this.app.getSystem('ui');
        if (!uiSystem) return;

        uiSystem.showPanel(
            'Parabéns! 🎉',
            `
                <div style="text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
                    <p><strong>Você completou todos os módulos disponíveis!</strong></p>
                    <p>Continue explorando o ambiente 3D e praticando os conceitos aprendidos.</p>
                </div>
            `,
            [
                { 
                    label: 'Explorar Ambiente', 
                    callback: () => uiSystem.hidePanel() 
                },
                { 
                    label: 'Recomeçar', 
                    callback: () => this.startFirstModule() 
                }
            ]
        );
    }

    /**
     * Obtém o módulo atual
     * @returns {Object|null}
     */
    getCurrentModule() {
        const appState = this.app.getState();
        return this.modules[appState.currentModule] || null;
    }

    /**
     * Obtém o passo atual
     * @returns {Object|null}
     */
    getCurrentStep() {
        const currentModule = this.getCurrentModule();
        return currentModule ? currentModule.steps[this.currentStep] || null : null;
    }

    /**
     * Obtém informações sobre o progresso
     * @returns {Object}
     */
    getProgress() {
        const appState = this.app.getState();
        const currentModule = this.getCurrentModule();
        
        return {
            moduleIndex: appState.currentModule,
            stepIndex: this.currentStep,
            totalModules: this.modules.length,
            totalSteps: currentModule ? currentModule.steps.length : 0,
            moduleProgress: currentModule ? ((this.currentStep + 1) / currentModule.steps.length) * 100 : 0,
            overallProgress: ((appState.currentModule + (this.currentStep + 1) / (currentModule ? currentModule.steps.length : 1)) / this.modules.length) * 100
        };
    }

    /**
     * Inicia demonstração automática da aplicação
     */
    startDemo() {
        const uiSystem = this.app.getSystem('ui');
        const threeSystem = this.app.getSystem('three');
        
        // Sistema iniciado silenciosamente - apenas logs para debug
        console.log('🎭 Sistema de módulos iniciado');
        
        // Iniciar primeiro módulo automaticamente
        setTimeout(() => {
            this.startFirstModule();
        }, 2000);
        
        console.log('🎭 Demonstração iniciada - aplicação totalmente funcional!');
    }

    /**
     * Limpa recursos do sistema
     */
    dispose() {
        this.modules = [];
        this.moduleDefinitions = null;
        this.currentStep = 0;
        console.log('🧹 Sistema de módulos limpo');
    }
}
