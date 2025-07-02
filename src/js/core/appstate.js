/* 
 * Nexo Dash - Estado Global da Aplicação
 * Centraliza o estado global e variáveis compartilhadas
 */

const AppState = {
    // Estado da aplicação
    isInitialized: false,
    currentModule: 0,
    
    // Instâncias Three.js
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    animationId: null,
    
    // Instância Pyodide
    pyodide: null,
    
    // Personagens e objetos 3D
    drTuring: null,
    drTuringAnimations: null,
    drTuringSpeech3D: null,
    drTuringLighting: null,
    
    // Sistema de câmera
    cameraOrbit: null,
    
    // Função para resetar estado
    reset() {
        this.isInitialized = false;
        this.currentModule = 0;
        
        // Limpar animações
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Limpar Three.js
        if (this.scene) {
            this.scene.clear();
        }
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.pyodide = null;
        this.drTuring = null;
        this.drTuringAnimations = null;
        this.drTuringSpeech3D = null;
        this.drTuringLighting = null;
        this.cameraOrbit = null;
    },
    
    // Função para verificar se está pronto
    isReady() {
        return this.isInitialized && 
               this.scene && 
               this.camera && 
               this.renderer;
    },
    
    // Logs de debug
    log(message, level = 'info') {
        if (AppConfig.debug.enableLogging) {
            console[level](`[AppState] ${message}`);
        }
    }
};

// Disponibilizar globalmente
window.AppState = AppState;
