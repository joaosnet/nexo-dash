Tech Stack: Nexo Dash
1. Target Platforms

    A single web application, built as an HTML file, accessible on:

        PC/Desktop

        Laptops

        Smartphones/Tablets (Android/iOS) with responsive layout.

2. Tools Taught

    Code Editor: Visual Studio Code

    Language: Python

    Package Manager: uv (from Astral)

    Version Control: Git

    Dashboard Libraries:

        Dash

        Plotly

        dash-mantine-components

    Chart Editor: dash-chart-editor v0.0.1a5 (substitui react-chart-editor)

3. Application Technologies

    Main File: A single index.html file.

    Python Execution Core: pycafe will be used to run Python code (Dash, Pandas, etc.) directly in the user's browser via WebAssembly.

    3D Rendering and Interface: three.js is the fundamental library for creating the entire visual experience of the virtual laboratory, including holographic panels and the visualization of the dashboard architecture.

    2D Interface (Overlays): Standard HTML, CSS, and JavaScript will be used to create the interface elements that appear over the 3D scene, such as the code editor and text panels.

4. Internationalization and Accessibility (i18n)

    Automatic Language Detection: The application will detect the user's browser language (navigator.language) as a starting point for translation.

    Translation Solution: The AutoTranslate.js v2.0.1 library will be used. This tool will dynamically translate the page content using an AI model (SeamlessM4T).

    Language Selector: A control in the interface will allow the user to choose a different language at any time, triggering AutoTranslate.js to re-translate the content.

5. Reference Documents (Architect's Arsenal)

    Official Python Documentation

    Dash and Plotly Documentation

    Dash Mantine Components Documentation

    Pandas Documentation

    uv (Astral) Documentation

    Visual Studio Code Documentation

    React Chart Editor Repository

## Especificações Técnicas Adicionais

### Editor de Código
- **Recomendado**: Visual Studio Code
- **Configuração**: Ensinada no Módulo 0 do jogo
- **Integração**: Monaco Editor ou Ace Editor para edição in-browser

### Dataset Principal
- **Nome**: Heart Disease Dataset
- **Fonte**: Kaggle (johnsmith88)
- **URL de Download Direto**: https://www.kaggle.com/api/v1/datasets/download/johnsmith88/heart-disease-dataset
- **Formato**: CSV
- **Localização no Projeto**: pasta `data/`

### React e Componentes UI
- **Framework React**: Instanciado automaticamente pelo dash-mantine-components
- **Componentes**: dash-mantine-components (interface moderna)
- **Chart Editor**: dash-chart-editor v0.0.1a5 (substitui react-chart-editor)

### Assets de Áudio
- **Status**: A serem encontrados ou criados
- **Tipos Necessários**: 
  - Trilha sonora ambiente
  - Efeitos sonoros para interações
  - Sons para animações 3D
  - Feedback auditivo para conclusão de módulos
- **Formatos**: MP3/OGG para compatibilidade cross-browser
- **API**: Web Audio API para controle

### Responsividade
- **Breakpoints**: Padrão da indústria
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px  
  - Desktop: 1024px - 1439px
  - Large Desktop: 1440px+

### Deploy e Distribuição
- **Deploy Inicial**: GitHub Pages
- **Configuração**: GitHub Actions para deploy automático
- **Arquitetura**: Arquivo único (index.html) para simplicidade
- **CDN**: Bibliotecas externas via CDN para reduzir tamanho

### Comandos de Desenvolvimento
```bash
# Servidor local para desenvolvimento
python -m http.server 8000

# Comandos ensinados no jogo (Módulo 0)
uv init                                                    # Inicializar projeto Python
uv add dash dash-mantine-components dash-chart-editor pandas  # Adicionar dependências principais
uv run python main.py                                     # Executar aplicação Dash
```

### Versões Específicas
- **AutoTranslate.js**: v2.0.1
- **dash-chart-editor**: v0.0.1a5
- **Python**: Executado via pycafe (WebAssembly)
- **Gerenciador de Pacotes**: uv (Astral) - foco principal do ensino