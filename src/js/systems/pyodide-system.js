/* 
 * Nexo Dash - Sistema Pyodide
 * Gerencia a execução de Python no navegador
 */

const PyodideSystem = {
    /**
     * Inicializa o sistema Pyodide
     */
    async init() {
        try {
            LoadingSystem.updateProgress(3, 'Inicializando Pyodide...');
            
            // Carregar Pyodide
            AppState.pyodide = await loadPyodide({
                indexURL: AppConfig.pyodide.indexURL
            });

            LoadingSystem.updateProgress(4, 'Carregando pacotes Python...');

            // Carregar pacotes essenciais
            await AppState.pyodide.loadPackage(AppConfig.pyodide.packages);

            // Instalar pacotes via micropip
            await this.installMicropipPackages();

            AppState.log('Pyodide initialized successfully');
            return true;
        } catch (error) {
            console.error('Erro ao inicializar Pyodide:', error);
            AppState.log(`Pyodide initialization error: ${error.message}`, 'error');
            LoadingSystem.updateProgress(4, 'Erro ao carregar Python (continuando...)');
            return false;
        }
    },

    /**
     * Instala pacotes via micropip
     */
    async installMicropipPackages() {
        try {
            const micropip = AppState.pyodide.pyimport('micropip');
            await micropip.install(AppConfig.pyodide.micropipPackages);
            AppState.log('Micropip packages installed');
        } catch (error) {
            AppState.log(`Micropip installation error: ${error.message}`, 'error');
            throw error;
        }
    },

    /**
     * Executa código Python
     * @param {string} pythonCode - Código Python para executar
     * @returns {any} Resultado da execução
     */
    runCode(pythonCode) {
        if (!AppState.pyodide) {
            AppState.log('Pyodide not initialized', 'error');
            return null;
        }

        try {
            const result = AppState.pyodide.runPython(pythonCode);
            AppState.log(`Python code executed successfully`);
            return result;
        } catch (error) {
            AppState.log(`Python execution error: ${error.message}`, 'error');
            return null;
        }
    },

    /**
     * Executa código Python assíncrono
     * @param {string} pythonCode - Código Python para executar
     * @returns {Promise<any>} Resultado da execução
     */
    async runCodeAsync(pythonCode) {
        if (!AppState.pyodide) {
            AppState.log('Pyodide not initialized', 'error');
            return null;
        }

        try {
            const result = await AppState.pyodide.runPythonAsync(pythonCode);
            AppState.log(`Python async code executed successfully`);
            return result;
        } catch (error) {
            AppState.log(`Python async execution error: ${error.message}`, 'error');
            return null;
        }
    },

    /**
     * Instala pacotes adicionais via micropip
     * @param {string|string[]} packages - Pacote(s) para instalar
     */
    async installPackage(packages) {
        if (!AppState.pyodide) {
            AppState.log('Pyodide not initialized', 'error');
            return false;
        }

        try {
            const micropip = AppState.pyodide.pyimport('micropip');
            const packageList = Array.isArray(packages) ? packages : [packages];
            await micropip.install(packageList);
            AppState.log(`Packages installed: ${packageList.join(', ')}`);
            return true;
        } catch (error) {
            AppState.log(`Package installation error: ${error.message}`, 'error');
            return false;
        }
    },

    /**
     * Verifica se Pyodide está pronto
     * @returns {boolean} True se Pyodide está inicializado
     */
    isReady() {
        return AppState.pyodide !== null;
    },

    /**
     * Obtém a versão do Pyodide
     * @returns {string} Versão do Pyodide
     */
    getVersion() {
        if (!AppState.pyodide) {
            return 'Not initialized';
        }
        return AppState.pyodide.version;
    },

    /**
     * Lista pacotes instalados
     * @returns {string[]} Lista de pacotes
     */
    getInstalledPackages() {
        if (!AppState.pyodide) {
            return [];
        }

        try {
            const result = AppState.pyodide.runPython(`
import sys
import pkg_resources
[pkg.project_name for pkg in pkg_resources.working_set]
            `);
            return result.toJs();
        } catch (error) {
            AppState.log(`Error getting packages: ${error.message}`, 'error');
            return [];
        }
    },

    /**
     * Executa código de exemplo para teste
     */
    async runExample() {
        const exampleCode = `
import pandas as pd
import numpy as np

# Criar dados de exemplo
data = {
    'nome': ['Ana', 'Carlos', 'Maria'],
    'idade': [25, 30, 35],
    'salario': [5000, 6000, 7000]
}
df = pd.DataFrame(data)
print("DataFrame criado com sucesso!")
print(df)
df.describe()
        `;

        return this.runCode(exampleCode);
    }
};

// Disponibilizar globalmente
window.PyodideSystem = PyodideSystem;
