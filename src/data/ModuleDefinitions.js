/**
 * ModuleDefinitions - Definições dos módulos educacionais
 * Contém toda a estrutura curricular e progressão de aprendizado
 */
export const ModuleDefinitions = {
    // Configuração geral
    totalModules: 7,
    currentModule: 0,
    currentStep: 0,
    
    // Módulos estruturados (baseados no index.html original)
    modules: [
        {
            id: 0,
            title: 'Módulo 0: Calibração da Estação',
            description: "Configuração completa do ambiente de desenvolvimento",
            duration: "15 min",
            difficulty: "beginner",
            objectives: [
                "Instalar VS Code e extensões",
                "Configurar uv (gerenciador Python moderno)",
                "Criar estrutura do projeto",
                "Instalar dependências essenciais"
            ],
            steps: [
                {
                    id: 0,
                    title: 'Bem-vindo ao Nexo Dash',
                    description: "Apresentação da missão e da Dra. Ana Turing",
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
                        callback: function() {
                            // Fazer a Dra. Turing falar quando o usuário aceita a missão
                            const threeSystem = this.app.getSystem('three');
                            if (threeSystem && threeSystem.getDrTuringManager) {
                                const drTuring = threeSystem.getDrTuringManager();
                                if (drTuring && drTuring.speak3D) {
                                    drTuring.speak3D('Excelente! Você aceitou a missão. Agora vamos configurar seu ambiente de desenvolvimento profissional. Primeiro, precisamos instalar o VS Code, o editor de código mais usado na indústria.', 6000);
                                }
                            }
                            this.nextStep();
                        }
                    }]
                },
                {
                    id: 1,
                    title: 'Passo 1: Instalação do VS Code',
                    description: "Configure seu editor de código profissional",
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
                            callback: function() {
                                const threeSystem = this.app.getSystem('three');
                                if (threeSystem && threeSystem.getDrTuringManager) {
                                    const drTuring = threeSystem.getDrTuringManager();
                                    if (drTuring && drTuring.speak3D) {
                                        drTuring.speak3D('Perfeito! Com o VS Code instalado, agora vamos configurar o uv, o gerenciador de pacotes Python mais rápido e moderno da atualidade.', 5000);
                                    }
                                }
                                this.nextStep();
                            }
                        },
                        { 
                            label: 'Já Tenho VS Code', 
                            callback: function() {
                                const threeSystem = this.app.getSystem('three');
                                if (threeSystem && threeSystem.getDrTuringManager) {
                                    const drTuring = threeSystem.getDrTuringManager();
                                    if (drTuring && drTuring.speak3D) {
                                        drTuring.speak3D('Ótimo! Você já tem o VS Code. Agora vamos para o próximo passo: instalar o uv para gerenciar nossos pacotes Python.', 5000);
                                    }
                                }
                                this.nextStep();
                            }
                        }
                    ]
                },
                {
                    id: 2,
                    title: 'Passo 2: Instalação do uv',
                    description: "Configure o gerenciador de pacotes Python mais rápido",
                    content: `
                        <div style="background: rgba(100,0,100,0.2); padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                            <h4>⚡ Gerenciador de Pacotes Moderno</h4>
                        </div>
                        <p><strong>uv</strong> é o gerenciador de pacotes Python mais rápido da atualidade (Astral).</p>
                        
                        <p><strong>Windows (PowerShell):</strong></p>
                        <div style="background: #1a1a1a; padding: 1rem; border-radius: 5px; font-family: monospace; margin: 1rem 0;">
                            powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
                        </div>
                        
                        <p><strong>macOS/Linux:</strong></p>
                        <div style="background: #1a1a1a; padding: 1rem; border-radius: 5px; font-family: monospace; margin: 1rem 0;">
                            curl -LsSf https://astral.sh/uv/install.sh | sh
                        </div>
                        
                        <p><strong>Verificar instalação:</strong></p>
                        <div style="background: #1a1a1a; padding: 1rem; border-radius: 5px; font-family: monospace; margin: 1rem 0;">
                            uv --version
                        </div>
                        
                        <p><em>⚠️ Pode ser necessário reiniciar o terminal após a instalação.</em></p>
                    `,
                    actions: [
                        { 
                            label: 'uv Instalado', 
                            callback: function() {
                                const threeSystem = this.app.getSystem('three');
                                if (threeSystem && threeSystem.getDrTuringManager()?.speak3D) {
                                    threeSystem.getDrTuringManager()?.speak3D('Excelente! O uv está instalado e pronto. Agora vamos criar a estrutura do nosso projeto de análise cardíaca usando as melhores práticas da indústria.', 5000);
                                }
                                this.nextStep();
                            }
                        }
                    ]
                },
                {
                    id: 3,
                    title: 'Passo 3: Criação do Projeto',
                    description: "Estruture seu projeto seguindo padrões profissionais",
                    content: `
                        <div style="background: rgba(0,100,0,0.2); padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                            <h4>🏗️ Estrutura do Projeto</h4>
                        </div>
                        <p>Agora vamos criar a estrutura do nosso projeto de análise cardíaca:</p>
                        
                        <p><strong>1. Criar pasta do projeto:</strong></p>
                        <div style="background: #1a1a1a; padding: 1rem; border-radius: 5px; font-family: monospace; margin: 1rem 0;">
                            mkdir dashboard-cardiaco<br>
                            cd dashboard-cardiaco
                        </div>
                        
                        <p><strong>2. Inicializar projeto com uv:</strong></p>
                        <div style="background: #1a1a1a; padding: 1rem; border-radius: 5px; font-family: monospace; margin: 1rem 0;">
                            uv init
                        </div>
                        
                        <p><strong>3. Abrir no VS Code:</strong></p>
                        <div style="background: #1a1a1a; padding: 1rem; border-radius: 5px; font-family: monospace; margin: 1rem 0;">
                            code .
                        </div>
                        
                        <p>✨ O comando <code>uv init</code> criará automaticamente o arquivo <code>pyproject.toml</code> que é o centro de controle do projeto!</p>
                    `,
                    actions: [
                        { 
                            label: 'Projeto Criado', 
                            callback: function() {
                                const threeSystem = this.app.getSystem('three');
                                if (threeSystem && threeSystem.getDrTuringManager()?.speak3D) {
                                    threeSystem.getDrTuringManager()?.speak3D('Fantástico! A estrutura do projeto está criada. Agora vamos instalar as bibliotecas essenciais para construir nosso dashboard de análise cardíaca.', 5000);
                                }
                                this.nextStep();
                            }
                        }
                    ]
                },
                {
                    id: 4,
                    title: 'Passo 4: Instalação de Dependências',
                    description: "Instale as bibliotecas essenciais do projeto",
                    content: `
                        <div style="background: rgba(100,100,0,0.2); padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                            <h4>📦 Bibliotecas Essenciais</h4>
                        </div>
                        <p>Vamos instalar as bibliotecas que usaremos no dashboard:</p>
                        
                        <div style="background: #1a1a1a; padding: 1rem; border-radius: 5px; font-family: monospace; margin: 1rem 0;">
                            uv add dash dash-mantine-components dash-chart-editor pandas plotly
                        </div>
                        
                        <p><strong>O que cada biblioteca faz:</strong></p>
                        <ul>
                            <li><strong>dash</strong>: Framework principal para dashboards web</li>
                            <li><strong>dash-mantine-components</strong>: Componentes UI modernos</li>
                            <li><strong>dash-chart-editor</strong>: Editor visual de gráficos</li>
                            <li><strong>pandas</strong>: Manipulação e análise de dados</li>
                            <li><strong>plotly</strong>: Criação de gráficos interativos</li>
                        </ul>
                        
                        <p>🚀 O uv resolverá automaticamente todas as dependências necessárias!</p>
                    `,
                    actions: [
                        { 
                            label: 'Dependências Instaladas', 
                            callback: function() {
                                const threeSystem = this.app.getSystem('three');
                                if (threeSystem && threeSystem.getDrTuringManager()?.speak3D) {
                                    threeSystem.getDrTuringManager()?.speak3D('Perfeito! Todas as bibliotecas estão instaladas. Sua estação de trabalho está completamente calibrada e pronta para a missão! Agora vamos carregar o blueprint do projeto.', 6000);
                                }
                                this.nextStep();
                            }
                        }
                    ]
                },
                {
                    id: 5,
                    title: 'Calibração Completa!',
                    description: "Estação pronta para desenvolvimento",
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
                            callback: function() {
                                const threeSystem = this.app.getSystem('three');
                                if (threeSystem && threeSystem.getDrTuringManager()?.speak3D) {
                                    threeSystem.getDrTuringManager()?.speak3D('Excelente trabalho! Sua estação está calibrada. Agora vamos carregar o blueprint 3D do projeto e os dados que analisaremos. Prepare-se para ver a arquitetura ganhar vida!', 7000);
                                }
                                this.nextModule();
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: 1,
            title: 'Módulo 1: Blueprint do Projeto',
            description: "Estrutura profissional e carregamento do dataset",
            duration: "15 min",
            difficulty: "beginner",
            objectives: [
                "Visualizar arquitetura 3D do projeto",
                "Entender estrutura profissional do projeto",
                "Baixar dataset de doenças cardíacas",
                "Organizar pastas do projeto"
            ],
            steps: [
                {
                    id: 0,
                    title: 'Carregando Blueprint do Projeto',
                    description: "Visualização 3D da arquitetura",
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
                            callback: function() {
                                const threeSystem = this.app.getSystem('three');
                                if (threeSystem && threeSystem.getDrTuringManager()?.speak3D) {
                                    threeSystem.getDrTuringManager()?.speak3D('Iniciando carregamento do blueprint 3D! Observe como a arquitetura do projeto se materializa no laboratório virtual. Cada componente tem uma função específica.', 6000);
                                }
                                this.load3DBlueprint();
                            }
                        }
                    ]
                },
                {
                    id: 1,
                    title: 'Estrutura de Pastas Profissional',
                    description: "Organização para projetos escaláveis",
                    content: `
                        <div style="background: rgba(0,100,100,0.2); padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                            <h4>🏗️ Organização do Projeto</h4>
                        </div>
                        <p>Esta é a estrutura que implementaremos:</p>
                        <div style="background: #1a1a1a; padding: 1rem; border-radius: 5px; font-family: monospace; font-size: 0.9rem;">
dashboard-cardiaco/<br>
├── app/<br>
│   ├── __init__.py<br>
│   ├── models.py<br>
│   ├── routers.py<br>
│   ├── views.py<br>
│   └── static/<br>
├── data/<br>
├── utils/<br>
├── tests/<br>
├── main.py<br>
└── pyproject.toml
                        </div>
                        <p><strong>Benefícios desta estrutura:</strong></p>
                        <ul>
                            <li>Código organizado e fácil de manter</li>
                            <li>Separação clara de responsabilidades</li>
                            <li>Facilita trabalho em equipe</li>
                            <li>Padrão da indústria</li>
                        </ul>
                    `,
                    actions: [
                        { 
                            label: 'Criar Estrutura', 
                            callback: function() {
                                const threeSystem = this.app.getSystem('three');
                                if (threeSystem && threeSystem.getDrTuringManager()?.speak3D) {
                                    threeSystem.getDrTuringManager()?.speak3D('Excelente! Agora você entende a organização do projeto. Esta estrutura facilita a manutenção e o trabalho em equipe. Vamos baixar os dados que analisaremos.', 6000);
                                }
                                this.nextStep();
                            }
                        }
                    ]
                },
                {
                    id: 2,
                    title: 'Download do Dataset',
                    description: "Obtenha os dados reais de doenças cardíacas",
                    content: `
                        <div style="background: rgba(100,0,0,0.2); padding: 1rem; border-radius: 5px; margin-bottom: 1rem;">
                            <h4>❤️ Dados de Doenças Cardíacas</h4>
                        </div>
                        <p>Agora vamos baixar o dataset que analisaremos:</p>
                        
                        <p><strong>Dataset:</strong> Heart Disease Dataset (Kaggle)</p>
                        <p><strong>Conteúdo:</strong> Dados clínicos de pacientes com fatores de risco cardíaco</p>
                        
                        <p><strong>1. Criar pasta data:</strong></p>
                        <div style="background: #1a1a1a; padding: 1rem; border-radius: 5px; font-family: monospace; margin: 1rem 0;">
                            mkdir data
                        </div>
                        
                        <p><strong>2. Download direto:</strong></p>
                        <a href="https://www.kaggle.com/api/v1/datasets/download/johnsmith88/heart-disease-dataset" 
                           target="_blank" 
                           style="color: #00ccff; text-decoration: none; background: rgba(0,200,255,0.2); padding: 0.5rem 1rem; border-radius: 5px; display: inline-block; margin: 1rem 0;">
                            📥 Baixar Heart Disease Dataset
                        </a>
                        
                        <p><strong>3. Extrair para a pasta data/</strong></p>
                        <p><em>💡 O arquivo virá compactado (.zip). Extraia o CSV para dentro da pasta data/</em></p>
                    `,
                    actions: [
                        { 
                            label: 'Dataset Baixado', 
                            callback: function() {
                                const threeSystem = this.app.getSystem('three');
                                if (threeSystem && threeSystem.getDrTuringManager()?.speak3D) {
                                    threeSystem.getDrTuringManager()?.speak3D('Perfeito! O dataset de doenças cardíacas está carregado. Agora temos todos os ingredientes para construir um dashboard incrível. A missão está pronta para começar!', 6000);
                                }
                                this.nextStep();
                            }
                        }
                    ]
                },
                {
                    id: 3,
                    title: 'Blueprint Carregado!',
                    description: "Projeto estruturado e pronto para desenvolvimento",
                    content: `
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                            <p><strong>Missão Preparada!</strong></p>
                        </div>
                        <p>Perfeito! Agora temos tudo pronto:</p>
                        <ul>
                            <li>✅ Estrutura do projeto definida</li>
                            <li>✅ Dataset de doenças cardíacas baixado</li>
                            <li>✅ Arquitetura 3D visualizada</li>
                            <li>✅ Ambiente de desenvolvimento pronto</li>
                        </ul>
                        
                        <p><strong>Próximos módulos:</strong> Construção iterativa do dashboard</p>
                        <ul>
                            <li>Módulo 2: Núcleo do servidor Dash</li>
                            <li>Módulo 3: Layout inicial</li>
                            <li>Módulo 4: Primeira visualização</li>
                            <li>Módulo 5: Interatividade com callbacks</li>
                            <li>Módulo 6: Dashboard completo</li>
                            <li>Módulo 7: Deploy e finalização</li>
                        </ul>
                        
                        <div style="background: rgba(0,255,136,0.1); padding: 1rem; border-radius: 5px; margin-top: 1rem;">
                            <p><em>🎉 Você está oficialmente pronto para construir seu dashboard profissional!</em></p>
                        </div>
                    `,
                    actions: [
                        { 
                            label: 'Próximos Módulos', 
                            callback: function() {
                                this.showUpcomingModules();
                            }
                        },
                        { 
                            label: 'Explorar Ambiente', 
                            callback: function() {
                                const uiSystem = this.app.getSystem('ui');
                                if (uiSystem) {
                                    uiSystem.hidePanel();
                                    uiSystem.showNotification('Explore o ambiente 3D! Clique nos elementos do blueprint para ver detalhes.', 'info', 5000);
                                }
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            title: "Introdução ao Dash",
            description: "Primeiros passos com o framework Dash",
            duration: "30 min",
            difficulty: "intermediate",
            objectives: [
                "Criar primeira aplicação Dash",
                "Entender componentes básicos",
                "Implementar layout responsivo"
            ],
            steps: [
                {
                    id: 0,
                    title: "Hello World Dash",
                    description: "Sua primeira aplicação Dash",
                    content: "Vamos criar nossa primeira aplicação Dash com um layout simples e funcional.",
                    action: "create_hello_dash",
                    files: ["main.py"],
                    code: `import dash
from dash import html, dcc

app = dash.Dash(__name__)

app.layout = html.Div([
    html.H1("Heart Disease Dashboard", style={'textAlign': 'center'}),
    html.P("Bem-vindo ao seu primeiro dashboard!"),
    dcc.Graph(
        figure={
            'data': [{'x': [1, 2, 3], 'y': [4, 5, 6], 'type': 'bar', 'name': 'Exemplo'}],
            'layout': {'title': 'Gráfico de Exemplo'}
        }
    )
])

if __name__ == '__main__':
    app.run_server(debug=True)`,
                    duration: 90000,
                    autoNext: false
                },
                {
                    id: 1,
                    title: "Componentes Dash",
                    description: "Explore os componentes fundamentais",
                    content: "Dash oferece uma rica variedade de componentes. Vamos conhecer os mais importantes para nosso dashboard.",
                    action: "explore_components",
                    components: ["html.Div", "html.H1", "dcc.Graph", "dcc.Dropdown", "dcc.Input"],
                    duration: 120000,
                    autoNext: false
                },
                {
                    id: 2,
                    title: "Layout Responsivo",
                    description: "Crie layouts que se adaptam a diferentes telas",
                    content: "Vamos implementar um layout responsivo usando dash-mantine-components para uma experiência profissional.",
                    action: "responsive_layout",
                    duration: 90000,
                    autoNext: false
                }
            ]
        },
        {
            id: 3,
            title: "Trabalhando com Dados",
            description: "Carregamento e manipulação do dataset de doenças cardíacas",
            duration: "25 min",
            difficulty: "intermediate",
            objectives: [
                "Carregar dataset de doenças cardíacas",
                "Explorar e limpar dados",
                "Criar visualizações iniciais"
            ],
            steps: [
                {
                    id: 0,
                    title: "Carregando o Dataset",
                    description: "Importe e explore o dataset de doenças cardíacas",
                    content: "Vamos carregar nosso dataset real de doenças cardíacas e fazer uma análise exploratória inicial.",
                    action: "load_dataset",
                    files: ["app/data_loader.py"],
                    duration: 60000,
                    autoNext: false
                },
                {
                    id: 1,
                    title: "Análise Exploratória",
                    description: "Entenda os dados através de estatísticas descritivas",
                    content: "Análise exploratória é fundamental para entender nossos dados antes de criar visualizações.",
                    action: "explore_data",
                    duration: 90000,
                    autoNext: false
                },
                {
                    id: 2,
                    title: "Limpeza de Dados",
                    description: "Trate valores ausentes e inconsistências",
                    content: "Dados do mundo real precisam de limpeza. Vamos preparar nosso dataset para análise.",
                    action: "clean_data",
                    duration: 75000,
                    autoNext: false
                }
            ]
        },
        {
            id: 4,
            title: "Visualizações Interativas",
            description: "Criação de gráficos dinâmicos com Plotly",
            duration: "35 min",
            difficulty: "intermediate",
            objectives: [
                "Criar gráficos de barras interativos",
                "Implementar gráficos de dispersão",
                "Adicionar mapas de calor"
            ],
            steps: [
                {
                    id: 0,
                    title: "Gráficos de Barras",
                    description: "Visualize distribuições categóricas",
                    content: "Gráficos de barras são ideais para mostrar distribuições de variáveis categóricas como tipos de dor no peito.",
                    action: "create_bar_charts",
                    duration: 90000,
                    autoNext: false
                },
                {
                    id: 1,
                    title: "Gráficos de Dispersão",
                    description: "Explore correlações entre variáveis",
                    content: "Gráficos de dispersão revelam relações entre variáveis numéricas como idade e pressão arterial.",
                    action: "create_scatter_plots",
                    duration: 90000,
                    autoNext: false
                },
                {
                    id: 2,
                    title: "Mapas de Calor",
                    description: "Visualize correlações de forma intuitiva",
                    content: "Mapas de calor mostram correlações entre todas as variáveis de forma visual e intuitiva.",
                    action: "create_heatmaps",
                    duration: 90000,
                    autoNext: false
                }
            ]
        },
        {
            id: 5,
            title: "Callbacks e Interatividade",
            description: "Implementação de callbacks para interatividade",
            duration: "40 min",
            difficulty: "advanced",
            objectives: [
                "Entender o sistema de callbacks",
                "Implementar filtros dinâmicos",
                "Criar interações entre gráficos"
            ],
            steps: [
                {
                    id: 0,
                    title: "Fundamentos de Callbacks",
                    description: "Aprenda como funciona a reatividade no Dash",
                    content: "Callbacks são o coração da interatividade no Dash. Eles conectam inputs a outputs de forma reativa.",
                    action: "learn_callbacks",
                    duration: 120000,
                    autoNext: false
                },
                {
                    id: 1,
                    title: "Filtros Dinâmicos",
                    description: "Implemente filtros que atualizam gráficos em tempo real",
                    content: "Vamos criar filtros dinâmicos que permitem aos usuários explorar diferentes subconjuntos dos dados.",
                    action: "dynamic_filters",
                    duration: 150000,
                    autoNext: false
                },
                {
                    id: 2,
                    title: "Cross-filtering",
                    description: "Conecte gráficos para análise integrada",
                    content: "Cross-filtering permite que seleções em um gráfico afetem outros, criando uma experiência analítica rica.",
                    action: "cross_filtering",
                    duration: 120000,
                    autoNext: false
                }
            ]
        },
        {
            id: 6,
            title: "Dashboard Completo",
            description: "Finalização e otimização do dashboard",
            duration: "30 min",
            difficulty: "advanced",
            objectives: [
                "Integrar todos os componentes",
                "Otimizar performance",
                "Implementar deploy"
            ],
            steps: [
                {
                    id: 0,
                    title: "Integração Final",
                    description: "Una todos os componentes em um dashboard coeso",
                    content: "Agora vamos integrar todos os elementos criados em um dashboard profissional e funcional.",
                    action: "final_integration",
                    duration: 180000,
                    autoNext: false
                },
                {
                    id: 1,
                    title: "Otimização de Performance",
                    description: "Melhore a velocidade e responsividade",
                    content: "Performance é crucial em aplicações web. Vamos implementar otimizações que fazem diferença real.",
                    action: "optimize_performance",
                    duration: 120000,
                    autoNext: false
                },
                {
                    id: 2,
                    title: "Preparação para Deploy",
                    description: "Configure o projeto para produção",
                    content: "Vamos preparar nossa aplicação para deploy, incluindo configurações de produção e documentação.",
                    action: "prepare_deploy",
                    duration: 120000,
                    autoNext: false
                }
            ]
        }
    ],

    // Ações específicas que podem ser executadas
    actions: {
        introduction: {
            type: "speech",
            character: "dra_ana",
            animation: "wave",
            camera: "focus_character"
        },
        lab_tour: {
            type: "environment",
            action: "create_blueprint",
            camera: "blueprint_overview",
            interactive: true
        },
        show_objectives: {
            type: "ui",
            panel: "objectives",
            content: "module_objectives"
        },
        install_python: {
            type: "terminal",
            instructions: "python_install",
            verification: "python_version_check"
        },
        install_uv: {
            type: "terminal",
            instructions: "uv_install",
            verification: "uv_version_check"
        },
        setup_vscode: {
            type: "ide",
            action: "install_extensions",
            extensions: ["ms-python.python", "ms-python.debugpy"]
        },
        init_project: {
            type: "terminal",
            commands: ["uv init heart-disease-dashboard"],
            workdir: "create_if_not_exists"
        },
        create_structure: {
            type: "file_system",
            action: "create_directories",
            directories: ["app", "data", "utils", "tests", "docs"],
            show_in_3d: true
        },
        add_dependencies: {
            type: "terminal",
            commands: ["uv add dash dash-mantine-components pandas plotly plotly-express"],
            verification: "check_pyproject_toml"
        },
        create_hello_dash: {
            type: "code_editor",
            file: "main.py",
            template: "hello_dash",
            explanation: true
        },
        explore_components: {
            type: "interactive_demo",
            components: ["html.Div", "html.H1", "dcc.Graph", "dcc.Dropdown"],
            live_preview: true
        },
        responsive_layout: {
            type: "code_editor",
            file: "app/layout.py",
            template: "responsive_layout",
            preview: true
        },
        load_dataset: {
            type: "data_analysis",
            dataset: "heart_disease",
            action: "load_and_preview",
            file: "app/data_loader.py"
        },
        explore_data: {
            type: "data_analysis",
            action: "exploratory_analysis",
            show_statistics: true,
            interactive: true
        },
        clean_data: {
            type: "data_analysis",
            action: "data_cleaning",
            show_before_after: true
        },
        create_bar_charts: {
            type: "visualization",
            chart_type: "bar",
            file: "app/charts/bar_charts.py",
            live_preview: true
        },
        create_scatter_plots: {
            type: "visualization", 
            chart_type: "scatter",
            file: "app/charts/scatter_plots.py",
            live_preview: true
        },
        create_heatmaps: {
            type: "visualization",
            chart_type: "heatmap", 
            file: "app/charts/heatmaps.py",
            live_preview: true
        },
        learn_callbacks: {
            type: "interactive_tutorial",
            topic: "callbacks",
            live_coding: true,
            examples: ["basic_callback", "multiple_outputs", "state_example"]
        },
        dynamic_filters: {
            type: "code_editor",
            file: "app/callbacks/filters.py",
            template: "dynamic_filters",
            interactive_preview: true
        },
        cross_filtering: {
            type: "code_editor",
            file: "app/callbacks/cross_filter.py",
            template: "cross_filtering",
            interactive_preview: true
        },
        final_integration: {
            type: "project_assembly",
            action: "integrate_all_components",
            show_architecture: true
        },
        optimize_performance: {
            type: "optimization",
            techniques: ["caching", "lazy_loading", "efficient_callbacks"],
            before_after_metrics: true
        },
        prepare_deploy: {
            type: "deployment",
            platform: "heroku",
            files: ["Procfile", "requirements.txt", "runtime.txt"],
            checklist: true
        }
    },

    // Templates de código essenciais
    codeTemplates: {
        hello_dash: `import dash
from dash import html, dcc

app = dash.Dash(__name__)

app.layout = html.Div([
    html.H1("Heart Disease Dashboard", 
            style={'textAlign': 'center', 'color': '#2c3e50', 'marginBottom': 30}),
    
    html.P("Bem-vindo ao seu primeiro dashboard interativo!", 
           style={'textAlign': 'center', 'fontSize': 18}),
    
    dcc.Graph(
        id='exemplo-grafico',
        figure={
            'data': [{'x': ['Homens', 'Mulheres'], 'y': [150, 120], 'type': 'bar', 'name': 'Pacientes'}],
            'layout': {'title': 'Distribuição de Pacientes por Gênero'}
        }
    )
])

if __name__ == '__main__':
    app.run_server(debug=True, port=8050)`,

        responsive_layout: `import dash_mantine_components as dmc
from dash import html, dcc

def create_responsive_layout():
    return dmc.MantineProvider(
        theme={"colorScheme": "dark"},
        children=[
            dmc.Container([
                dmc.Title("Heart Disease Dashboard", order=1, align="center"),
                dmc.Grid([
                    dmc.Col([
                        dmc.Card([
                            dmc.Title("Filtros", order=3),
                            dmc.Select(label="Gênero", data=["Todos", "Masculino", "Feminino"], value="Todos"),
                            dmc.RangeSlider(label="Idade", min=20, max=80, value=[30, 70])
                        ])
                    ], span=4),
                    dmc.Col([dmc.Card([dcc.Graph(id="main-chart")])], span=8)
                ])
            ])
        ]
    )`,

        dynamic_filters: `from dash import callback, Input, Output
import plotly.express as px

@callback(
    Output('filtered-chart', 'figure'),
    [Input('gender-dropdown', 'value'), Input('age-range-slider', 'value')]
)
def update_chart(selected_gender, age_range):
    filtered_df = df.copy()
    
    if selected_gender != 'Todos':
        filtered_df = filtered_df[filtered_df['sex'] == selected_gender]
    
    filtered_df = filtered_df[
        (filtered_df['age'] >= age_range[0]) & 
        (filtered_df['age'] <= age_range[1])
    ]
    
    fig = px.histogram(filtered_df, x='chest_pain_type', color='target',
                       title=f'Distribuição por Tipo de Dor (N={len(filtered_df)})')
    return fig`
    },

    // Configurações de UI específicas para cada módulo
    uiConfigs: {
        defaultPanel: {
            width: "400px",
            height: "auto",
            position: "right",
            theme: "dark",
            opacity: 0.95
        },
        modulePanel: {
            width: "500px",
            height: "600px",
            position: "right",
            theme: "holographic",
            opacity: 0.9
        },
        codePanel: {
            width: "800px",
            height: "500px",
            position: "center",
            theme: "code",
            opacity: 0.95
        }
    },

    // Configurações de câmera para diferentes momentos
    cameraConfigs: {
        introduction: {
            position: { x: 5, y: 3, z: 5 },
            lookAt: { x: 0, y: 1.7, z: 0 },
            transition: "smooth",
            duration: 2000
        },
        blueprint_overview: {
            position: { x: 8, y: 10, z: 8 },
            lookAt: { x: 0, y: 2.5, z: 0 },
            transition: "smooth",
            duration: 3000
        },
        focus_character: {
            position: { x: 2, y: 2, z: 4 },
            lookAt: { x: 0, y: 1.7, z: 0 },
            transition: "smooth",
            duration: 1500
        },
        code_view: {
            position: { x: 0, y: 5, z: 10 },
            lookAt: { x: 0, y: 3, z: 0 },
            transition: "smooth",
            duration: 2000
        }
    },

    // Recursos essenciais
    resources: {
        documentation: {
            dash: "https://dash.plotly.com/",
            plotly: "https://plotly.com/python/",
            pandas: "https://pandas.pydata.org/docs/",
            uv: "https://github.com/astral-sh/uv"
        },
        dataset: {
            source: "UCI Machine Learning Repository",
            description: "Dataset com 303 instâncias de dados cardíacos",
            features: 14
        },
        tips: [
            "Use uv para gerenciamento rápido de dependências",
            "Dash callbacks são reativos - mudanças automáticas",
            "Plotly Express oferece APIs simples para gráficos",
            "dash-mantine-components para UI moderna",
            "Use debug=True durante desenvolvimento"
        ]
    },

    // Métricas de progresso
    metrics: {
        calculateProgress: function(currentModule, currentStep) {
            const totalSteps = this.modules.reduce((sum, module) => sum + module.steps.length, 0);
            const completedSteps = this.modules
                .slice(0, currentModule)
                .reduce((sum, module) => sum + module.steps.length, 0) + currentStep;
            
            return Math.round((completedSteps / totalSteps) * 100);
        },
        
        getTimeEstimate: function(currentModule, currentStep) {
            const remainingModules = this.modules.slice(currentModule);
            const totalMinutes = remainingModules.reduce((sum, module, index) => {
                if (index === 0) {
                    // Módulo atual - considerar apenas steps restantes
                    const remainingSteps = module.steps.slice(currentStep);
                    return sum + remainingSteps.reduce((stepSum, step) => stepSum + (step.duration / 60000), 0);
                }
                return sum + parseInt(module.duration.replace(' min', ''));
            }, 0);
            
            return Math.ceil(totalMinutes);
        },
        
        getCompletionCertificate: function() {
            return {
                title: "Certificado de Conclusão - Nexo Dash",
                subtitle: "Dashboard Development with Python & Dash",
                skills: [
                    "Python Development",
                    "Dash Framework",
                    "Data Visualization",
                    "Interactive Dashboards",
                    "Modern Python Tooling (uv)",
                    "Professional Project Structure"
                ],
                date: new Date().toLocaleDateString('pt-BR'),
                signature: "Dra. Ana Turing - Mentora Virtual"
            };
        }
    }
};
