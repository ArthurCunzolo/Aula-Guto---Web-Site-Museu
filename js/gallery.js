// Gallery.js - Funcionalidades específicas da galeria de obras

document.addEventListener('DOMContentLoaded', function() {
    
    // Sistema de filtros da galeria
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Remove classe active de todos os botões
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Adiciona classe active ao botão clicado
                this.classList.add('active');
                
                // Filtra os itens
                filterGalleryItems(filterValue);
            });
        });
    }

    // Função para filtrar itens da galeria
    function filterGalleryItems(filter) {
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (filter === 'all' || itemCategory === filter) {
                item.classList.remove('hidden');
                // Adiciona animação de entrada
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                    item.style.opacity = '1';
                }, 100);
            } else {
                item.classList.add('hidden');
                item.style.transform = 'scale(0.8)';
                item.style.opacity = '0';
            }
        });

        // Atualiza contador de itens (se existir)
        updateItemCounter(filter);
    }

    // Função para contar itens visíveis
    function updateItemCounter(filter) {
        const counter = document.querySelector('.gallery-counter');
        if (counter) {
            const visibleItems = document.querySelectorAll(`.gallery-item${filter !== 'all' ? `[data-category="${filter}"]` : ''}:not(.hidden)`);
            const total = filter === 'all' ? galleryItems.length : document.querySelectorAll(`[data-category="${filter}"]`).length;
            counter.textContent = `Mostrando ${visibleItems.length} de ${total} itens`;
        }
    }

    // Lazy loading para imagens da galeria
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.setAttribute('src', src);
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Observa todas as imagens da galeria
    document.querySelectorAll('.gallery-item img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // Animação hover para itens da galeria
    galleryItems.forEach(item => {
        const image = item.querySelector('.item-image img');
        
        item.addEventListener('mouseenter', function() {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });

    // Sistema de busca (se existir input de busca)
    const searchInput = document.querySelector('.gallery-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase();
            searchGalleryItems(searchTerm);
        }, 300));
    }

    // Função de busca
    function searchGalleryItems(searchTerm) {
        galleryItems.forEach(item => {
            const title = item.querySelector('.item-info h3').textContent.toLowerCase();
            const category = item.querySelector('.item-category').textContent.toLowerCase();
            const date = item.querySelector('.item-date').textContent.toLowerCase();
            
            const matchesSearch = title.includes(searchTerm) || 
                                category.includes(searchTerm) || 
                                date.includes(searchTerm);
            
            if (matchesSearch || searchTerm === '') {
                item.classList.remove('hidden');
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            } else {
                item.classList.add('hidden');
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
            }
        });
    }

    // Keyboard navigation para galeria
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            const currentModal = document.querySelector('.modal.show');
            if (currentModal) {
                navigateModal(event.key === 'ArrowRight' ? 'next' : 'prev');
            }
        }
    });

    // Navegação entre modais
    function navigateModal(direction) {
        const currentModal = document.querySelector('.modal.show');
        if (!currentModal) return;
        
        const currentId = currentModal.id;
        const modalNumber = parseInt(currentId.replace('modal', ''));
        const totalModals = document.querySelectorAll('.modal').length;
        
        let nextModalNumber;
        
        if (direction === 'next') {
            nextModalNumber = modalNumber >= totalModals ? 1 : modalNumber + 1;
        } else {
            nextModalNumber = modalNumber <= 1 ? totalModals : modalNumber - 1;
        }
        
        const nextModal = document.getElementById(`modal${nextModalNumber}`);
        
        if (nextModal) {
            closeModal(currentId);
            setTimeout(() => {
                openModal(`modal${nextModalNumber}`);
            }, 100);
        }
    }

    // Adiciona botões de navegação aos modais
    function addModalNavigation() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach((modal, index) => {
            const modalContent = modal.querySelector('.modal-content');
            const totalModals = modals.length;
            
            if (totalModals > 1) {
                const navContainer = document.createElement('div');
                navContainer.className = 'modal-navigation';
                navContainer.innerHTML = `
                    <button class="modal-nav-btn prev-btn" onclick="navigateModal('prev')" aria-label="Anterior">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                    </button>
                    <span class="modal-counter">${index + 1} / ${totalModals}</span>
                    <button class="modal-nav-btn next-btn" onclick="navigateModal('next')" aria-label="Próximo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                    </button>
                `;
                
                modalContent.appendChild(navContainer);
            }
        });
    }

    // Inicializa navegação dos modais
    addModalNavigation();

    // Zoom na imagem do modal
    document.querySelectorAll('.modal img').forEach(img => {
        img.addEventListener('click', function() {
            this.classList.toggle('zoomed');
        });
    });

    // Compartilhamento social (se implementado)
    function shareItem(itemId, platform) {
        const item = document.querySelector(`[data-item-id="${itemId}"]`);
        if (!item) return;
        
        const title = item.querySelector('h3').textContent;
        const url = window.location.href;
        const text = `Confira esta obra do Museu Municipal de Jaú: ${title}`;
        
        let shareUrl;
        
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    // Adiciona funcionalidade de favoritos (localStorage)
    function toggleFavorite(itemId) {
        let favorites = JSON.parse(localStorage.getItem('museum-favorites') || '[]');
        
        if (favorites.includes(itemId)) {
            favorites = favorites.filter(id => id !== itemId);
        } else {
            favorites.push(itemId);
        }
        
        localStorage.setItem('museum-favorites', JSON.stringify(favorites));
        updateFavoriteButton(itemId, favorites.includes(itemId));
    }

    // Atualiza visual do botão de favorito
    function updateFavoriteButton(itemId, isFavorite) {
        const button = document.querySelector(`[data-favorite="${itemId}"]`);
        if (button) {
            button.classList.toggle('favorited', isFavorite);
            button.setAttribute('aria-label', isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
        }
    }

    // Inicializa favoritos salvos
    function initializeFavorites() {
        const favorites = JSON.parse(localStorage.getItem('museum-favorites') || '[]');
        favorites.forEach(itemId => {
            updateFavoriteButton(itemId, true);
        });
    }

    // Chama inicialização
    initializeFavorites();

    // Analytics simples (se necessário)
    function trackGalleryInteraction(action, item) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'Gallery',
                event_label: item,
                value: 1
            });
        }
        
        // Console log para debug
        console.log(`Gallery Interaction: ${action} - ${item}`);
    }

    // Adiciona tracking aos botões de visualização
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.gallery-item');
            const itemTitle = item.querySelector('h3').textContent;
            trackGalleryInteraction('view_item', itemTitle);
        });
    });

    // Otimização de performance para scroll
    let ticking = false;
    
    function updateGalleryOnScroll() {
        // Atualiza posições ou animações baseadas no scroll
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateGalleryOnScroll);
            ticking = true;
        }
    });

    console.log('🖼️ Gallery.js carregado - Filtros e modais ativos');
});

// Torna as funções disponíveis globalmente
window.navigateModal = function(direction) {
    const currentModal = document.querySelector('.modal.show');
    if (!currentModal) return;
    
    const currentId = currentModal.id;
    const modalNumber = parseInt(currentId.replace('modal', ''));
    const totalModals = document.querySelectorAll('.modal').length;
    
    let nextModalNumber;
    
    if (direction === 'next') {
        nextModalNumber = modalNumber >= totalModals ? 1 : modalNumber + 1;
    } else {
        nextModalNumber = modalNumber <= 1 ? totalModals : modalNumber - 1;
    }
    
    const nextModal = document.getElementById(`modal${nextModalNumber}`);
    
    if (nextModal) {
        closeModal(currentId);
        setTimeout(() => {
            openModal(`modal${nextModalNumber}`);
        }, 100);
    }
};