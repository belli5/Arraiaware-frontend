# RPE - Rocket Performance & Engagement (Frontend)

Este repositório contém o código-fonte do **Frontend** da plataforma RPE (Rocket Performance & Engagement), desenvolvida pela equipe **Arraiware** para a Rocket Corp.

O RPE é uma solução digital inovadora que visa modernizar e centralizar o processo de avaliação de desempenho da Rocket Corp, substituindo métodos manuais por uma abordagem mais eficiente, segura, estruturada e baseada em dados.

🔗 **Sistema no ar**: [arraiaware-frontend-iota.vercel.app](http://arraiaware-frontend-iota.vercel.app)

> Novo por aqui? Confira o guia de [ONBOARDING](docs/ONBOARDING.md) para começar!

---

## 🧭 Visão Geral do Projeto

O RPE (Rocket Performance & Engagement) é uma plataforma construída para automatizar e estruturar os processos de:

- Autoavaliação de colaboradores
- Avaliação de pares e líderes
- Equalização de avaliações por comitês
- Análise inteligente de desempenho (com GenAI)
- Segurança e controle de dados sensíveis

Seu objetivo principal é fornecer uma base sólida para decisões estratégicas sobre talentos, reconhecimentos, promoções e desenvolvimento de pessoas.

---

## 🛠 Tecnologias Utilizadas (Frontend)

- **Framework:** React
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS
- **Roteamento:** React Router DOM
- **Ícones:** React Icons

---

## 📦 MVPs Implementados

### ✅ MVP 1 — Digitalização Básica do Processo

> Foco: Eficiência operacional

- Cadastro de usuários (com trilha, unidade e cargo)
- Criação e edição de critérios personalizados por trilha/unidade
- Autoavaliação com notas (1-5) e justificativas obrigatórias
- Avaliação de pares e líderes
- Indicação de referências técnicas e culturais
- Importação de histórico de avaliações (via Excel/CSV)
- Painel básico para RH acompanhar status dos envios
- Exportação das avaliações para o comitê de equalização

### ✅ MVP 2 — Avaliação Líder-Colaborador e Equalização Inicial

> Foco: Análise estratégica e suporte à decisão

- Integração com ERP para identificar automaticamente líderes e alocações
- Painel dedicado para gestores avaliarem seus liderados
- Painel consolidado de equalização com visualização de múltiplas fontes (autoavaliação, pares, gestores)
- Detecção automática de discrepâncias nas avaliações
- Resumos automáticos por colaborador com GenAI para guiar discussões
- Exportação pós-equalização com justificativas consolidadas
- Geração dos "Brutal Facts" para mentores

### ✅ MVP 3 — Privacidade e Segurança

> Foco: Conformidade e proteção de dados sensíveis

- Criptografia granular dos textos e dados sensíveis
- Gestão de permissões por papel (colaborador, gestor, comitê, RH, admin)
- Restrição de acesso a dados confidenciais para desenvolvedores
- Logs de auditoria e controle de acessos críticos
- Monitoramento básico de segurança e acesso

---

## 🚀 Como Executar o Projeto (Desenvolvimento)

1. **Pré-requisitos**: Node.js 18+ e pnpm instalados

2. **Clonar o Repositório**
```bash
git clone https://github.com/belli5/Arraiaware-frontend.git
cd Arraiaware-frontend
````

3. **Instalar Dependências**

```bash
pnpm install
```

4. **Rodar em Desenvolvimento**

```bash
pnpm run dev
```

> O app estará disponível em `http://localhost:5173/` (ou outra porta conforme o Vite indicar).

---

## 🔗 Repositório do Backend

Este frontend consome dados de uma API separada. Para uma experiência completa, clone e rode também o backend:

👉 [https://github.com/belli5/Arraiaware-backend](https://github.com/belli5/Arraiaware-backend)

---

## 👥 Equipe de Desenvolvimento

Projeto desenvolvido pela equipe **Arraiware** como parte do desafio Rocket Lab para a **Rocket Corp**.

---

## 🤝 Contribuição

Contribuições são muito bem-vindas!

1. Faça um fork do repositório
2. Crie uma branch: `git checkout -b feature/nome-da-feature`
3. Faça suas alterações com commits atômicos
4. Push para seu fork
5. Abra um Pull Request para `main`

---

📌 **Status Atual**: MVPs 1 a 3 entregues com sucesso e em produção.

💡 **Próximos passos**: módulos analíticos, gestão de OKRs/PDIs e integração com NPS.

```
