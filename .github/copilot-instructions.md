# Nexo Dash - Copilot Instructions

# IMPORTANT:
# Always read memory-bank/@architecture.md before writing any code. Include entire database schema.
# Always read memory-bank/@game-design-document.md before writing any code.
# Always read examples in examples/ as a basis for developing in three.js.
# After adding a major feature or completing a milestone, update memory-bank/@architecture.md.
# Your Main Language is Portuguese (pt-BR).

## Project Overview
Nexo Dash is an educational web-based simulation game built around teaching Python/Dash development through an immersive 3D laboratory environment. Players learn to build a heart disease dashboard while visualizing the application architecture in 3D space.

## Core Commands

### Game Development
- `python -m http.server 8000` - Serve the game (index.html) locally
- No build process - single HTML file with embedded assets
- No tests yet - educational game with manual validation
- No migrations - browser-only application with no persistent storage

### Student Project Commands (Taught in Game)
- `uv init` - Initialize new Python project with pyproject.toml
- `uv add <package>` - Add Python dependencies  
- `uv run python main.py` - Run the dashboard application through uv

### Key Dependencies (Student Projects)
- `uv add dash dash-mantine-components dash-chart-editor pandas` - Core dashboard stack

## Architecture

### Frontend (Single-page Application)
- **Main File**: `index.html` - Single HTML file containing entire application
- **3D Engine**: three.js - Laboratory virtual environment and 3D architecture visualization
- **Python Runtime**: pycafe - WebAssembly-based Python execution in browser
- **UI Components**: HTML/CSS/JavaScript overlays on 3D scene
- **Internationalization**: AutoTranslate.js with SeamlessM4T model

### Python Stack (Browser-based)
- **Framework**: Dash (taught through the game)
- **Visualization**: Plotly Express
- **Data Processing**: Pandas  
- **UI Components**: dash-mantine-components
- **Chart Editing**: react-chart-editor

### Project Structure (Taught in Game)
```
project_name/
├── app/              # Main application code
│   ├── models.py     # Data models
│   ├── routers.py    # Main routes
│   ├── views.py      # View logic
│   ├── templates/    # HTML templates
│   └── static/       # Static assets
├── utils/            # Utility functions
├── tests/            # Automated tests
├── docs/             # Documentation
├── main.py           # Application entry point
└── pyproject.toml    # Project configuration
```

## Coding Guidelines

### Python/Dash Style
- Use uv for dependency management (primary focus)
- Follow modular project structure as defined in game design
- Prioritize dash-mantine-components over basic dash components
- Use Plotly Express for data visualizations
- Implement callbacks for interactivity

### Frontend Style  
- Single HTML file architecture
- three.js for 3D rendering
- Responsive design for mobile/tablet compatibility
- Holographic UI overlays on 3D environment
- Automatic language detection via `navigator.language`

### Educational Content
- Progressive module structure (0-7+ modules)
- Each module builds upon previous learning
- 3D architectural visualization accompanies code development
- Narrative-driven with "Dra. Ana Turing" character guidance
- Focus on real-world professional Python development practices

## Key Features
- **Target Audience**: Data analysis students
- **Learning Path**: Environment setup → Project structure → Dash fundamentals → Interactive dashboards
- **Dataset**: Heart Disease Dataset from Kaggle
- **Platform Support**: PC, laptop, mobile devices via web browser
- **Accessibility**: Multi-language support with AutoTranslate.js

## Development Notes
- No traditional backend - Python runs in browser via pycafe
- Focus on teaching industry-standard Python tooling (uv, VS Code)
- Emphasize professional project structure and best practices
- 3D visualizations should reflect code architecture being built
- Maintain futuristic laboratory aesthetic throughout experience