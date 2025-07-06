/**
 * VoiceSystem - Sistema de síntese de voz otimizado
 */
export class VoiceSystem {
    constructor(app) { // Adicionado parâmetro app
        this.isEnabled = true;
        this.initialized = false;
        this.app = app; // Armazenar referência ao app
        this.setupVoiceSystem(); 
    }

    setupVoiceSystem() {
        if (!('speechSynthesis' in window)) {
            console.warn('⚠️ Web Speech API não suportada');
            return;
        }

        window.voiceEnabled = this.isEnabled;
        window.speakText = this.speakText.bind(this);
        window.listAvailableVoices = this.listAvailableVoices.bind(this);
        window.checkFranciscaAvailability = this.checkFranciscaAvailability.bind(this);
        window.testFrancisca = this.testFrancisca.bind(this);
        window.voiceHelp = this.showHelp.bind(this);

        // Inicializar vozes quando disponíveis
        this.initializeVoices();
        this.initialized = true;
        console.log('🎤 Sistema de voz inicializado! Digite voiceHelp() para comandos.');
    }

    speakText(text, lang = 'pt-BR', rate = 1.0, pitch = 1.0) {
        if (!this.isEnabled || !window.voiceEnabled) {
            console.log('🔇 Voz desabilitada');
            return;
        }

        // Adicionar tratamento de erro específico
        if (window.speechSynthesis.speaking) {
            console.warn('⚠️ Já está falando - ignorando novo pedido');
            return;
        }

        if (!('speechSynthesis' in window)) return;

        const synth = window.speechSynthesis;
        synth.cancel();

        const executeSpeech = () => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = rate;
            utterance.pitch = pitch;

            const voice = this.selectBestVoice(synth.getVoices(), lang);
            if (voice) {
                utterance.voice = voice;
                console.log(`🔊 Usando voz: ${voice.name}`);
            }

            utterance.onstart = () => console.log('🎤 Síntese iniciada');
            utterance.onend = () => console.log('🎤 Síntese finalizada');
            utterance.onerror = (e) => {
                console.error('❌ Erro na síntese:', e);
                if (e.error === 'not-allowed') {
                    console.warn('⚠️ Ative o áudio primeiro através de interação do usuário!');
                    // Verificar se app está disponível antes de acessar
                    if (this.app && this.app.getSystem) {
                        this.app.getSystem('ui').showNotification('Clique em qualquer lugar para ativar o áudio!');
                    }
                }
            };

            synth.speak(utterance);
        };

        if (synth.getVoices().length === 0) {
            synth.addEventListener('voiceschanged', executeSpeech, { once: true });
        } else {
            executeSpeech();
        }
    }

    selectBestVoice(voices, lang) {
        // Prioridade: Francisca -> Maria -> Feminina PT-BR -> Qualquer PT -> Padrão
        const franciscaVoice = voices.find(v => 
            v.name.toLowerCase().includes('francisca') &&
            v.lang.toLowerCase() === 'pt-br' // Garante match exato do idioma
        );
        
        if (franciscaVoice) return franciscaVoice;

        // Busca explícita por Maria como fallback prioritário
        const mariaVoice = voices.find(v => 
            v.name.toLowerCase().includes('maria') && 
            v.lang.toLowerCase() === 'pt-br'
        );
        if (mariaVoice) return mariaVoice;

        const femalePortuguese = voices.find(v => 
            v.lang === 'pt-BR' && (
                (v.gender && v.gender.toLowerCase() === 'female') || // Chrome
                v.name.toLowerCase().includes('feminina') || // Firefox
                v.name.toLowerCase().includes('female') // Outros
            )
        );

        // Fallback para qualquer voz PT-BR antes do padrão
        return femalePortuguese || voices.find(v => v.lang === 'pt-BR') || voices.find(v => v.lang.startsWith('pt')) || voices[0];
    }

    listAvailableVoices() {
        if (!('speechSynthesis' in window)) return [];

        const voices = window.speechSynthesis.getVoices();
        console.log('🎤 Vozes disponíveis:');
        voices.forEach((voice, index) => {
            // Pool 🇧🇷: Daniel, Maria, Irving
            const isBrazilianPool = (
                voice.name === 'Microsoft Maria - Portuguese (Brazil)' ||
                voice.name === 'Irving'
            ) && voice.lang === 'pt-BR';

            const marker = voice.name.toLowerCase().includes('francisca') ? '⭐' : 
                          isBrazilianPool ? '🇧🇷' : 
                          voice.lang.startsWith('pt') ? '🇧🇷' : '🌐';
            console.log(`${marker} ${index + 1}. ${voice.name} (${voice.lang})`);
        });
        return voices;
    }

    checkFranciscaAvailability() {
        if (!('speechSynthesis' in window)) {
            return { available: false, reason: 'Web Speech API não suportada' };
        }

        const voices = window.speechSynthesis.getVoices();
        const franciscaVoice = voices.find(v => v.name.toLowerCase().includes('francisca'));
        
        if (franciscaVoice) {
            return { 
                available: true, 
                voice: franciscaVoice,
                name: franciscaVoice.name,
                lang: franciscaVoice.lang
            };
        }

        return { 
            available: false, 
            reason: 'Voz Francisca não encontrada',
            suggestion: 'Verifique se as vozes do Microsoft Speech Platform estão instaladas'
        };
    }

    testFrancisca() {
        const check = this.checkFranciscaAvailability();
        console.log('🎤 Status da Francisca:', check);
        
        const message = check.available ? 
            'Olá! Eu sou a Francisca, narrando sua jornada no Nexo Dash!' :
            'Francisca não disponível, usando voz alternativa!';
            
        this.speakText(message);
    }

    showHelp() {
        console.log(`
🎤 COMANDOS DE VOZ:
═══════════════════
📋 listAvailableVoices() - Lista vozes
🔍 checkFranciscaAvailability() - Verifica Francisca
🎵 testFrancisca() - Testa Francisca
🔊 speakText("texto") - Fala texto
ℹ️  voiceHelp() - Esta ajuda
        `);
    }

    initializeVoices() {
        if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis;
            const checkVoices = () => {
                this.listAvailableVoices();
                const check = this.checkFranciscaAvailability();
                console.log(check.available ? 
                    `✅ Francisca disponível: ${check.name}` : 
                    `⚠️ Francisca não disponível: ${check.reason}`);
            };

            if (synth.getVoices().length === 0) {
                synth.addEventListener('voiceschanged', checkVoices, { once: true });
            } else {
                checkVoices();
            }
        }
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
        window.voiceEnabled = enabled;
        
        // Cancelar qualquer fala em andamento
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        
        // Se habilitado, reproduzir confirmação
        if (enabled) {
            setTimeout(() => {
                this.speakText('Voz reativada!', 'pt-BR', 1.0, 1.0);
            }, 100);
        }
        
        console.log(`🔊 Voz ${enabled ? 'ligada' : 'desligada'}`);
        return enabled;
    }

    isVoiceEnabled() {
        return this.isEnabled && window.voiceEnabled;
    }
}
