
const botao = document.querySelector('.botao-menu');
const menulateral = document.querySelector('.menu-lateral');
const modal = document.querySelector('.modal');
const logoVerMais = document.querySelector('.ver-horarios');
const indicadores = document.querySelectorAll('.indicadores li');
const searchInput = document.querySelector('.pesquisa input');
// Botões de scroll removidos
const indicadoresContainer = document.querySelector('.indicadores');

// Variável para cards será definida no DOMContentLoaded
let cards;

// Estado da aplicação
let currentCategory = 'todos';
let isModalOpen = false;
let touchStartX = 0;
let touchStartY = 0;
let isMenuOpen = false;
let isScrolling = false;

// Toggle do menu lateral
botao.addEventListener('click', () => {
    toggleMenu();
});

// Suporte a gestos touch para o menu
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Swipe horizontal para abrir/fechar menu
    if (Math.abs(diffX) > 50 && Math.abs(diffY) < 30) {
        if (diffX > 0 && !isMenuOpen) {
            // Swipe da direita para esquerda - abrir menu
            openMenu();
        } else if (diffX < 0 && isMenuOpen) {
            // Swipe da esquerda para direita - fechar menu
            closeMenu();
        }
    }
    
    // Swipe vertical para fechar modal
    if (Math.abs(diffY) > 50 && Math.abs(diffX) < 30 && isModalOpen) {
        if (diffY > 0) {
            closeModal();
        }
    }
});

function toggleMenu() {
    if (isMenuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    menulateral.classList.add('ativo');
    botao.classList.add('ativo');
    document.body.style.overflow = 'hidden';
    isMenuOpen = true;
    
    // Adiciona overlay para fechar ao tocar
    addOverlay();
}

function closeMenu() {
    menulateral.classList.remove('ativo');
    botao.classList.remove('ativo');
    document.body.style.overflow = 'auto';
    isMenuOpen = false;
    
    // Remove overlay
    removeOverlay();
}

function addOverlay() {
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
    
    overlay.addEventListener('click', closeMenu);
    overlay.addEventListener('touchstart', closeMenu);
}

function removeOverlay() {
    const overlay = document.querySelector('.menu-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
    if (!menulateral.contains(e.target) && !botao.contains(e.target) && isMenuOpen) {
        closeMenu();
    }
});

// Modal de horários
logoVerMais.addEventListener('click', () => {
    if (!isModalOpen) {
        openModal();
    }
});

// Evento para abrir modal de horários quando clicar em "Sobre"
const sobreLink = document.querySelector('a[href="#sobre"]');
sobreLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isModalOpen) {
        openModal();
        closeMenu(); // Fechar o menu lateral
    }
});

// Suporte a gestos para fechar modal
modal.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

modal.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;
    
    if (diffY > 50) {
        closeModal();
    }
});

function openModal() {
    modal.style.display = 'flex';
    isModalOpen = true;
    document.body.style.overflow = 'hidden';
    
    // Animação de entrada
    modal.style.opacity = '0';
    modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
    
    setTimeout(() => {
        modal.style.transition = 'all 0.3s ease';
        modal.style.opacity = '1';
        modal.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
}

// Fechar modal
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
        closeModal();
    }
});

function closeModal() {
    modal.style.transition = 'all 0.3s ease';
    modal.style.opacity = '0';
    modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
    
    setTimeout(() => {
        modal.style.display = 'none';
        isModalOpen = false;
        document.body.style.overflow = 'auto';
    }, 300);
}

// Sistema de filtros de categoria funcionando
indicadores.forEach(indicator => {
    indicator.addEventListener('click', () => {
        const category = indicator.getAttribute('data-category');
        filterByCategory(category);
    });
    
    // Suporte a touch para indicadores
    indicator.addEventListener('touchstart', (e) => {
        e.preventDefault();
        indicator.style.transform = 'scale(0.95)';
    });
    
    indicator.addEventListener('touchend', (e) => {
        e.preventDefault();
        indicator.style.transform = 'scale(1)';
        const category = indicator.getAttribute('data-category');
        filterByCategory(category);
    });
});

function filterByCategory(category) {
    // Remove classe ativo de todos os indicadores
    indicadores.forEach(ind => {
        ind.classList.remove('ativo');
        ind.setAttribute('aria-selected', 'false');
    });
    
    // Adiciona classe ativo ao selecionado
    const selectedIndicator = document.querySelector(`[data-category="${category}"]`);
    if (selectedIndicator) {
        selectedIndicator.classList.add('ativo');
        selectedIndicator.setAttribute('aria-selected', 'true');
        
        // Scroll para o indicador selecionado se estiver em mobile
        if (window.innerWidth <= 768) {
            selectedIndicator.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }
    
    // Se estamos em modo de busca, não aplica o filtro de categoria
    if (isSearching && lastSearchTerm.length > 0) {
        return;
    }
    
    // Limpa a busca se mudou de categoria
    if (isSearching) {
        searchInput.value = '';
        clearSearch();
    }
    
    // Filtra os cards
    filterCards(category);
    
    // Atualiza categoria atual
    currentCategory = category;
    
    // Scroll suave para a seção de produtos
    const productsSection = document.querySelector('#serviços');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function filterCards(category) {
    if (!cards) {
        cards = document.querySelectorAll('.card');
    }
    
    // Limpa mensagens de pesquisa quando filtra por categoria
    clearSearchMessages();
    
    const container = document.querySelector('.produtos-container');
    const visibleCards = [];
    
    // Primeiro, coleta todos os cards visíveis
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'todos' || cardCategory === category) {
            visibleCards.push(card);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Se for a categoria "todos", ordena os cards
    if (category === 'todos') {
        // Adiciona atributos de ordenação se não existirem
        addOrderAttributes();
        
        visibleCards.sort((a, b) => {
            const orderA = parseInt(a.getAttribute('data-order')) || 999;
            const orderB = parseInt(b.getAttribute('data-order')) || 999;
            return orderA - orderB;
        });
        
        // Reordena os elementos no DOM
        visibleCards.forEach(card => {
            container.appendChild(card);
        });
    }
    
    // Exibe os cards com animação
    visibleCards.forEach((card, index) => {
        card.style.display = 'flex';
        // Animação de entrada
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 80);
    });
}

// Sistema de navegação horizontal removido - setas foram removidas

// Sistema de busca otimizado
let searchTimeout;
let isSearching = false;
let lastSearchTerm = '';

searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    
    const searchTerm = e.target.value.trim();
    
    // Adiciona indicador de loading
    searchInput.style.borderColor = '#388E3C';
    
    searchTimeout = setTimeout(() => {
        performSearch(searchTerm);
        searchInput.style.borderColor = '#1B5E20';
    }, 300);
});

// Busca ao pressionar Enter
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const searchTerm = e.target.value.trim();
        performSearch(searchTerm);
    }
});

function performSearch(searchTerm) {
    if (!cards) return;
    
    isSearching = searchTerm.length > 0;
    lastSearchTerm = searchTerm;
    
    if (searchTerm === '') {
        // Se não há termo de busca, volta ao filtro atual
        filterCards(currentCategory);
        
        // Remove mensagens de pesquisa
        clearSearchMessages();
        return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    let foundCount = 0;
    
    cards.forEach((card, index) => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p:first-of-type').textContent.toLowerCase();
        const price = card.querySelector('.preco').textContent.toLowerCase();
        
        // Busca em título, descrição e preço
        const matches = title.includes(searchTermLower) || 
                       description.includes(searchTermLower) || 
                       price.includes(searchTermLower);
        
        if (matches) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            // Animação de entrada escalonada
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, foundCount * 50);
            
            foundCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Mostra mensagem se não encontrou resultados
    showSearchResults(foundCount, searchTerm);
    
    // Atualiza contador de resultados
    updateSearchCounter(foundCount, searchTerm);
}

function clearSearchMessages() {
    // Remove mensagem de "não encontrado"
    const existingMessage = document.querySelector('.search-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Remove contador de resultados
    const existingCounter = document.querySelector('.search-counter');
    if (existingCounter) {
        existingCounter.remove();
    }
}

function showSearchResults(count, searchTerm) {
    // Remove mensagem anterior se existir
    const existingMessage = document.querySelector('.search-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (count === 0 && searchTerm.length > 0) {
        // Cria mensagem de "não encontrado"
        const message = document.createElement('div');
        message.className = 'search-message';
        message.innerHTML = `
            <div style="
                text-align: center;
                padding: 40px 20px;
                color: #666;
                font-size: 16px;
            ">
                <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <h3 style="margin-bottom: 8px; color: #333;">Nenhum produto encontrado</h3>
                <p>Não encontramos produtos para "<strong>${searchTerm}</strong>"</p>
                <p style="margin-top: 8px; font-size: 14px;">Tente usar termos diferentes ou verifique a ortografia</p>
            </div>
        `;
        
        const container = document.querySelector('.produtos-container');
        container.appendChild(message);
    }
}

// Limpar busca
searchInput.addEventListener('blur', () => {
    if (searchInput.value === '' && isSearching) {
        clearSearch();
    }
});

// Função para limpar a busca
function clearSearch() {
    isSearching = false;
    lastSearchTerm = '';
    
    // Remove mensagem de busca se existir
    const existingMessage = document.querySelector('.search-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Remove contador de resultados se existir
    const existingCounter = document.querySelector('.search-counter');
    if (existingCounter) {
        existingCounter.remove();
    }
    
    // Volta ao filtro atual
    filterCards(currentCategory);
}

// Adiciona botão de limpar busca
function addClearSearchButton() {
    const clearBtn = document.createElement('button');
    clearBtn.innerHTML = '✕';
    clearBtn.className = 'clear-search-btn';
    clearBtn.style.cssText = `
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 18px;
        color: #999;
        cursor: pointer;
        padding: 5px;
        display: none;
    `;
    
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch();
        clearBtn.style.display = 'none';
    });
    
    // Mostra/esconde botão baseado no conteúdo do input
    searchInput.addEventListener('input', () => {
        if (searchInput.value.length > 0) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
    });
    
    // Adiciona o botão ao container de pesquisa
    const searchContainer = document.querySelector('.pesquisa');
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(clearBtn);
}

// Adiciona funcionalidade de busca por teclas de atalho
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K para focar na busca
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // ESC para limpar busca
    if (e.key === 'Escape' && isSearching) {
        searchInput.value = '';
        clearSearch();
        searchInput.blur();
    }
});

// Adiciona contador de resultados
function updateSearchCounter(count, searchTerm) {
    // Remove contador anterior se existir
    const existingCounter = document.querySelector('.search-counter');
    if (existingCounter) {
        existingCounter.remove();
    }
    
    if (count > 0 && searchTerm.length > 0) {
        const counter = document.createElement('div');
        counter.className = 'search-counter';
        counter.innerHTML = `
            <div style="
                text-align: center;
                padding: 10px 20px;
                background: rgba(27, 94, 32, 0.1);
                color: var(--primary-color);
                font-size: 14px;
                font-weight: 600;
                border-radius: 20px;
                margin: 10px auto;
                max-width: 300px;
            ">
                <i class="fas fa-search" style="margin-right: 8px;"></i>
                ${count} produto${count > 1 ? 's' : ''} encontrado${count > 1 ? 's' : ''} para "${searchTerm}"
            </div>
        `;
        
        const container = document.querySelector('.produtos-container');
        container.insertBefore(counter, container.firstChild);
    }
}

// Animações de scroll otimizadas para mobile
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Função para aplicar animações aos cards
function applyCardAnimations() {
    if (!cards) return;
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
}

// Efeito parallax otimizado
let ticking = false;
const parallaxElements = {
    banner: null,
    logo: null
};

function initParallax() {
    parallaxElements.banner = document.querySelector('.banner');
    parallaxElements.logo = document.querySelector('.logo');
}

function updateParallax() {
    if (!parallaxElements.banner || !parallaxElements.logo) return;
    
    const scrolled = window.pageYOffset;
    parallaxElements.banner.style.transform = `translateY(${scrolled * 0.3}px)`;
    parallaxElements.logo.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.1}px)`;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateParallax();
            ticking = false;
        });
        ticking = true;
    }
});

// Smooth scroll para links do menu
document.querySelectorAll('.menu-lateral a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.querySelector(`#${targetId}`);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Fecha o menu após clicar
        closeMenu();
    });
});

// Inicialização otimizada
document.addEventListener('DOMContentLoaded', () => {
    // Define a variável cards agora que o DOM está carregado
    cards = document.querySelectorAll('.card');
    
    // Inicializa componentes
    initParallax();
    addOrderAttributes();
    addClearSearchButton();
    applyCardAnimations();
    setupCardInteractions();
    setupFavoriteSystem();
    
    // Carrega produtos salvos do localStorage
    loadProductsFromStorage();
    
    // Força a reordenação inicial
    setTimeout(() => {
        filterByCategory('todos');
    }, 100);
});

// Função para configurar interações dos cards
function setupCardInteractions() {
    if (!cards) return;
    
    cards.forEach(card => {
        // Hover para desktop
        card.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                card.style.transform = 'translateY(-4px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                card.style.transform = 'translateY(0) scale(1)';
            }
        });
        
        // Touch feedback para mobile
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            card.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', (e) => {
            e.preventDefault();
            card.style.transform = 'scale(1)';
        });
    });
}

// Função para configurar sistema de favoritos
function setupFavoriteSystem() {
    if (!cards) return;
    
    cards.forEach(card => {
        const favoriteBtn = document.createElement('button');
        favoriteBtn.innerHTML = '❤️';
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.setAttribute('aria-label', 'Adicionar aos favoritos');
        
        card.style.position = 'relative';
        card.appendChild(favoriteBtn);
        
        // Verifica se já é favorito
        const cardTitle = card.querySelector('h3').textContent;
        if (localStorage.getItem(`favorite_${cardTitle}`)) {
            favoriteBtn.style.opacity = '1';
            favoriteBtn.style.transform = 'scale(1.2)';
        }
        
        favoriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(cardTitle, favoriteBtn);
        });
        
        // Suporte touch para favoritos
        favoriteBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            favoriteBtn.style.transform = 'scale(0.9)';
        });
        
        favoriteBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            favoriteBtn.style.transform = 'scale(1.2)';
            toggleFavorite(cardTitle, favoriteBtn);
        });
    });
}

// Função para adicionar atributos de ordenação
function addOrderAttributes() {
    if (!cards) {
        cards = document.querySelectorAll('.card');
    }
    
    // Define a ordem das categorias
    const categoryOrder = {
        'almoco': 1,
        'bebidas': 10,
        'cafes': 20,
        'conveniencia': 30,
        'croissants': 40,
        'cuscuz': 50,
        'jantas': 60,
        'omeletes': 70,
        'pamonhas': 80,
        'salgados': 90,
        'sanduiches': 100,
        'sobremesas': 110,
        'sucos': 120,
        'tapiocas': 130,
        'vitaminas': 140
    };
    
    // Contador para cada categoria
    const categoryCounters = {};
    
    cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const currentOrder = card.getAttribute('data-order');
        
        // Se não tem data-order, adiciona baseado na categoria
        if (!currentOrder && categoryOrder[category]) {
            if (!categoryCounters[category]) {
                categoryCounters[category] = 0;
            }
            categoryCounters[category]++;
            
            const baseOrder = categoryOrder[category];
            const finalOrder = baseOrder + categoryCounters[category];
            card.setAttribute('data-order', finalOrder);
        }
    });
}

// Funções otimizadas para mobile

function toggleFavorite(cardTitle, favoriteBtn) {
    const isFavorite = localStorage.getItem(`favorite_${cardTitle}`);
    
    if (isFavorite) {
        localStorage.removeItem(`favorite_${cardTitle}`);
        favoriteBtn.style.opacity = '0.7';
        favoriteBtn.style.transform = 'scale(1)';
        showToast('Removido dos favoritos');
    } else {
        localStorage.setItem(`favorite_${cardTitle}`, 'true');
        favoriteBtn.style.opacity = '1';
        favoriteBtn.style.transform = 'scale(1.2)';
        showToast('Adicionado aos favoritos');
    }
    
    updateFavoriteCount();
}

// Sistema de toast para feedback
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #1B5E20, #2E7D32);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        z-index: 3000;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 15px rgba(27, 94, 32, 0.3);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2000);
}

// Contador de favoritos
function updateFavoriteCount() {
    const favoriteCount = Object.keys(localStorage).filter(key => key.startsWith('favorite_')).length;
    
    let counter = document.querySelector('.favorite-counter');
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'favorite-counter';
        document.body.appendChild(counter);
    }
    
    counter.textContent = `❤️ ${favoriteCount} favoritos`;
}

// Atualiza contador quando localStorage muda
window.addEventListener('storage', updateFavoriteCount);

// Prevenção de zoom em inputs para iOS
searchInput.addEventListener('focus', () => {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        searchInput.style.fontSize = '16px';
    }
});

searchInput.addEventListener('blur', () => {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        searchInput.style.fontSize = '16px';
    }
});

// Otimização de performance para mobile
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalcula posições após redimensionamento
        if (isModalOpen) {
            const modalRect = modal.getBoundingClientRect();
            if (modalRect.top < 0 || modalRect.bottom > window.innerHeight) {
                modal.style.top = '50%';
                modal.style.transform = 'translate(-50%, -50%)';
            }
        }
        
        // Botões de navegação removidos
    }, 250);
});

// Sistema Administrativo
let isAdminLoggedIn = false;
let products = [];
let currentEditingProduct = null;

// Credenciais administrativas (em produção, isso deveria estar em um servidor)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'torres123'
};

// Chave para localStorage
const STORAGE_KEY = 'torres_coffee_products';

// Funções de persistência
function saveProductsToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        console.log('Produtos salvos no localStorage:', products.length);
    } catch (error) {
        console.error('Erro ao salvar produtos:', error);
        showToast('Erro ao salvar produtos!', 'error');
    }
}

function loadProductsFromStorage() {
    try {
        const savedProducts = localStorage.getItem(STORAGE_KEY);
        if (savedProducts) {
            products = JSON.parse(savedProducts);
            console.log('Produtos carregados do localStorage:', products.length);
            
            // Só renderiza produtos salvos se não houver produtos no DOM
            const existingCards = document.querySelectorAll('.card');
            if (existingCards.length === 0) {
                renderSavedProductsToDOM();
            }
            return true;
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showToast('Erro ao carregar produtos salvos!', 'error');
    }
    return false;
}

function renderSavedProductsToDOM() {
    const container = document.querySelector('.produtos-container');
    if (!container) return;
    
    // Adiciona produtos salvos que não estão no DOM
    products.forEach(product => {
        // Verifica se o produto já existe no DOM
        const existingCards = container.querySelectorAll('.card');
        let productExists = false;
        
        existingCards.forEach(card => {
            const cardName = card.querySelector('h3').textContent;
            if (cardName === product.name) {
                productExists = true;
            }
        });
        
        if (!productExists) {
            const newCard = document.createElement('div');
            newCard.className = 'card';
            newCard.setAttribute('data-category', product.category);
            
            newCard.innerHTML = `
                <button class="favorite-btn" aria-label="Adicionar aos favoritos">
                    <i class="far fa-heart"></i>
                </button>
                <div>
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div>
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="preco">R$ ${product.price}</p>
                </div>
            `;
            
            container.appendChild(newCard);
        }
    });
    
    // Atualiza a variável cards
    cards = document.querySelectorAll('.card');
}

// Elementos do sistema administrativo
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminLoginModal = document.getElementById('adminLoginModal');
const adminPanelModal = document.getElementById('adminPanelModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const logoutBtn = document.getElementById('logoutBtn');
const cancelLogin = document.getElementById('cancelLogin');
const adminProductsList = document.getElementById('adminProductsList');
const addProductForm = document.getElementById('addProductForm');
const productImage = document.getElementById('productImage');
const imagePreview = document.getElementById('imagePreview');

// Event Listeners para sistema administrativo
adminLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeMenu(); // Fecha o menu lateral
    openAdminLogin();
});
cancelLogin.addEventListener('click', closeAdminLogin);
logoutBtn.addEventListener('click', logout);
adminLoginForm.addEventListener('submit', handleAdminLogin);

// Event Listeners para tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        switchTab(e.target.dataset.tab);
    });
});

// Event Listeners para formulário de produto
addProductForm.addEventListener('submit', handleAddProduct);
productImage.addEventListener('change', handleImagePreview);

// Event Listeners para controles administrativos
document.getElementById('adminSearch').addEventListener('input', filterAdminProducts);
document.getElementById('categoryFilter').addEventListener('change', filterAdminProducts);

// Funções do sistema administrativo
function openAdminLogin() {
    adminLoginModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeAdminLogin() {
    adminLoginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        isAdminLoggedIn = true;
        updateAdminMenuState();
        closeAdminLogin();
        openAdminPanel();
        showToast('Login realizado com sucesso!');
    } else {
        showToast('Credenciais inválidas!', 'error');
    }
}

function openAdminPanel() {
    adminPanelModal.style.display = 'flex';
    // Não bloqueia o overflow do body para permitir rolagem no modal
    loadProducts();
}

function closeAdminPanel() {
    adminPanelModal.style.display = 'none';
    // Restaura o overflow do body
    document.body.style.overflow = 'auto';
}

function logout() {
    isAdminLoggedIn = false;
    updateAdminMenuState();
    closeAdminPanel();
    showToast('Logout realizado com sucesso!');
}

function updateAdminMenuState() {
    const adminMenuItem = document.querySelector('.admin-menu-item');
    if (isAdminLoggedIn) {
        adminMenuItem.classList.add('logged-in');
    } else {
        adminMenuItem.classList.remove('logged-in');
    }
}

function switchTab(tabName) {
    // Remove active class de todas as tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
    
    // Adiciona active class na tab selecionada
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).style.display = 'block';
    
    if (tabName === 'products') {
        loadProducts();
    }
}

function loadProducts() {
    // Primeiro tenta carregar produtos salvos
    const hasSavedProducts = loadProductsFromStorage();
    
    if (!hasSavedProducts) {
        // Se não há produtos salvos, carrega produtos existentes do DOM
        products = [];
        const cards = document.querySelectorAll('.card');
        
        cards.forEach((card, index) => {
            const product = {
                id: Date.now() + index,
                name: card.querySelector('h3').textContent,
                description: card.querySelector('p:first-of-type').textContent,
                price: card.querySelector('.preco').textContent.replace('R$ ', '').replace(',', '.'),
                category: card.getAttribute('data-category') || 'geral',
                image: card.querySelector('img').src,
                element: card
            };
            products.push(product);
        });
        
        // Salva os produtos iniciais
        saveProductsToStorage();
    }
    
    renderAdminProducts();
}

function renderAdminProducts() {
    adminProductsList.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'admin-product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">R$ ${product.price}</p>
            <div class="admin-product-actions">
                <button class="edit-btn" onclick="editProduct(${product.id})">Editar</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">Excluir</button>
            </div>
        `;
        adminProductsList.appendChild(productCard);
    });
}

function filterAdminProducts() {
    const searchTerm = document.getElementById('adminSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    // Atualiza a lista com produtos filtrados
    adminProductsList.innerHTML = '';
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'admin-product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">R$ ${product.price}</p>
            <div class="admin-product-actions">
                <button class="edit-btn" onclick="editProduct(${product.id})">Editar</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">Excluir</button>
            </div>
        `;
        adminProductsList.appendChild(productCard);
    });
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentEditingProduct = product;
    
    // Preenche o formulário com dados do produto
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productPrice').value = product.price;
    
    // Muda para a tab de adicionar produto
    switchTab('add-product');
    
    // Altera o título do formulário
    const formTitle = document.querySelector('#add-product-tab h2');
    if (formTitle) {
        formTitle.textContent = 'Editar Produto';
    }
    
    showToast('Produto carregado para edição');
}

function deleteProduct(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Remove do DOM
    product.element.remove();
    
    // Remove da lista
    products = products.filter(p => p.id !== productId);
    
    // Salva no localStorage
    saveProductsToStorage();
    
    showToast('Produto excluído com sucesso!');
    renderAdminProducts();
}

function handleAddProduct(e) {
    e.preventDefault();
    console.log('Formulário de produto submetido');
    
    const formData = new FormData(addProductForm);
    const productData = {
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description'),
        price: formData.get('price'),
        image: productImage.files[0]
    };
    
    console.log('Dados do produto:', productData);
    
    // Validação básica
    if (!productData.name || !productData.description || !productData.price) {
        showToast('Por favor, preencha todos os campos obrigatórios!', 'error');
        return;
    }
    
    if (currentEditingProduct) {
        // Editando produto existente
        console.log('Editando produto existente:', currentEditingProduct.id);
        updateProduct(currentEditingProduct.id, productData);
    } else {
        // Adicionando novo produto
        console.log('Adicionando novo produto');
        addNewProduct(productData);
    }
}

function addNewProduct(productData) {
    console.log('Adicionando novo produto:', productData);
    
    // Cria novo elemento de produto
    const newCard = document.createElement('div');
    newCard.className = 'card';
    newCard.setAttribute('data-category', productData.category);
    
    // Processa imagem
    let imageSrc = 'assets/product_not_found.jpg';
    if (productData.image) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageSrc = e.target.result;
            updateProductImage(newCard, imageSrc);
        };
        reader.readAsDataURL(productData.image);
    }
    
    newCard.innerHTML = `
        <button class="favorite-btn" aria-label="Adicionar aos favoritos">
            <i class="far fa-heart"></i>
        </button>
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
    const container = document.querySelector('.produtos-container');
    if (!container) {
        console.error('Container .produtos-container não encontrado!');
        showToast('Erro: Container não encontrado!', 'error');
        return;
    }
    
    container.appendChild(newCard);
    console.log('Produto adicionado ao DOM');
    
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
    products.push(newProduct);
    console.log('Produto adicionado à lista. Total:', products.length);
    
    // Salva no localStorage
    saveProductsToStorage();
    
    showToast('Produto adicionado com sucesso!');
    switchTab('products');
    addProductForm.reset();
    imagePreview.innerHTML = '';
}

function updateProduct(productId, productData) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Atualiza dados do produto
    product.name = productData.name;
    product.description = productData.description;
    product.price = productData.price;
    product.category = productData.category;
    
    // Atualiza no DOM
    const card = product.element;
    card.setAttribute('data-category', productData.category);
    card.querySelector('h3').textContent = productData.name;
    card.querySelector('p:first-of-type').textContent = productData.description;
    card.querySelector('.preco').textContent = `R$ ${productData.price}`;
    
    // Atualiza imagem se fornecida
    if (productData.image) {
        const reader = new FileReader();
        reader.onload = function(e) {
            product.image = e.target.result;
            updateProductImage(card, e.target.result);
        };
        reader.readAsDataURL(productData.image);
    }
    
    // Salva no localStorage
    saveProductsToStorage();
    
    showToast('Produto atualizado com sucesso!');
    switchTab('products');
    addProductForm.reset();
    imagePreview.innerHTML = '';
    currentEditingProduct = null;
}

function updateProductImage(card, imageSrc) {
    const img = card.querySelector('img');
    if (img) {
        img.src = imageSrc;
    }
}

function handleImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// Fechar modais ao clicar fora
adminLoginModal.addEventListener('click', (e) => {
    if (e.target === adminLoginModal) {
        closeAdminLogin();
    }
});

adminPanelModal.addEventListener('click', (e) => {
    if (e.target === adminPanelModal) {
        closeAdminPanel();
    }
});

// Fechar modais com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (adminLoginModal.style.display === 'flex') {
            closeAdminLogin();
        }
        if (adminPanelModal.style.display === 'flex') {
            closeAdminPanel();
        }
    }
});

// Função para mostrar toast com tipo
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    const bgColor = type === 'error' ? '#f44336' : 'linear-gradient(135deg, #1B5E20, #2E7D32)';
    
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        z-index: 3000;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2000);
}

console.log('Torres Coffee - Sistema Administrativo implementado! ☕🌿✨');