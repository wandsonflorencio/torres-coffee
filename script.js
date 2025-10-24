/**
 * Torres Coffee - Sistema de Cardápio Digital
 * Versão Otimizada
 */

// ===== CONSTANTES E CONFIGURAÇÕES =====
const CONFIG = {
    ADMIN_CREDENTIALS: {
        username: 'admin',
        password: 'torres123'
    },
    STORAGE_KEY: 'torres_coffee_products',
    TOUCH_THRESHOLDS: {
        SWIPE_DISTANCE: 50,
        VERTICAL_THRESHOLD: 30,
        MOVEMENT_THRESHOLD: 5,
        TOUCH_DURATION: 300
    },
    SELECTORS: {
        MENU_BUTTON: '.botao-menu',
        MENU_LATERAL: '.menu-lateral',
        MODAL: '.modal',
        SEARCH_INPUT: '.pesquisa input',
        INDICADORES: '.indicadores li',
        CARDS: '.card',
        PRODUCTS_CONTAINER: '.produtos-container'
    }
};

// ===== ELEMENTOS DOM =====
const elements = {
    botao: document.querySelector(CONFIG.SELECTORS.MENU_BUTTON),
    menulateral: document.querySelector(CONFIG.SELECTORS.MENU_LATERAL),
    modal: document.querySelector(CONFIG.SELECTORS.MODAL),
    logoVerMais: document.querySelector('.ver-horarios'),
    indicadores: document.querySelectorAll(CONFIG.SELECTORS.INDICADORES),
    searchInput: document.querySelector(CONFIG.SELECTORS.SEARCH_INPUT),
    indicadoresContainer: document.querySelector('.indicadores')
};

// ===== ESTADO DA APLICAÇÃO =====
const state = {
    currentCategory: 'todos',
    isModalOpen: false,
    isMenuOpen: false,
    isScrolling: false,
    touchStartX: 0,
    touchStartY: 0,
    cards: null,
    isAdminLoggedIn: false,
    products: [],
    currentEditingProduct: null
};

// ===== SISTEMA ADMINISTRATIVO =====
const adminSystem = {
    // Elementos administrativos
    adminLoginModal: document.getElementById('adminLoginModal'),
    adminPanelModal: document.getElementById('adminPanelModal'),
    adminLoginForm: document.getElementById('adminLoginForm'),
    addProductForm: document.getElementById('addProductForm'),
    productImage: document.getElementById('productImage'),
    imagePreview: document.getElementById('imagePreview'),
    adminProductsList: document.getElementById('adminProductsList'),
    adminMenuItem: document.querySelector('.admin-menu-item'),

    // Funções de armazenamento
    saveProductsToStorage() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state.products));
            console.log('Produtos salvos no localStorage:', state.products.length);
        } catch (error) {
            console.error('Erro ao salvar produtos:', error);
            this.showToast('Erro ao salvar produtos!', 'error');
        }
    },

    loadProductsFromStorage() {
        try {
            const savedProducts = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (savedProducts) {
                state.products = JSON.parse(savedProducts);
                console.log('Produtos carregados do localStorage:', state.products.length);
                return true;
            }
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
        return false;
    },

    // Funções de login
    openAdminLogin() {
        this.adminLoginModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    },

    closeAdminLogin() {
        this.adminLoginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    },

    handleAdminLogin(e) {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        if (username === CONFIG.ADMIN_CREDENTIALS.username && 
            password === CONFIG.ADMIN_CREDENTIALS.password) {
            state.isAdminLoggedIn = true;
            this.closeAdminLogin();
            this.openAdminPanel();
            this.updateAdminMenuState();
            this.showToast('Login realizado com sucesso!');
        } else {
            this.showToast('Credenciais inválidas!', 'error');
        }
    },

    openAdminPanel() {
        this.adminPanelModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.loadProducts();
    },

    closeAdminPanel() {
        this.adminPanelModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        state.currentEditingProduct = null;
    },

    logout() {
        state.isAdminLoggedIn = false;
        this.closeAdminPanel();
        this.updateAdminMenuState();
        this.showToast('Logout realizado com sucesso!');
    },

    updateAdminMenuState() {
        if (state.isAdminLoggedIn) {
            this.adminMenuItem.classList.add('logged-in');
        } else {
            this.adminMenuItem.classList.remove('logged-in');
        }
    },

    // Funções de produtos
    loadProducts() {
        const hasSavedProducts = this.loadProductsFromStorage();
        
        if (!hasSavedProducts) {
            this.initializeDefaultProducts();
        }
        
        this.renderAdminProducts();
    },

    initializeDefaultProducts() {
        // Produtos padrão se não houver salvos
        const defaultProducts = [
            {
                id: 1,
                name: 'Arrumadinho De Charque',
                description: 'Feijão de corda, arroz, vinagrete, farofa e charque',
                price: '24,99',
                category: 'almoco',
                image: 'assets/arrumadinho de charque.webp'
            }
        ];
        
        state.products = defaultProducts;
        this.saveProductsToStorage();
    },

    renderAdminProducts() {
        this.adminProductsList.innerHTML = '';
        
        state.products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'admin-product-card';
            productCard.setAttribute('data-category', product.category);
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">R$ ${product.price}</p>
                <div class="admin-product-actions">
                    <button class="edit-btn" onclick="adminSystem.editProduct(${product.id})">Editar</button>
                    <button class="delete-btn" onclick="adminSystem.deleteProduct(${product.id})">Excluir</button>
                </div>
            `;
            this.adminProductsList.appendChild(productCard);
        });
    },

    editProduct(productId) {
        const product = state.products.find(p => p.id === productId);
        if (!product) return;
        
        state.currentEditingProduct = product;
        
        // Preenche o formulário
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        
        // Limpa preview de imagem
        if (this.imagePreview) {
            this.imagePreview.innerHTML = '';
        }
        
        // Muda para tab de adicionar produto
        this.switchTab('add-product');
        
        // Altera título do formulário
        const formTitle = document.querySelector('#add-product-tab h2');
        if (formTitle) {
            formTitle.textContent = 'Editar Produto';
        }
        
        this.showToast('Produto carregado para edição');
    },

    deleteProduct(productId) {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;
        
        const product = state.products.find(p => p.id === productId);
        if (!product) return;
        
        const index = state.products.indexOf(product);
        state.products.splice(index, 1);
        
        this.saveProductsToStorage();
        this.renderAdminProducts();
        this.showToast('Produto excluído com sucesso!');
    },

    filterAdminProducts(searchTerm) {
        const products = document.querySelectorAll('.admin-product-card');
        const term = searchTerm.toLowerCase();
        
        products.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (name.includes(term) || description.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    },

    filterAdminProductsByCategory(category) {
        const products = document.querySelectorAll('.admin-product-card');
        
        products.forEach(card => {
            const productCategory = card.getAttribute('data-category');
            if (category === 'all' || productCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    },

    switchTab(tabName) {
        // Remove active class de todas as tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
        
        // Adiciona active class na tab selecionada
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).style.display = 'block';
        
        if (tabName === 'products') {
            this.loadProducts();
        }
        
        // Limpa estado de edição se mudou de tab
        if (tabName !== 'add-product') {
            state.currentEditingProduct = null;
            const formTitle = document.querySelector('#add-product-tab h2');
            if (formTitle) {
                formTitle.textContent = 'Adicionar Produto';
            }
        }
    },

    handleAddProduct(e) {
        e.preventDefault();
        
        const formData = new FormData(this.addProductForm);
        const productData = {
            name: formData.get('name'),
            category: formData.get('category'),
            description: formData.get('description'),
            price: formData.get('price'),
            image: this.productImage.files[0]
        };
        
        // Validação
        if (!productData.name || !productData.description || !productData.price) {
            this.showToast('Por favor, preencha todos os campos obrigatórios!', 'error');
            return;
        }
        
        console.log('Estado atual:', state.currentEditingProduct);
        console.log('Dados do produto:', productData);
        
        if (state.currentEditingProduct) {
            console.log('Atualizando produto:', state.currentEditingProduct.id);
            this.updateProduct(state.currentEditingProduct.id, productData);
        } else {
            console.log('Adicionando novo produto');
            this.addNewProduct(productData);
        }
    },

    addNewProduct(productData) {
        const newCard = document.createElement('div');
        newCard.className = 'card';
        newCard.setAttribute('data-category', productData.category);
        
        let imageSrc = 'assets/product_not_found.jpg';
        if (productData.image) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imageSrc = e.target.result;
                this.updateProductImage(newCard, imageSrc);
            }.bind(this);
            reader.readAsDataURL(productData.image);
        }
        
        newCard.innerHTML = `
            <div>
                <img src="${imageSrc}" alt="${productData.name}">
            </div>
            <div>
                <h3>${productData.name}</h3>
                <p>${productData.description}</p>
                <p class="preco">R$ ${productData.price}</p>
            </div>
        `;
        
        // Adiciona ao DOM
        const container = document.querySelector(CONFIG.SELECTORS.PRODUCTS_CONTAINER);
        if (!container) {
            this.showToast('Erro: Container não encontrado!', 'error');
            return;
        }
        
        container.appendChild(newCard);
        
        // Adiciona à lista de produtos
        const newProduct = {
            id: Date.now() + Math.random(),
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: productData.category,
            image: imageSrc,
            element: newCard
        };
        
        state.products.push(newProduct);
        this.saveProductsToStorage();
        this.renderAdminProducts();
        
        this.showToast('Produto adicionado com sucesso!');
        this.switchTab('products');
        this.addProductForm.reset();
        this.imagePreview.innerHTML = '';
        state.currentEditingProduct = null;
    },

    updateProduct(productId, productData) {
        const product = state.products.find(p => p.id === productId);
        if (!product) {
            this.showToast('Produto não encontrado!', 'error');
            return;
        }
        
        // Atualiza dados do produto
        product.name = productData.name;
        product.description = productData.description;
        product.price = productData.price;
        product.category = productData.category;
        
        // Atualiza imagem se fornecida
        if (productData.image) {
            const reader = new FileReader();
            reader.onload = function(e) {
                product.image = e.target.result;
                this.saveProductsToStorage();
                this.renderAdminProducts();
                this.showToast('Produto atualizado com sucesso!');
                this.switchTab('products');
                this.addProductForm.reset();
                this.imagePreview.innerHTML = '';
                state.currentEditingProduct = null;
            }.bind(this);
            reader.readAsDataURL(productData.image);
        } else {
            // Se não há nova imagem, salva imediatamente
            this.saveProductsToStorage();
            this.renderAdminProducts();
            this.showToast('Produto atualizado com sucesso!');
            this.switchTab('products');
            this.addProductForm.reset();
            this.imagePreview.innerHTML = '';
            state.currentEditingProduct = null;
        }
    },

    updateProductImage(card, imageSrc) {
        const img = card.querySelector('img');
        if (img) {
            img.src = imageSrc;
        }
    },

    handleImagePreview(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                this.imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px;">`;
            }.bind(this);
            reader.readAsDataURL(file);
        }
    },

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        if (type === 'error') {
            toast.style.background = '#e74c3c';
        }
        
        document.body.appendChild(toast);
        
            setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }
};

// ===== SISTEMA DE MENU =====
const menuSystem = {
    toggle() {
        if (state.isMenuOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open() {
        elements.menulateral.classList.add('ativo');
        elements.botao.classList.add('ativo');
        document.body.style.overflow = 'hidden';
        state.isMenuOpen = true;
        this.addOverlay();
    },

    close() {
        elements.menulateral.classList.remove('ativo');
        elements.botao.classList.remove('ativo');
        document.body.style.overflow = 'auto';
        state.isMenuOpen = false;
        this.removeOverlay();
    },

    addOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        overlay.addEventListener('click', this.close.bind(this));
        overlay.addEventListener('touchstart', this.close.bind(this));
        
        // Adiciona event listeners para fechar o menu quando clicar nos links
        this.setupMenuLinks();
    },

    removeOverlay() {
        const overlay = document.querySelector('.menu-overlay');
        if (overlay) {
            overlay.remove();
        }
    },

    setupMenuLinks() {
        const menuLinks = elements.menulateral.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Se for o botão de admin, não fecha o menu ainda
                if (link.id === 'adminLoginBtn') {
                    e.preventDefault();
                    this.handleAdminClick();
                    return;
                }
                
                // Fecha o menu quando clicar em qualquer outro link
                this.close();
                
                // Se for um link de âncora, faz scroll suave
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        setTimeout(() => {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 300);
                    }
                }
            });
        });
    },

    handleAdminClick() {
        // Fecha o menu lateral
        this.close();
        
        // Abre o modal de login administrativo
        setTimeout(() => {
            if (adminSystem.adminLoginModal) {
                adminSystem.adminLoginModal.style.display = 'flex';
                adminSystem.adminLoginModal.style.opacity = '0';
                adminSystem.adminLoginModal.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    adminSystem.adminLoginModal.style.transition = 'all 0.3s ease';
                    adminSystem.adminLoginModal.style.opacity = '1';
                    adminSystem.adminLoginModal.style.transform = 'scale(1)';
                }, 10);
            }
        }, 300);
    }
};

// ===== SISTEMA DE MODAL =====
const modalSystem = {
    open() {
        elements.modal.style.display = 'flex';
        state.isModalOpen = true;
        document.body.style.overflow = 'hidden';
        this.addModalOverlay();
        
        // Animação simples de entrada
        elements.modal.style.opacity = '0';
        elements.modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
        
        setTimeout(() => {
            elements.modal.style.transition = 'all 0.3s ease';
            elements.modal.style.opacity = '1';
            elements.modal.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    },

    close() {
        elements.modal.style.transition = 'all 0.2s ease';
        elements.modal.style.opacity = '0';
        elements.modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
        
        setTimeout(() => {
            elements.modal.style.display = 'none';
            state.isModalOpen = false;
            document.body.style.overflow = 'auto';
            this.removeModalOverlay();
        }, 200);
    },

    addModalOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1999;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            this.close();
        });
    },

    removeModalOverlay() {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
};

// ===== SISTEMA DE CATEGORIAS =====
const categorySystem = {
    filterByCategory(category) {
        // Remove classe ativo de todos os indicadores
        elements.indicadores.forEach(ind => {
            ind.classList.remove('ativo');
            ind.setAttribute('aria-selected', 'false');
        });
        
        // Adiciona classe ativo no indicador selecionado
        const activeIndicator = Array.from(elements.indicadores).find(ind => 
            ind.getAttribute('data-category') === category
        );
        
        if (activeIndicator) {
            activeIndicator.classList.add('ativo');
            activeIndicator.setAttribute('aria-selected', 'true');
        }
        
        // Filtra cards com animação
        if (state.cards) {
            const visibleCards = [];
            const hiddenCards = [];
            
            state.cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'todos' || cardCategory === category) {
                    visibleCards.push(card);
                } else {
                    hiddenCards.push(card);
                }
            });
            
            // Anima saída dos cards ocultos
            cardSystem.animateCardFilter(hiddenCards, false);
            
            // Anima entrada dos cards visíveis
            setTimeout(() => {
                cardSystem.animateCardFilter(visibleCards, true);
            }, 200);
        }
        
        state.currentCategory = category;
    },

    setupIndicators() {
        elements.indicadores.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const category = indicator.getAttribute('data-category');
                this.filterByCategory(category);
            });
            
            // Sistema de touch otimizado
            this.setupTouchEvents(indicator);
        });
    },

    setupTouchEvents(indicator) {
        let touchStartTime = 0;
        let touchStartX = 0;
        let touchStartY = 0;
        let hasMoved = false;
        
        indicator.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            hasMoved = false;
            
            indicator.style.transform = 'scale(0.95)';
        });
        
        indicator.addEventListener('touchmove', (e) => {
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - touchStartX);
            const diffY = Math.abs(currentY - touchStartY);
            
            if (diffX > CONFIG.TOUCH_THRESHOLDS.MOVEMENT_THRESHOLD || 
                diffY > CONFIG.TOUCH_THRESHOLDS.MOVEMENT_THRESHOLD) {
                hasMoved = true;
            }
            
            if (diffY > 10) {
                e.preventDefault();
            }
        });
        
        indicator.addEventListener('touchend', (e) => {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            
            indicator.style.transform = 'scale(1)';
            
            if (!hasMoved && touchDuration < CONFIG.TOUCH_THRESHOLDS.TOUCH_DURATION) {
                const category = indicator.getAttribute('data-category');
                this.filterByCategory(category);
            }
        });
    }
};

// ===== SISTEMA DE BUSCA =====
const searchSystem = {
    init() {
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', this.handleSearch.bind(this));
            this.addClearButton();
        }
    },

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (state.cards) {
            const visibleCards = [];
            const hiddenCards = [];
            
            state.cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    visibleCards.push(card);
                } else {
                    hiddenCards.push(card);
                }
            });
            
            // Anima saída dos cards ocultos
            cardSystem.animateCardFilter(hiddenCards, false);
            
            // Anima entrada dos cards visíveis
            setTimeout(() => {
                cardSystem.animateCardFilter(visibleCards, true);
            }, 200);
        }
    },

    addClearButton() {
        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-search-btn';
        clearBtn.innerHTML = '×';
        clearBtn.style.cssText = `
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 18px;
            color: #999;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: all 0.3s ease;
            display: none;
        `;
        
        elements.searchInput.parentNode.style.position = 'relative';
        elements.searchInput.parentNode.appendChild(clearBtn);
        
        clearBtn.addEventListener('click', () => {
            elements.searchInput.value = '';
            this.handleSearch({ target: elements.searchInput });
            clearBtn.style.display = 'none';
        });
        
        elements.searchInput.addEventListener('input', () => {
            clearBtn.style.display = elements.searchInput.value ? 'block' : 'none';
        });
    }
};

// ===== SISTEMA DE TOUCH GLOBAL =====
const touchSystem = {
    init() {
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    },

    handleTouchStart(e) {
        if (this.shouldCaptureTouch(e)) {
            state.touchStartX = e.touches[0].clientX;
            state.touchStartY = e.touches[0].clientY;
        }
    },

    handleTouchEnd(e) {
        if (this.shouldCaptureTouch(e)) {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = state.touchStartX - touchEndX;
            const diffY = state.touchStartY - touchEndY;
            
            // Swipe horizontal para menu
            if (Math.abs(diffX) > CONFIG.TOUCH_THRESHOLDS.SWIPE_DISTANCE && 
                Math.abs(diffY) < CONFIG.TOUCH_THRESHOLDS.VERTICAL_THRESHOLD) {
                if (diffX > 0 && !state.isMenuOpen) {
                    menuSystem.open();
                } else if (diffX < 0 && state.isMenuOpen) {
                    menuSystem.close();
                }
            }
            
            // Swipe vertical para modal
            if (Math.abs(diffY) > CONFIG.TOUCH_THRESHOLDS.SWIPE_DISTANCE && 
                Math.abs(diffX) < CONFIG.TOUCH_THRESHOLDS.VERTICAL_THRESHOLD && 
                state.isModalOpen) {
                if (diffY > 0) {
                    modalSystem.close();
                }
            }
        }
    },

    shouldCaptureTouch(e) {
        return e.target.closest('.botao-menu') || 
               e.target.closest('.menu-lateral') ||
               (e.target.closest('body') && 
                !e.target.closest('.indicadores') && 
                !e.target.closest('.card') && 
                !e.target.closest('button') && 
                !e.target.closest('input') && 
                !e.target.closest('a') &&
                e.clientX < 50);
    }
};

// ===== SISTEMA DE CARDS =====
const cardSystem = {
    init() {
        this.setupCardInteractions();
        this.applyInitialAnimations();
    },

    setupCardInteractions() {
        if (state.cards) {
            state.cards.forEach(card => {
                this.setupCardTouchEvents(card);
                this.setupCardHoverEffects(card);
            });
        }
    },

    setupCardTouchEvents(card) {
        card.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault(); // Prevenir zoom com dois dedos
            }
        });
    },

    setupCardHoverEffects(card) {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('animating')) {
                card.style.transform = 'translateY(-3px)';
                card.style.boxShadow = '0 6px 20px rgba(27, 94, 32, 0.25)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('animating')) {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 4px 16px rgba(27, 94, 32, 0.15)';
            }
        });
    },

    applyInitialAnimations() {
        if (state.cards) {
            state.cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.4s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 80);
            });
        }
    },

    animateCardFilter(cards, isVisible) {
        cards.forEach((card, index) => {
            if (isVisible) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(15px) scale(0.95)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, index * 50);
            } else {
                card.style.transition = 'all 0.2s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 200);
            }
        });
    }
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa cards
    state.cards = document.querySelectorAll(CONFIG.SELECTORS.CARDS);
    
    // Inicializa sistemas
    touchSystem.init();
    categorySystem.setupIndicators();
    searchSystem.init();
    cardSystem.init();
    
    // Event listeners básicos
    elements.botao.addEventListener('click', menuSystem.toggle.bind(menuSystem));
    elements.logoVerMais.addEventListener('click', modalSystem.open.bind(modalSystem));
    
    // Event listener para botão de fechar modal
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', modalSystem.close.bind(modalSystem));
    }
    
    // Event listeners administrativos
    if (adminSystem.adminLoginForm) {
        adminSystem.adminLoginForm.addEventListener('submit', adminSystem.handleAdminLogin.bind(adminSystem));
    }
    
    if (adminSystem.addProductForm) {
        adminSystem.addProductForm.addEventListener('submit', adminSystem.handleAddProduct.bind(adminSystem));
    }
    
    if (adminSystem.productImage) {
        adminSystem.productImage.addEventListener('change', adminSystem.handleImagePreview.bind(adminSystem));
    }
    
    // Event listener para botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            adminSystem.logout();
        });
    }
    
    // Event listener para fechar modal administrativo clicando fora
    if (adminSystem.adminPanelModal) {
        adminSystem.adminPanelModal.addEventListener('click', (e) => {
            if (e.target === adminSystem.adminPanelModal) {
                adminSystem.closeAdminPanel();
            }
        });
    }
    
    // Event listeners para tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            adminSystem.switchTab(e.target.dataset.tab);
        });
    });
    
    // Event listeners para controles administrativos
    const adminSearch = document.getElementById('adminSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (adminSearch) {
        adminSearch.addEventListener('input', (e) => {
            adminSystem.filterAdminProducts(e.target.value);
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            adminSystem.filterAdminProductsByCategory(e.target.value);
        });
    }
    
    // Prevenção de zoom em inputs para iOS
    if (elements.searchInput) {
        elements.searchInput.addEventListener('focus', () => {
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                elements.searchInput.style.fontSize = '16px';
            }
        });
        
        elements.searchInput.addEventListener('blur', () => {
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                elements.searchInput.style.fontSize = '16px';
            }
        });
    }
    
    // Carrega produtos salvos
    adminSystem.loadProductsFromStorage();
    
    // Força filtro inicial
    setTimeout(() => {
        categorySystem.filterByCategory('todos');
    }, 100);
});

// ===== EXPOSIÇÃO GLOBAL PARA COMPATIBILIDADE =====
window.adminSystem = adminSystem;
window.menuSystem = menuSystem;
window.modalSystem = modalSystem;
window.categorySystem = categorySystem;