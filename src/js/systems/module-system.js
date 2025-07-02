/* 
 * Nexo Dash - Sistema de Módulos
 * Gerencia a progressão dos módulos educacionais
 */

const ModuleSystem = {
    currentStep: 0,
    
    /**
     * Definição dos módulos do curso
     */
    modules: [
        {
            title: 'Módulo 0: Calibração da Estação',
            steps: [
                {
                    title: 'Bem-vindo ao Nexo Dash',
                    content: `
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🧬</div>
                            <p><strong>Bem-vindo ao Laboratório Virtual Nexo Dash!</strong></p>
                        </div>
                        <p>Eu sou a <strong>Dra. Ana Turing</strong>, sua mentora nesta jornada de aprendizado.</p>
                        <p>Você foi recrutado para uma missão importante: analisar fatores de risco de doenças cardíacas usando um dataset real do Kaggle.</p>
                        <p><strong>Sua missão:</strong> Construir um dashboard profissional usando Python, Dash e as melhores práticas da indústria.</p>
                        <p>Vamos começar calibrando sua estação de trabalho!</p>
                    `,
                    actions: [{ 
                        label: 'Aceitar Missão', 
                        callback: () => {
                            ThreeJSSystem.drTuringSpeak3D('Excelente! Você aceitou a missão. Agora vamos configurar seu ambiente de desenvolvimento profissional. Primeiro, precisamos instalar o VS Code, o editor de código mais usado na indústria.', 6000);
                            ModuleSystem.nextStep();
                        }
                    }]
                },
                {
                    title: 'Passo 1: Instalação do VS Code',
                    content: `
                        <div style="background: rgba(0,100,100,0.2); padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                            <h4>🔧 Configuração do Ambiente</h4>
                        </div>
                        <p><strong>Visual Studio Code</strong> é nosso editor principal. Se ainda não tem instalado:</p>
                        <ol>
                            <li>Acesse: <a href="https://code.visualstudio.com/" target="_blank" style="color: #00ccff;">https://code.visualstudio.com/</a></li>
                            <li>Baixe a versão para seu sistema operacional</li>
                            <li>Execute a instalação com as configurações padrão</li>
                            <li>Abra o VS Code após a instalação</li>
                        </ol>
                        <p><strong>Extensões recomendadas:</strong></p>
                        <ul>
                            <li><strong>Python (Microsoft)</strong>: Suporte completo para Python</li>
                            <li><strong>Ruff (Astral Software)</strong>: Linter e formatter super rápido</li>
                            <li><strong>Error Lens</strong>: Mostra erros diretamente no código</li>
                            <li><strong>Data Wrangler (Microsoft)</strong>: Visualização de dados CSV/Excel</li>
                        </ul>
                        <p><em>💡 Essas extensões transformarão seu VS Code numa IDE Python profissional!</em></p>
                    `,
                    actions: [
                        { 
                            label: 'VS Code Instalado', 
                            callback: () => {
                                ThreeJSSystem.drTuringSpeak3D('Perfeito! Com o VS Code instalado, agora vamos configurar o uv, o gerenciador de pacotes Python mais rápido e moderno da atualidade.', 5000);
                                ModuleSystem.nextStep();
                            }
                        },
                        { 
                            label: 'Já Tenho VS Code', 
                            callback: () => {
                                ThreeJSSystem.drTuringSpeak3D('Ótimo! Você já tem o VS Code. Agora vamos para o próximo passo: instalar o uv para gerenciar nossos pacotes Python.', 5000);
                                ModuleSystem.nextStep();
                            }
                        }
                    ]
                },
                {
                    title: 'Passo 2: Instalação do uv',
                    content: `
                        <div style="background: rgba(100,0,100,0.2); padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                            <h4>⚡ Gerenciador de Pacotes Moderno</h4>
                        </div>
                        <p><strong>uv</strong> é o gerenciador de pacotes Python mais rápido da atualidade (Astral).</p>
                        
                        <p><strong>Windows (PowerShell):</strong></p>
                        <div class="code-block">
                            <code>powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"</code>
                        </div>
                        
                        <p><strong>macOS/Linux:</strong></p>
                        <div class="code-block">
                            <code>curl -LsSf https://astral.sh/uv/install.sh | sh</code>
                        </div>
                        
                        <p><strong>Verificar instalação:</strong></p>
                        <div class="code-block">
                            <code>uv --version</code>
                        </div>
                        
                        <p><em>⚠️ Pode ser necessário reiniciar o terminal após a instalação.</em></p>
                    `,
                    actions: [
                        { 
                            label: 'uv Instalado', 
                            callback: () => {
                                ThreeJSSystem.drTuringSpeak3D('Excelente! O uv está instalado e pronto. Agora vamos criar a estrutura do nosso projeto de análise cardíaca usando as melhores práticas da indústria.', 5000);
                                ModuleSystem.nextStep();
                            }
                        }
                    ]
                },
                {
                    title: 'Passo 3: Criação do Projeto',
                    content: `
                        <div style="background: rgba(0,100,0,0.2); padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                            <h4>🏗️ Estrutura do Projeto</h4>
                        </div>
                        <p>Agora vamos criar a estrutura do nosso projeto de análise cardíaca:</p>
                        
                        <p><strong>1. Criar pasta do projeto:</strong></p>
                        <div class="code-block">
                            <code>mkdir dashboard-cardiaco<br>cd dashboard-cardiaco</code>
                        </div>
                        
                        <p><strong>2. Inicializar projeto com uv:</strong></p>
                        <div class="code-block">
                            <code>uv init</code>
                        </div>
                        
                        <p><strong>3. Abrir no VS Code:</strong></p>
                        <div class="code-block">
                            <code>code .</code>
                        </div>
                        
                        <p>✨ O comando <code>uv init</code> criará automaticamente o arquivo <code>pyproject.toml</code> que é o centro de controle do projeto!</p>
                    `,
                    actions: [
                        { 
                            label: 'Projeto Criado', 
                            callback: () => {
                                ThreeJSSystem.drTuringSpeak3D('Fantástico! A estrutura do projeto está criada. Agora vamos instalar as bibliotecas essenciais para construir nosso dashboard de análise cardíaca.', 5000);
                                ModuleSystem.nextStep();
                            }
                        }
                    ]
                },
                {
                    title: 'Passo 4: Instalação de Dependências',
                    content: `
                        <div style="background: rgba(100,100,0,0.2); padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                            <h4>📦 Bibliotecas Essenciais</h4>
                        </div>
                        <p>Vamos instalar as bibliotecas que usaremos no dashboard:</p>
                        
                        <div class="code-block">
                            <code>uv add dash dash-mantine-components dash-chart-editor pandas plotly</code>
                        </div>
                        
                        <p><strong>O que cada biblioteca faz:</strong></p>
                        <ul>
                            <li><strong>dash</strong>: Framework principal para dashboards web</li>
                            <li><strong>dash-mantine-components</strong>: Componentes UI modernos</li>
                            <li><strong>dash-chart-editor</strong>: Editor visual de gráficos</li>
                            <li><strong>pandas</strong>: Manipulação e análise de dados</li>
                            <li><strong>plotly</strong>: Criação de gráficos interativos</li>
                        </ul>
                        
                        <p>🚀 O uv resolverá automaticamente todas as dependências e criará um ambiente virtual!</p>
                    `,
                    actions: [
                        { 
                            label: 'Dependências Instaladas', 
                            callback: () => {
                                ThreeJSSystem.drTuringSpeak3D('Perfeito! Todas as bibliotecas estão instaladas. Sua estação de trabalho está completamente calibrada e pronta para a missão! Agora vamos carregar o blueprint do projeto.', 6000);
                                ModuleSystem.nextStep();
                            }
                        }
                    ]
                },
                {
                    title: 'Calibração Completa!',
                    content: `
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                            <p><strong>Estação de Trabalho Calibrada!</strong></p>
                        </div>
                        <p>Excelente trabalho! Sua estação está configurada com:</p>
                        <ul>
                            <li>✅ VS Code configurado</li>
                            <li>✅ uv instalado e funcionando</li>
                            <li>✅ Projeto inicializado</li>
                            <li>✅ Dependências instaladas</li>
                        </ul>
                        
                        <p><strong>Próximo passo:</strong> Vamos carregar o blueprint do projeto e os dados que analisaremos!</p>
                        
                        <div style="background: rgba(0,255,136,0.1); padding: 1rem; border-radius: 5px; margin-top: 1rem;">
                            <p><em>💡 Dica: Mantenha o VS Code aberto com seu projeto. Usaremos ele nos próximos módulos!</em></p>
                        </div>
                    `,
                    actions: [
                        { 
                            label: 'Ir para Módulo 1', 
                            callback: () => {
                                ThreeJSSystem.drTuringSpeak3D('Excelente trabalho! Sua estação está calibrada. Agora vamos carregar o blueprint 3D do projeto e os dados que analisaremos. Prepare-se para ver a arquitetura ganhar vida!', 7000);
                                ModuleSystem.nextModule();
                            }
                        }
                    ]
                }
            ]
        },
        {
            title: 'Módulo 1: Blueprint do Projeto',
            steps: [
                {
                    title: 'Carregando Blueprint do Projeto',
                    content: `
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🗂️</div>
                            <p><strong>Arquitetura do Projeto</strong></p>
                        </div>
                        <p>Agora vou mostrar a estrutura profissional que seu projeto deve ter.</p>
                        <p>Observe a visualização 3D que aparecerá ao lado - cada pasta e arquivo tem sua função específica.</p>
                        <p><strong>Clique nos elementos 3D</strong> para ver suas descrições!</p>
                    `,
                    actions: [
                        { 
                            label: 'Carregar Blueprint', 
                            callback: () => {
                                ThreeJSSystem.drTuringSpeak3D('Iniciando carregamento do blueprint 3D! Observe como a arquitetura do projeto se materializa no laboratório virtual. Cada componente tem uma função específica.', 6000);
                                ModuleSystem.load3DBlueprint();
                            }
                        }
                    ]
                }
            ]
        }
    ],

    /**
     * Avança para o próximo módulo
     */
    nextModule() {
        AppState.currentModule++;
        this.currentStep = 0;
        if (AppState.currentModule < this.modules.length) {
            this.showCurrentStep();
        } else {
            this.showUpcomingModules();
        }
        AppState.log(`Advanced to module ${AppState.currentModule}`);
    },

    /**
     * Avança para o próximo passo
     */
    nextStep() {
        this.currentStep++;
        const currentModule = this.modules[AppState.currentModule];
        if (this.currentStep < currentModule.steps.length) {
            this.showCurrentStep();
        } else {
            this.nextModule();
        }
        AppState.log(`Advanced to step ${this.currentStep}`);
    },

    /**
     * Mostra o passo atual
     */
    showCurrentStep() {
        const currentModule = this.modules[AppState.currentModule];
        const currentStep = currentModule.steps[this.currentStep];
        
        if (currentStep) {
            UISystem.showPanel(currentStep.title, currentStep.content, currentStep.actions);
            AppState.log(`Showing step: ${currentStep.title}`);
        }
    },

    /**
     * Inicia o primeiro módulo
     */
    startFirstModule() {
        AppState.currentModule = 0;
        this.currentStep = 0;
        this.showCurrentStep();
        AppState.log('Started first module');
    },

    /**
     * Carrega o blueprint 3D
     */
    load3DBlueprint() {
        AppState.log('Loading 3D blueprint...');
        
        // Delegar para sistema de blueprint se existir
        if (typeof BlueprintSystem !== 'undefined') {
            BlueprintSystem.create3DProjectStructure();
        } else {
            // Fallback básico
            UISystem.showNotification('Blueprint 3D carregado!', 'success');
        }
        
        this.nextStep();
    },

    /**
     * Mostra módulos futuros
     */
    showUpcomingModules() {
        UISystem.showPanel(
            'Próximos Módulos',
            `
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                    <p><strong>Jornada de Desenvolvimento</strong></p>
                </div>
                <p>Aqui estão os próximos módulos que implementaremos:</p>
                <ul>
                    <li><strong>Módulo 2:</strong> Núcleo do Servidor (<code>app = Dash(__name__)</code>)</li>
                    <li><strong>Módulo 3:</strong> Estrutura do Layout (dash_html_components)</li>
                    <li><strong>Módulo 4:</strong> Primeira Visualização (dash_core_components + Plotly)</li>
                    <li><strong>Módulo 5:</strong> Interatividade (callbacks)</li>
                    <li><strong>Módulo 6:</strong> Melhorias com Mantine (dash-mantine-components)</li>
                    <li><strong>Módulo 7:</strong> Refinamento (dash-chart-editor)</li>
                    <li><strong>Projeto Final:</strong> Dashboard Completo</li>
                </ul>
                <div style="background: rgba(0,255,136,0.1); padding: 1rem; border-radius: 5px; margin-top: 1rem;">
                    <p><em>🎯 Cada módulo adiciona uma nova funcionalidade ao dashboard e uma nova peça à arquitetura 3D!</em></p>
                </div>
            `,
            [
                { 
                    label: 'Explorar Ambiente', 
                    callback: () => UISystem.hidePanel() 
                },
                { 
                    label: 'Começar Módulo 2', 
                    callback: () => this.showComingSoon() 
                }
            ]
        );
    },

    /**
     * Mostra mensagem de "em breve"
     */
    showComingSoon() {
        UISystem.showPanel(
            'Em Desenvolvimento',
            `
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
                    <p><strong>Módulos 2+ em Desenvolvimento</strong></p>
                    <p>Os próximos módulos estão sendo preparados e estarão disponíveis em breve!</p>
                    <p>Por enquanto, explore o ambiente 3D e familiarize-se com a estrutura do projeto.</p>
                </div>
            `,
            [
                { 
                    label: 'Fechar', 
                    callback: () => UISystem.hidePanel() 
                }
            ]
        );
    },

    /**
     * Obtém progresso atual
     */
    getProgress() {
        const totalSteps = this.modules.reduce((sum, module) => sum + module.steps.length, 0);
        const completedSteps = this.modules.slice(0, AppState.currentModule).reduce((sum, module) => sum + module.steps.length, 0) + this.currentStep;
        
        return {
            current: completedSteps,
            total: totalSteps,
            percentage: Math.round((completedSteps / totalSteps) * 100)
        };
    }
};

// Disponibilizar globalmente
window.ModuleSystem = ModuleSystem;
