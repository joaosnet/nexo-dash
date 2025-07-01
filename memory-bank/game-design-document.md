Game Design Document: Nexo Dash

1. Overview

    Game Title: Nexo Dash

    Concept: A fully immersive learning journey within a "Virtual Simulation Laboratory." Using a futuristic interface built with three.js, the student learns to set up a professional Python environment and structure a project. Then, module by module, they build a complete heart disease dashboard, visualizing the application architecture in an interactive 3D projection.

    Genre: Educational, Simulation, Hands-on Tutorial.

    Target Audience: Undergraduate students in areas involving data analysis.

2. Learning Objectives

    Set Up a Professional Development Environment: Install and configure VS Code, Python, and the uv package manager.

    Structure a Professional Project: Understand and create a modular and scalable folder structure.

    Visualize and Understand Dash Architecture: Understand how the different parts of a Dash application connect.

    Understand the Fundamental Code Structure of a Dash Application.

    Use Native Dash Components: Master the use of dash_html_components and dash_core_components.

    Use Third-Party Component Libraries: Learn to integrate and use dash-mantine-components to create richer and more modern interfaces.

    Visualize Data with Plotly Express.

    Edit Charts Interactively: Use react-chart-editor to customize data visualizations intuitively.

    Create Interactivity with Callbacks.

    Apply Skills in a Real Project: Consolidate knowledge to build a complete dashboard with data from Kaggle.

3. Narrative and Theme

    Theme: The player is a "Data Architect" in training.

    Narrative: The journey begins when the student "logs in" to the Nexo Dash Virtual Simulation Laboratory. The mentor, Dr. Ana Turing, appears as a hologram and recruits them for an important mission: to analyze the risk factors for heart disease using a real dataset. In each module, the student will add a new functionality to the dashboard, seeing both the practical result and the 3D architecture grow simultaneously.

4. Gameplay and Architectural Visualization

The experience is continuous within the three.js environment:
4.1. Module 0: Workstation Calibration

    Presentation: Dr. Turing guides the student through a professional workflow displayed on holographic panels. The detailed steps are:

        Project Creation: Instruct the student to create a local folder for the project and open a terminal inside it.

        uv Installation: Present the instructions to install uv and configure the environment variables necessary for the command to be recognized by the terminal.

        Environment Initialization: The student will execute the uv init command. Dr. Turing will explain that this command creates the pyproject.toml file, which is the control center of the project.

        Adding Dependencies: The student will use the command uv add dash dash-mantine-components dash-chart-editor pandas to add the essential libraries. The simulation will visually show these dependencies being added to pyproject.toml.

        Project Execution: Finally, Dr. Turing will teach the standard command to execute the project: uv run python main.py, explaining how uv manages the virtual environment transparently.

    3D Interaction: Upon confirming the completion of each step, a subtle animation occurs in the background of the scene, such as a beam of light that stabilizes, showing that the "Workstation" is being calibrated and successfully synchronized.

4.2. Module 1: Loading the Blueprint and Project Data

    Presentation: Dr. Turing presents the ideal folder structure as an interactive 3D diagram. The student can rotate the diagram and click on each element to see its description. The structure taught is:

    project_name/
    │
    ├── app/              # Main application code
    │   ├── __init__.py   # Package initialization
    │   ├── models.py     # Data models
    │   ├── routers.py    # Main routes
    │   ├── views.py      # View logic
    │   ├── templates/    # HTML templates
    │   └── static/       # Static files (CSS, JS, Images)
    │
    ├── utils/            # Utility functions and helpers
    │
    ├── tests/            # Automated tests
    │
    ├── docs/             # Project documentation
    │
    ├── instance/         # Environment-specific configurations
    │
    ├── cache/            # Cache files
    │
    ├── criar_banco.py    # Script for database creation
    ├── Dockerfile        # Docker file for containerization
    ├── main.py           # Application entry point
    ├── pyproject.toml    # Project configuration (dependencies, etc.)
    ├── requirements.txt  # Project dependencies
    ├── .gitignore        # Files and folders ignored by Git
    └── README.md         # Initial project documentation

    Next, she presents the central mission and directs the student to download the "Heart Disease Dataset" from Kaggle, instructing them to save it in the correct project folder.

    3D Interaction: The 3D diagram lights up, and a new object representing the "data container" is added to the scene, ready to be used.

4.3. Modules 2 onwards: Iterative Dashboard Construction

The focus shifts to building the health dashboard, with the 3D architecture being assembled in parallel:

    Module 2 (The Server Core): The student writes app = Dash(__name__) to start the dashboard server. A pulsating 3D energy core appears.

    Module 3 (The Layout Scaffolding): The student creates the initial layout with dash_html_components, adding a title like "Cardiac Analysis Panel." A transparent metal structure is assembled in the hologram.

    Module 4 (First Visualization): Using dash_core_components and Plotly, the student creates the first graph (e.g., a histograma of patient age). A functional crystalline object is inserted into the 3D structure.

    Module 5 (Making it Interactive): The student adds a callback to filter the data (e.g., by gender) and see the graph update. An animated beam of light connects the components in the hologram, showing the nexus.

    Module 6 (Enhancing with Mantine): The student replaces the basic components with dash-mantine-components for a more professional look. The 3D pieces receive a visual "upgrade," becoming more polished.

    Module 7 (Refining the Visualization): The student uses the react-chart-editor to customize the existing graphs, adjusting colors and axes.

    Completion Project: The final mission is not to start a new project but to finalize and expand the existing dashboard. Dr. Turing will ask for the addition of a new analysis page or a set of advanced KPIs, consolidating all the learning into a single and impressive final result.

5. User Interface (UI/UX)

    Unified Environment: The interface is consistent across all modules, with a persistent 3D scene background. The content appears as holographic overlays within this space.

6. Art and Sound

    Visual Style: Futuristic, clean, and "glow" throughout the experience.

    Sound: Ambient soundtrack and subtle sound effects accompany all interactions.

7. Post-Journey Resources

    Conclusion and Next Steps: Upon completing the final project, Dr. Turing congratulates the student on graduation and emphasizes the importance of continuous learning.

    Documentation Arsenal: As a graduation gift, she materializes a final holographic panel containing the "Architect's Arsenal": a collection of direct links to the official documentation.

    Encouragement to Explore: The narrative ends with Dr. Turing encouraging the student to use these documentations as their primary resource to continue their professional evolution.