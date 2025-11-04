// Contact.js - Sistema de contato

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    // Validação em tempo real
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateContactField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });

    // Máscara para telefone
    const phoneInput = document.getElementById('contact-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
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
    }

    // Contador de caracteres para textarea
    const messageTextarea = document.getElementById('contact-message');
    if (messageTextarea) {
        const maxLength = 1000;
        
        // Cria contador
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: #8d6e63;
            margin-top: 0.5rem;
        `;
        
        messageTextarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - messageTextarea.value.length;
            counter.textContent = `${remaining} caracteres restantes`;
            
            if (remaining < 100) {
                counter.style.color = '#d32f2f';
            } else {
                counter.style.color = '#8d6e63';
            }
        }
        
        messageTextarea.addEventListener('input', updateCounter);
        updateCounter();
    }

    // Submissão do formulário
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            submitContactForm();
        }
    });

    // Validação individual de campo
    function validateContactField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        switch (field.id) {
            case 'contact-name':
                if (value.length < 2) {
                    showError(field, 'Nome deve ter pelo menos 2 caracteres.');
                    isValid = false;
                } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
                    showError(field, 'Nome deve conter apenas letras e espaços.');
                    isValid = false;
                }
                break;
                
            case 'contact-email':
                if (!isValidEmail(value)) {
                    showError(field, 'Por favor, insira um e-mail válido.');
                    isValid = false;
                }
                break;
                
            case 'contact-phone':
                if (value && value.length < 14) {
                    showError(field, 'Por favor, insira um telefone válido.');
                    isValid = false;
                }
                break;
                
            case 'contact-subject':
                if (!value) {
                    showError(field, 'Por favor, selecione um assunto.');
                    isValid = false;
                }
                break;
                
            case 'contact-message':
                if (value.length < 10) {
                    showError(field, 'Mensagem deve ter pelo menos 10 caracteres.');
                    isValid = false;
                } else if (value.length > 1000) {
                    showError(field, 'Mensagem deve ter no máximo 1000 caracteres.');
                    isValid = false;
                }
                break;
                
            case 'contact-privacy':
                if (!field.checked) {
                    showError(field, 'Você deve concordar com a política de privacidade.');
                    isValid = false;
                }
                break;
        }
        
        if (isValid) {
            clearError(field);
        }
        
        return isValid;
    }

    // Validação completa do formulário
    function validateContactForm() {
        let isFormValid = true;
        
        // Campos obrigatórios
        const requiredFields = ['contact-name', 'contact-email', 'contact-subject', 'contact-message'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!validateContactField(field)) {
                isFormValid = false;
            }
        });
        
        // Checkbox de privacidade
        const privacyCheckbox = document.getElementById('contact-privacy');
        if (!validateContactField(privacyCheckbox)) {
            isFormValid = false;
        }
        
        return isFormValid;
    }

    // Submissão do formulário de contato
    function submitContactForm() {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.btn-text');
        const buttonLoading = submitButton.querySelector('.btn-loading');
        
        // Estado de carregamento
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'block';
        
        // Coleta dados do formulário
        const formData = new FormData(contactForm);
        const contactData = Object.fromEntries(formData.entries());
        
        // Simula envio (em produção, seria uma chamada AJAX real)
        setTimeout(() => {
            // Sucesso simulado
            showContactConfirmation(contactData);
            
            // Reseta formulário
            contactForm.reset();
            
            // Atualiza contador de caracteres
            const counter = contactForm.querySelector('.char-counter');
            if (counter) {
                counter.textContent = '1000 caracteres restantes';
                counter.style.color = '#8d6e63';
            }
            
            // Restaura botão
            submitButton.disabled = false;
            buttonText.style.display = 'block';
            buttonLoading.style.display = 'none';
            
        }, 1500);
    }

    // Mostra confirmação de envio
    function showContactConfirmation(data) {
        const modal = document.getElementById('contactConfirmationModal');
        openModal('contactConfirmationModal');
        
        // Analytics
        trackContactSubmission(data);
        
        // Remove dados salvos
        localStorage.removeItem('museum-contact-draft');
    }

    // Tracking para analytics
    function trackContactSubmission(data) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_submitted', {
                event_category: 'Contact',
                event_label: data.subject,
                value: 1
            });
        }
        
        console.log('📧 Contato enviado:', {
            assunto: data.subject,
            timestamp: new Date().toISOString()
        });
    }

    // Auto-save do formulário
    let autoSaveTimeout;
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                saveContactFormData();
            }, 1000);
        });
    });

    function saveContactFormData() {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem('museum-contact-draft', JSON.stringify(data));
    }

    // Restaura dados salvos
    function loadContactFormData() {
        const savedData = localStorage.getItem('museum-contact-draft');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const field = contactForm.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'checkbox') {
                            field.checked = data[key] === 'on';
                        } else {
                            field.value = data[key];
                        }
                    }
                });
                
                // Atualiza contador se necessário
                const messageField = document.getElementById('contact-message');
                if (messageField && messageField.value) {
                    const event = new Event('input');
                    messageField.dispatchEvent(event);
                }
                
            } catch (e) {
                console.log('Erro ao carregar dados salvos:', e);
            }
        }
    }

    // Templates de mensagem rápida baseado no assunto
    const subjectSelect = document.getElementById('contact-subject');
    const messageField = document.getElementById('contact-message');
    
    if (subjectSelect && messageField) {
        subjectSelect.addEventListener('change', function() {
            if (messageField.value.trim() === '') {
                const templates = {
                    'informacoes': 'Olá! Gostaria de obter mais informações sobre...',
                    'agendamento': 'Olá! Gostaria de agendar uma visita para...',
                    'pesquisa': 'Olá! Estou realizando uma pesquisa sobre... e gostaria de saber se vocês têm informações sobre...',
                    'educativo': 'Olá! Tenho interesse no programa educativo do museu. Gostaria de saber mais sobre...',
                    'doacao': 'Olá! Tenho interesse em fazer uma doação de... para o acervo do museu.',
                    'parcerias': 'Olá! Represento a... e gostaria de propor uma parceria...',
                    'imprensa': 'Olá! Sou jornalista da... e gostaria de solicitar informações para...',
                    'sugestoes': 'Olá! Gostaria de fazer uma sugestão para...'
                };
                
                const template = templates[this.value];
                if (template) {
                    messageField.value = template;
                    messageField.focus();
                    messageField.setSelectionRange(template.length, template.length);
                    
                    // Atualiza contador
                    const event = new Event('input');
                    messageField.dispatchEvent(event);
                }
            }
        });
    }

    // FAQ dinâmico baseado no assunto
    const faqContainer = document.createElement('div');
    faqContainer.className = 'dynamic-faq';
    faqContainer.style.cssText = `
        background: #f5f5dc;
        border: 1px solid rgba(141, 110, 99, 0.2);
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        display: none;
    `;
    
    if (subjectSelect) {
        subjectSelect.parentNode.appendChild(faqContainer);
        
        subjectSelect.addEventListener('change', function() {
            showDynamicFAQ(this.value);
        });
    }

    function showDynamicFAQ(subject) {
        const faqContent = {
            'agendamento': {
                title: 'Dicas para Agendamento:',
                items: [
                    'Agendamentos devem ser feitos com pelo menos 24h de antecedência',
                    'Grupos acima de 30 pessoas precisam de agendamento especial',
                    'Visitas guiadas têm horários específicos'
                ]
            },
            'pesquisa': {
                title: 'Para Pesquisadores:',
                items: [
                    'Nosso acervo documental está disponível mediante agendamento',
                    'Consultas podem ser realizadas de terça a sexta, das 9h às 16h',
                    'É necessário apresentar projeto de pesquisa'
                ]
            },
            'educativo': {
                title: 'Programa Educativo:',
                items: [
                    'Oferecemos visitas educativas para escolas',
                    'Material didático disponível para professores',
                    'Atividades adaptadas para diferentes faixas etárias'
                ]
            }
        };
        
        const content = faqContent[subject];
        
        if (content) {
            faqContainer.innerHTML = `
                <h4 style="color: #2c1810; margin-bottom: 0.5rem; font-size: 1rem;">${content.title}</h4>
                <ul style="margin: 0; padding-left: 1.2rem;">
                    ${content.items.map(item => `<li style="margin-bottom: 0.3rem; font-size: 0.9rem; color: #5d4037;">${item}</li>`).join('')}
                </ul>
            `;
            faqContainer.style.display = 'block';
        } else {
            faqContainer.style.display = 'none';
        }
    }

    // Carrega dados salvos na inicialização
    loadContactFormData();

    // Limpa dados salvos quando formulário é enviado com sucesso
    contactForm.addEventListener('submit', function() {
        setTimeout(() => {
            localStorage.removeItem('museum-contact-draft');
        }, 2000);
    });

    // Validação de spam simples
    function detectSpam(data) {
        const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'urgent', 'click here'];
        const message = data.message.toLowerCase();
        
        return spamKeywords.some(keyword => message.includes(keyword));
    }

    // Honeypot field (campo oculto para detectar bots)
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'website';
    honeypot.style.display = 'none';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    contactForm.appendChild(honeypot);

    console.log('📧 Contact.js carregado - Sistema de contato ativo');
});