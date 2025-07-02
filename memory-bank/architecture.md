# Nexo Dash - Arquitetura do Sistema

## Visão Geral Técnica

O Nexo Dash é uma aplicação web educacional modularizada que combina um ambiente de laboratório virtual 3D com execução de Python no navegador para ensinar desenvolvimento Dash de forma imersiva.

**🔄 ATUALIZAÇÃO**: A aplicação foi refatorada de um arquivo único para uma arquitetura modular para melhor manutenibilidade e escalabilidade.

## Stack Tecnológico Principal

### Frontend (Aplicação de Página Única)
- **Arquivo Principal**: `index.html` - Aplicação completa em arquivo HTML único
- **Engine 3D**: three.js - Ambiente virtual de laboratório e visualização 3D da arquitetura
- **Runtime Python**: Pyodide (WebAssembly) - Execução de Python no navegador
- **Componentes UI**: Overlays HTML/CSS/JavaScript sobre cena 3D
- **Internacionalização**: AutoTranslate.js 2.0.1 com modelo SeamlessM4T
- **Editor de Código**: Monaco Editor ou Ace Editor (integrado no ambiente 3D)

### Stack Python (Baseado no Navegador)
- **Framework**: Dash (ensinado através do jogo)
- **Visualização**: Plotly Express
- **Processamento de Dados**: Pandas
- **Componentes UI**: dash-mantine-components (instancia React automaticamente)
- **Editor de Gráficos**: dash-chart-editor v0.0.1a5 (substitui react-chart-editor)

### Ferramentas de Desenvolvimento (Ensinadas no Jogo)
- **Editor de Código**: VS Code (configuração ensinada no Módulo 0)
- **Gerenciador de Pacotes**: uv (foco principal)
- **Controle de Versão**: Git
- **Linguagem**: Python

## Arquitetura do Sistema

### Estrutura de Arquivos (Modularizada)
```
nexo-dash/
├── index.html                    # Redirecionador para compatibilidade
├── src/                         # Código fonte modularizado
│   ├── index.html              # HTML principal modularizado
│   ├── js/                     # JavaScript modularizado
│   │   ├── config.js          # Configurações centralizadas
│   │   ├── main.js            # Script principal e inicialização
│   │   ├── core/              # Módulos centrais
│   │   │   ├── appstate.js    # Estado global da aplicação
│   │   │   └── loading-system.js # Sistema de carregamento
│   │   └── systems/           # Sistemas da aplicação
│   │       ├── threejs-system.js  # Sistema Three.js
│   │       ├── pyodide-system.js  # Sistema Python
│   │       ├── ui-system.js       # Sistema de interface
│   │       └── module-system.js   # Sistema de módulos educacionais
│   ├── styles/                # CSS modularizado
│   │   ├── main.css           # Estilos principais
│   │   ├── loading.css        # Estilos da tela de carregamento
│   │   ├── panels.css         # Estilos dos painéis holográficos
│   │   ├── responsive.css     # Estilos responsivos
│   │   └── animations.css     # Animações
│   └── README.md              # Documentação da estrutura modular
├── assets/                    # Assets 3D e recursos
├── memory-bank/              # Documentação e especificações
│   ├── architecture.md       # Este arquivo (atualizado)
│   ├── game-design-document.md
│   ├── implementation-plan.md
│   ├── progress.md
│   └── tech-stack.md
└── .github/
    └── copilot-instructions.md
```

### Estrutura de Projeto Python (Ensinada no Jogo)
```
projeto_estudante/
├── app/                 # Código principal da aplicação
│   ├── __init__.py     # Inicialização do pacote
│   ├── models.py       # Modelos de dados
│   ├── routers.py      # Rotas principais
│   ├── views.py        # Lógica de visualização
│   ├── templates/      # Templates HTML
│   └── static/         # Arquivos estáticos (CSS, JS, imagens)
├── utils/              # Funções utilitárias
├── tests/              # Testes automatizados
├── docs/               # Documentação
├── instance/           # Configurações específicas do ambiente
├── cache/              # Arquivos de cache
├── data/               # Dataset de doenças cardíacas
├── criar_banco.py      # Script para criação de banco de dados
├── Dockerfile          # Arquivo Docker para containerização
├── main.py             # Ponto de entrada da aplicação
├── pyproject.toml      # Configuração do projeto (dependências, etc.)
├── requirements.txt    # Dependências do projeto
├── .gitignore          # Arquivos ignorados pelo Git
└── README.md           # Documentação inicial
```

## Componentes da Aplicação

### 1. Sistema de Renderização 3D (three.js)
- **Scene**: Ambiente do laboratório virtual
- **Camera**: PerspectiveCamera com OrbitControls
- **Lighting**: AmbientLight + DirectionalLight
- **Geometrias**: BoxGeometry, SphereGeometry para visualização de arquitetura
- **Materiais**: MeshLambertMaterial com efeitos holográficos
- **Animações**: RequestAnimationFrame loop com tweening

### 2. Sistema de Execução Python (Pyodide)
- **Inicialização**: loadPyodide() assíncrono
- **Pacotes**: pandas, plotly, dash pré-carregados
- **Executor**: Interpretação de código Python em tempo real
- **Interface**: Comunicação bidirecional JavaScript ↔ Python

### 3. Sistema de Interface Holográfica
- **Painéis**: Overlays CSS3 com efeitos de transparência e brilho
- **Editor**: Monaco/Ace integrado para edição de código
- **Preview**: Renderização em tempo real do dashboard Dash
- **Controles**: Navegação entre módulos e interações 3D

### 4. Sistema de Áudio
- **API**: Web Audio API
- **Assets**: Sons ambiente e efeitos sonoros (a serem criados/encontrados)
- **Contexto**: AudioContext para controle de reprodução
- **Efeitos**: Sons para interações, conclusão de módulos, animações 3D

### 5. Sistema de Internacionalização
- **Detecção**: navigator.language automático
- **Tradução**: AutoTranslate.js 2.0.1 com SeamlessM4T
- **Seletor**: Dropdown para mudança manual de idioma
- **Escopo**: Tradução dinâmica de todo conteúdo textual

## Dataset e Recursos

### Dataset Principal
- **Fonte**: Heart Disease Dataset (Kaggle)
- **URL de Download**: https://www.kaggle.com/api/v1/datasets/download/johnsmith88/heart-disease-dataset
- **Formato**: CSV
- **Localização**: Pasta `data/` no projeto do estudante
- **Uso**: Análise de fatores de risco cardíaco

### Assets de Áudio
- **Localização**: A ser determinada (embedded no HTML ou CDN)
- **Tipos**: Música ambiente, efeitos sonoros, narração
- **Formato**: MP3/OGG para compatibilidade cross-browser

## Responsividade e Compatibilidade

### Breakpoints (Padrão da Indústria)
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px  
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

### Browsers Suportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos Alvo
- **PC/Desktop**: Experiência completa
- **Laptops**: Experiência completa  
- **Tablets**: Interface adaptada, funcionalidade preservada
- **Smartphones**: Interface simplificada, funcionalidade essencial

## Deploy e Distribuição

### Deploy Inicial
- **Plataforma**: GitHub Pages
- **Arquivo**: index.html único
- **CDN**: Links externos para bibliotecas
- **Configuração**: GitHub Actions para deploy automático

### Comandos de Desenvolvimento

#### Servidor Local
```bash
python -m http.server 8000
```

#### Comandos Estudante (Ensinados no Jogo)
```bash
uv init                                                    # Inicializar projeto
uv add dash dash-mantine-components dash-chart-editor pandas  # Adicionar dependências
uv run python main.py                                     # Executar aplicação
```

## Fluxo de Dados

### 1. Inicialização
```
index.html → three.js → Pyodide → AutoTranslate.js → Interface Pronta
```

### 2. Interação do Usuário
```
Código Python → Parser JS → Pyodide → Dash Render → Preview 2D + Visualização 3D
```

### 3. Progressão do Módulo
```
Módulo Completo → Animação 3D → Atualização Estado → Próximo Módulo
```

## Considerações de Performance

### Otimizações three.js
- **Geometrias**: Reutilização com InstancedMesh
- **Materiais**: Pool de materiais compartilhados
- **Renderização**: Frustum culling automático
- **Texturas**: Compressão e cache

### Otimizações Pyodide
- **Carregamento**: Lazy loading de pacotes não essenciais
- **Cache**: Service Worker para cache de bibliotecas
- **Execução**: Throttling para evitar bloqueio da UI

### Otimizações Gerais
- **Assets**: Minificação e compressão
- **Loading**: Feedback visual durante inicialização
- **Memory**: Garbage collection de objetos 3D não utilizados