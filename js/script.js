// Carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    // Simula carregamento
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(function() {
                loadingScreen.style.display = 'none';
                if (mainContent) {
                    mainContent.style.opacity = '1';
                }
            }, 500);
        }
    }, 2000);

    // Navbar responsiva
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fecha o menu ao clicar em um link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(250, 249, 247, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(141, 110, 99, 0.1)';
            } else {
                navbar.style.background = 'rgba(250, 249, 247, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Animações de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observa todos os elementos com classe fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Compensar altura da navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax effect no hero (apenas desktop)
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (hero && heroBackground && window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        });
    }

    // Contador animado (se existir)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Observa contadores se existirem
    document.querySelectorAll('[data-counter]').forEach(counter => {
        observer.observe(counter);
        counter.addEventListener('visible', function() {
            const target = parseInt(this.getAttribute('data-counter'));
            animateCounter(this, target);
        });
    });

    // Fecha modais ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            event.target.classList.remove('show');
        }
    });

    // Fecha modais com ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.style.display = 'none';
                modal.classList.remove('show');
            });
        }
    });

    // Validação de data mínima para agendamentos
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);
        
        // Não permite segundas-feiras
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const dayOfWeek = selectedDate.getDay();
            
            if (dayOfWeek === 1) { // Segunda-feira
                alert('Desculpe, o museu está fechado às segundas-feiras. Por favor, escolha outro dia.');
                this.value = '';
            }
        });
    }

    // Máscara para telefone
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            }
            
            e.target.value = value;
        });
    });

    // Tooltip simples
    function createTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: #2c1810;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltip);
        
        element.addEventListener('mouseenter', function(e) {
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.opacity = '1';
        });
        
        element.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
        });
        
        element.addEventListener('click', function() {
            tooltip.style.opacity = '0';
        });
    }

    // Adiciona tooltips aos elementos com data-tooltip
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip');
        createTooltip(element, tooltipText);
    });

    // Lazy loading para imagens
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // Performance: Remove listeners em elementos que saem da tela
    const performanceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                // Remove listeners desnecessários de elementos fora da viewport
                const element = entry.target;
                if (element.dataset.hasListeners) {
                    // Remove listeners específicos se necessário
                }
            }
        });
    });

    // Console log para debug (apenas em desenvolvimento)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🏛️ Museu Municipal de Jaú - Website carregado com sucesso!');
        console.log('📱 Responsivo:', window.innerWidth <= 768 ? 'Mobile' : 'Desktop');
        console.log('🎨 Animações:', 'Ativadas');
    }
});

// Função global para abrir modais
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Previne scroll da página
    }
}

// Função global para fechar modais
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restaura scroll da página
    }
}

// Event listeners para fechar modais
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('close')) {
        const modal = event.target.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
});

// Função para formatar data brasileira
function formatDateBR(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Função para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para mostrar mensagens de erro
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Função para limpar erros
function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Debounce function para otimizar performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('meuVideo');
    const soundButton = document.getElementById('soundButton');

    // 1. Lógica para o autoplay quando o vídeo está em foco (viewport)
    const observerOptions = {
        root: null, // Observa em relação ao viewport
        rootMargin: '0px',
        threshold: 0.5 // Dispara quando 50% do vídeo está visível
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Tenta reproduzir o vídeo. Autoplay é permitido se estiver silenciado.
                video.play().catch(error => {
                    console.log("A reprodução automática falhou:", error);
                });
            } else {
                // Pausa o vídeo quando sai do foco
                video.pause();
            }
        });
    };

    const videoObserver = new IntersectionObserver(observerCallback, observerOptions);
    videoObserver.observe(video);

    // 2. Lógica para o botão de som personalizado
    soundButton.addEventListener('click', () => {
        // Alterna o estado de mudo
        video.muted = !video.muted;

        // Atualiza o ícone do botão com base no estado do som
        if (video.muted) {
            soundButton.textContent = '🔇';
        } else {
            soundButton.textContent = '🔊';
        }
    });

    // 3. Garante que o ícone inicial do botão corresponda ao estado do vídeo (silenciado por padrão no HTML)
    if (video.muted) {
        soundButton.textContent = '🔇';
    }
});

