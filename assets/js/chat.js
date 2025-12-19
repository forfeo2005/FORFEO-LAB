/* assets/js/chat.js */
(function() {
    // Fonction d'initialisation sécurisée
    function initChatbot() {
        // Si le widget existe déjà, on ne le recrée pas
        if (document.getElementById('forfy-widget')) return;

        // 1. CONFIGURATION
        const config = {
            botName: "Forfy",
            // IMPORTANT : Assure-toi que la vidéo est à la racine de ton site
            videoAvatar: "GifForfy.MP4", 
            primaryColor: "#2563eb", // Bleu Forfeo
            secondaryColor: "#06b6d4" // Cyan
        };

        // 2. CERVEAU (RÉPONSES)
        const knowledgeBase = {
            "bonjour": "Bonjour ! Je suis Forfy, l'assistant virtuel. Comment puis-je vous aider ?",
            "salut": "Salut ! Prêt à explorer l'univers Forfeo ?",
            
            "c'est quoi ?": "Forfeo Lab est le portail officiel des ambassadeurs. Ici, vous documentez vos expériences et validez vos missions.",
            "contact": "Besoin d'aide ? Écrivez à support@forfeolab.com ou utilisez la page contact du site principal.",
            "prix": "L'accès est 100% gratuit pour nos ambassadeurs. Vous échangez vos rapports contre des expériences offertes.",
            "services": "Nous proposons : audits qualité, clients mystères et création de contenu pour les entreprises.",
            
            "aide": "Je connais : 'C'est quoi ?', 'Contact', 'Prix' et 'Services'.",
            "default": "Je ne suis pas sûr. Essayez 'Aide', 'Contact' ou 'C'est quoi ?'."
        };

        // Message contextuel selon la page
        const getPageMessage = () => {
            const path = window.location.pathname;
            if (path.includes("dashboard")) return "Prêt pour une mission ? 🚀";
            if (path.includes("login")) return "Connectez-vous ici 🔐";
            if (path.includes("candidature")) return "Rejoignez l'équipe ! ⭐";
            if (path.includes("survey") || path.includes("sondage")) return "Besoin d'aide pour le rapport ? 📝";
            return "Bienvenue sur FORFEO LAB ! 👋"; // Accueil par défaut
        };

        // 3. INJECTION CSS (STYLE)
        const style = document.createElement('style');
        style.innerHTML = `
            #forfy-widget { 
                position: fixed; bottom: 30px; right: 30px; z-index: 99999; 
                font-family: 'Inter', sans-serif; display: flex; flex-direction: column; align-items: flex-end; 
            }
            #forfy-bubble { 
                background: white; padding: 10px 15px; border-radius: 15px 15px 5px 15px; 
                box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-bottom: 10px; font-size: 14px; 
                font-weight: 600; color: #1e293b; opacity: 0; transform: translateY(10px); 
                animation: forfyFadeIn 0.5s forwards 1s; border: 1px solid #e2e8f0; 
                max-width: 200px; text-align: right; 
            }
            #forfy-toggle { 
                width: 70px; height: 70px; border-radius: 50%; overflow: hidden; cursor: pointer; 
                box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4); border: 3px solid white; 
                background: ${config.primaryColor}; /* Couleur de fond si la vidéo charge mal */
                transition: transform 0.3s; position: relative;
            }
            #forfy-toggle:hover { transform: scale(1.1); }
            #forfy-toggle video { width: 100%; height: 100%; object-fit: cover; }
            
            #forfy-window { 
                position: fixed; bottom: 110px; right: 30px; width: 350px; height: 450px; 
                background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); 
                border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); 
                display: none; flex-direction: column; border: 1px solid rgba(255,255,255,0.5); 
                overflow: hidden; animation: forfySlideUp 0.3s ease; 
            }
            .forfy-header { 
                background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor}); 
                padding: 15px; color: white; display: flex; justify-content: space-between; align-items: center; 
            }
            .forfy-close { cursor: pointer; font-size: 1.2rem; padding: 5px; }
            #forfy-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; font-size: 14px; }
            .msg { padding: 8px 12px; border-radius: 12px; max-width: 85%; line-height: 1.4; }
            .msg-bot { background: #f1f5f9; color: #334155; align-self: flex-start; border-bottom-left-radius: 2px; }
            .msg-user { background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor}); color: white; align-self: flex-end; border-bottom-right-radius: 2px; }
            .forfy-input-area { padding: 10px; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 10px; }
            #forfy-input { flex: 1; border: 1px solid #e2e8f0; border-radius: 20px; padding: 8px 15px; outline: none; }
            #forfy-send { background: ${config.primaryColor}; color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
            
            @keyframes forfyFadeIn { to { opacity: 1; transform: translateY(0); } }
            @keyframes forfySlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @media (max-width: 480px) { #forfy-window { width: calc(100% - 40px); bottom: 100px; right: 20px; height: 60vh; } #forfy-widget { right: 20px; bottom: 20px; } }
        `;
        document.head.appendChild(style);

        // 4. INJECTION HTML (STRUCTURE)
        const widgetHTML = `
            <div id="forfy-widget">
                <div id="forfy-bubble">${getPageMessage()}</div>
                
                <div id="forfy-window">
                    <div class="forfy-header">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <div style="width:30px; height:30px; background:white; border-radius:50%; overflow:hidden;">
                                <video src="${config.videoAvatar}" autoplay loop muted style="width:100%; height:100%; object-fit:cover;"></video>
                            </div>
                            <h3 style="margin:0; font-size:16px;">${config.botName}</h3>
                        </div>
                        <span class="forfy-close" id="forfy-close-btn">✕</span>
                    </div>
                    <div id="forfy-messages"></div>
                    <div class="forfy-input-area">
                        <input type="text" id="forfy-input" placeholder="Posez une question...">
                        <button id="forfy-send"><i class="bi bi-send-fill"></i></button>
                    </div>
                </div>

                <div id="forfy-toggle">
                    <video src="${config.videoAvatar}" autoplay loop muted playsinline></video>
                </div>
            </div>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = widgetHTML;
        document.body.appendChild(div);

        // 5. LOGIQUE & ÉVÉNEMENTS
        let isOpen = false;
        let hasGreeted = false;

        const toggleBtn = document.getElementById('forfy-toggle');
        const closeBtn = document.getElementById('forfy-close-btn');
        const sendBtn = document.getElementById('forfy-send');
        const inputField = document.getElementById('forfy-input');
        const windowDiv = document.getElementById('forfy-window');
        const bubbleDiv = document.getElementById('forfy-bubble');

        function toggleChat() {
            isOpen = !isOpen;
            if (isOpen) {
                windowDiv.style.display = 'flex';
                bubbleDiv.style.display = 'none';
                if (!hasGreeted) {
                    setTimeout(() => addBotMessage(knowledgeBase["bonjour"]), 500);
                    hasGreeted = true;
                }
                setTimeout(() => inputField.focus(), 100);
            } else {
                windowDiv.style.display = 'none';
            }
        }

        function sendMessage() {
            const text = inputField.value.trim();
            if (!text) return;

            addUserMessage(text);
            inputField.value = "";

            const lowerText = text.toLowerCase();
            let response = knowledgeBase["default"];
            
            for (const key in knowledgeBase) {
                if (lowerText.includes(key)) {
                    response = knowledgeBase[key];
                    break;
                }
            }
            
            setTimeout(() => addBotMessage(response), 600);
        }

        function addUserMessage(text) {
            const msgs = document.getElementById('forfy-messages');
            const d = document.createElement('div'); d.className = 'msg msg-user'; d.textContent = text;
            msgs.appendChild(d);
            msgs.scrollTop = msgs.scrollHeight;
        }

        function addBotMessage(text) {
            const msgs = document.getElementById('forfy-messages');
            const d = document.createElement('div'); d.className = 'msg msg-bot'; d.innerHTML = text;
            msgs.appendChild(d);
            msgs.scrollTop = msgs.scrollHeight;
        }

        // Écouteurs d'événements
        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);
        sendBtn.addEventListener('click', sendMessage);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // DÉMARRAGE SÉCURISÉ (Attend que la page soit prête)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }

})();
