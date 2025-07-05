# Nexo Dash - Arquitetura do Sistema

## Visão Geral Técnica

O Nexo Dash é uma aplicação web educacional que combina um ambiente de laboratório 3D com execução de Python no navegador para ensinar desenvolvimento Dash de forma imersiva. A aplicação utiliza uma arquitetura orientada a objetos escalável e manutenível.

## Stack Tecnológico Principal

### Frontend
- **Arquivo Principal**: `index.html` - Aplicação completa
- **Engine 3D**: three.js r128 - Ambiente de laboratório 3D
- **Arquitetura**: ES6 Modules com classes orientadas a objetos
- **Componentes UI**: Sistema de painéis holográficos
- **Padrões**: Dependency Injection, Observer Pattern, Factory Pattern

### Sistemas
- **NexoDashApp**: Coordenador principal da aplicação
- **LoadingSystem**: Gerenciamento de carregamento e transições
- **ThreeJSSystem**: Coordenação dos sistemas 3D
- **UISystem**: Interface holográfica e notificações
- **ModuleSystem**: Progressão educacional e conteúdo
- **DrTuringManager**: Personagem 3D mentora (IA)
- **EnvironmentManager**: Laboratório virtual e interações

### Stack Python (Baseado no Navegador)
- **Framework**: Dash (ensinado através do jogo)
- **Visualização**: Plotly Express
- **Processamento de Dados**: Pandas
- **Componentes UI**: dash-mantine-components
- **Editor de Gráficos**: dash-chart-editor

### Ferramentas de Desenvolvimento (Ensinadas no Jogo)
- **Editor de Código**: VS Code (configuração ensinada no Módulo 1)
- **Gerenciador de Pacotes**: uv (foco principal)
- **Controle de Versão**: Git
- **Linguagem**: Python 3.11+

## Arquitetura do Sistema

### Estrutura de Arquivos
```
nexo-dash/
├── index.html                  # Aplicação principal
├── src/                       # Código fonte
│   ├── core/
│   │   └── NexoDashApp.js     # Aplicação principal (331 linhas)
│   ├── systems/               # Sistemas principais
│   │   ├── LoadingSystem.js   # Sistema de carregamento (149 linhas)
│   │   ├── ThreeJSSystem.js   # Sistema 3D principal (280 linhas)
│   │   ├── UISystem.js        # Interface holográfica (347 linhas)
│   │   ├── ModuleSystem.js    # Sistema educacional (424 linhas)
│   │   └── three/             # Subsistemas Three.js
│   │       ├── DrTuringManager.js      # Personagem 3D (819 linhas)
│   │       └── EnvironmentManager.js   # Ambiente de laboratório (950 linhas)
│   ├── config/
│   │   └── AppConfig.js       # Configurações centralizadas (580 linhas)
│   ├── data/
│   │   └── ModuleDefinitions.js # Definições curriculares (850 linhas)
│   └── utils/
│       └── TestSuite.js       # Suite de testes (400 linhas)
├── assets/                    # Recursos 3D (inalterado)
├── examples/                  # Exemplos Three.js (inalterado)
├── memory-bank/              # Documentação arquitetural
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
├── data/               # Dataset de doenças cardíacas
├── main.py             # Ponto de entrada da aplicação
├── pyproject.toml      # Configuração do projeto (uv)
└── README.md           # Documentação inicial
```

## Padrões Arquiteturais Implementados

### 1. Dependency Injection Pattern
```javascript
class SystemBase {
    constructor(app) {
        this.app = app;  // Dependência injetada
        // Acesso a outros sistemas via this.app.getSystem('name')
    }
}
```

### 2. Observer Pattern
```javascript
// Sistemas comunicam via eventos
app.emit('module:changed', { module: currentModule });
uiSystem.on('panel:closed', () => this.updateState());
```

### 3. Factory Pattern
```javascript
// Criação dinâmica de painéis UI
const panel = PanelFactory.create(type, config);
uiSystem.registerPanel(panel);
```

### 4. Strategy Pattern
```javascript
// Diferentes estratégias para carregamento de modelos
const loader = LoaderStrategy.getLoader(fileExtension);
await loader.load(modelPath);
```

### 5. Singleton Pattern
```javascript
// Aplicação principal como singleton
class NexoDashApp {
    static instance = null;
    static getInstance() {
        if (!this.instance) {
            this.instance = new NexoDashApp();
        }
        return this.instance;
    }
}
```

## Componentes da Aplicação

### 1. NexoDashApp (Core Application)
**Responsabilidades:**
- Coordenação de todos os sistemas
- Gerenciamento do ciclo de vida da aplicação
- Registry de sistemas
- Event bus central

**Principais Métodos:**
```javascript
registerSystem(name, system)    // Registra novo sistema
getSystem(name)                 // Obtém sistema por nome
initialize()                    // Inicializa aplicação
dispose()                      // Limpa recursos
```

### 2. LoadingSystem
**Responsabilidades:**
- Controle da tela de carregamento
- Feedback visual de progresso
- Transições suaves entre estados

**Interface Principal:**
```javascript
updateProgress(percentage, status)  // Atualiza progresso
hide()                             // Oculta tela de loading
show()                             // Mostra tela de loading
```

### 3. ThreeJSSystem
**Responsabilidades:**
- Inicialização do Three.js (scene, camera, renderer)
- Coordenação de subsistemas 3D
- Loop de animação principal
- Gerenciamento de recursos 3D

**Subsistemas:**
- **DrTuringManager**: Personagem mentora 3D
- **EnvironmentManager**: Laboratório virtual

### 4. UISystem
**Responsabilidades:**
- Painéis holográficos
- Sistema de notificações
- Elementos de interface
- Gerenciamento de eventos UI

**Funcionalidades:**
```javascript
showPanel(config)              // Mostra painel configurado
hidePanel(id)                  // Oculta painel específico
createButton(config)           // Cria botão customizado
showNotification(msg, type)    // Mostra notificação
```

### 5. ModuleSystem
**Responsabilidades:**
- Progressão educacional
- Gerenciamento de conteúdo
- Controle de módulos e passos
- Processamento de ações

**Principais Recursos:**
- 8 módulos educacionais estruturados
- Sistema de progressão linear
- Ações contextuais por módulo
- Integração com outros sistemas

### 6. DrTuringManager (Subsistema 3D)
**Responsabilidades:**
- Carregamento de modelos 3D (FBX/GLB)
- Sistema de animações
- Balões de fala 3D
- Interações contextuais

**Recursos Avançados:**
- Fallback automático entre formatos
- Sistema de fala com timing
- Animações contextuais
- Iluminação dedicada

### 7. EnvironmentManager (Subsistema 3D)
**Responsabilidades:**
- Criação do laboratório virtual
- Blueprint 3D interativo
- Sistema de partículas
- Interações de mouse/touch

**Elementos 3D:**
- Plataforma holográfica
- Modelos do laboratório (servidor, GPU, etc.)
- Sistema de partículas ambientais
- Estrutura 3D do projeto

## Melhorias da Arquitetura

### ✅ Benefícios Técnicos

1. **Separação de Responsabilidades**
   - Cada classe tem uma função específica
   - Fácil localização de bugs
   - Código mais legível e documentado

2. **Manutenibilidade**
   - Módulos independentes
   - Fácil adição de novos recursos
   - Testes isolados por sistema

3. **Escalabilidade**
   - Arquitetura plugin-based
   - Novos sistemas facilmente integráveis
   - Configuração centralizada

4. **Reusabilidade**
   - Sistemas podem ser reutilizados
   - Padrões bem definidos
   - Interfaces consistentes

5. **Testabilidade**
   - Suite de testes incluída
   - Sistemas testáveis isoladamente
   - Mocks e stubs facilitados

### ✅ Padrões da Indústria

1. **ES6 Modules**
   - Import/export padrão
   - Tree-shaking automático
   - Compatibilidade moderna

2. **Orientação a Objetos**
   - Classes bem estruturadas
   - Encapsulamento adequado
   - Herança quando apropriada

3. **Error Handling**
   - Try/catch em operações críticas
   - Fallbacks robustos
   - Logs estruturados

4. **Resource Management**
   - Limpeza automática de recursos
   - Prevenção de memory leaks
   - Dispose patterns

### ✅ Performance

1. **Lazy Loading**
   - Sistemas carregados sob demanda
   - Modelos 3D com cache
   - Recursos otimizados

2. **Event-Driven**
   - Comunicação assíncrona
   - Desacoplamento de sistemas
   - Performance otimizada

3. **Memory Management**
   - Limpeza automática
   - Pools de objetos
   - Garbage collection otimizada

## Sistema de Renderização 3D (three.js)
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