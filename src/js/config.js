/* 
 * Nexo Dash - Configurações da Aplicação
 * Este arquivo contém todas as configurações centralizadas
 */

const AppConfig = {
    // Configurações do Three.js
    threejs: {
        antialias: true,
        shadowMapEnabled: true,
        shadowMapType: 'PCFSoftShadowMap',
        backgroundColor: 0x0a0a1a,
        camera: {
            fov: 75,
            near: 0.1,
            far: 1000,
            initialPosition: { x: 0, y: 5, z: 10 }
        }
    },

    // Configurações do Pyodide
    pyodide: {
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        packages: [
            'micropip',
            'pandas',
            'numpy'
        ],
        micropipPackages: [
            'dash',
            'plotly',
            'dash-html-components',
            'dash-core-components'
        ]
    },

    // URLs de assets
    assets: {
        drTuringModel: './assets/Pbr/base_basic_pbr.glb',
        drTuringModelFallback: './assets/Shaded/base_basic_shaded.glb'
    },

    // Configurações do sistema de carregamento
    loading: {
        steps: [
            'Inicializando sistema...',
            'Carregando three.js...',
            'Configurando ambiente 3D...',
            'Inicializando Pyodide...',
            'Carregando pacotes Python...'
        ],
        totalSteps: 5
    },

    // Configurações do laboratório 3D
    laboratory: {
        platform: {
            radius: 8,
            height: 0.2,
            segments: 32,
            color: 0x00ff88,
            opacity: 0.3,
            emissive: 0x004422
        },
        core: {
            radius: 0.5,
            segments: 32,
            color: 0x00ccff,
            opacity: 0.8,
            emissive: 0x002244,
            position: { x: 0, y: 2, z: 0 }
        },
        grid: {
            size: 16,
            divisions: 16,
            color: 0x00ff88,
            opacity: 0.2
        }
    },

    // Configurações da Dra. Turing
    drTuring: {
        position: { x: -8, y: 0, z: 5 },
        scale: { x: 2.5, y: 2.5, z: 2.5 },
        rotation: { x: 0, y: Math.PI / 4, z: 0 },
        materials: {
            skin: 0xffdbac,
            hair: 0x2d1b0e,
            clothing: 0xf8f8ff,
            eyes: 0x4a90e2
        },
        animations: {
            breathingSpeed: 0.005,
            speakingSpeed: 0.02,
            walkDuration: 3000
        },
        speech: {
            balloonSize: { width: 6, height: 3 },
            defaultDuration: 5000
        }
    },

    // Dataset e URLs
    data: {
        heartDiseaseDataset: 'https://www.kaggle.com/api/v1/datasets/download/johnsmith88/heart-disease-dataset'
    },

    // Configurações responsivas
    responsive: {
        breakpoints: {
            mobile: 480,
            tablet: 768,
            laptop: 1024,
            desktop: 1440
        }
    },

    // Configurações de debug
    debug: {
        enableLogging: true,
        showFPS: false,
        showAxes: false
    }
};

// Exportar configurações para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
} else {
    window.AppConfig = AppConfig;
}
