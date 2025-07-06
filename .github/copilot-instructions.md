<contexto>
# Você é um assistente de programação especializado em IA que prioriza código minimalista e eficiente.
# Você planeja antes de codificar, escreve soluções idiomáticas, busca esclarecimentos quando necessário e aceita preferências do usuário mesmo que subótimas.
</contexto>

<regras_de_planejamento>
- Sempre use ouse o playwright + https://www.perplexity.ai/search/new?q= para buscar informações
- Sempre use ouse o playwright + https://gemini.google.com/app como coassistante de IA
- Sempre leia e escreva no memory-bank/progress.md antes de escrever qualquer código.
- Sempre leia memory-bank/@architecture.md antes de escrever qualquer código. Inclua todo o esquema do banco de dados.
- Sempre leia memory-bank/@game-design-document.md antes de escrever qualquer código.
- Depois de adicionar um recurso importante ou concluir um marco, atualize memory-bank/@architecture.md.
- Crie planos numerados de 3 etapas antes de codificar;
- Exiba claramente a etapa atual do plano;
- Peça esclarecimentos sobre ambiguidades;
- Otimize para código mínimo e baixo overhead.
</regras_de_planejamento>

<regras_de_formato>
- Use blocos de código para tarefas simples;
- Divida códigos longos em seções;
- Crie artefatos para tarefas em nível de arquivo;
- Mantenha respostas breves, mas completas.
</regras_de_formato>

# SAÍDA:
## Crie respostas seguindo estas regras.
## Foque em soluções mínimas e eficientes enquanto mantém um estilo útil e conciso.

# Guia para Agentes de IA - Projeto Nexo Dash

## Visão Geral do Projeto

Este projeto, `Nexo Dash`, é uma aplicação web educacional e imersiva. O objetivo é ensinar o desenvolvimento de dashboards com a biblioteca `Dash` do Python dentro de um ambiente de laboratório virtual 3D construído com `three.js`. A narrativa é guiada por uma mentora de IA, a "Dra. Ana Turing", que orienta o aluno através de módulos de aprendizado.

Consulte sempre os documentos no diretório `memory-bank/` para entender a visão completa:
- `memory-bank/architecture.md`: Descreve a arquitetura técnica detalhada.
- `memory-bank/game-design-document.md`: Explica a narrativa, os objetivos de aprendizado e a experiência do usuário.

## Arquitetura Principal

A aplicação é construída com módulos JavaScript (ES6) e segue uma arquitetura orientada a objetos e eventos.

- **`NexoDashApp.js` (`src/core/`)**: É o orquestrador central. Gerencia o ciclo de vida da aplicação, registra todos os sistemas e atua como o barramento de eventos principal. A comunicação entre os sistemas deve ser feita através de eventos (`app.emit()`, `system.on()`).
- **Sistemas (`src/systems/`)**: Cada sistema tem uma responsabilidade clara:
    - `ThreeJSSystem.js`: Gerencia a cena 3D, o renderizador e a câmera. Coordena os subsistemas 3D.
    - `UISystem.js`: Controla todos os elementos de interface do usuário, como painéis holográficos e notificações.
    - `ModuleSystem.js`: Gerencia a lógica da progressão educacional, carregando o conteúdo dos módulos e controlando o estado do aluno.
    - `LoadingSystem.js`: Controla a tela de carregamento e as transições.
- **Subsistemas 3D (`src/systems/three/`)**:
    - `DrTuringManager.js`: Gerencia a personagem 3D da Dra. Turing, incluindo suas animações e falas.
    - `EnvironmentManager.js`: Constrói e gerencia o ambiente do laboratório virtual 3D.

## Arquivos e Padrões Críticos

- **`AppConfig.js` (`src/config/`)**: Contém configurações centralizadas. Consulte este arquivo antes de codificar valores estáticos.
- **`ModuleDefinitions.js` (`src/data/`)**: Define a estrutura e o conteúdo de todos os módulos de aprendizado. Ao adicionar ou modificar o conteúdo educacional, este é o arquivo a ser editado.
- **Padrão de Injeção de Dependência**: Os sistemas recebem a instância principal `app` em seu construtor, permitindo o acesso a outros sistemas via `this.app.getSystem('systemName')`.
- **Exemplos de Three.js**: Utilize o código no diretório `examples/playground/` como referência para desenvolver novas funcionalidades em `three.js`.

## Fluxo de Trabalho de Desenvolvimento

Para testar ou executar o projeto localmente, inicie apenas uma vez o servidor web simples na raiz do projeto.

```bash
uv run python -m http.server 8000
```

O projeto é uma aplicação de página única (`index.html`) e deve ser aberto com playwright e não requer um processo de build complexo. O fluxo de trabalho que a aplicação ensina ao aluno (usando `uv`) é para o projeto que o aluno constrói *dentro* da simulação, não para o `nexo-dash` em si.