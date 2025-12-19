/* assets/js/chat.js */
(function() {
    // On attend que la page soit chargée pour éviter les bugs
    window.addEventListener('load', function() {
        
        // Si le chatbot existe déjà, on ne fait rien (évite les doublons)
        if (document.getElementById('forfy-widget')) return;

        // --- 1. CONFIGURATION ---
        const config = {
            botName: "Forfy",
            videoAvatar: "GifForfy.MP4", // Doit être à côté de tes fichiers HTML
            primaryColor: "#2563eb",
            secondaryColor: "#06b6d4"
        };

        // --- 2. LES RÉPONSES ---
        const knowledgeBase = {
            "bonjour": "Bonjour ! Je suis Forfy. Comment puis-je vous aider ?",
            "salut": "Salut ! Prêt à explorer l'univers Forfeo ?",
            "c'est quoi ?": "Forfeo Lab est le portail des ambassadeurs pour documenter vos expériences.",
            "contact": "Écrivez à support@forfeolab.com pour toute aide.",
            "prix": "C'est 100% gratuit pour nos ambassadeurs !",
            "aide": "Demandez-moi : 'C'est quoi ?', 'Contact' ou 'Prix'.",
            "default": "Je ne suis pas sûr. Essayez de dire 'Aide'."
        };

        // --- 3. LE DESIGN (CSS) ---
        const style = document.createElement('style');
        style.innerHTML = `
            #forfy-widget { position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: sans-serif; display: flex; flex-direction: column; align-items: flex-end; }
            #forfy-bubble { background: white; padding: 10px; border-radius: 10px; margin-bottom: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); font-size: 14px; font-weight: bold; opacity: 0; animation: fadeIn 0.5s forwards 1s; max-width: 200px; display: none; }
            #forfy-toggle { width: 70px; height: 70px; border-radius: 50%; border: 3px solid white; overflow: hidden; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); background: black; transition: transform 0.3s; }
            #forfy-toggle:hover { transform: scale(1.1); }
            #forfy-toggle video { width: 100%; height: 100%; object-fit: cover; }
            #forfy-window { position: fixed; bottom: 100px; right: 20px; width: 320px; height: 400px; background: white; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); display: none; flex-direction: column; overflow: hidden; border: 1px solid #ddd; }
            .forfy-header { background: ${config.primaryColor}; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
            .forfy-close { cursor: pointer; font-size: 1.2rem; }
            #forfy-messages { flex: 1; padding: 10px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; font-size: 14px; background: #f9f9f9; }
            .msg { padding: 8px 12px; border-radius: 10px; max-width: 80%; }
            .msg-bot { background: #e0e7ff; color: #333; align-self: flex-start; }
            .msg-user { background: ${config.primaryColor}; color: white; align-self: flex-end; }
            .forfy-input-area { padding: 10px; border-top: 1px solid #eee; display: flex; gap: 5px; background: white; }
            #forfy-input { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 20px; outline: none; }
            #forfy-send { background: ${config.primaryColor}; color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; }
            @keyframes fadeIn { to { opacity: 1; } }
        `;
        document.head.appendChild(style);

        // --- 4. LE CORPS (HTML) ---
        const widgetHTML = `
            <div id="forfy-widget">
                <div id="forfy-bubble">Besoin d'aide ? 👋</div>
                
                <div id="forfy-window">
                    <div class="forfy-header">
                        <span>${config.botName}</span>
                        <span class="forfy-close" id="forfy-close-btn">✕</span>
                    </div>
                    <div id="forfy-messages"></div>
                    <div class="forfy-input-area">
                        <input type="text" id="forfy-input" placeholder="Posez une question...">
                        <button id="forfy-send">➤</button>
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

        // --- 5. LA LOGIQUE (ACTIONS) ---
        const toggleBtn = document.getElementById('forfy-toggle');
        const windowDiv = document.getElementById('forfy-window');
        const bubbleDiv = document.getElementById('forfy-bubble');
        const closeBtn = document.getElementById('forfy-close-btn');
        const sendBtn = document.getElementById('forfy-send');
        const inputField = document.getElementById('forfy-input');
        const msgsDiv = document.getElementById('forfy-messages');

        // Afficher la bulle après 1 seconde
        setTimeout(() => bubbleDiv.style.display = 'block', 1000);

        function toggleChat() {
            if (windowDiv.style.display === 'flex') {
                windowDiv.style.display = 'none';
                bubbleDiv.style.display = 'block';
            } else {
                windowDiv.style.display = 'flex';
                bubbleDiv.style.display = 'none';
                if(msgsDiv.children.length === 0) addBotMessage(knowledgeBase["bonjour"]);
            }
        }

        function sendMessage() {
            const text = inputField.value.trim();
            if (!text) return;
            
            // Message utilisateur
            const userDiv = document.createElement('div');
            userDiv.className = 'msg msg-user';
            userDiv.textContent = text;
            msgsDiv.appendChild(userDiv);
            
            inputField.value = "";
            msgsDiv.scrollTop = msgsDiv.scrollHeight;

            // Réponse Bot
            setTimeout(() => {
                const lowerText = text.toLowerCase();
                let response = knowledgeBase["default"];
                for (const key in knowledgeBase) {
                    if (lowerText.includes(key)) {
                        response = knowledgeBase[key];
                        break;
                    }
                }
                addBotMessage(response);
            }, 500);
        }

        function addBotMessage(text) {
            const botDiv = document.createElement('div');
            botDiv.className = 'msg msg-bot';
            botDiv.textContent = text;
            msgsDiv.appendChild(botDiv);
            msgsDiv.scrollTop = msgsDiv.scrollHeight;
        }

        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);
        sendBtn.addEventListener('click', sendMessage);
        inputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    });
})();
