# Torres Coffee - Sistema de Cardápio Digital

## 📋 Visão Geral

Sistema completo de cardápio digital para a Torres Coffee com dois tipos de acesso:

1. **Acesso Público**: Visualização do cardápio sem necessidade de login
2. **Acesso Administrativo**: Login necessário para gerenciar produtos, preços e imagens

## 🚀 Funcionalidades

### Acesso Público
- ✅ Visualização completa do cardápio
- ✅ Sistema de busca por produtos
- ✅ Filtros por categoria
- ✅ Sistema de favoritos
- ✅ Interface responsiva para mobile e desktop
- ✅ Animações e transições suaves

### Acesso Administrativo
- ✅ Login seguro com credenciais
- ✅ Painel administrativo completo
- ✅ Gerenciamento de produtos (CRUD)
- ✅ Upload de imagens
- ✅ Edição de preços e descrições
- ✅ Criação e exclusão de produtos
- ✅ Filtros e busca administrativa

## 🔐 Credenciais Administrativas

**Usuário:** `admin`  
**Senha:** `torres123`

> ⚠️ **Importante**: Em produção, essas credenciais devem ser armazenadas em um servidor seguro.

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com variáveis CSS e animações
- **JavaScript ES6+**: Funcionalidades interativas
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia (Playfair Display)

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- 📱 Dispositivos móveis (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1200px+)

## 🎨 Características do Design

- **Paleta de Cores**: Verde (tema café)
- **Tipografia**: Playfair Display (elegante)
- **Animações**: Transições suaves e efeitos hover
- **Layout**: Grid responsivo e flexbox
- **Acessibilidade**: ARIA labels e navegação por teclado

## 📂 Estrutura do Projeto

```
torres-coffee/
├── index.html          # Página principal
├── script.js          # Lógica JavaScript
├── style.css          # Estilos CSS
├── assets/            # Imagens dos produtos
│   ├── logo.png
│   ├── *.webp         # Imagens dos produtos
│   └── product_not_found.jpg
└── README.md          # Documentação
```

## 🚀 Como Usar

### Acesso Público
1. Abra o `index.html` no navegador
2. Navegue pelo cardápio usando os filtros de categoria
3. Use a busca para encontrar produtos específicos
4. Adicione produtos aos favoritos

### Acesso Administrativo
1. Clique no botão de login administrativo (ícone de escudo)
2. Digite as credenciais: `admin` / `torres123`
3. Gerencie produtos no painel administrativo:
   - **Produtos**: Visualizar, editar e excluir produtos existentes
   - **Adicionar Produto**: Criar novos produtos com imagem

## 🔧 Funcionalidades Administrativas

### Gerenciamento de Produtos
- **Visualizar**: Lista todos os produtos com filtros
- **Adicionar**: Criar novos produtos com formulário completo
- **Editar**: Modificar produtos existentes
- **Excluir**: Remover produtos do cardápio
- **Upload**: Adicionar imagens aos produtos

### Filtros e Busca
- Busca por nome ou descrição
- Filtro por categoria
- Interface intuitiva e responsiva

## 🎯 Categorias de Produtos

- 🍽️ Almoço
- 🥤 Bebidas
- ☕ Cafés
- 🏪 Conveniência
- 🥐 Croissants
- 🌽 Cuscuz
- 🌙 Jantas
- 🍳 Omeletes
- 🌽 Pamonhas
- 🥧 Salgados
- 🥪 Sanduíches
- 🍰 Sobremesas
- 🧃 Sucos
- 🥞 Tapiocas
- 🥤 Vitaminas

## 🔒 Segurança

- Login obrigatório para acesso administrativo
- Validação de formulários
- Confirmação para exclusão de produtos
- Escape para fechar modais

## 📱 Otimizações Mobile

- Touch gestures para navegação
- Interface adaptativa
- Performance otimizada
- Prevenção de zoom em inputs (iOS)

## 🎨 Personalização

O sistema permite fácil personalização através das variáveis CSS:

```css
:root {
    --primary-color: #1B5E20;
    --secondary-color: #2E7D32;
    --accent-color: #388E3C;
    /* ... outras variáveis */
}
```

## 🚀 Próximas Melhorias

- [ ] Sistema de backup de dados
- [ ] Múltiplos administradores
- [ ] Relatórios de vendas
- [ ] Integração com sistema de pagamento
- [ ] API REST para dados
- [ ] Sistema de notificações

## 📞 Suporte

Para dúvidas ou suporte técnico, entre em contato através do sistema administrativo.

---

**Desenvolvido com ☕ para Torres Coffee** ✨
