Implementation Plan: Nexo Dash        
Include the CDN links for:

            three.js (for the 3D scene).

            Pyodide (to run Python).

            AutoTranslate.js v2.0.1 (for translation). Dash

This document details the step-by-step implementation plan for the "Nexo Dash" project, based on the GDD and the defined technology stack.

Phase 1: Foundation and Environment Structure (Scaffolding)

Objective: Create the application skeleton, configure the basic 3D environment, and ensure that Pyodide (the Python engine) is working.

    Create the Main File:

        Create the index.html file.

        Add the basic HTML structure (<!DOCTYPE html>, <html>, <head>, <body>).

        Include essential meta tags, such as viewport for responsiveness.

    Integrate Main Libraries:

        In the <head>, add the CDN links for:

            three.js (for the 3D scene).

            Pyodide (to run Python).

            AutoTranslate.js (for translation).

    Configure the Basic 3D Scene (three.js):

        Inside a <script> tag in index.html, write the JavaScript code to:

            Initialize the WebGLRenderer from three.js and attach it to the <body>.

            Create a Scene and a PerspectiveCamera.

            Add a camera control (OrbitControls) to allow the user to rotate and zoom.

            Add basic lighting (e.g., AmbientLight and DirectionalLight).

            Create an animation loop (requestAnimationFrame) to render the scene continuously.

    Initialize Pyodide:

        In the same script, write the asynchronous function to initialize Pyodide.

        Use loadPyodide() and then load the essential Python packages that will be used later, such as pandas, plotly, and dash. This may take some time, so it's important to display a "Loading Laboratory..." message to the user.

Phase 2: Holographic Interface and Initial Modules (UI/UX)

Objective: Build the user interface for the configuration modules (0 and 1), which consist of holographic panels and 3D diagrams.

    Create Holographic Panels:

        Use HTML/CSS to create the overlay panels that will contain the mission text and code editor.

        Style the panels with CSS to give them a translucent glass appearance with a "glow" effect, so that they integrate into the 3D scene.

    Implement Module 0 (Calibration):

        Populate the mission panel with the text and instructions for Module 0.

        Add the link to the VS Code download page.

        Create functions in JavaScript to control the "next step" logic and trigger the 3D "calibration" animations in the three.js scene.

    Implement Module 1 (Project Blueprint):

        Use three.js to create an interactive 3D diagram of the folder structure. Each folder/file can be a BoxGeometry with a TextGeometry or Sprite for the name.

        Add interactivity (Raycasting in three.js) so that when you click on an object in the diagram, its information appears in the holographic panel.

Phase 3: Dashboard Simulation and Central Logic

Objective: Implement the core of the learning experience, where the user's code builds the 3D hologram and renders the 2D dashboard.

    Integrate the Code Editor:

        Add a lightweight JavaScript code editor (such as Ace or Monaco Editor) to the corresponding panel.

    Develop the Simulation Parser:

        Create a JavaScript function that takes the Python code from the editor.

        This function will not execute the code directly with Pyodide yet. Instead, it will use regular expressions or simple analysis to detect keywords (app = Dash, dcc.Graph, @app.callback).

        Based on the detected keywords, the function will trigger the corresponding events.

    Connect the Parser to the 3D Visualization:

        Create three.js functions for each parser event:

            createCore(): Generates the pulsating energy core.

            createScaffolding(): Generates the metal structure.

            createCrystal(): Generates a chart component.

            createCallbackBeam(): Generates the animated light beam.

        When the parser detects @app.callback, for example, it will call the createCallbackBeam() function.

    Render the 2D Dashboard (Preview):

        After code validation by the parser, the actual Python code is sent to Pyodide.

        Pyodide executes the Dash code and returns the dashboard layout structure.

        A JavaScript function will translate this structure into HTML elements and inject it into the preview panel.

    Implement the Chart Editor:

        Integrate the dash-chart-editor v0.0.1a5 (which replaces react-chart-editor) into a modal or panel.

        When the user edits a chart, the editor will generate a new Plotly JSON specification. This specification will be used to update both the 2D chart in the preview and the appearance of the corresponding 3D "crystal".

Phase 4: Finalization and Polishing

Objective: Add the final layers of functionality, sound, and optimization.

    Implement Translation:

        Configure AutoTranslate.js v2.0.1 to observe the text elements of the interface.

        Create the language selector (a simple dropdown) and link its change to the library's translation function.

    Add Audio:

        Use the Web Audio API to load and play sound effects and background music.

        Find or create audio assets for:
          - Ambient laboratory soundtrack
          - Interaction sound effects (clicks, module completion)  
          - 3D animation audio feedback
          - UI feedback sounds

        Link sound effects to interaction events (clicks, module completion, 3D animations).

    Optimization:

        Review the three.js code to optimize performance (e.g., use InstancedMesh if there are many repeated objects).

        Ensure that the initial loading of Pyodide has clear visual feedback for the user.

Phase 5: Testing and Distribution

Objective: Ensure that the application works correctly in different environments.

    Compatibility Tests:

        Test the application in major browsers (Chrome, Firefox, Safari, Edge).

        Test on different devices (desktop, laptop, tablet, smartphone) using industry-standard breakpoints:
          - Mobile: 320px - 767px
          - Tablet: 768px - 1023px  
          - Desktop: 1024px - 1439px
          - Large Desktop: 1440px+

        Ensure that the responsive layout is working correctly across all breakpoints.

    Final Review:

        Go through the entire user journey, from Module 0 to the end, to find bugs or flow issues.

    Distribution:

        Since the project is a single index.html file, distribution is simple: the file can be hosted on any static web server.

        Initial deployment will be on GitHub Pages with GitHub Actions for automatic deployment.

        The application can also be sent directly to users as a single file.

## Additional Implementation Details

### Dataset Integration
- **Heart Disease Dataset**: Download URL: https://www.kaggle.com/api/v1/datasets/download/johnsmith88/heart-disease-dataset
- **Integration Point**: Module 1 (Project Blueprint) - students will be instructed to download and place in project's `data/` folder
- **Usage**: Throughout modules for building dashboard visualizations

### VS Code Configuration (Module 0)
- **Installation Guide**: Provide VS Code download links and installation instructions
- **Extensions**: Recommend Python extension pack
- **Terminal Setup**: Configure integrated terminal for uv commands
- **Project Setup**: Guide through opening project folder and terminal

### Package Manager Focus (uv)
- **Installation**: Detailed uv installation and PATH configuration
- **Core Commands**: 
  - `uv init` - Initialize project with pyproject.toml
  - `uv add dash dash-mantine-components dash-chart-editor pandas` - Add dependencies
  - `uv run python main.py` - Run application
- **Benefits**: Explain fast dependency resolution and virtual environment management

### React Integration
- **Automatic Instantiation**: React will be automatically available through dash-mantine-components
- **No Manual Setup**: Students don't need to configure React separately
- **Component Usage**: Focus on dash-mantine-components syntax rather than raw React

### Responsive Design Implementation
- **CSS Grid/Flexbox**: Use modern CSS layout for 3D overlays
- **Media Queries**: Implement breakpoints for different screen sizes
- **Touch Optimization**: Ensure 3D controls work on touch devices
- **Performance**: Optimize three.js rendering for mobile devices