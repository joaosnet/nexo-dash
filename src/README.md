# Nexo Dash - Estrutura Modular

A aplicação foi refatorada para uma arquitetura modular, dividindo o arquivo único `index.html` em vários arquivos menores para melhor organização e manutenibilidade.

## 📁 Estrutura de Arquivos

```
nexo-dash/
├── index.html                    # Arquivo principal (redireciona para src/)
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
│   └── styles/                # CSS modularizado
│       ├── main.css           # Estilos principais
│       ├── loading.css        # Estilos da tela de carregamento
│       ├── panels.css         # Estilos dos painéis holográficos
│       ├── responsive.css     # Estilos responsivos
│       └── animations.css     # Animações
├── assets/                    # Assets 3D e recursos
├── memory-bank/              # Documentação do projeto
└── README.md                 # Este arquivo
```

## 🚀 Benefícios da Modularização

### ✅ **Manutenibilidade**
- Cada funcionalidade em arquivo separado
- Fácil localização de bugs e melhorias
- Código mais organizado e legível

### ✅ **Escalabilidade**
- Fácil adição de novos módulos
- Sistemas independentes
- Configurações centralizadas

### ✅ **Desenvolvimento em Equipe**
- Múltiplos desenvolvedores podem trabalhar simultaneamente
- Redução de conflitos de merge
- Responsabilidades bem definidas

### ✅ **Performance**
- Carregamento mais eficiente
- Cache melhorado dos módulos
- Possibilidade de lazy loading

### ✅ **Debugging**
- Stack traces mais claros
- Logs organizados por sistema
- Ferramentas de desenvolvimento melhoradas

## 📋 Componentes Principais

### 🎛️ **config.js**
Configurações centralizadas de toda a aplicação:
- Configurações Three.js
- URLs de assets
- Parâmetros do Pyodide
- Settings do laboratório 3D

### 🧠 **appstate.js**
Estado global da aplicação:
- Variáveis compartilhadas
- Instâncias dos sistemas
- Controle de estado da aplicação

### 🎬 **loading-system.js**
Gerencia a tela de loading:
- Progresso de inicialização
- Mensagens de status
- Tratamento de erros

### 🎮 **threejs-system.js**
Sistema de renderização 3D:
- Inicialização da cena
- Gerenciamento de objetos 3D
- Controles de câmera
- Dra. Turing (placeholders)

### 🐍 **pyodide-system.js**
Sistema de execução Python:
- Inicialização do Pyodide
- Instalação de pacotes
- Execução de código Python
- Interface JS ↔ Python

### 🖥️ **ui-system.js**
Sistema de interface:
- Painéis holográficos
- Modais e notificações
- Elementos UI dinâmicos
- Interações do usuário

### 📚 **module-system.js**
Sistema educacional:
- Definição dos módulos
- Progressão do curso
- Conteúdo educacional
- Navegação entre lições

## 🔧 Como Usar

### Desenvolvimento Local
```bash
# Servir a aplicação
python -m http.server 8000

# Ou usando Node.js
npx serve .

# Acessar: http://localhost:8000
```

### Adicionando Novos Sistemas
1. Crie um novo arquivo em `src/js/systems/`
2. Registre no `src/index.html`
3. Adicione configurações em `config.js`
4. Integre no ciclo de inicialização em `main.js`

### Modificando Estilos
1. Edite os arquivos CSS específicos em `src/styles/`
2. Evite CSS inline - use classes reutilizáveis
3. Mantenha responsividade em `responsive.css`

## 🛠️ Ferramentas de Debug

### Console Commands (modo debug)
```javascript
// Informações da aplicação
debugInfo()

// Estado atual
AppState

// Progresso dos módulos
ModuleSystem.getProgress()

// Status do Pyodide
PyodideSystem.isReady()
```

### Keyboard Shortcuts
- `ESC` - Fechar painel atual
- `F11` - Toggle fullscreen
- `Ctrl/Cmd + Enter` - Próximo passo (debug mode)

## 🔗 Compatibilidade

O arquivo `index.html` original foi mantido como redirecionador para garantir compatibilidade com links existentes. A aplicação automaticamente redireciona para `src/index.html`.

## 📝 Próximos Passos

- [ ] Implementar sistema de laboratório 3D separado
- [ ] Criar sistema da Dra. Turing independente
- [ ] Adicionar sistema de blueprint 3D
- [ ] Implementar sistema de áudio
- [ ] Lazy loading de módulos
- [ ] Service Worker para cache
- [ ] Testes automatizados

## 🤝 Contribuindo

1. Mantenha a modularização
2. Use `AppState.log()` para logging
3. Centralize configurações em `config.js`
4. Documente novas funcionalidades
5. Teste em múltiplos dispositivos

---

**Nota**: Esta refatoração mantém 100% da funcionalidade original enquanto melhora significativamente a organização e manutenibilidade do código.
