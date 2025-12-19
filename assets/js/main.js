/**
 * FORFEO LAB - Script JavaScript principal
 * Gestion des formulaires, validation et interactions
 */

// ==========================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('FORFEO LAB initialisé');
    
    // Initialiser la validation des formulaires
    initFormValidation();
    
    // Initialiser les cartes cliquables du dashboard
    initDashboardCards();
    
    // Initialiser les animations au scroll
    initScrollAnimations();
});

// ==========================================
// VALIDATION DES FORMULAIRES
// ==========================================
function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Vérifier la validité du formulaire
            if (form.checkValidity()) {
                // Si le formulaire est valide, soumettre via Web3Forms
                submitFormToWeb3Forms(form);
            } else {
                // Afficher les erreurs de validation
                form.classList.add('was-validated');
                showAlert('Veuillez remplir tous les champs obligatoires.', 'danger');
            }
        });
    });
}

// ==========================================
// SOUMISSION VIA WEB3FORMS
// ==========================================
function submitFormToWeb3Forms(form) {
    // Afficher le loader
    showLoader();
    
    // Récupérer les données du formulaire
    const formData = new FormData(form);
    
    // Envoyer les données à Web3Forms
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideLoader();
        
        if (data.success) {
            // Redirection vers la page de confirmation
            window.location.href = 'confirmation.html';
        } else {
            // Afficher un message d'erreur
            showAlert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.', 'danger');
        }
    })
    .catch(error => {
        hideLoader();
        console.error('Erreur:', error);
        showAlert('Erreur de connexion. Veuillez vérifier votre connexion internet.', 'danger');
    });
}

// ==========================================
// GESTION DU LOADER
// ==========================================
function showLoader() {
    let loader = document.getElementById('loader');
    if (!loader) {
        // Créer le loader s'il n'existe pas
        loader = document.createElement('div');
        loader.id = 'loader';
        loader.className = 'loader';
        loader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loader);
    }
    loader.classList.add('active');
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.remove('active');
    }
}

// ==========================================
// GESTION DES ALERTES
// ==========================================
function showAlert(message, type = 'info') {
    // Créer l'élément d'alerte
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-forfeo`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
    `;
    
    // Trouver le conteneur principal
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        
        // Faire défiler vers l'alerte
        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Supprimer automatiquement après 5 secondes
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// ==========================================
// CARTES CLIQUABLES DU DASHBOARD
// ==========================================
function initDashboardCards() {
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    
    dashboardCards.forEach(card => {
        card.addEventListener('click', function() {
            const link = this.getAttribute('data-link');
            if (link) {
                window.location.href = link;
            }
        });
    });
}

// ==========================================
// ANIMATIONS AU SCROLL
// ==========================================
function initScrollAnimations() {
    const cards = document.querySelectorAll('.card-forfeo');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// ==========================================
// VALIDATION PERSONNALISÉE POUR LES NOTES
// ==========================================
function validateRating(input) {
    const value = parseInt(input.value);
    const min = parseInt(input.min);
    const max = parseInt(input.max);
    
    if (value < min || value > max) {
        input.setCustomValidity(`La note doit être entre ${min} et ${max}`);
        return false;
    } else {
        input.setCustomValidity('');
        return true;
    }
}

// Ajouter des écouteurs pour les champs de notation
document.addEventListener('DOMContentLoaded', function() {
    const ratingInputs = document.querySelectorAll('input[type="number"][min][max]');
    
    ratingInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateRating(this);
        });
    });
});

// ==========================================
// CONFIRMATION DE SOUMISSION
// ==========================================
function confirmSubmission(formName) {
    return confirm(`Êtes-vous sûr de vouloir soumettre ce ${formName} ? Cette action ne peut pas être annulée.`);
}

// ==========================================
// UTILITAIRES
// ==========================================

// Formater la date au format français
function formatDateFR(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('fr-CA', options);
}

// Valider une adresse email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Compter les caractères restants dans un textarea
function updateCharCount(textarea, counterId) {
    const counter = document.getElementById(counterId);
    if (counter && textarea) {
        const maxLength = textarea.getAttribute('maxlength');
        const currentLength = textarea.value.length;
        counter.textContent = `${currentLength} / ${maxLength} caractères`;
    }
}

// ==========================================
// GESTION DES ERREURS GLOBALES
// ==========================================
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// ==========================================
// EXPORT DES FONCTIONS POUR UTILISATION GLOBALE
// ==========================================
window.ForfeoLab = {
    showAlert,
    showLoader,
    hideLoader,
    validateRating,
    confirmSubmission,
    formatDateFR,
    validateEmail,
    updateCharCount
};
