/**
 * EnvironmentManager - Gerenciador do ambiente 3D
 * Responsável por criar e gerenciar o laboratório virtual e elementos do ambiente
 */
export class EnvironmentManager {
    constructor(threeSystem) {
        this.threeSystem = threeSystem;
        this.scene = threeSystem.getScene();
        this.camera = threeSystem.getCamera();
        
        // Estado do ambiente
        this.laboratoryElements = new Map();
        this.blueprintGroup = null;
        this.particleSystems = [];
        
        // Sistemas de interação
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.interactionEnabled = false;
    }

    /**
     * Inicializa o Environment Manager
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            console.log('🌍 Inicializando ambiente 3D...');
            
            this.createLaboratoryPlatform();
            // Modelos geométricos criados sob demanda, não na inicialização
            this.createDecorativeElements();
            this.setupInteractionSystem();
            
            console.log('✅ Ambiente 3D inicializado');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar ambiente:', error);
            throw error;
        }
    }

    /**
     * Cria a plataforma base do laboratório
     */
    createLaboratoryPlatform() {
        // Grid holográfico (piso quadriculado) - mantido
        const gridHelper = new THREE.GridHelper(16, 16, 0x00ff88, 0x00ff88);
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        gridHelper.name = 'laboratory-grid';
        this.scene.add(gridHelper);
        
        this.laboratoryElements.set('grid', gridHelper);

        // Apenas o núcleo central, sem base circular
        this.createCentralCore();
        
        console.log('🏗️ Ambiente do laboratório criado (com piso quadriculado, sem base circular)');
    }

    /**
     * Cria o núcleo central do laboratório
     */
    createCentralCore() {
        const coreGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const coreMaterial = new THREE.MeshLambertMaterial({
            color: 0x00ccff,
            transparent: true,
            opacity: 0.8,
            emissive: 0x002244
        });
        
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.y = 2;
        core.name = 'laboratory-core';
        this.scene.add(core);
        
        this.laboratoryElements.set('core', core);
        
        // Adicionar animação rotacional
        this.addCoreAnimation(core);
    }

    /**
     * Adiciona animação ao núcleo central
     * @param {THREE.Mesh} core - Núcleo a animar
     */
    addCoreAnimation(core) {
        const animateCore = () => {
            if (core && core.parent) {
                core.rotation.y += 0.01;
                core.position.y = 2 + Math.sin(Date.now() * 0.001) * 0.2;
                requestAnimationFrame(animateCore);
            }
        };
        animateCore();
    }

    /**
     * Cria modelos geométricos do laboratório
     */
    createLaboratoryModels() {
        console.log('🏗️ Criando modelos geométricos do laboratório...');
        
        const modelsToCreate = [
            {
                name: 'gpu',
                position: { x: 6, y: 1, z: -3 },
                scale: { x: 1, y: 1, z: 1 },
                rotation: { y: Math.PI / 4 }
            },
            {
                name: 'python-icon',
                position: { x: -6, y: 2, z: -3 },
                scale: { x: 1, y: 1, z: 1 }
            },
            {
                name: 'toolbox',
                position: { x: 6, y: 0.5, z: 3 },
                scale: { x: 1, y: 1, z: 1 },
                rotation: { y: -Math.PI / 6 }
            }
        ];

        modelsToCreate.forEach(modelConfig => {
            const model = this.createGeometricModel(modelConfig);
            if (model) {
                this.scene.add(model);
                this.laboratoryElements.set(modelConfig.name, model);
                console.log(`✅ Modelo geométrico ${modelConfig.name} criado`);
            }
        });
        
        console.log('🏗️ Modelos geométricos do laboratório criados');
    }

    /**
     * Cria apenas os modelos básicos do laboratório (chamado no Módulo 1)
     */
    createBasicLabModels() {
        console.log('🏭 Criando modelos básicos do laboratório...');

        // Não carrega mais o servidor no meio - apenas mantém o núcleo central
        console.log('✅ Modelos básicos mantidos (núcleo central preservado)');
    }

    /**
     * Cria modelos avançados do laboratório (chamado em módulos posteriores)
     */
    createAdvancedLabModels() {
        console.log('🚀 Criando modelos avançados do laboratório...');

        const advancedModels = [
            {
                name: 'gpu',
                position: { x: 6, y: 1, z: -3 },
                scale: { x: 1, y: 1, z: 1 },
                rotation: { y: Math.PI / 4 }
            },
            {
                name: 'python-icon',
                position: { x: -6, y: 2, z: -3 },
                scale: { x: 1, y: 1, z: 1 }
            },
            {
                name: 'toolbox',
                position: { x: 6, y: 0.5, z: 3 },
                scale: { x: 1, y: 1, z: 1 },
                rotation: { y: -Math.PI / 6 }
            }
        ];

        advancedModels.forEach(modelConfig => {
            const model = this.createGeometricModel(modelConfig);
            if (model) {
                this.scene.add(model);
                this.laboratoryElements.set(modelConfig.name, model);
            }
        });

        console.log('✅ Modelos avançados criados');
    }

    /**
     * Cria um modelo geométrico baseado na configuração
     * @param {Object} config - Configuração do modelo
     * @returns {THREE.Group|null}
     */
    createGeometricModel(config) {
        let model;
        
        switch (config.name) {
            case 'server':
                model = this.createServerModel();
                break;
            case 'gpu':
                model = this.createGpuModel();
                break;
            case 'python-icon':
                model = this.createPythonIconModel();
                break;
            case 'toolbox':
                model = this.createToolboxModel();
                break;
            default:
                console.warn(`⚠️ Tipo de modelo desconhecido: ${config.name}`);
                return null;
        }
        
        if (model) {
            // Configurar posição, escala e rotação
            if (config.position) {
                model.position.set(config.position.x, config.position.y, config.position.z);
            }
            if (config.scale) {
                model.scale.set(config.scale.x, config.scale.y, config.scale.z);
            }
            if (config.rotation) {
                model.rotation.set(
                    config.rotation.x || 0,
                    config.rotation.y || 0,
                    config.rotation.z || 0
                );
            }
            
            model.name = `laboratory-${config.name}`;
            
            // Desabilitar animações por padrão
            model.userData.animationDisabled = true;
            
            // Configurar sombras
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            // Adicionar animações específicas
            this.addModelAnimation(model, config.name);
        }
        
        return model;
    }

    /**
     * Cria modelo geométrico de servidor realista
     * @returns {THREE.Group}
     */
    createServerModel() {
        const serverGroup = new THREE.Group();
        
        // Chassi principal do servidor (metal escovado)
        const chassisGeometry = new THREE.BoxGeometry(2.5, 3.5, 2);
        const chassisMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.1,
            envMapIntensity: 1.5
        });
        const chassis = new THREE.Mesh(chassisGeometry, chassisMaterial);
        serverGroup.add(chassis);
        
        // Painel frontal com detalhes
        const frontPanelGeometry = new THREE.BoxGeometry(2.6, 3.6, 0.1);
        const frontPanelMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            metalness: 0.8,
            roughness: 0.2
        });
        const frontPanel = new THREE.Mesh(frontPanelGeometry, frontPanelMaterial);
        frontPanel.position.z = 1.05;
        serverGroup.add(frontPanel);
        
        // Slots para drives (4 unidades)
        for (let i = 0; i < 4; i++) {
            const row = Math.floor(i / 2);
            const col = i % 2;
            
            // Drive bay
            const driveGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.12);
            const driveMaterial = new THREE.MeshStandardMaterial({
                color: 0x34495e,
                metalness: 0.7,
                roughness: 0.3
            });
            const drive = new THREE.Mesh(driveGeometry, driveMaterial);
            drive.position.set(-0.5 + col * 1, 0.8 - row * 0.8, 1.1);
            serverGroup.add(drive);
            
            // LED de atividade do drive
            const ledGeometry = new THREE.SphereGeometry(0.03, 8, 8);
            const ledMaterial = new THREE.MeshStandardMaterial({
                color: i < 2 ? 0x00ff00 : 0xff0000,
                emissive: i < 2 ? 0x00ff00 : 0xff0000,
                emissiveIntensity: 0.8,
                metalness: 0.3,
                roughness: 0.2
            });
            const led = new THREE.Mesh(ledGeometry, ledMaterial);
            led.position.set(0.3, 0, 0.07);
            drive.add(led);
            
            // Handle do drive
            const handleGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.05);
            const handleMaterial = new THREE.MeshStandardMaterial({
                color: 0x555555,
                metalness: 0.8
            });
            const handle = new THREE.Mesh(handleGeometry, handleMaterial);
            handle.position.set(0.35, 0, 0.05);
            drive.add(handle);
        }
        
        // Sistema de ventilação frontal (múltiplos ventiladores)
        for (let i = 0; i < 3; i++) {
            const fanGroup = new THREE.Group();
            
            // Housing do ventilador
            const housingGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 32);
            const housingMaterial = new THREE.MeshStandardMaterial({
                color: 0x2c3e50,
                metalness: 0.6,
                roughness: 0.4
            });
            const housing = new THREE.Mesh(housingGeometry, housingMaterial);
            fanGroup.add(housing);
            
            // Grelha protetora
            for (let j = 0; j < 8; j++) {
                const grillGeometry = new THREE.BoxGeometry(0.6, 0.02, 0.01);
                const grill = new THREE.Mesh(grillGeometry, housingMaterial);
                grill.rotation.z = (j * Math.PI) / 4;
                grill.position.z = 0.05;
                fanGroup.add(grill);
            }
            
            // Pás do ventilador (mais realistas)
            const bladeGroup = new THREE.Group();
            for (let j = 0; j < 7; j++) {
                const bladeGeometry = new THREE.BoxGeometry(0.25, 0.04, 0.01);
                const bladeMaterial = new THREE.MeshStandardMaterial({
                    color: 0x444444,
                    metalness: 0.3,
                    roughness: 0.7
                });
                const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
                blade.rotation.z = (j * 2 * Math.PI) / 7;
                blade.position.x = 0.1;
                bladeGroup.add(blade);
            }
            bladeGroup.position.z = 0.02;
            fanGroup.add(bladeGroup);
            
            // Centro do ventilador
            const centerGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.03, 16);
            const center = new THREE.Mesh(centerGeometry, housingMaterial);
            center.position.z = 0.02;
            fanGroup.add(center);
            
            fanGroup.rotation.x = Math.PI / 2;
            fanGroup.position.set(-0.8 + i * 0.8, -1.2, 1.1);
            serverGroup.add(fanGroup);
        }
        
        // Painel de I/O frontal
        const ioPanel = new THREE.Group();
        
        // Display LCD
        const displayGeometry = new THREE.BoxGeometry(0.6, 0.3, 0.02);
        const displayMaterial = new THREE.MeshStandardMaterial({
            color: 0x001122,
            emissive: 0x0066ff,
            emissiveIntensity: 0.3,
            metalness: 0.4,
            roughness: 0.3
        });
        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        ioPanel.add(display);
        
        // Botões de controle
        for (let i = 0; i < 3; i++) {
            const buttonGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16);
            const buttonMaterial = new THREE.MeshStandardMaterial({
                color: i === 0 ? 0x00ff00 : i === 1 ? 0xffff00 : 0xff0000,
                metalness: 0.5,
                roughness: 0.3
            });
            const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
            button.rotation.x = Math.PI / 2;
            button.position.set(-0.15 + i * 0.15, -0.2, 0.01);
            ioPanel.add(button);
        }
        
        // Portas USB frontais
        for (let i = 0; i < 2; i++) {
            const usbGeometry = new THREE.BoxGeometry(0.05, 0.02, 0.03);
            const usbMaterial = new THREE.MeshStandardMaterial({
                color: 0x000000,
                metalness: 0.1,
                roughness: 0.9
            });
            const usb = new THREE.Mesh(usbGeometry, usbMaterial);
            usb.position.set(-0.1 + i * 0.2, 0.25, 0.01);
            ioPanel.add(usb);
        }
        
        ioPanel.position.set(0, 1.3, 1.15);
        serverGroup.add(ioPanel);
        
        // Cabos traseiros (mais realistas)
        const cableGroup = new THREE.Group();
        const cableTypes = [
            { color: 0x000000, size: 0.04, label: 'Power' },
            { color: 0x0066ff, size: 0.03, label: 'Ethernet' },
            { color: 0xff6600, size: 0.025, label: 'USB' },
            { color: 0xffff00, size: 0.035, label: 'VGA' }
        ];
        
        cableTypes.forEach((cable, i) => {
            // Conector
            const connectorGeometry = new THREE.BoxGeometry(0.1, 0.06, 0.08);
            const connectorMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                metalness: 0.8,
                roughness: 0.2
            });
            const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
            connector.position.set(-0.6 + i * 0.4, 0.5 - Math.floor(i / 2) * 0.6, -1.1);
            cableGroup.add(connector);
            
            // Cabo (curva natural)
            const cableGeometry = new THREE.CylinderGeometry(cable.size, cable.size, 1, 8);
            const cableMaterial = new THREE.MeshStandardMaterial({
                color: cable.color,
                metalness: 0.1,
                roughness: 0.9
            });
            const cableMesh = new THREE.Mesh(cableGeometry, cableMaterial);
            cableMesh.rotation.x = Math.PI / 2;
            cableMesh.position.z = -0.5;
            connector.add(cableMesh);
        });
        
        serverGroup.add(cableGroup);
        
        // Slots de expansão traseiros
        for (let i = 0; i < 6; i++) {
            const slotGeometry = new THREE.BoxGeometry(0.02, 0.3, 0.15);
            const slotMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.9,
                roughness: 0.1
            });
            const slot = new THREE.Mesh(slotGeometry, slotMaterial);
            slot.position.set(-0.75 + i * 0.3, 0.2, -1.05);
            serverGroup.add(slot);
        }
        
        // Fonte de alimentação (PSU)
        const psuGeometry = new THREE.BoxGeometry(0.8, 0.8, 1.8);
        const psuMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            metalness: 0.7,
            roughness: 0.3
        });
        const psu = new THREE.Mesh(psuGeometry, psuMaterial);
        psu.position.set(0.7, -1.2, 0);
        serverGroup.add(psu);
        
        // Ventilador da PSU
        const psuFanGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32);
        const psuFanMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            metalness: 0.6,
            roughness: 0.4
        });
        const psuFan = new THREE.Mesh(psuFanGeometry, psuFanMaterial);
        psuFan.rotation.x = Math.PI / 2;
        psuFan.position.set(0, 0, 0.9);
        psu.add(psuFan);
        
        return serverGroup;
    }

    /**
     * Cria modelo geométrico de GPU NVIDIA realista
     * @returns {THREE.Group}
     */
    createGpuModel() {
        const gpuGroup = new THREE.Group();
        
        // PCB (Placa de Circuito Principal) - Verde característico
        const pcbGeometry = new THREE.BoxGeometry(3.2, 0.15, 1.4);
        const pcbMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a4d3a,
            metalness: 0.1,
            roughness: 0.8
        });
        const pcb = new THREE.Mesh(pcbGeometry, pcbMaterial);
        pcb.position.y = -0.3;
        gpuGroup.add(pcb);
        
        // Cooler Principal (Shroud)
        const shroudGeometry = new THREE.BoxGeometry(3, 1.2, 1.2);
        const shroudMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.8,
            roughness: 0.2
        });
        const shroud = new THREE.Mesh(shroudGeometry, shroudMaterial);
        shroud.position.y = 0.1;
        gpuGroup.add(shroud);
        
        // Ventiladores duplos (realistas)
        for (let i = 0; i < 2; i++) {
            const fanGroup = new THREE.Group();
            
            // Aro exterior do ventilador
            const ringGeometry = new THREE.TorusGeometry(0.4, 0.03, 16, 32);
            const ringMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                metalness: 0.7,
                roughness: 0.3
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            fanGroup.add(ring);
            
            // Pás curvadas do ventilador (9 pás como NVIDIA)
            for (let j = 0; j < 9; j++) {
                const bladeGeometry = new THREE.CylinderGeometry(0.02, 0.01, 0.35, 6);
                const bladeMaterial = new THREE.MeshStandardMaterial({
                    color: 0x2c2c2c,
                    metalness: 0.5,
                    roughness: 0.4
                });
                const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
                
                // Posicionar e curvar as pás
                const angle = (j * 2 * Math.PI) / 9;
                blade.position.x = Math.cos(angle) * 0.2;
                blade.position.z = Math.sin(angle) * 0.2;
                blade.rotation.y = angle + Math.PI / 2;
                blade.rotation.z = Math.PI / 12; // Inclinação das pás
                
                fanGroup.add(blade);
            }
            
            // Hub central
            const hubGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
            const hubMaterial = new THREE.MeshStandardMaterial({
                color: 0x666666,
                metalness: 0.8,
                roughness: 0.2
            });
            const hub = new THREE.Mesh(hubGeometry, hubMaterial);
            hub.rotation.x = Math.PI / 2;
            fanGroup.add(hub);
            
            fanGroup.rotation.x = Math.PI / 2;
            fanGroup.position.set(-0.7 + i * 1.4, 0.65, 0);
            gpuGroup.add(fanGroup);
        }
        
        // Heatsink (Dissipador)
        const heatsinkGroup = new THREE.Group();
        
        // Base do dissipador
        const heatsinkBaseGeometry = new THREE.BoxGeometry(2.8, 0.3, 1);
        const heatsinkMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            metalness: 0.9,
            roughness: 0.1
        });
        const heatsinkBase = new THREE.Mesh(heatsinkBaseGeometry, heatsinkMaterial);
        heatsinkGroup.add(heatsinkBase);
        
        // Aletas do dissipador
        for (let i = 0; i < 15; i++) {
            const finGeometry = new THREE.BoxGeometry(0.02, 0.8, 1);
            const fin = new THREE.Mesh(finGeometry, heatsinkMaterial);
            fin.position.x = -1.35 + i * 0.18;
            fin.position.y = 0.4;
            heatsinkGroup.add(fin);
        }
        
        heatsinkGroup.position.y = -0.1;
        gpuGroup.add(heatsinkGroup);
        
        // Heat Pipes (Tubos de calor)
        for (let i = 0; i < 4; i++) {
            const pipeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 2.5, 12);
            const pipeMaterial = new THREE.MeshStandardMaterial({
                color: 0xcd7f32,
                metalness: 0.9,
                roughness: 0.1
            });
            const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
            pipe.rotation.z = Math.PI / 2;
            pipe.position.set(0, 0.5, -0.35 + i * 0.23);
            gpuGroup.add(pipe);
        }
        
        // Backplate (Placa traseira)
        const backplateGeometry = new THREE.BoxGeometry(3.2, 0.05, 1.4);
        const backplateMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c2c2c,
            metalness: 0.8,
            roughness: 0.2
        });
        const backplate = new THREE.Mesh(backplateGeometry, backplateMaterial);
        backplate.position.y = -0.8;
        gpuGroup.add(backplate);
        
        // Logo NVIDIA (simulado)
        const logoGeometry = new THREE.BoxGeometry(0.4, 0.02, 0.2);
        const logoMaterial = new THREE.MeshStandardMaterial({
            color: 0x76b900,
            emissive: 0x76b900,
            emissiveIntensity: 0.3,
            metalness: 0.2,
            roughness: 0.4
        });
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.set(0.8, 0.61, -0.4);
        gpuGroup.add(logo);
        
        // Conectores de energia (8-pin)
        for (let i = 0; i < 2; i++) {
            const connectorGroup = new THREE.Group();
            
            // Corpo do conector
            const connectorGeometry = new THREE.BoxGeometry(0.15, 0.25, 0.4);
            const connectorMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.1,
                roughness: 0.9
            });
            const connectorBody = new THREE.Mesh(connectorGeometry, connectorMaterial);
            connectorGroup.add(connectorBody);
            
            // Pinos do conector
            for (let j = 0; j < 8; j++) {
                const pinGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.08, 8);
                const pinMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffd700,
                    metalness: 0.9,
                    roughness: 0.1
                });
                const pin = new THREE.Mesh(pinGeometry, pinMaterial);
                pin.position.set(
                    -0.05 + (j % 4) * 0.035,
                    0,
                    -0.15 + Math.floor(j / 4) * 0.3
                );
                pin.rotation.x = Math.PI / 2;
                connectorGroup.add(pin);
            }
            
            connectorGroup.position.set(0.8 + i * 0.25, 0.4, 0.3);
            connectorGroup.rotation.x = -Math.PI / 4;
            gpuGroup.add(connectorGroup);
        }
        
        // I/O Shield (Bracket)
        const ioShieldGeometry = new THREE.BoxGeometry(0.05, 1.2, 0.8);
        const ioShieldMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c2c2c,
            metalness: 0.8,
            roughness: 0.3
        });
        const ioShield = new THREE.Mesh(ioShieldGeometry, ioShieldMaterial);
        ioShield.position.set(-1.65, 0, 0);
        gpuGroup.add(ioShield);
        
        // Portas de saída (DisplayPort, HDMI)
        const portTypes = [
            { type: 'DP', color: 0x333333, width: 0.08, height: 0.04 },
            { type: 'DP', color: 0x333333, width: 0.08, height: 0.04 },
            { type: 'HDMI', color: 0x1a1a1a, width: 0.06, height: 0.03 },
            { type: 'DVI', color: 0x4a4a4a, width: 0.1, height: 0.05 }
        ];
        
        portTypes.forEach((port, i) => {
            const portGeometry = new THREE.BoxGeometry(0.02, port.width, port.height);
            const portMaterial = new THREE.MeshStandardMaterial({
                color: port.color,
                metalness: 0.6,
                roughness: 0.4
            });
            const portMesh = new THREE.Mesh(portGeometry, portMaterial);
            portMesh.position.set(-1.67, 0.2 - i * 0.12, 0);
            gpuGroup.add(portMesh);
        });
        
        // SLI/NVLink Connector (topo da placa)
        const sliGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.1);
        const sliMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.9,
            roughness: 0.1
        });
        const sli = new THREE.Mesh(sliGeometry, sliMaterial);
        sli.position.set(0, 0.65, 0.5);
        gpuGroup.add(sli);
        
        // Memory chips (GDDR6)
        for (let i = 0; i < 8; i++) {
            const memoryGeometry = new THREE.BoxGeometry(0.15, 0.08, 0.2);
            const memoryMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.1,
                roughness: 0.9
            });
            const memory = new THREE.Mesh(memoryGeometry, memoryMaterial);
            
            const side = i < 4 ? 1 : -1;
            memory.position.set(
                -1.2 + (i % 4) * 0.8,
                -0.25,
                side * 0.5
            );
            gpuGroup.add(memory);
        }
        
        return gpuGroup;
    }

    /**
     * Cria modelo geométrico do logo Python realista
     * @returns {THREE.Group}
     */
    createPythonIconModel() {
        const pythonGroup = new THREE.Group();
        
        // Base circular moderna
        const baseGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            metalness: 0.8,
            roughness: 0.2
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -1.2;
        pythonGroup.add(base);
        
        // Símbolo Python entrelaçado (mais preciso)
        const snakeGroup = new THREE.Group();
        
        // Cabeça da cobra azul (Python)
        const blueHeadGeometry = new THREE.SphereGeometry(0.35, 16, 16);
        const blueMaterial = new THREE.MeshStandardMaterial({
            color: 0x3776ab,
            metalness: 0.2,
            roughness: 0.6,
            emissive: 0x001144,
            emissiveIntensity: 0.1
        });
        const blueHead = new THREE.Mesh(blueHeadGeometry, blueMaterial);
        blueHead.position.set(-0.6, 0.8, 0);
        snakeGroup.add(blueHead);
        
        // Olho da cobra azul
        const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.3,
            metalness: 0.1,
            roughness: 0.1
        });
        const blueEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        blueEye.position.set(0.15, 0.1, 0.25);
        blueHead.add(blueEye);
        
        // Corpo da cobra azul (curvas do Python)
        const blueBodyPoints = [
            new THREE.Vector3(-0.6, 0.8, 0),
            new THREE.Vector3(-0.3, 0.5, 0.3),
            new THREE.Vector3(0, 0, 0.4),
            new THREE.Vector3(0.3, -0.5, 0.3),
            new THREE.Vector3(0.6, -0.8, 0),
            new THREE.Vector3(0.3, -1.1, -0.3),
            new THREE.Vector3(0, -1.2, -0.4),
            new THREE.Vector3(-0.3, -1.1, -0.3),
            new THREE.Vector3(-0.6, -0.8, 0)
        ];
        
        for (let i = 0; i < blueBodyPoints.length - 1; i++) {
            const start = blueBodyPoints[i];
            const end = blueBodyPoints[i + 1];
            const distance = start.distanceTo(end);
            
            const segmentGeometry = new THREE.CylinderGeometry(0.15, 0.15, distance, 12);
            const segment = new THREE.Mesh(segmentGeometry, blueMaterial);
            
            segment.position.copy(start).add(end).multiplyScalar(0.5);
            segment.lookAt(end);
            segment.rotation.x += Math.PI / 2;
            
            snakeGroup.add(segment);
        }
        
        // Cabeça da cobra amarela (Python)
        const yellowMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd43b,
            metalness: 0.2,
            roughness: 0.6,
            emissive: 0x443300,
            emissiveIntensity: 0.1
        });
        const yellowHead = new THREE.Mesh(blueHeadGeometry, yellowMaterial);
        yellowHead.position.set(0.6, -0.8, 0);
        snakeGroup.add(yellowHead);
        
        // Olho da cobra amarela
        const yellowEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        yellowEye.position.set(-0.15, 0.1, 0.25);
        yellowHead.add(yellowEye);
        
        // Corpo da cobra amarela (espelhado)
        const yellowBodyPoints = [
            new THREE.Vector3(0.6, -0.8, 0),
            new THREE.Vector3(0.3, -0.5, -0.3),
            new THREE.Vector3(0, 0, -0.4),
            new THREE.Vector3(-0.3, 0.5, -0.3),
            new THREE.Vector3(-0.6, 0.8, 0),
            new THREE.Vector3(-0.3, 1.1, 0.3),
            new THREE.Vector3(0, 1.2, 0.4),
            new THREE.Vector3(0.3, 1.1, 0.3),
            new THREE.Vector3(0.6, 0.8, 0)
        ];
        
        for (let i = 0; i < yellowBodyPoints.length - 1; i++) {
            const start = yellowBodyPoints[i];
            const end = yellowBodyPoints[i + 1];
            const distance = start.distanceTo(end);
            
            const segmentGeometry = new THREE.CylinderGeometry(0.15, 0.15, distance, 12);
            const segment = new THREE.Mesh(segmentGeometry, yellowMaterial);
            
            segment.position.copy(start).add(end).multiplyScalar(0.5);
            segment.lookAt(end);
            segment.rotation.x += Math.PI / 2;
            
            snakeGroup.add(segment);
        }
        
        pythonGroup.add(snakeGroup);
        
        // Texto "Python" em 3D
        const textGroup = new THREE.Group();
        
        // Simular texto Python com geometrias
        const letterMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            metalness: 0.3,
            roughness: 0.7
        });
        
        // "P" simplificado
        const pGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.05);
        const p1 = new THREE.Mesh(pGeometry, letterMaterial);
        p1.position.set(-0.8, -0.5, 0.8);
        textGroup.add(p1);
        
        const p2Geometry = new THREE.BoxGeometry(0.3, 0.1, 0.05);
        const p2 = new THREE.Mesh(p2Geometry, letterMaterial);
        p2.position.set(-0.65, -0.3, 0.8);
        textGroup.add(p2);
        
        const p3 = new THREE.Mesh(p2Geometry, letterMaterial);
        p3.position.set(-0.65, -0.5, 0.8);
        textGroup.add(p3);
        
        // "y" simplificado
        const yGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.05);
        const y1 = new THREE.Mesh(yGeometry, letterMaterial);
        y1.position.set(-0.3, -0.4, 0.8);
        y1.rotation.z = Math.PI / 6;
        textGroup.add(y1);
        
        const y2 = new THREE.Mesh(yGeometry, letterMaterial);
        y2.position.set(-0.1, -0.4, 0.8);
        y2.rotation.z = -Math.PI / 6;
        textGroup.add(y2);
        
        // Outros caracteres simplificados...
        const dotGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        for (let i = 0; i < 4; i++) {
            const dot = new THREE.Mesh(dotGeometry, letterMaterial);
            dot.position.set(0.2 + i * 0.15, -0.5, 0.8);
            textGroup.add(dot);
        }
        
        pythonGroup.add(textGroup);
        
        // Efeitos de código flutuante
        const codeGroup = new THREE.Group();
        const codeSnippets = ['def', 'class', 'import', 'return', 'if', 'for'];
        
        codeSnippets.forEach((snippet, i) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 128;
            canvas.height = 32;
            
            context.fillStyle = 'rgba(55, 118, 171, 0.8)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            context.fillStyle = '#ffffff';
            context.font = 'bold 16px monospace';
            context.textAlign = 'center';
            context.fillText(snippet, canvas.width / 2, canvas.height / 2 + 6);
            
            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ 
                map: texture,
                transparent: true 
            });
            const sprite = new THREE.Sprite(spriteMaterial);
            
            const angle = (i * Math.PI * 2) / codeSnippets.length;
            sprite.position.set(
                Math.cos(angle) * 2.5,
                Math.sin(angle * 0.5) * 1.5,
                Math.sin(angle) * 2.5
            );
            sprite.scale.set(0.8, 0.2, 1);
            
            codeGroup.add(sprite);
        });
        
        pythonGroup.add(codeGroup);
        
        // Partículas de "bytecode"
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 50;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 6;
            positions[i3 + 1] = Math.random() * 4 - 2;
            positions[i3 + 2] = (Math.random() - 0.5) * 6;
            
            // Cores Python (azul e amarelo)
            const isPythonBlue = Math.random() > 0.5;
            colors[i3] = isPythonBlue ? 0.22 : 1.0;     // R
            colors[i3 + 1] = isPythonBlue ? 0.46 : 0.83; // G
            colors[i3 + 2] = isPythonBlue ? 0.67 : 0.23; // B
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.name = 'python-particles';
        pythonGroup.add(particles);
        
        return pythonGroup;
    }

    /**
     * Cria modelo geométrico da caixa de ferramentas realista
     * @returns {THREE.Group}
     */
    createToolboxModel() {
        const toolboxGroup = new THREE.Group();
        
        // Corpo principal da caixa (metal texturizado)
        const mainBodyGeometry = new THREE.BoxGeometry(3, 1.5, 2.2);
        const mainMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0392b,
            metalness: 0.6,
            roughness: 0.4,
            normalScale: new THREE.Vector2(0.5, 0.5)
        });
        const mainBody = new THREE.Mesh(mainBodyGeometry, mainMaterial);
        toolboxGroup.add(mainBody);
        
        // Tampa superior com dobradiças
        const lidGeometry = new THREE.BoxGeometry(3.1, 0.2, 2.3);
        const lid = new THREE.Mesh(lidGeometry, mainMaterial);
        lid.position.y = 0.85;
        toolboxGroup.add(lid);
        
        // Dobradiças realistas
        for (let i = 0; i < 2; i++) {
            const hingeGroup = new THREE.Group();
            
            // Base da dobradiça
            const hingeBaseGeometry = new THREE.BoxGeometry(0.15, 0.08, 0.3);
            const hingeMaterial = new THREE.MeshStandardMaterial({
                color: 0x2c3e50,
                metalness: 0.9,
                roughness: 0.1
            });
            const hingeBase = new THREE.Mesh(hingeBaseGeometry, hingeMaterial);
            hingeGroup.add(hingeBase);
            
            // Pino da dobradiça
            const pinGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 12);
            const pin = new THREE.Mesh(pinGeometry, hingeMaterial);
            pin.rotation.x = Math.PI / 2;
            hingeGroup.add(pin);
            
            hingeGroup.position.set(-1.2 + i * 2.4, 0.75, -1.2);
            toolboxGroup.add(hingeGroup);
        }
        
        // Alça central robusta
        const handleGroup = new THREE.Group();
        
        // Suportes da alça
        for (let i = 0; i < 2; i++) {
            const supportGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
            const supportMaterial = new THREE.MeshStandardMaterial({
                color: 0x2c3e50,
                metalness: 0.8,
                roughness: 0.2
            });
            const support = new THREE.Mesh(supportGeometry, supportMaterial);
            support.position.set(-0.3 + i * 0.6, 0, 0);
            handleGroup.add(support);
        }
        
        // Alça principal
        const handleGeometry = new THREE.TorusGeometry(0.4, 0.08, 8, 16);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0x34495e,
            metalness: 0.7,
            roughness: 0.3
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.rotation.x = Math.PI / 2;
        handleGroup.add(handle);
        
        handleGroup.position.y = 1.2;
        toolboxGroup.add(handleGroup);
        
        // Gavetas deslizantes
        for (let i = 0; i < 3; i++) {
            const drawerGroup = new THREE.Group();
            
            // Corpo da gaveta
            const drawerGeometry = new THREE.BoxGeometry(2.8, 0.3, 2);
            const drawerMaterial = new THREE.MeshStandardMaterial({
                color: 0xa93226,
                metalness: 0.5,
                roughness: 0.5
            });
            const drawer = new THREE.Mesh(drawerGeometry, drawerMaterial);
            drawerGroup.add(drawer);
            
            // Puxador da gaveta
            const pullGeometry = new THREE.BoxGeometry(0.4, 0.08, 0.08);
            const pullMaterial = new THREE.MeshStandardMaterial({
                color: 0x2c3e50,
                metalness: 0.8,
                roughness: 0.2
            });
            const pull = new THREE.Mesh(pullGeometry, pullMaterial);
            pull.position.set(0, 0, 1.1);
            drawerGroup.add(pull);
            
            // Trilhos da gaveta
            for (let j = 0; j < 2; j++) {
                const railGeometry = new THREE.BoxGeometry(0.02, 0.02, 2);
                const railMaterial = new THREE.MeshStandardMaterial({
                    color: 0x7f8c8d,
                    metalness: 0.9,
                    roughness: 0.1
                });
                const rail = new THREE.Mesh(railGeometry, railMaterial);
                rail.position.set(-1.4 + j * 2.8, -0.15, 0);
                drawerGroup.add(rail);
            }
            
            drawerGroup.position.y = 0.4 - i * 0.4;
            toolboxGroup.add(drawerGroup);
        }
        
        // Fechadura com chave
        const lockGroup = new THREE.Group();
        
        // Corpo da fechadura
        const lockBodyGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16);
        const lockMaterial = new THREE.MeshStandardMaterial({
            color: 0xf39c12,
            metalness: 0.9,
            roughness: 0.1
        });
        const lockBody = new THREE.Mesh(lockBodyGeometry, lockMaterial);
        lockBody.rotation.x = Math.PI / 2;
        lockGroup.add(lockBody);
        
        // Buraco da chave
        const keyholeGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.08, 8);
        const keyholeMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            metalness: 0.1,
            roughness: 0.9
        });
        const keyhole = new THREE.Mesh(keyholeGeometry, keyholeMaterial);
        keyhole.rotation.x = Math.PI / 2;
        keyhole.position.z = 0.01;
        lockGroup.add(keyhole);
        
        lockGroup.position.set(0, 0.4, 1.2);
        toolboxGroup.add(lockGroup);
        
        // Ferramentas saindo da caixa (mais realistas)
        const toolsGroup = new THREE.Group();
        
        // Chave de fenda
        const screwdriverGroup = new THREE.Group();
        const screwdriverShaftGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1.2, 8);
        const metalMaterial = new THREE.MeshStandardMaterial({
            color: 0x95a5a6,
            metalness: 0.9,
            roughness: 0.1
        });
        const screwdriverShaft = new THREE.Mesh(screwdriverShaftGeometry, metalMaterial);
        
        const screwdriverHandleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 12);
        const handleRedMaterial = new THREE.MeshStandardMaterial({
            color: 0xe74c3c,
            metalness: 0.2,
            roughness: 0.8
        });
        const screwdriverHandle = new THREE.Mesh(screwdriverHandleGeometry, handleRedMaterial);
        screwdriverHandle.position.y = -0.8;
        
        const screwdriverTipGeometry = new THREE.BoxGeometry(0.02, 0.1, 0.002);
        const screwdriverTip = new THREE.Mesh(screwdriverTipGeometry, metalMaterial);
        screwdriverTip.position.y = 0.65;
        
        screwdriverGroup.add(screwdriverShaft);
        screwdriverGroup.add(screwdriverHandle);
        screwdriverGroup.add(screwdriverTip);
        screwdriverGroup.position.set(0.8, 1.8, 0);
        screwdriverGroup.rotation.z = Math.PI / 6;
        toolsGroup.add(screwdriverGroup);
        
        // Martelo
        const hammerGroup = new THREE.Group();
        const hammerHandleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 12);
        const woodMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            metalness: 0.1,
            roughness: 0.9
        });
        const hammerHandle = new THREE.Mesh(hammerHandleGeometry, woodMaterial);
        
        const hammerHeadGeometry = new THREE.BoxGeometry(0.15, 0.3, 0.15);
        const hammerHead = new THREE.Mesh(hammerHeadGeometry, metalMaterial);
        hammerHead.position.y = 0.5;
        
        hammerGroup.add(hammerHandle);
        hammerGroup.add(hammerHead);
        hammerGroup.position.set(-0.6, 1.8, 0.3);
        hammerGroup.rotation.z = -Math.PI / 8;
        toolsGroup.add(hammerGroup);
        
        // Chave inglesa
        const wrenchGroup = new THREE.Group();
        const wrenchBodyGeometry = new THREE.BoxGeometry(0.04, 0.8, 0.02);
        const wrenchBody = new THREE.Mesh(wrenchBodyGeometry, metalMaterial);
        
        const wrenchHeadGeometry = new THREE.BoxGeometry(0.08, 0.15, 0.04);
        const wrenchHead = new THREE.Mesh(wrenchHeadGeometry, metalMaterial);
        wrenchHead.position.y = 0.4;
        
        const wrenchJawGeometry = new THREE.BoxGeometry(0.06, 0.02, 0.04);
        const wrenchJaw = new THREE.Mesh(wrenchJawGeometry, metalMaterial);
        wrenchJaw.position.set(0.04, 0.47, 0);
        
        wrenchGroup.add(wrenchBody);
        wrenchGroup.add(wrenchHead);
        wrenchGroup.add(wrenchJaw);
        wrenchGroup.position.set(0.2, 1.8, -0.4);
        wrenchGroup.rotation.z = Math.PI / 12;
        toolsGroup.add(wrenchGroup);
        
        // Alicate
        const pliersGroup = new THREE.Group();
        const pliersHandle1Geometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
        const pliersHandle1 = new THREE.Mesh(pliersHandle1Geometry, handleRedMaterial);
        pliersHandle1.position.set(-0.05, -0.3, 0);
        pliersHandle1.rotation.z = Math.PI / 12;
        
        const pliersHandle2 = new THREE.Mesh(pliersHandle1Geometry, handleRedMaterial);
        pliersHandle2.position.set(0.05, -0.3, 0);
        pliersHandle2.rotation.z = -Math.PI / 12;
        
        const pliersJaw1Geometry = new THREE.BoxGeometry(0.03, 0.2, 0.04);
        const pliersJaw1 = new THREE.Mesh(pliersJaw1Geometry, metalMaterial);
        pliersJaw1.position.set(-0.02, 0.1, 0);
        
        const pliersJaw2 = new THREE.Mesh(pliersJaw1Geometry, metalMaterial);
        pliersJaw2.position.set(0.02, 0.1, 0);
        
        pliersGroup.add(pliersHandle1);
        pliersGroup.add(pliersHandle2);
        pliersGroup.add(pliersJaw1);
        pliersGroup.add(pliersJaw2);
        pliersGroup.position.set(-0.2, 1.8, 0.6);
        toolsGroup.add(pliersGroup);
        
        toolboxGroup.add(toolsGroup);
        
        // Etiquetas identificadoras
        const labelGroup = new THREE.Group();
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = '#2c3e50';
        context.font = 'bold 18px Arial';
        context.textAlign = 'center';
        context.fillText('DEV TOOLS', canvas.width / 2, 25);
        context.fillText('v3.11+', canvas.width / 2, 45);
        
        const labelTexture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ 
            map: labelTexture,
            transparent: true 
        });
        const label = new THREE.Sprite(labelMaterial);
        label.scale.set(1.5, 0.4, 1);
        label.position.set(0, 0.3, 1.25);
        labelGroup.add(label);
        
        toolboxGroup.add(labelGroup);
        
        return toolboxGroup;
    }

    /**
     * Adiciona animações específicas para modelos
     * @param {THREE.Object3D} model - Modelo a animar
     * @param {string} modelName - Nome do modelo
     */
    addModelAnimation(model, modelName) {
        // Store animation function to allow stopping later
        const animations = {
            gpu: () => {
                let animationId;
                const animateGPU = () => {
                    if (model && model.parent && !model.userData.animationStopped) {
                        model.rotation.y += 0.015;
                        model.position.y = 1 + Math.sin(Date.now() * 0.0012) * 0.15;
                        animationId = requestAnimationFrame(animateGPU);
                    }
                };
                model.userData.stopAnimation = () => {
                    model.userData.animationStopped = true;
                    if (animationId) cancelAnimationFrame(animationId);
                };
                animateGPU();
            },
            'python-icon': () => {
                let animationId;
                const animatePython = () => {
                    if (model && model.parent && !model.userData.animationStopped) {
                        model.rotation.y += 0.008;
                        model.position.y = 2 + Math.sin(Date.now() * 0.0015) * 0.12;
                        animationId = requestAnimationFrame(animatePython);
                    }
                };
                model.userData.stopAnimation = () => {
                    model.userData.animationStopped = true;
                    if (animationId) cancelAnimationFrame(animationId);
                };
                animatePython();
            },
            toolbox: () => {
                let animationId;
                const animateToolbox = () => {
                    if (model && model.parent && !model.userData.animationStopped) {
                        model.rotation.y += 0.005;
                        animationId = requestAnimationFrame(animateToolbox);
                    }
                };
                model.userData.stopAnimation = () => {
                    model.userData.animationStopped = true;
                    if (animationId) cancelAnimationFrame(animationId);
                };
                animateToolbox();
            },
            server: () => {
                let animationId;
                const animateServer = () => {
                    if (model && model.parent && !model.userData.animationStopped) {
                        model.rotation.y += 0.01;
                        model.position.y = 1.5 + Math.sin(Date.now() * 0.0008) * 0.1;
                        animationId = requestAnimationFrame(animateServer);
                    }
                };
                model.userData.stopAnimation = () => {
                    model.userData.animationStopped = true;
                    if (animationId) cancelAnimationFrame(animationId);
                };
                animateServer();
            }
        };

        // Inicialmente, não inicie animações automaticamente
        // As animações devem ser iniciadas apenas quando necessário
        const animation = animations[modelName];
        if (animation && !model.userData.animationDisabled) {
            animation();
        }
    }

    /**
     * Para todas as animações dos modelos
     */
    stopAllModelAnimations() {
        this.laboratoryElements.forEach((model, name) => {
            if (model.userData && model.userData.stopAnimation) {
                model.userData.stopAnimation();
                console.log(`🛑 Animação do modelo ${name} parada`);
            }
        });
    }

    /**
     * Inicia animações dos modelos especificados
     * @param {Array<string>} modelNames - Nomes dos modelos para animar
     */
    startModelAnimations(modelNames = []) {
        modelNames.forEach(name => {
            const model = this.laboratoryElements.get(name);
            if (model) {
                model.userData.animationStopped = false;
                this.addModelAnimation(model, name);
                console.log(`▶️ Animação do modelo ${name} iniciada`);
            }
        });
    }

    /**
     * Cria elementos decorativos
     */
    createDecorativeElements() {
        this.createHolographicParticles();
        this.createFloatingElements();
        console.log('✨ Elementos decorativos criados');
    }

    /**
     * Cria sistema de partículas holográficas
     */
    createHolographicParticles() {
        const particleCount = 50;
        const particles = new THREE.Group();
        particles.name = 'holographic-particles';
        
        for (let i = 0; i < particleCount; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.02, 4, 4);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0x00ff88 : 0x00ccff,
                transparent: true,
                opacity: 0.6
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Posição aleatória
            const radius = 5 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
            particle.position.y = 1 + Math.random() * 4;
            particle.position.z = radius * Math.sin(phi) * Math.sin(theta);
            
            particle.userData = {
                originalPosition: particle.position.clone(),
                speed: 0.001 + Math.random() * 0.002,
                phase: Math.random() * Math.PI * 2
            };
            
            particles.add(particle);
        }
        
        this.scene.add(particles);
        this.particleSystems.push(particles);
        
        // Animar partículas
        this.animateParticles(particles);
    }

    /**
     * Anima sistema de partículas
     * @param {THREE.Group} particleGroup - Grupo de partículas
     */
    animateParticles(particleGroup) {
        const animateParticles = () => {
            if (particleGroup && particleGroup.parent) {
                particleGroup.children.forEach((particle) => {
                    const time = Date.now() * particle.userData.speed;
                    const phase = particle.userData.phase;
                    
                    // Movimento orbital suave
                    particle.position.x = particle.userData.originalPosition.x + Math.sin(time + phase) * 0.5;
                    particle.position.y = particle.userData.originalPosition.y + Math.cos(time * 0.7 + phase) * 0.3;
                    particle.position.z = particle.userData.originalPosition.z + Math.cos(time + phase) * 0.5;
                    
                    // Fade in/out
                    particle.material.opacity = 0.3 + Math.sin(time * 2 + phase) * 0.3;
                });
                
                requestAnimationFrame(animateParticles);
            }
        };
        animateParticles();
    }

    /**
     * Cria elementos flutuantes decorativos
     */
    createFloatingElements() {
        // Implementar elementos flutuantes adicionais
        console.log('🎈 Elementos flutuantes criados');
    }

    /**
     * Cria a estrutura do projeto em 3D
     */
    createProjectStructure() {
        console.log('🗂️ Iniciando criação da estrutura do projeto 3D...');
        
        // Remover blueprint anterior se existir
        if (this.blueprintGroup) {
            this.scene.remove(this.blueprintGroup);
            console.log('🧹 Blueprint anterior removido');
        }

        this.blueprintGroup = new THREE.Group();
        this.blueprintGroup.name = 'project-blueprint';
        
        // Posicionar o grupo em uma área visível
        this.blueprintGroup.position.set(0, 2, 0);

        // Estrutura do projeto com posições ajustadas e ícones melhorados
        const projectStructure = [
            { 
                name: 'app/', 
                position: [-4, 3, 0], 
                color: 0x4285f4, 
                type: 'folder',
                description: 'Código principal da aplicação - Controllers, Views e Models',
                icon: '📁'
            },
            { 
                name: 'data/', 
                position: [-2, 3, 0], 
                color: 0xff4757, 
                type: 'folder',
                description: 'Datasets e arquivos de dados - Heart Disease CSV',
                icon: '📊'
            },
            { 
                name: 'utils/', 
                position: [0, 3, 0], 
                color: 0x9c88ff, 
                type: 'folder',
                description: 'Funções utilitárias e helpers',
                icon: '🔧'
            },
            { 
                name: 'tests/', 
                position: [2, 3, 0], 
                color: 0x2ecc71, 
                type: 'folder',
                description: 'Testes automatizados e validação',
                icon: '🧪'
            },
            { 
                name: 'docs/', 
                position: [4, 3, 0], 
                color: 0xe67e22, 
                type: 'folder',
                description: 'Documentação do projeto',
                icon: '📚'
            },
            { 
                name: 'main.py', 
                position: [-3, 1, 0], 
                color: 0x3776ab, 
                type: 'file',
                description: 'Arquivo principal - Entry point da aplicação Dash',
                icon: '🐍'
            },
            { 
                name: 'pyproject.toml', 
                position: [-1, 1, 0], 
                color: 0xff6b6b, 
                type: 'file',
                description: 'Configuração do projeto - Dependências e metadados',
                icon: '⚙️'
            },
            { 
                name: 'README.md', 
                position: [1, 1, 0], 
                color: 0x45b7d1, 
                type: 'file',
                description: 'Documentação principal do projeto',
                icon: '📝'
            },
            { 
                name: '.gitignore', 
                position: [3, 1, 0], 
                color: 0x6c5ce7, 
                type: 'file',
                description: 'Arquivos ignorados pelo Git',
                icon: '🚫'
            }
        ];

        projectStructure.forEach((item, index) => {
            this.createBlueprintItem(item, index);
        });

        // Adicionar efeitos visuais
        this.addBlueprintEffects();

        this.scene.add(this.blueprintGroup);
        this.enableInteraction();
        
        console.log('✅ Estrutura do projeto 3D criada com sucesso');
    }

    /**
     * Cria item do blueprint
     * @param {Object} item - Configuração do item
     * @param {number} index - Índice do item
     */
    createBlueprintItem(item, index) {
        // Criar representação mais realista baseada no tipo
        let mesh;
        
        if (item.type === 'folder') {
            // Pasta realística como encontrado no explorador de arquivos
            const group = new THREE.Group();
            
            // Base da pasta (corpo principal)
            const baseGeometry = new THREE.BoxGeometry(1.8, 0.3, 1.4);
            const baseMaterial = new THREE.MeshStandardMaterial({
                color: item.color,
                metalness: 0.1,
                roughness: 0.8,
                transparent: true,
                opacity: 0.9
            });
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.y = -0.05;
            group.add(base);
            
            // Aba superior da pasta (característica)
            const tabGeometry = new THREE.BoxGeometry(0.8, 0.15, 1.45);
            const tabMaterial = new THREE.MeshStandardMaterial({
                color: new THREE.Color(item.color).multiplyScalar(1.2),
                metalness: 0.1,
                roughness: 0.7,
                transparent: true,
                opacity: 0.95
            });
            const tab = new THREE.Mesh(tabGeometry, tabMaterial);
            tab.position.set(-0.5, 0.18, 0);
            group.add(tab);
            
            // Etiqueta com ícone
            this.createItemLabel(group, item.name, item.icon, [0, 0.4, 0]);
            
            // Efeito de brilho sutil
            const glowGeometry = new THREE.BoxGeometry(1.9, 0.35, 1.5);
            const glowMaterial = new THREE.MeshStandardMaterial({
                color: item.color,
                emissive: item.color,
                emissiveIntensity: 0.15,
                transparent: true,
                opacity: 0.3
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.y = -0.05;
            group.add(glow);
            
            mesh = group;
        } else {
            // Arquivo como um documento realístico
            const group = new THREE.Group();
            
            // Corpo do documento
            const docGeometry = new THREE.BoxGeometry(1.2, 1.6, 0.08);
            const docMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.05,
                roughness: 0.9,
                transparent: true,
                opacity: 0.95
            });
            const document = new THREE.Mesh(docGeometry, docMaterial);
            group.add(document);
            
            // Cabeçalho colorido do arquivo (indicador de tipo)
            const headerGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.09);
            const headerMaterial = new THREE.MeshStandardMaterial({
                color: item.color,
                metalness: 0.2,
                roughness: 0.6
            });
            const header = new THREE.Mesh(headerGeometry, headerMaterial);
            header.position.y = 0.65;
            group.add(header);
            
            // Linhas de "texto" no documento
            for (let i = 0; i < 6; i++) {
                const lineWidth = 0.8 - (Math.random() * 0.3);
                const lineGeometry = new THREE.BoxGeometry(lineWidth, 0.03, 0.01);
                const lineMaterial = new THREE.MeshStandardMaterial({
                    color: 0x333333,
                    metalness: 0.0,
                    roughness: 1.0
                });
                const line = new THREE.Mesh(lineGeometry, lineMaterial);
                line.position.set((lineWidth - 1.2) / 2, 0.3 - i * 0.15, 0.05);
                group.add(line);
            }
            
            // Etiqueta com ícone
            this.createItemLabel(group, item.name, item.icon, [0, -1.0, 0]);
            
            // Sombra do documento
            const shadowGeometry = new THREE.BoxGeometry(1.25, 1.65, 0.02);
            const shadowMaterial = new THREE.MeshStandardMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.2
            });
            const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
            shadow.position.set(0.05, -0.05, -0.1);
            group.add(shadow);
            
            mesh = group;
        }
        
        mesh.position.set(...item.position);
        mesh.userData = { 
            name: item.name, 
            type: item.type,
            description: item.description,
            index: index,
            icon: item.icon
        };
        mesh.name = `blueprint-item-${index}`;
        
        // Configurar sombras
        mesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        this.blueprintGroup.add(mesh);
        
        // Animação suave de entrada
        mesh.scale.set(0, 0, 0);
        const targetScale = 1;
        const animateScale = () => {
            mesh.scale.x += (targetScale - mesh.scale.x) * 0.1;
            mesh.scale.y += (targetScale - mesh.scale.y) * 0.1;
            mesh.scale.z += (targetScale - mesh.scale.z) * 0.1;
            
            if (Math.abs(targetScale - mesh.scale.x) > 0.01) {
                requestAnimationFrame(animateScale);
            }
        };
        setTimeout(() => animateScale(), index * 100);
    }

    /**
     * Cria etiqueta com ícone para item do blueprint
     * @param {THREE.Group} parent - Objeto pai para anexar o label
     * @param {string} name - Nome do item
     * @param {string} icon - Ícone emoji do item
     * @param {Array} position - Posição do label [x, y, z]
     */
    createItemLabel(parent, name, icon, position) {
        // Criar canvas para o texto
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;
        
        // Fundo semi-transparente com gradiente
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 50, 100, 0.9)');
        gradient.addColorStop(1, 'rgba(0, 100, 150, 0.9)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Borda holográfica
        context.strokeStyle = '#00ff88';
        context.lineWidth = 4;
        context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
        
        // Ícone emoji grande
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.fillStyle = '#ffffff';
        context.fillText(icon, canvas.width / 2, 80);
        
        // Nome do arquivo/pasta com destaque
        context.font = 'bold 28px monospace';
        context.fillStyle = '#00ff88';
        context.strokeStyle = '#001122';
        context.lineWidth = 2;
        context.strokeText(name, canvas.width / 2, 140);
        context.fillText(name, canvas.width / 2, 140);
        
        // Linha decorativa
        context.strokeStyle = '#00ff88';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(50, 160);
        context.lineTo(canvas.width - 50, 160);
        context.stroke();
        
        // Tipo do item (pequeno texto)
        const typeText = name.includes('/') ? 'PASTA' : 'ARQUIVO';
        context.font = 'bold 16px Arial';
        context.fillStyle = '#88ddff';
        context.fillText(typeText, canvas.width / 2, 190);
        
        // Criar sprite
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            alphaTest: 0.1
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(3, 1.5, 1);
        sprite.position.set(...position);
        sprite.name = `label-${name.replace(/[^a-zA-Z0-9]/g, '-')}`;
        
        // Animação suave do label
        sprite.userData.originalScale = sprite.scale.clone();
        const animateLabel = () => {
            if (sprite.parent) {
                const time = Date.now() * 0.002;
                const pulse = 1 + Math.sin(time) * 0.02;
                sprite.scale.copy(sprite.userData.originalScale).multiplyScalar(pulse);
                requestAnimationFrame(animateLabel);
            }
        };
        animateLabel();
        
        parent.add(sprite);
    }

    /**
     * Adiciona animação suave para item do blueprint
     * @param {THREE.Object3D} item - Item do blueprint
     * @param {number} index - Índice do item
     */
    addBlueprintItemAnimation(item, index) {
        // Animação de flutuação sutil
        let animationId;
        const animate = () => {
            if (item && item.parent && !item.userData.animationStopped) {
                const time = Date.now() * 0.001;
                const offset = index * 0.5;
                item.position.y = item.userData.originalY + Math.sin(time + offset) * 0.1;
                item.rotation.y = Math.sin(time * 0.5 + offset) * 0.05;
                animationId = requestAnimationFrame(animate);
            }
        };
        
        // Salvar posição original
        item.userData.originalY = item.position.y;
        
        // Função para parar animação
        item.userData.stopAnimation = () => {
            item.userData.animationStopped = true;
            if (animationId) cancelAnimationFrame(animationId);
        };
        
        animate();
    }

    /**
     * Para todas as animações do blueprint
     */
    stopBlueprintAnimations() {
        if (this.blueprintGroup) {
            this.blueprintGroup.traverse((child) => {
                if (child.userData && child.userData.stopAnimation) {
                    child.userData.stopAnimation();
                }
            });
            console.log('🛑 Animações do blueprint paradas');
        }
    }

    /**
     * Adiciona efeitos visuais ao blueprint
     */
    addBlueprintEffects() {
        // Partículas holográficas ao redor do blueprint
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 50;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 15;
            positions[i3 + 1] = Math.random() * 8;
            positions[i3 + 2] = (Math.random() - 0.5) * 15;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00ff88,
            size: 0.1,
            transparent: true,
            opacity: 0.6
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.name = 'blueprint-particles';
        this.blueprintGroup.add(particles);
        
        // Animação das partículas
        const animateParticles = () => {
            if (particles.parent) {
                particles.rotation.y += 0.001;
                requestAnimationFrame(animateParticles);
            }
        };
        animateParticles();
        
        console.log('✨ Efeitos visuais do blueprint adicionados');
    }

    /**
     * Configura sistema de interação
     */
    setupInteractionSystem() {
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        
        // Event listeners
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('click', (event) => this.onMouseClick(event));
        
        console.log('🖱️ Sistema de interação configurado');
    }

    /**
     * Manipula movimento do mouse
     * @param {MouseEvent} event - Evento do mouse
     */
    onMouseMove(event) {
        if (!this.interactionEnabled) return;
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        if (this.blueprintGroup) {
            const intersects = this.raycaster.intersectObjects(this.blueprintGroup.children, true);
            
            // Reset all objects
            this.blueprintGroup.children.forEach(child => {
                if (child.isMesh && child.material) {
                    child.material.emissiveIntensity = 0.15;
                    child.scale.set(1, 1, 1);
                }
            });
            
            // Highlight hovered object
            if (intersects.length > 0) {
                const hoveredObject = intersects[0].object;
                if (hoveredObject.isMesh && hoveredObject.userData.name) {
                    hoveredObject.material.emissiveIntensity = 0.4;
                    hoveredObject.scale.set(1.1, 1.1, 1.1);
                    document.body.style.cursor = 'pointer';
                    return;
                }
            }
            
            document.body.style.cursor = 'default';
        }
    }

    /**
     * Manipula clique do mouse
     * @param {MouseEvent} event - Evento do mouse
     */
    onMouseClick(event) {
        if (!this.interactionEnabled) return;
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        if (this.blueprintGroup) {
            const intersects = this.raycaster.intersectObjects(this.blueprintGroup.children, true);
            
            if (intersects.length > 0) {
                const clickedObject = intersects[0].object;
                if (clickedObject.userData.name) {
                    this.handleBlueprintItemClick(clickedObject);
                }
            }
        }
    }

    /**
     * Manipula clique em item do blueprint
     * @param {THREE.Object3D} object - Objeto clicado
     */
    handleBlueprintItemClick(object) {
        const item = object.userData;
        console.log(`🖱️ Clicou em: ${item.name}`);
        
        // Efeito visual de clique
        this.animateClick(object);
        
        // Criar painel informativo detalhado
        this.showItemInfoPanel(item);
        
        // Notificar outros sistemas
        const app = this.threeSystem.app;
        const uiSystem = app.getSystem('ui');
        
        if (uiSystem) {
            uiSystem.showNotification(
                `📂 Explorando: ${item.name}`,
                'info',
                2000
            );
        }
        
        // Reação da Dra. Turing
        const drTuringManager = this.threeSystem.getDrTuringManager();
        if (drTuringManager) {
            this.triggerDrTuringReaction(item, drTuringManager);
        }
    }

    /**
     * Mostra painel informativo do item
     * @param {Object} item - Dados do item
     */
    showItemInfoPanel(item) {
        // Remover painel anterior se existir
        const existingPanel = document.getElementById('item-info-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // Criar painel informativo
        const panel = document.createElement('div');
        panel.id = 'item-info-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(0, 50, 100, 0.95), rgba(0, 100, 150, 0.95));
            border: 2px solid #00ff88;
            border-radius: 15px;
            padding: 25px;
            min-width: 400px;
            max-width: 600px;
            color: white;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
            z-index: 10000;
            animation: slideInDown 0.3s ease-out;
        `;
        
        // Conteúdo do painel
        panel.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <span style="font-size: 48px; margin-right: 15px;">${item.icon}</span>
                <div>
                    <h2 style="margin: 0; color: #00ff88; font-size: 24px;">${item.name}</h2>
                    <p style="margin: 5px 0 0 0; color: #88ddff; font-size: 14px;">
                        ${item.type === 'folder' ? 'PASTA DO PROJETO' : 'ARQUIVO DO PROJETO'}
                    </p>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #00ff88; font-size: 18px; margin-bottom: 10px;">📋 Descrição:</h3>
                <p style="line-height: 1.6; color: #ffffff; margin: 0;">${item.description}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #00ff88; font-size: 18px; margin-bottom: 10px;">🎯 Função no Projeto:</h3>
                <p style="line-height: 1.6; color: #ffffff; margin: 0;">${this.getItemPurpose(item)}</p>
            </div>
            
            <div style="text-align: center; margin-top: 25px;">
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: linear-gradient(45deg, #00ff88, #00cc6a); 
                               border: none; 
                               color: black; 
                               padding: 12px 24px; 
                               border-radius: 25px; 
                               font-weight: bold; 
                               cursor: pointer; 
                               font-size: 14px;
                               transition: all 0.3s ease;">
                    ✅ ENTENDI
                </button>
            </div>
        `;
        
        // Adicionar estilo de animação
        if (!document.getElementById('item-panel-styles')) {
            const style = document.createElement('style');
            style.id = 'item-panel-styles';
            style.textContent = `
                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -60%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                }
                
                #item-info-panel button:hover {
                    background: linear-gradient(45deg, #00cc6a, #00aa55) !important;
                    transform: scale(1.05);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(panel);
        
        // Auto-fechar após 10 segundos
        setTimeout(() => {
            if (panel.parentElement) {
                panel.remove();
            }
        }, 10000);
    }

    /**
     * Retorna o propósito específico do item no projeto
     * @param {Object} item - Dados do item
     * @returns {string} Propósito do item
     */
    getItemPurpose(item) {
        const purposes = {
            'app/': 'Contém todo o código principal da aplicação Dash, incluindo rotas, views, models e templates. É o coração do seu projeto.',
            'data/': 'Armazena datasets, arquivos CSV e outras fontes de dados. Aqui fica o Heart Disease Dataset que usaremos para criar visualizações.',
            'utils/': 'Funções utilitárias e helpers que podem ser reutilizados em diferentes partes do projeto. Mantém o código organizado.',
            'tests/': 'Testes automatizados para garantir que seu código funciona corretamente. Essencial para desenvolvimento profissional.',
            'docs/': 'Documentação técnica do projeto, guias de uso e especificações. Ajuda outros desenvolvedores a entender seu código.',
            'main.py': 'Ponto de entrada principal da aplicação Dash. É onde tudo começa quando você executa `uv run python main.py`.',
            'pyproject.toml': 'Arquivo de configuração do projeto Python. Define dependências, metadados e configurações do uv.',
            'README.md': 'Primeira impressão do seu projeto. Explica o que faz, como instalar e como usar. Muito importante para GitHub.',
            '.gitignore': 'Lista de arquivos que o Git deve ignorar (cache, logs, etc.). Mantém seu repositório limpo e profissional.'
        };
        
        return purposes[item.name] || 'Componente importante da estrutura do projeto Python.';
    }

    /**
     * Anima clique em objeto
     * @param {THREE.Object3D} object - Objeto a animar
     */
    animateClick(object) {
        const originalScale = { x: object.scale.x, y: object.scale.y, z: object.scale.z };
        const duration = 300;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (progress < 0.5) {
                const scale = 1 + (progress * 0.4);
                object.scale.set(scale, scale, scale);
            } else {
                const scale = 1.2 - ((progress - 0.5) * 0.4);
                object.scale.set(scale, scale, scale);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                object.scale.set(originalScale.x, originalScale.y, originalScale.z);
            }
        };
        
        animate();
    }

    /**
     * Dispara reação da Dra. Turing
     * @param {Object} item - Item do blueprint
     * @param {DrTuringManager} drTuringManager - Manager da Dra. Turing
     */
    triggerDrTuringReaction(item, drTuringManager) {
        const reactions = {
            'app/': 'Excelente escolha! A pasta app/ é o coração da nossa aplicação Dash.',
            'data/': 'Perfeito! Os dados são fundamentais para qualquer análise.',
            'main.py': 'Muito bem! O main.py é nosso ponto de partida.',
            'pyproject.toml': 'Ótima observação! Este é o arquivo de configuração moderno do Python.',
            'utils/': 'Inteligente! As funções utilitárias tornam nosso código mais limpo.',
            'tests/': 'Fantástico! Os testes garantem a qualidade do código.'
        };

        const reaction = reactions[item.name];
        if (reaction && drTuringManager) {
            setTimeout(() => {
                drTuringManager.speak3D(reaction, 4000);
            }, 500);
        }
    }

    /**
     * Foca a câmera no blueprint
     */
    focusCameraOnBlueprint() {
        if (!this.blueprintGroup) {
            console.warn('⚠️ Blueprint não encontrado para focar câmera');
            return;
        }
        
        console.log('📷 Iniciando foco da câmera no blueprint...');
        
        // Configuração de câmera otimizada para blueprint
        const targetPos = { x: 8, y: 10, z: 12 };
        const targetLookAt = { x: 0, y: 4, z: 0 };
        
        const startPos = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };
        
        const startTime = Date.now();
        const duration = 2500;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing suave (cubic-out)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            // Interpolar posição da câmera
            this.camera.position.x = startPos.x + (targetPos.x - startPos.x) * easedProgress;
            this.camera.position.y = startPos.y + (targetPos.y - startPos.y) * easedProgress;
            this.camera.position.z = startPos.z + (targetPos.z - startPos.z) * easedProgress;
            
            // Fazer câmera olhar para o centro do blueprint
            this.camera.lookAt(targetLookAt.x, targetLookAt.y, targetLookAt.z);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                console.log('✅ Câmera focada no blueprint');
            }
        };
        
        animate();
    }

    /**
     * Habilita interação com o blueprint
     */
    enableInteraction() {
        this.interactionEnabled = true;
        console.log('🖱️ Interação com blueprint habilitada');
    }

    /**
     * Desabilita interação com o blueprint
     */
    disableInteraction() {
        this.interactionEnabled = false;
        document.body.style.cursor = 'default';
        console.log('🖱️ Interação com blueprint desabilitada');
    }

    /**
     * Atualiza o ambiente (chamado no loop de animação)
     * @param {number} deltaTime - Delta time em segundos
     */
    update(deltaTime) {
        // Atualizar sistemas de partículas e animações do ambiente
        // Implementar atualizações necessárias aqui
    }

    /**
     * Limpa recursos do sistema
     */
    dispose() {
        // Parar todas as animações antes de limpar
        this.stopAllModelAnimations();
        this.stopBlueprintAnimations();
        
        // Remover event listeners
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('click', this.onMouseClick);
        
        // Limpar elementos do laboratório
        this.laboratoryElements.forEach((element, name) => {
            if (element.parent) {
                this.scene.remove(element);
            }
        });
        this.laboratoryElements.clear();
        
        // Limpar blueprint
        if (this.blueprintGroup && this.blueprintGroup.parent) {
            this.scene.remove(this.blueprintGroup);
        }
        
        // Limpar sistemas de partículas
        this.particleSystems.forEach(system => {
            if (system.parent) {
                this.scene.remove(system);
            }
        });
        this.particleSystems = [];
        
        this.interactionEnabled = false;
        
        console.log('🧹 Environment Manager limpo');
    }
}
