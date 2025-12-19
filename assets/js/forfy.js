/* * FORFY - Le Chatbot Flottant Tout-en-un pour FORFEO LAB
 * Contient : Logique JS + Injection CSS + Injection HTML
 */

(function() {
    // ==========================================
    // 1. CONFIGURATION & CERVEAU (LE CONTENU)
    // ==========================================
    
    // Configuration de base
    const config = {
        botName: "Forfy",
        videoAvatar: "GifForfy.MP4", // Assure-toi que ce fichier est à la racine ou ajuste le chemin
        primaryColor: "#2563eb",     // Bleu Forfeo
        secondaryColor: "#06b6d4"    // Cyan Forfeo
    };

    // Le Cerveau (Réponses automatiques)
    const knowledgeBase = {
        "bonjour": "Bonjour ! Je suis Forfy, l'assistant virtuel de Forfeo Lab. Comment puis-je vous aider ?",
        "salut": "Salut ! Prêt pour une nouvelle mission ?",
        "aide": "Je peux vous renseigner sur : 'C'est quoi ?', 'Contact', ou 'Services'.",
        
        // Questions spécifiques demandées
        "c'est quoi ?": "Forfeo Lab est le portail officiel des ambassadeurs. C'est ici que vous documentez vos expériences, validez vos missions et contribuez à l'excellence de nos partenaires.",
        "contact": "Vous avez un problème technique ou une urgence ? Écrivez-nous directement à support@forfeolab.com ou via le formulaire du site principal.",
        "prix": "Pour nos ambassadeurs, l'accès est 100% gratuit ! Vous profitez d'expériences offertes en échange de vos rapports de qualité.",
        "services": "Nous proposons : audits qualité, clients mystères et création de contenu pour les établissements hôteliers et touristiques.",
        
        // Fallback (si on ne comprend pas)
        "default": "Je ne suis pas sûr de comprendre. Essayez de demander 'Contact', 'C'est quoi ?' ou 'Aide'."
    };

    // Messages de la bulle contextuelle (selon la page)
    const getPageMessage = () => {
        const path = window.location.pathname;
        if (path.includes("index.html") || path === "/") return "Bienvenue sur FORFEO LAB ! 👋";
        if (path.includes("dashboard.html")) return "Prêt pour votre prochaine mission ? 🚀";
        if (path.includes("survey")) return "Besoin d'aide pour votre rapport ? 📝";
        if (path.includes("login.html")) return "Connectez-vous pour accéder à l'espace 🔐";
        return "Je suis là si besoin !";
    };

    // ==========================================
    // 2. INJECTION DU CSS (LE DESIGN)
    // ==========================================
    const style = document.createElement('style');
    style.innerHTML = `
        /* Conteneur principal fixe */
        #forfy-widget {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        /* La Bulle d'incitation */
        #forfy-bubble {
            background: white;
            padding: 10px 15px;
            border-radius: 15px 15px 5px 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
            opacity: 0;
            transform: translateY(10px);
            animation: forfyFadeIn 0.5s forwards 1s;
            max-width: 200px;
            text-align: right;
            border: 1px solid #e2e8f0;
        }

        /* L'icône ronde avec la vidéo */
        #forfy-toggle {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
            border: 3px solid white;
            background: black;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
        }

        #forfy-toggle:hover { transform: scale(1.1); }
        #forfy-toggle:active { transform: scale(0.95); }

        #forfy-toggle video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* La fenêtre de Chat */
        #forfy-window {
            position: fixed;
            bottom: 110px;
            right: 30px;
            width: 350px;
            height: 450px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.15);
            display: none; /* Caché par défaut */
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,0.5);
            animation: forfySlideUp 0.3s ease;
        }

        /* Header du chat */
        .forfy-header {
            background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
            padding: 15px;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .forfy-header h3 { margin: 0; font-size: 16px; font-weight: 700; }
        .forfy-close { cursor: pointer; opacity: 0.8; transition: 0.2s; }
        .forfy-close:hover { opacity: 1; }

        /* Corps du chat (Messages) */
        #forfy-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 14px;
        }

        /* Bulles de messages */
        .msg { padding: 8px 12px; border-radius: 12px; max-width: 80%; line-height: 1.4; }
        .msg-bot { 
            background: #f1f5f9; 
            color: #334155; 
            align-self: flex-start; 
            border-bottom-left-radius: 2px;
        }
        .msg-user { 
            background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor}); 
            color: white; 
            align-self: flex-end; 
            border-bottom-right-radius: 2px;
            box-shadow: 0 2px 5px rgba(37,99,235,0.2);
        }

        /* Zone de saisie */
        .forfy-input-area {
            padding: 10px;
            background: white;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 10px;
        }
        #forfy-input {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 8px 15px;
            outline: none;
            transition: 0.3s;
        }
        #forfy-input:focus { border-color: ${config.primaryColor}; }
        #forfy-send {
            background: ${config.primaryColor};
            color: white;
            border: none;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.3s;
        }
        #forfy-send:hover { background: ${config.secondaryColor}; }

        /* Animations */
        @keyframes forfyFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes forfySlideUp { from { opacity: 0; transform: translateY(20px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        
        /* Responsive Mobile */
        @media (max-width: 480px) {
            #forfy-window { width: calc(100% - 40px); bottom: 100px; right: 20px; height: 60vh; }
            #forfy-widget { right: 20px; bottom: 20px; }
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 3. INJECTION DU HTML (LA STRUCTURE)
    // ==========================================
    const widgetHTML = `
        <div id="forfy-widget">
            <div id="forfy-bubble">${getPageMessage()}</div>

            <div id="forfy-window">
                <div class="forfy-header">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:30px; height:30px; background:white; border-radius:50%; overflow:hidden;">
                            <video src="${config.videoAvatar}" autoplay loop muted style="width:100%; height:100%; object-fit:cover;"></video>
                        </div>
                        <h3>${config.botName}</h3>
                    </div>
                    <span class="forfy-close" onclick="window.toggleForfy()">✕</span>
                </div>
                <div id="forfy-messages"></div>
                <div class="forfy-input-area">
                    <input type="text" id="forfy-input" placeholder="Écrivez votre message..." onkeypress="handleKeyPress(event)">
                    <button id="forfy-send" onclick="sendMessage()"><i class="bi bi-send-fill"></i></button>
                </div>
            </div>

            <div id="forfy-toggle" onclick="window.toggleForfy()">
                <video src="${config.videoAvatar}" autoplay loop muted playsinline></video>
            </div>
        </div>
    `;
    
    // Ajout au body
    const div = document.createElement('div');
    div.innerHTML = widgetHTML;
    document.body.appendChild(div);

    // ==========================================
    // 4. LOGIQUE JS (LES FONCTIONS)
    // ==========================================
    
    // État du chat
    let isOpen = false;
    let hasGreeted = false;

    // Fonction globale pour ouvrir/fermer
    window.toggleForfy = function() {
        const win = document.getElementById('forfy-window');
        const bubble = document.getElementById('forfy-bubble');
        
        isOpen = !isOpen;
        
        if (isOpen) {
            win.style.display = 'flex';
            bubble.style.display = 'none'; // On cache la bulle quand ouvert
            if (!hasGreeted) {
                setTimeout(() => addBotMessage("Bonjour ! Je suis Forfy. Comment puis-je vous aider aujourd'hui ?"), 500);
                hasGreeted = true;
            }
            // Focus sur l'input
            setTimeout(() => document.getElementById('forfy-input').focus(), 100);
        } else {
            win.style.display = 'none';
        }
    };

    // Gestion touche Entrée
    window.handleKeyPress = function(e) {
        if (e.key === 'Enter') sendMessage();
    };

    // Envoyer un message
    window.sendMessage = function() {
        const input = document.getElementById('forfy-input');
        const text = input.value.trim();
        
        if (text === "") return;

        // 1. Afficher message utilisateur
        addUserMessage(text);
        input.value = "";

        // 2. Trouver la réponse (Logique simple)
        const lowerText = text.toLowerCase();
        let response = knowledgeBase["default"];

        // Recherche de mots-clés
        for (const key in knowledgeBase) {
            if (lowerText.includes(key)) {
                response = knowledgeBase[key];
                break;
            }
        }

        // 3. Réponse du bot avec petit délai "naturel"
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'msg msg-bot';
        loadingDiv.innerHTML = '<span class="typing">...</span>'; // Tu peux styliser ça si tu veux
        document.getElementById('forfy-messages').appendChild(loadingDiv);
        scrollToBottom();

        setTimeout(() => {
            loadingDiv.remove();
            addBotMessage(response);
        }, 800);
    };

    function addUserMessage(text) {
        const msgs = document.getElementById('forfy-messages');
        const div = document.createElement('div');
        div.className = 'msg msg-user';
        div.textContent = text;
        msgs.appendChild(div);
        scrollToBottom();
    }

    function addBotMessage(text) {
        const msgs = document.getElementById('forfy-messages');
        const div = document.createElement('div');
        div.className = 'msg msg-bot';
        div.innerHTML = text; // innerHTML permet de mettre des liens si besoin
        msgs.appendChild(div);
        scrollToBottom();
    }

    function scrollToBottom() {
        const msgs = document.getElementById('forfy-messages');
        msgs.scrollTop = msgs.scrollHeight;
    }

})();
