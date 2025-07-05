/**
 * AppConfig - Configurações globais da aplicação
 * Centralizador de todas as configurações do Nexo Dash
 */
export const AppConfig = {
    // Informações da aplicação
    app: {
        name: "Nexo Dash",
        version: "2.0.0",
        description: "Laboratório Virtual de Simulação para Python/Dash",
        author: "Nexo Dash Team",
        language: "pt-BR"
    },

    // Configurações de desenvolvimento
    development: {
        debug: false, // Será definido automaticamente baseado no hostname
        logLevel: "info", // debug, info, warn, error
        showPerformanceMetrics: false,
        enableHotReload: false
    },

    // Configurações de carregamento
    loading: {
        maxRetries: 20,
        retryDelay: 500,
        progressSteps: {
            dependencies: 50,
            systems: 80,
            initialization: 100
        },
        messages: {
            "pt-BR": {
                checking: "Verificando dependências...",
                loading: "Carregando: {0}...",
                systems: "Sistemas registrados...",
                starting: "Iniciando laboratório...",
                complete: "Sistema pronto!"
            },
            "en-US": {
                checking: "Checking dependencies...",
                loading: "Loading: {0}...",
                systems: "Systems registered...",
                starting: "Starting laboratory...",
                complete: "System ready!"
            }
        }
    },

    // Configurações do Three.js
    three: {
        renderer: {
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false
        },
        camera: {
            fov: 75,
            near: 0.1,
            far: 1000,
            position: { x: 5, y: 3, z: 5 },
            lookAt: { x: 0, y: 0, z: 0 }
        },
        lighting: {
            ambient: {
                color: 0x404040,
                intensity: 0.6
            },
            directional: {
                color: 0xffffff,
                intensity: 1.0,
                position: { x: 10, y: 10, z: 5 },
                castShadow: true,
                shadowMapSize: 2048
            },
            point: {
                color: 0x00ff88,
                intensity: 0.8,
                position: { x: 0, y: 5, z: 0 },
                distance: 20,
                decay: 2
            }
        },
        controls: {
            enableDamping: true,
            dampingFactor: 0.25,
            enableZoom: true,
            enableRotate: true,
            enablePan: true,
            maxDistance: 20,
            minDistance: 3,
            maxPolarAngle: Math.PI / 2.2
        },
        shadows: {
            enabled: true,
            type: "PCFSoft", // Basic, PCF, PCFSoft, VSM
            autoUpdate: true
        }
    },

    // Configurações da Dra. Ana Turing
    drTuring: {
        models: {
            primary: "./assets/dra_ana_turing/Pbr/base_basic_pbr.glb",
            fallback: "./assets/dra_ana_turing/Shaded/base_basic_shaded.glb",
            realistic: "./assets/dra_ana_turing_realista/character.fbx"
        },
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        animations: {
            idle: "idle",
            wave: "wave",
            talk: "talk",
            point: "point"
        },
        speech: {
            bubbleStyle: {
                background: "rgba(0, 255, 136, 0.9)",
                color: "#000000",
                padding: "15px 20px",
                borderRadius: "20px",
                fontSize: "16px",
                maxWidth: "300px",
                lineHeight: "1.4"
            },
            defaultDuration: 5000,
            typingSpeed: 50,
            positions: {
                above: { x: 0, y: 3, z: 0 },
                side: { x: 2, y: 2, z: 0 }
            }
        }
    },

    // Configurações do ambiente
    environment: {
        laboratory: {
            platform: {
                radius: 8,
                height: 0.2,
                segments: 32,
                color: 0x00ff88,
                opacity: 0.3,
                emissive: 0x004422
            },
            grid: {
                size: 16,
                divisions: 16,
                color: 0x00ff88,
                opacity: 0.2
            },
            core: {
                radius: 0.5,
                color: 0x00ccff,
                opacity: 0.8,
                emissive: 0x002244,
                position: { x: 0, y: 2, z: 0 }
            }
        },
        models: [
            {
                name: "server",
                path: "./assets/servidor/scene.gltf",
                position: { x: 0, y: 1.5, z: 0 },
                scale: { x: 0.8, y: 0.8, z: 0.8 },
                replaces: "laboratory-core"
            },
            {
                name: "gpu",
                path: "./assets/gpu_nvidia/Pbr/base_basic_pbr.glb",
                position: { x: 6, y: 1, z: -3 },
                scale: { x: 1.5, y: 1.5, z: 1.5 },
                rotation: { y: Math.PI / 4 }
            },
            {
                name: "python-icon",
                path: "./assets/icon_3d_python/Pbr/base_basic_pbr.glb",
                position: { x: -6, y: 2, z: -3 },
                scale: { x: 1.2, y: 1.2, z: 1.2 }
            },
            {
                name: "toolbox",
                path: "./assets/tool_box/Pbr/base_basic_pbr.glb",
                position: { x: 6, y: 0.5, z: 3 },
                scale: { x: 1.8, y: 1.8, z: 1.8 },
                rotation: { y: -Math.PI / 6 }
            }
        ],
        particles: {
            count: 50,
            colors: [0x00ff88, 0x00ccff],
            opacity: 0.6,
            size: 0.02,
            speed: { min: 0.001, max: 0.003 },
            range: { min: 5, max: 13 }
        }
    },

    // Configurações da UI
    ui: {
        panels: {
            default: {
                width: "400px",
                height: "auto",
                position: "right",
                theme: "holographic",
                opacity: 0.95,
                animation: {
                    duration: 500,
                    easing: "ease-out"
                }
            },
            module: {
                width: "500px",
                height: "600px",
                position: "center",
                theme: "holographic",
                opacity: 0.9
            },
            code: {
                width: "800px",
                height: "500px",
                position: "center",
                theme: "code",
                opacity: 0.95
            }
        },
        notifications: {
            duration: 5000,
            position: "top-right",
            maxVisible: 3,
            types: {
                info: {
                    background: "rgba(0, 255, 136, 0.9)",
                    color: "#000000"
                },
                success: {
                    background: "rgba(46, 213, 115, 0.9)",
                    color: "#ffffff"
                },
                warning: {
                    background: "rgba(255, 165, 2, 0.9)",
                    color: "#000000"
                },
                error: {
                    background: "rgba(255, 71, 87, 0.9)",
                    color: "#ffffff"
                }
            }
        },
        themes: {
            holographic: {
                background: "rgba(0, 255, 136, 0.1)",
                border: "2px solid rgba(0, 255, 136, 0.3)",
                color: "#00ff88",
                backdropFilter: "blur(10px)",
                boxShadow: "0 0 30px rgba(0, 255, 136, 0.2)"
            },
            code: {
                background: "rgba(0, 0, 0, 0.9)",
                border: "1px solid #333",
                color: "#00ff88",
                fontFamily: "monospace"
            },
            dark: {
                background: "rgba(0, 0, 0, 0.8)",
                border: "1px solid #444",
                color: "#ffffff"
            }
        }
    },

    // Configurações dos módulos educacionais
    modules: {
        autoProgress: false,
        showProgress: true,
        allowSkip: false,
        defaultStepDuration: 30000,
        transitionDuration: 1000,
        camera: {
            smoothTransitions: true,
            transitionDuration: 2000,
            easing: "ease-out"
        }
    },

    // Configurações de performance
    performance: {
        targetFPS: 60,
        adaptiveQuality: true,
        shadowMapSize: 2048,
        maxLights: 8,
        cullingDistance: 100,
        lodLevels: 3,
        textureQuality: "high", // low, medium, high
        particleLimit: 500
    },

    // Configurações de áudio (para implementação futura)
    audio: {
        enabled: false,
        volume: {
            master: 0.7,
            effects: 0.5,
            ambient: 0.3,
            voice: 0.8
        },
        sounds: {
            ui: "./assets/audio/ui/",
            ambient: "./assets/audio/ambient/",
            voice: "./assets/audio/voice/"
        }
    },

    // Configurações de analytics (para implementação futura)
    analytics: {
        enabled: false,
        trackProgress: true,
        trackInteractions: true,
        trackPerformance: false,
        endpoint: null
    },

    // URLs e recursos externos
    resources: {
        cdn: {
            threejs: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
            controls: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js",
            gltfLoader: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js",
            fbxLoader: "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/FBXLoader.js",
            fflate: "https://unpkg.com/fflate@0.6.9/umd/index.js"
        },
        documentation: {
            dash: "https://dash.plotly.com/",
            plotly: "https://plotly.com/python/",
            pandas: "https://pandas.pydata.org/docs/",
            uv: "https://github.com/astral-sh/uv",
            threejs: "https://threejs.org/docs/"
        }
    },

    // Responsividade
    responsive: {
        breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        },
        adaptations: {
            mobile: {
                reduceParticles: true,
                simplifyLighting: true,
                disableShadows: false,
                reducedAnimations: false
            },
            tablet: {
                reduceParticles: false,
                simplifyLighting: false,
                disableShadows: false,
                reducedAnimations: false
            }
        }
    },

    // Configurações de erro e debug
    errors: {
        showUserFriendlyMessages: true,
        logToConsole: true,
        maxRetries: 3,
        fallbackBehavior: "graceful",
        reportEndpoint: null
    },

    // Configurações específicas do navegador
    browser: {
        detectWebGL: true,
        requireWebGL2: false,
        fallbackFor: {
            noWebGL: "show_error",
            oldBrowser: "show_warning",
            mobile: "adapt_interface"
        }
    },

    // Utilitários de configuração
    utils: {
        /**
         * Obtém configuração com base no ambiente
         */
        getEnvironmentConfig() {
            const isDev = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
            
            return {
                ...this.development,
                debug: isDev,
                logLevel: isDev ? "debug" : "warn",
                showPerformanceMetrics: isDev
            };
        },

        /**
         * Obtém configurações responsivas
         */
        getResponsiveConfig() {
            const width = window.innerWidth;
            
            if (width <= this.responsive.breakpoints.mobile) {
                return { device: 'mobile', ...this.responsive.adaptations.mobile };
            } else if (width <= this.responsive.breakpoints.tablet) {
                return { device: 'tablet', ...this.responsive.adaptations.tablet };
            } else {
                return { device: 'desktop' };
            }
        },

        /**
         * Formata string com placeholders
         */
        formatString(template, ...args) {
            return template.replace(/{(\d+)}/g, (match, index) => {
                return args[index] !== undefined ? args[index] : match;
            });
        },

        /**
         * Mescla configurações profundamente
         */
        mergeConfig(base, override) {
            const result = { ...base };
            
            Object.keys(override).forEach(key => {
                if (typeof override[key] === 'object' && override[key] !== null) {
                    result[key] = this.mergeConfig(result[key] || {}, override[key]);
                } else {
                    result[key] = override[key];
                }
            });
            
            return result;
        },

        /**
         * Valida configuração obrigatória
         */
        validateConfig() {
            const required = [
                'app.name',
                'three.camera.position',
                'drTuring.models.primary',
                'ui.panels.default'
            ];

            const missing = [];
            
            required.forEach(path => {
                const value = this.getNestedValue(this, path);
                if (value === undefined || value === null) {
                    missing.push(path);
                }
            });

            if (missing.length > 0) {
                throw new Error(`Configurações obrigatórias ausentes: ${missing.join(', ')}`);
            }

            return true;
        },

        /**
         * Obtém valor aninhado do objeto
         */
        getNestedValue(obj, path) {
            return path.split('.').reduce((current, key) => {
                return current && current[key] !== undefined ? current[key] : undefined;
            }, obj);
        }
    }
};

// Configurar ambiente automaticamente
AppConfig.development = AppConfig.utils.getEnvironmentConfig();

// Exportar configuração como padrão
export default AppConfig;
