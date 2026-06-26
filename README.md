# 🛍️ Smartly — E-commerce & Painel Administrativo Inteligente

> Uma plataforma de e-commerce moderna e completa com catálogo interativo, carrinho dinâmico, fluxo de rastreamento de pedidos e um painel de administração integrado com Inteligência Artificial para geração automática de descrições e gerenciamento de estoque/campanhas.

---

## ⚡ Principais Funcionalidades

### 🌟 Experiência do Cliente (Storefront)
- **Filtros e Busca Dinâmica:** Busca instantânea por termo de pesquisa e filtros por categorias e marcas integradas diretamente com a API.
- **Ficha Técnica Detalhada:** Visualização de especificações técnicas completas, cálculo dinâmico de desconto ("Economize R$ X") e carrossel de produtos semelhantes.
- **Carrinho de Compras Híbrido:** Suporte a compras via conta de usuário logado (persistido na API) ou como visitante (persistido no `localStorage`).
- **Simulação de Checkout Seguro:** Dados de entrega unificados com o perfil e fechamento de pedido com simulação de gateway de pagamento.
- **Rastreamento de Pedido com Linha do Tempo:** Timeline dinâmica contendo as etapas logísticas simuladas do pedido desde a aprovação até a entrega.

### ⚙️ Painel do Administrador (Backoffice)
- **Gestão de Catálogo (CRUD Completo):** Criação, edição e exclusão de produtos com controle de especificações e imagens em Base64.
- **Integração com I.A.:** Botão especial para gerar descrições automáticas e profissionais de produtos de forma contextualizada usando Inteligência Artificial.
- **Controle de Campanhas Visuais (Banners):** Upload e gerenciamento centralizado de banners de destaque e ofertas promocionais.
- **Métricas de Faturamento e Estoque:** Gráficos e indicadores de nível de estoque crítico (com sinalizações visuais) e histórico das últimas vendas realizadas.

---

## 🛠️ Stack Tecnológica

### Frontend
* **React + Vite** (Estrutura SPA rápida e moderna)
* **Tailwind CSS** (Utilizado para estilização visual e design responsivo)
* **React Router** (Utilizado para gerenciar todas as rotas e navegação de páginas)
* **Lucide** (Utilizado como pacote de ícones vetoriais)

### Backend & Segurança
* **Autenticação JWT** (Cookies com política *SameSite=Strict* para evitar CSRF)
* **Auto-restauração (Self-Healing Session):** O frontend decodifica o JWT dos cookies e auto-regenera as sessões locais caso o cache do browser seja limpo de forma acidental.
* **Integração com IA:** Rota de processamento de linguagem natural no backend para auto-descrições.
* **Banco de Dados & API REST:** Armazenamento centralizado de produtos, categorias e banners.

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
Certifique-se de possuir o [Node.js](https://nodejs.org/) instalado em sua máquina.

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do diretório e aponte para a URL do seu backend:
```env
VITE_API_URL=https://sua-api-backend.com/api
```

### 3. Instalar Dependências e Rodar o Servidor
Execute os seguintes comandos no terminal:
```bash
# Instalar dependências do projeto
npm install

# Iniciar o servidor de desenvolvimento local
npm run dev
```

Abra o endereço exibido no terminal (geralmente [http://localhost:5173](http://localhost:5173)) em seu navegador.

---

## 👥 Contribuintes

* **Thiago** — Desenvolvedor Frontend (Header, menu, estrutura principal)
* **David** — Desenvolvedor Frontend (Carrossel, Seções de Ofertas e Vitrines)
* **Rodolfo** — Desenvolvedor Frontend (Seção de Destaques, Informativos e Footer)
* **Alana** — Desenvolvedora Backend (API & Banco de Dados do Catálogo de Produtos)
* **Rodrigo** — Desenvolvedor Backend (API do Carrinho de Compras e Sincronização)
* **Rafael** — Desenvolvedor Backend & I.A. (API de Banners, Integração de I.A. para descrição)
