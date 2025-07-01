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

    Chart Editor: react-chart-editor

3. Application Technologies

    Main File: A single index.html file.

    Python Execution Core: Pyodide will be used to run Python code (Dash, Pandas, etc.) directly in the user's browser via WebAssembly.

    3D Rendering and Interface: three.js is the fundamental library for creating the entire visual experience of the virtual laboratory, including holographic panels and the visualization of the dashboard architecture.

    2D Interface (Overlays): Standard HTML, CSS, and JavaScript will be used to create the interface elements that appear over the 3D scene, such as the code editor and text panels.

4. Internationalization and Accessibility (i18n)

    Automatic Language Detection: The application will detect the user's browser language (navigator.language) as a starting point for translation.

    Translation Solution: The AutoTranslate.js library will be used. This tool will dynamically translate the page content using an AI model (SeamlessM4T).

    Language Selector: A control in the interface will allow the user to choose a different language at any time, triggering AutoTranslate.js to re-translate the content.

5. Reference Documents (Architect's Arsenal)

    Official Python Documentation

    Dash and Plotly Documentation

    Dash Mantine Components Documentation

    Pandas Documentation

    uv (Astral) Documentation

    Visual Studio Code Documentation

    React Chart Editor Repository