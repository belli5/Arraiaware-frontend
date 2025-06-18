# RPE - Rocket Performance & Engagement (Frontend)

Este repositório contém o código-fonte do **Frontend** da plataforma RPE (Rocket Performance & Engagement), desenvolvida pela equipe **Arraiware** para a Rocket Corp.

O RPE é uma solução digital inovadora que visa modernizar e centralizar o processo de avaliação de desempenho da Rocket Corp, substituindo métodos manuais por uma abordagem mais eficiente, transparente e baseada em dados.

## Sobre o Projeto RPE

O RPE (Rocket Performance & Engagement) é uma plataforma desenvolvida para automatizar e otimizar as avaliações de desempenho, feedback 360 e gestão de talentos na Rocket Corp. O objetivo é proporcionar:

* **Eficiência:** Substituir planilhas e processos manuais, evitando erros e inconsistências.
* **Transparência:** Centralizar informações e facilitar o acesso aos dados de avaliação.
* **Decisão Estratégica:** Fornecer dados estruturados para o comitê de equalização, apoiando decisões de promoções, treinamentos e reconhecimento.

## Tecnologias Utilizadas (Frontend)

* **Framework:** React
* **Build Tool:** Vite
* **Estilização:** Tailwind CSS
* **Roteamento:** React Router DOM
* **Ícones:** React Icons

## Módulos Atuais (MVP 1)

O Mínimo Produto Viável (MVP 1) do RPE foca na digitalização básica do processo de avaliação, incluindo:

* **Cadastro de Usuários:** Gerenciamento de colaboradores com seus cargos, trilhas e unidades.
* **Configuração de Critérios:** Criação e edição de critérios de avaliação personalizados por trilha/unidade.
* **Formulário de Autoavaliação:** Permite que colaboradores preencham suas próprias avaliações.
* **Formulário de Avaliação de Pares e Líderes:** Permite que colaboradores avaliem seus colegas e gestores.
* **Indicação de Referências:** Funcionalidade para indicar referências técnicas e culturais.
* **Painel de Acompanhamento (RH):** Visão básica do status de preenchimento das avaliações.
* **Importação/Exportação:** Funcionalidades para importar históricos e exportar avaliações para o comitê.

## Como Executar o Projeto (Desenvolvimento)

Para rodar o frontend localmente, siga os passos abaixo:

1.  **Pré-requisitos:** Certifique-se de ter o Node.js (versão 18 ou superior recomendada) e o npm (ou Yarn) instalados em sua máquina.
2.  **Clonar o Repositório:**
    ```bash
    git clone https://github.com/belli5/Arraiaware-frontend.git
    cd Arraiaware-frontend
    ```

3.  **Instalar Dependências:**
    ```bash
    pnpm install
    ```
4.  **Iniciar o Servidor de Desenvolvimento:**
    ```bash
    pnpm run dev
    ```
    O aplicativo estará disponível em `http://localhost:5173/` (ou outra porta indicada pelo Vite).

## Repositório do Backend

Este frontend consome dados de uma API de backend separada. Você pode encontrar o código-fonte do backend no seguinte repositório:

* **Repositório do Backend:** [https://github.com/belli5/Arraiaware-backend](https://github.com/belli5/Arraiaware-backend)

Certifique-se de ter o backend rodando localmente para que o frontend possa se comunicar com ele e persistir os dados das avaliações. Consulte o README do repositório do backend para instruções sobre como configurá-lo e executá-lo.

## Contribuição

Contribuições são bem-vindas! Se você deseja colaborar, por favor, siga estas diretrizes:

1.  Faça um fork deste repositório.
2.  Crie uma nova branch para sua funcionalidade ou correção de bug (`git checkout -b feature/minha-feature` ou `fix/meu-bug`).
3.  Faça suas alterações e comite-as com mensagens claras e atômicas.
4.  Envie suas alterações para o seu fork.
5.  Abra um Pull Request para a branch `main` deste repositório.

## Equipe de Desenvolvimento

Este projeto está sendo desenvolvido pela equipe **Arraiware**.

---
