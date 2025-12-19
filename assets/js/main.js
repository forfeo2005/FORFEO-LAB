/* assets/js/main.js - Version Corrigée pour Web3Forms */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Initialisation de la validation Bootstrap
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // 2. Gestion de l'envoi du formulaire (AJAX)
    const surveyForm = document.getElementById('surveyForm');
    
    if (surveyForm) {
        surveyForm.addEventListener('submit', function(e) {
            e.preventDefault(); // On bloque l'envoi classique
            
            // Si le formulaire n'est pas valide visuellement, on arrête
            if (!surveyForm.checkValidity()) {
                // On scrolle vers la première erreur
                const firstInvalid = surveyForm.querySelector(':invalid');
                if(firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Changement du bouton pour montrer le chargement
            const submitBtn = surveyForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Envoi...';
            submitBtn.disabled = true;

            // Récupération des données sécurisée
            const formData = new FormData(surveyForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Envoi vers Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status == 200) {
                    // SUCCÈS : Redirection
                    window.location.href = "confirmation.html";
                } else {
                    // ERREUR API
                    console.error(response);
                    showErrorAlert(jsonResponse.message || "Une erreur technique est survenue.");
                    resetButton(submitBtn, originalBtnText);
                }
            })
            .catch(error => {
                // ERREUR RÉSEAU
                console.error(error);
                showErrorAlert("Problème de connexion. Vérifiez votre internet.");
                resetButton(submitBtn, originalBtnText);
            });
        });
    }
});

// Fonction pour remettre le bouton à l'état normal
function resetButton(btn, text) {
    btn.innerHTML = text;
    btn.disabled = false;
}

// Fonction pour afficher l'alerte rose (comme sur ta capture)
function showErrorAlert(message) {
    // Supprime l'alerte existante s'il y en a une
    const existingAlert = document.querySelector('.alert-fixed-top');
    if(existingAlert) existingAlert.remove();

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show alert-fixed-top';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translateX(-50%)';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.width = '90%';
    alertDiv.style.maxWidth = '500px';
    alertDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    alertDiv.innerHTML = `
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <strong>Erreur :</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    document.body.appendChild(alertDiv);
    
    // Auto-hide après 5 secondes
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
