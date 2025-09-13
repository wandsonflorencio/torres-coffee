
const botao = document.querySelector('.botao-menu');
const menulateral = document.querySelector('.menu-lateral');
const modal = document.querySelector('.modal');
const logoVerMais = document.querySelector('.ver-horarios');
const indicadores = document.querySelectorAll('.indicadores li');
const cards = document.querySelectorAll('.card');
const searchInput = document.querySelector('.pesquisa input');
const scrollLeftBtn = document.querySelector('.scroll-left');
const scrollRightBtn = document.querySelector('.scroll-right');
const indicadoresContainer = document.querySelector('.indicadores');

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
    cards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'todos' || cardCategory === category) {
            card.style.display = 'flex';
            // Animação de entrada
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 80);
        } else {
            card.style.display = 'none';
        }
    });
}

// Sistema de navegação horizontal para categorias
if (scrollLeftBtn && scrollRightBtn) {
    scrollLeftBtn.addEventListener('click', () => {
        scrollCategories('left');
    });
    
    scrollRightBtn.addEventListener('click', () => {
        scrollCategories('right');
    });
    
    // Suporte touch para botões de navegação
    scrollLeftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        scrollCategories('left');
    });
    
    scrollRightBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        scrollCategories('right');
    });
}

function scrollCategories(direction) {
    // Só permite scroll em dispositivos móveis
    if (window.innerWidth > 768 || isScrolling) return;
    
    isScrolling = true;
    const scrollAmount = 200;
    const currentScroll = indicadoresContainer.scrollLeft;
    
    if (direction === 'left') {
        indicadoresContainer.scrollTo({
            left: currentScroll - scrollAmount,
            behavior: 'smooth'
        });
    } else {
        indicadoresContainer.scrollTo({
            left: currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    }
    
    // Debounce para evitar múltiplos cliques
    setTimeout(() => {
        isScrolling = false;
    }, 500);
}

// Atualizar visibilidade dos botões de navegação baseado na posição do scroll
function updateScrollButtons() {
    if (!scrollLeftBtn || !scrollRightBtn) return;
    
    // Só mostra os botões em dispositivos móveis
    if (window.innerWidth > 768) {
        scrollLeftBtn.style.display = 'none';
        scrollRightBtn.style.display = 'none';
        return;
    }
    
    const { scrollLeft, scrollWidth, clientWidth } = indicadoresContainer;
    
    // Mostra/esconde botão esquerdo
    if (scrollLeft <= 0) {
        scrollLeftBtn.style.display = 'none';
    } else {
        scrollLeftBtn.style.display = 'flex';
    }
    
    // Mostra/esconde botão direito
    if (scrollLeft + clientWidth >= scrollWidth - 5) {
        scrollRightBtn.style.display = 'none';
    } else {
        scrollRightBtn.style.display = 'flex';
    }
}

// Event listeners para scroll das categorias
if (indicadoresContainer) {
    indicadoresContainer.addEventListener('scroll', updateScrollButtons);
    indicadoresContainer.addEventListener('touchmove', updateScrollButtons);
}

// Sistema de busca otimizado para mobile
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    
    // Adiciona indicador de loading
    searchInput.style.borderColor = '#388E3C';
    
    searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.toLowerCase();
        performSearch(searchTerm);
        searchInput.style.borderColor = '#1B5E20';
    }, 300);
});

function performSearch(searchTerm) {
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p:first-of-type').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'flex';
            card.style.opacity = '1';
        } else {
            card.style.opacity = '0.3';
        }
    });
}

// Limpar busca
searchInput.addEventListener('blur', () => {
    if (searchInput.value === '') {
        cards.forEach(card => {
            card.style.opacity = '1';
        });
    }
});

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

// Observa todos os cards para animação
cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    observer.observe(card);
});

// Efeito parallax suave para mobile
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const banner = document.querySelector('.banner');
            const logo = document.querySelector('.logo');
            
            if (banner && logo) {
                banner.style.transform = `translateY(${scrolled * 0.3}px)`;
                logo.style.transform = `translate(-50%, -50%) translateY(${scrolled * 0.1}px)`;
            }
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

// Adicionar IDs às seções para navegação
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const menuItems = ['home', 'sobre', 'serviços', 'contato'];
    
    sections.forEach((section, index) => {
        if (index < menuItems.length) {
            section.id = menuItems[index];
        }
    });
    
    // Inicializa o filtro com "todos" selecionado
    filterByCategory('todos');
    
    // Atualiza botões de navegação inicialmente
    updateScrollButtons();
});

// Efeito de hover otimizado para mobile
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

// Sistema de favoritos otimizado para mobile
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
        
        // Atualiza botões de navegação após resize
        updateScrollButtons();
    }, 250);
});

console.log('Torres Coffee - Sistema de Navegação Horizontal implementado! ☕🌿✨');