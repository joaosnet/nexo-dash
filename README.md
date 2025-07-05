# 🚀 Nexo Dash - Virtual Laboratory for Python/Dash Learning

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/joaosnet/nexo-dash)
[![Demo](https://img.shields.io/badge/demo-live-blue.svg)](https://joaosnet.github.io/nexo-dash)

*A fully immersive 3D educational simulation for learning professional Python/Dash development*

[🎮 **Live Demo**](https://joaosnet.github.io/nexo-dash) | [📖 Documentation](./memory-bank/) | [🐛 Report Bug](https://github.com/joaosnet/nexo-dash/issues)

</div>

---

## 🌟 Overview

**Nexo Dash** is an innovative educational web application that transforms the way students learn Python and Dash development. Built as a futuristic 3D virtual laboratory, it provides an immersive learning experience where students build a real-world heart disease dashboard while visualizing the application architecture in interactive 3D space.

### ✨ Key Features

- 🎓 **Educational Game**: Learn through guided missions with Dr. Ana Turing
- 🔬 **Virtual Laboratory**: Immersive 3D environment built with three.js
- 🐍 **Browser-based Python**: Execute Python code directly in the browser using pycafe
- 📊 **Real Dataset**: Work with actual heart disease data from Kaggle
- 🌐 **Multi-language Support**: Automatic translation with AutoTranslate.js
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🏗️ **Professional Workflow**: Learn industry-standard tools (uv, VS Code)

## 🎯 Learning Objectives

By completing Nexo Dash, students will master:

- ⚙️ **Professional Environment Setup**: VS Code, Python, and uv package manager
- 🗂️ **Project Structure**: Modular and scalable Python application architecture
- 📈 **Dash Framework**: Core concepts and component system
- 🎨 **Modern UI Components**: dash-mantine-components for rich interfaces
- 📊 **Data Visualization**: Plotly Express and interactive chart editing
- 🔄 **Callback System**: Creating interactive dashboards
- 📋 **Real-world Application**: Complete dashboard development workflow

## 🚀 Quick Start

### Option 1: Online Demo (Recommended)
Visit the live demo: **[https://joaosnet.github.io/nexo-dash](https://joaosnet.github.io/nexo-dash)**

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/joaosnet/nexo-dash.git
cd nexo-dash

# Serve locally
python -m http.server 8000

# Open browser
# Navigate to: http://localhost:8000
```

## 🏗️ Architecture

Nexo Dash is built as a **single HTML file** application with embedded technologies:

### 🛠️ Core Technologies
- **🌐 Frontend**: Single-page application (index.html)
- **🎮 3D Engine**: three.js for virtual laboratory environment
- **🐍 Python Runtime**: pycafe (WebAssembly) for browser-based Python execution
- **🎨 UI Framework**: HTML/CSS/JavaScript overlays on 3D scene
- **🌍 Internationalization**: AutoTranslate.js v2.0.1 with SeamlessM4T

### 📚 Python Stack (Taught in Game)
- **⚡ Framework**: Dash for web applications
- **📊 Visualization**: Plotly Express for data charts
- **🔍 Data Processing**: Pandas for data manipulation
- **🎯 UI Components**: dash-mantine-components for modern interfaces
- **✏️ Chart Editing**: dash-chart-editor for interactive customization

### 🛠️ Development Tools (Taught in Game)
- **📝 Code Editor**: Visual Studio Code
- **📦 Package Manager**: uv (primary focus)
- **🔧 Version Control**: Git

## 📖 Learning Modules

### 🔧 Module 0: Workstation Calibration
- Meet Dr. Ana Turing, your holographic mentor
- Install and configure VS Code with Python extensions
- Set up uv package manager
- Initialize project with `uv init`
- Install dependencies: `uv add dash dash-mantine-components dash-chart-editor pandas`

### 🗂️ Module 1: Project Blueprint
- Explore interactive 3D project structure
- Download Heart Disease Dataset from Kaggle
- Understand professional Python project organization

### 🏗️ Modules 2-7+: Dashboard Construction
- **Module 2**: Server Core (`app = Dash(__name__)`)
- **Module 3**: Layout Structure (dash_html_components)
- **Module 4**: First Visualization (dash_core_components + Plotly)
- **Module 5**: Interactivity (callbacks)
- **Module 6**: Enhanced UI (dash-mantine-components)
- **Module 7**: Advanced Visualization (dash-chart-editor)

## 📊 Dataset

The learning experience centers around the **Heart Disease Dataset** from Kaggle:
- **Source**: [Heart Disease Dataset](https://www.kaggle.com/datasets/johnsmith88/heart-disease-dataset)
- **Format**: CSV
- **Use Case**: Analyze cardiac risk factors through data visualization
- **Learning Value**: Real-world data science application

## 🎨 Visual Experience

### 🌌 3D Virtual Laboratory
- Futuristic holographic interface
- Interactive architectural visualization
- Real-time code-to-3D mapping
- Smooth animations and transitions

### 📱 Responsive Design
- **Mobile**: 320px - 767px (Essential functionality)
- **Tablet**: 768px - 1023px (Adapted interface)
- **Desktop**: 1024px - 1439px (Full experience)
- **Large Desktop**: 1440px+ (Enhanced experience)

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### 🚀 Development Commands

```bash
# Start local development server
python -m http.server 8000

# Student project commands (taught in game)
uv init                                                    # Initialize Python project
uv add dash dash-mantine-components dash-chart-editor pandas  # Add dependencies
uv run python main.py                                     # Run Dash application
```

## 📋 Project Status

- 🟢 **Phase 1**: Foundation and 3D Environment ✅
- 🟡 **Phase 2**: Holographic Interface and Initial Modules 🔄
- ⚪ **Phase 3**: Dashboard Simulation and Core Logic ⏳
- ⚪ **Phase 4**: Finalization and Polish ⏳
- ⚪ **Phase 5**: Testing and Distribution ⏳

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Target Audience**: Data analysis students and Python enthusiasts
- **Educational Focus**: Professional development practices and real-world applications
- **Inspiration**: Making programming education more engaging and immersive

---

<div align="center">

**[🎮 Try Nexo Dash Now](https://joaosnet.github.io/nexo-dash)**

*Transform your Python/Dash learning journey in a futuristic virtual laboratory*

</div>