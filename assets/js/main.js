/* assets/js/main.js - Système de Gestion Ambassadeurs */

// --- 1. CONFIGURATION DES ACCÈS (Ta "Base de données") ---
// Format : "identifiant": "mot_de_passe"
const AMBASSADEURS_DB = {
    "admin": "forfeo2025",       // Compte de test
    "julie.m": "paris2026",      // Exemple ambassadeur 1
    "marc.d": "quebec123",       // Exemple ambassadeur 2
    "sophie.l": "lovesushi"      // Exemple ambassadeur 3
};

// --- 2. GESTION DE LA CONNEXION (Login) ---
document.addEventListener('DOMContentLoaded', function() {
    
    // A. Si on est sur la page de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const user = document.getElementById('username').value.toLowerCase().trim();
            const pass = document.getElementById('password').value;
            const errorDiv = document.getElementById('loginError');

            // Vérification
            if (AMBASSADEURS_DB[user] && AMBASSADEURS_DB[user] === pass) {
                // Succès : On sauvegarde la session
                localStorage.setItem('forfeo_user', user);
                localStorage.setItem('forfeo_logged_in', 'true');
                // Redirection
                window.location.href = "dashboard.html";
            } else {
                // Échec
                errorDiv.classList.remove('d-none');
                // Animation de secousse
                loginForm.classList.add('shake');
                setTimeout(() => loginForm.classList.remove('shake'), 500);
            }
        });
        return; // On arrête ici pour la page login
    }

    // B. PROTECTION DES PAGES (Dashboard & Sondages)
    // Liste des pages protégées
    const protectedPages = ['dashboard.html', 'survey-experience.html', 'survey-qualite.html', 'survey-satisfaction.html'];
    const currentPage = window.location.pathname.split("/").pop();

    if (protectedPages.includes(currentPage)) {
        const isLoggedIn = localStorage.getItem('forfeo_logged_in');
        if (!isLoggedIn) {
            // Si pas connecté, on éjecte vers le login
            window.location.href = "login.html";
            return;
        }
    }

    // C. AUTO-REMPLISSAGE DU NOM (Intelligence)
    // Si on est connecté, on remplit automatiquement le champ "Nom" des formulaires
    const currentUser = localStorage.getItem('forfeo_user');
    const nameFields = document.querySelectorAll('input[name="nom_ambassadeur"]');
    
    if (currentUser && nameFields.length > 0) {
        nameFields.forEach(field => {
            // On met l'identifiant en majuscule comme nom (ex: JULIE.M)
            // Tu pourrais aussi avoir une autre liste pour les noms complets si tu veux
            field.value = currentUser.toUpperCase();
            field.setAttribute('readonly', true); // On empêche la modification pour être sûr
            field.classList.add('bg-light'); // Visuel gris pour montrer que c'est auto
        });
    }

    // --- 3. GESTION DES FORMULAIRES (Code existant Web3Forms) ---
    const surveyForm = document.getElementById('surveyForm');
    
    if (surveyForm) {
        // Validation Bootstrap standard
        surveyForm.addEventListener('submit', function(e) {
            e.preventDefault(); // On bloque l'envoi classique
            
            if (!surveyForm.checkValidity()) {
                e.stopPropagation();
                surveyForm.classList.add('was-validated');
                // Scroll vers la première erreur
                const firstInvalid = surveyForm.querySelector(':invalid');
                if(firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Bouton chargement
            const submitBtn = surveyForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Envoi...';
            submitBtn.disabled = true;

            // Préparation des données
            const formData = new FormData(surveyForm);
            
            // AJOUT INTELLIGENT : On force l'ajout du nom de l'utilisateur connecté
            // au cas où le champ serait vide ou manipulé
            if(currentUser) {
                formData.set('nom_ambassadeur', currentUser.toUpperCase());
            }

            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Envoi Web3Forms
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
                    window.location.href = "confirmation.html";
                } else {
                    alert("Erreur: " + jsonResponse.message);
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.log(error);
                alert("Erreur de connexion.");
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // D. BOUTON DÉCONNEXION
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('forfeo_user');
            localStorage.removeItem('forfeo_logged_in');
            window.location.href = "login.html";
        });
    }
});

// Animation CSS pour l'erreur de login (à ajouter dans style.css si tu veux, sinon optionnel)
/* .shake { animation: shake 0.5s; }
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}
*/
