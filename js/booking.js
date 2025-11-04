// Booking.js - Sistema de agendamento de visitas

document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    
    if (!bookingForm) return;

    // Configuração de data mínima (amanhã)
    const dateInput = document.getElementById('date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
    
    // Configuração de data máxima (3 meses no futuro)
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);

    // Validação em tempo real
    const inputs = bookingForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });

    // Máscara para telefone
    const phoneInput = document.getElementById('phone');
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

    // Validação de data - não permite segundas-feiras
    dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const dayOfWeek = selectedDate.getDay();
        
        if (dayOfWeek === 1) { // Segunda-feira
            showError(this, 'O museu está fechado às segundas-feiras. Por favor, escolha outro dia.');
            this.value = '';
            return;
        }
        
        validateField(this);
    });

    // Atualização dinâmica de horários baseado no tipo de visita
    const visitTypeInputs = document.querySelectorAll('input[name="visit-type"]');
    const timeSelect = document.getElementById('time');
    
    visitTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateAvailableTimes(this.value);
        });
    });

    function updateAvailableTimes(visitType) {
        const guidedTimes = ['09:00', '11:00', '14:00', '16:00'];
        const freeTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
        
        const availableTimes = visitType === 'guiada' ? guidedTimes : freeTimes;
        
        // Limpa opções atuais
        timeSelect.innerHTML = '<option value="">Selecione</option>';
        
        // Adiciona novas opções
        availableTimes.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        });
    }

    // Inicializa com horários de visita livre
    updateAvailableTimes('livre');

    // Validação do número de visitantes vs tipo de grupo
    const visitorsSelect = document.getElementById('visitors');
    const groupTypeSelect = document.getElementById('group-type');
    
    visitorsSelect.addEventListener('change', function() {
        const visitors = this.value;
        
        if (visitors === '30+') {
            showInfo('Para grupos acima de 30 pessoas, entre em contato diretamente conosco pelo telefone (14) 3622-1235.');
        }
        
        // Sugere tipo de grupo baseado no número
        if (visitors && visitors !== '1' && groupTypeSelect.value === '') {
            if (['6-10', '11-20', '21-30'].includes(visitors)) {
                showInfo('Para grupos, recomendamos selecionar o tipo de grupo para melhor atendimento.');
            }
        }
    });

    // Submissão do formulário
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitBooking();
        }
    });

    // Validação individual de campo
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        switch (field.id) {
            case 'name':
                if (value.length < 2) {
                    showError(field, 'Nome deve ter pelo menos 2 caracteres.');
                    isValid = false;
                } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
                    showError(field, 'Nome deve conter apenas letras e espaços.');
                    isValid = false;
                }
                break;
                
            case 'email':
                if (!isValidEmail(value)) {
                    showError(field, 'Por favor, insira um e-mail válido.');
                    isValid = false;
                }
                break;
                
            case 'phone':
                if (value && value.length < 14) {
                    showError(field, 'Por favor, insira um telefone válido.');
                    isValid = false;
                }
                break;
                
            case 'visitors':
                if (!value) {
                    showError(field, 'Por favor, selecione o número de visitantes.');
                    isValid = false;
                }
                break;
                
            case 'date':
                if (!value) {
                    showError(field, 'Por favor, selecione uma data.');
                    isValid = false;
                } else {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (selectedDate <= today) {
                        showError(field, 'Por favor, selecione uma data futura.');
                        isValid = false;
                    }
                }
                break;
                
            case 'time':
                if (!value) {
                    showError(field, 'Por favor, selecione um horário.');
                    isValid = false;
                }
                break;
                
            case 'terms':
                if (!field.checked) {
                    showError(field, 'Você deve concordar com os termos de visitação.');
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
    function validateForm() {
        let isFormValid = true;
        
        // Campos obrigatórios
        const requiredFields = ['name', 'email', 'visitors', 'date', 'time'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!validateField(field)) {
                isFormValid = false;
            }
        });
        
        // Checkbox de termos
        const termsCheckbox = document.getElementById('terms');
        if (!validateField(termsCheckbox)) {
            isFormValid = false;
        }
        
        return isFormValid;
    }

    // Submissão do agendamento
    function submitBooking() {
        const submitButton = bookingForm.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.btn-text');
        const buttonLoading = submitButton.querySelector('.btn-loading');
        
        // Estado de carregamento
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'block';
        
        // Coleta dados do formulário
        const formData = new FormData(bookingForm);
        const bookingData = Object.fromEntries(formData.entries());
        
        // Simula envio (em produção, seria uma chamada AJAX real)
        setTimeout(() => {
            // Sucesso simulado
            showBookingConfirmation(bookingData);
            
            // Reseta formulário
            bookingForm.reset();
            
            // Restaura botão
            submitButton.disabled = false;
            buttonText.style.display = 'block';
            buttonLoading.style.display = 'none';
            
            // Reinicializa horários
            updateAvailableTimes('livre');
            
        }, 2000);
    }

    // Mostra confirmação de agendamento
    function showBookingConfirmation(data) {
        const modal = document.getElementById('confirmationModal');
        const detailsContainer = document.getElementById('bookingDetails');
        
        // Formata data
        const formattedDate = formatDateBR(data.date);
        const visitType = data['visit-type'] === 'guiada' ? 'Visita Guiada' : 'Visita Livre';
        
        detailsContainer.innerHTML = `
            <div style="background: #faf9f7; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <p><strong>Nome:</strong> ${data.name}</p>
                <p><strong>E-mail:</strong> ${data.email}</p>
                <p><strong>Data:</strong> ${formattedDate}</p>
                <p><strong>Horário:</strong> ${data.time}</p>
                <p><strong>Visitantes:</strong> ${data.visitors}</p>
                <p><strong>Tipo:</strong> ${visitType}</p>
                ${data['group-type'] ? `<p><strong>Grupo:</strong> ${getGroupTypeLabel(data['group-type'])}</p>` : ''}
            </div>
        `;
        
        openModal('confirmationModal');
        
        // Analytics
        trackBookingSubmission(data);
    }

    // Converte valor do select em label legível
    function getGroupTypeLabel(value) {
        const labels = {
            'familia': 'Família',
            'escola': 'Escola',
            'universidade': 'Universidade',
            'empresa': 'Empresa',
            'terceira-idade': 'Terceira Idade',
            'turismo': 'Turismo',
            'outro': 'Outro'
        };
        return labels[value] || value;
    }

    // Mostra informações úteis
    function showInfo(message) {
        // Cria toast de informação
        const toast = document.createElement('div');
        toast.className = 'info-toast';
        toast.innerHTML = `
            <div style="
                position: fixed;
                top: 100px;
                right: 20px;
                background: #8d6e63;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(141, 110, 99, 0.3);
                z-index: 1000;
                max-width: 300px;
                animation: slideInRight 0.3s ease;
            ">
                <p style="margin: 0; font-size: 0.9rem;">${message}</p>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Remove após 5 segundos
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 5000);
    }

    // Tracking para analytics
    function trackBookingSubmission(data) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'booking_submitted', {
                event_category: 'Booking',
                event_label: data['visit-type'],
                value: parseInt(data.visitors) || 1
            });
        }
        
        console.log('📅 Agendamento enviado:', data);
    }

    // Auto-save do formulário (opcional)
    let autoSaveTimeout;
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                saveFormData();
            }, 1000);
        });
    });

    function saveFormData() {
        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem('museum-booking-draft', JSON.stringify(data));
    }

    // Restaura dados salvos
    function loadFormData() {
        const savedData = localStorage.getItem('museum-booking-draft');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const field = bookingForm.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'radio' || field.type === 'checkbox') {
                            if (field.value === data[key] || data[key] === 'on') {
                                field.checked = true;
                            }
                        } else {
                            field.value = data[key];
                        }
                    }
                });
            } catch (e) {
                console.log('Erro ao carregar dados salvos:', e);
            }
        }
    }

    // Carrega dados salvos na inicialização
    loadFormData();

    // Limpa dados salvos quando formulário é enviado com sucesso
    bookingForm.addEventListener('submit', function() {
        localStorage.removeItem('museum-booking-draft');
    });

    console.log('📅 Booking.js carregado - Sistema de agendamento ativo');
});

// Adiciona estilos para animações dos toasts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);