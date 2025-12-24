/* assets/js/forfy.js - Version Complète (Ambassadeurs + Entreprises) */
(function() {
    function initForfy() {
        if (document.getElementById('forfy-widget')) return;

        // --- CONFIGURATION ---
        const config = {
            botName: "Forfy",
            videoAvatar: "GifForfy.MP4", // Doit être à la racine
            primaryColor: "#0f172a", // Bleu nuit plus "Corporate" pour faire sérieux
            secondaryColor: "#2563eb" // Bleu Forfeo
        };

        // --- CERVEAU (BASE DE CONNAISSANCES) ---
        const greetingMessage = "Bonjour ! Je suis Forfy. Je peux aider les Ambassadeurs et les Entreprises. Qui êtes-vous ?";
        
        const knowledgeBase = {
            // Salutations
            "bonjour": greetingMessage,
            "salut": "Bienvenue chez Forfeo Lab. Comment puis-je vous orienter ?",
            "allo": "Bonjour ! Une question sur nos services ?",

            // Section AMBASSADEUR (B2C)
            "ambassadeur": "Nos ambassadeurs testent gratuitement des expériences (repas, hôtels) en échange de rapports détaillés. C'est un rôle VIP.",
            "c'est quoi ?": "Forfeo Lab est le trait d'union entre l'excellence des entreprises et l'expérience client. Nous offrons des audits par de vrais passionnés.",
            "comment devenir": "Cliquez sur le bouton 'Devenir Ambassadeur' sur l'accueil ou visitez la page Candidature pour postuler.",
            "gratuit": "Oui ! Pour les ambassadeurs, les expériences sont 100% offertes par nos partenaires.",

            // Section ENTREPRISE (B2B)
            "entreprise": "Pour les entreprises, nous offrons des solutions de client mystère nouvelle génération et de la création de contenu UGC.",
            "prix": "Nos forfaits entreprises démarrent à 29.99$/mois pour des audits réguliers. Visitez la page 'Solutions' pour voir les détails.",
            "tarif": "Nous avons des forfaits : Découverte (1 mission), Croissance (Mensuel) et Excellence (Annuel).",
            "lanla": "Comme les grands cabinets d'audit, mais avec une touche plus authentique et axée sur l'expérience client réelle.",
            "roi": "Nos clients constatent une amélioration de 15% de la satisfaction client dès les premiers rapports.",
            "recruter": "Les entreprises ne recrutent pas directement. Vous commandez une mission, et Forfeo assigne le meilleur ambassadeur certifié pour vous.",

            // Support
            "contact": "Support technique : support@forfeolab.com | Service Commercial : sales@forfeolab.com",
            "aide": "Dites-moi si vous êtes 'Ambassadeur' ou 'Entreprise' pour que je vous guide mieux !",
            "default": "Je ne suis pas sûr. Êtes-vous une Entreprise ou un Ambassadeur ?"
        };

        const getPageMessage = () => {
            const path = window.location.pathname;
            // Messages contextuels intelligents
            if (path.includes("business")) return "Une question sur nos solutions B2B ? 💼";
            if (path.includes("candidature")) return "Besoin d'aide pour postuler ? ✍️";
            if (path.includes("dashboard")) return "Prêt pour l'action ? 🚀";
            if (path.includes("login")) return "Problème de connexion ? 🔐";
            return "Bienvenue ! Ambassadeur ou Entreprise ? 👋";
        };

        // --- CSS INJECTÉ ---
        const style = document.createElement('style');
        style.innerHTML = `
            #forfy-widget { position: fixed; bottom: 30px; right: 30px; z-index: 99999; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; align-items: flex-end; }
            #forfy-bubble { background: white; padding: 12px 18px; border-radius: 20px 20px 5px 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.15); margin-bottom: 15px; font-size: 14px; font-weight: 600; color: #1e293b; opacity: 0; transform: translateY(10px); animation: forfyFadeIn 0.5s forwards 1s; border: 1px solid #e2e8f0; max-width: 250px; text-align: right; }
            #forfy-toggle { width: 75px; height: 75px; border-radius: 50%; overflow: hidden; cursor: pointer; box-shadow: 0 8px 30px rgba(15, 23, 42, 0.4); border: 4px solid white; background: ${config.primaryColor}; transition: all 0.3s; position: relative; }
            #forfy-toggle:hover { transform: scale(1.1); }
            #forfy-toggle video { width: 100%; height: 100%; object-fit: cover; }
            #forfy-window { position: fixed; bottom: 120px; right: 30px; width: 360px; height: 500px; background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(12px); border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); display: none; flex-direction: column; border: 1px solid rgba(255,255,255,0.5); overflow: hidden; animation: forfySlideUp 0.4s; }
            .forfy-header { background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor}); padding: 18px; color: white; display: flex; justify-content: space-between; align-items: center; }
            .forfy-close { cursor: pointer; font-size: 1.2rem; padding:5px; }
            #forfy-messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; font-size: 14px; background: #f8fafc; }
            .msg { padding: 10px 15px; border-radius: 15px; max-width: 85%; line-height: 1.5; }
            .msg-bot { background: white; color: #334155; align-self: flex-start; border: 1px solid #e2e8f0; }
            .msg-user { background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor}); color: white; align-self: flex-end; }
            .forfy-input-area { padding: 15px; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 10px; }
            #forfy-input { flex: 1; border: 2px solid #f1f5f9; border-radius: 25px; padding: 10px 18px; outline: none; }
            #forfy-send { background: ${config.primaryColor}; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
            
            @keyframes forfyFadeIn { to { opacity: 1; transform: translateY(0); } }
            @keyframes forfySlideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
            @media (max-width: 480px) { #forfy-window { width: calc(100% - 40px); bottom: 110px; right: 20px; height: 60vh; } }
        `;
        document.head.appendChild(style);

        // --- HTML ---
        const widgetHTML = `
            <div id="forfy-widget">
                <div id="forfy-bubble">${getPageMessage()}</div>
                <div id="forfy-window">
                    <div class="forfy-header">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:35px; height:35px; background:white; border-radius:50%; overflow:hidden; border:2px solid rgba(255,255,255,0.3);">
                                <video src="${config.videoAvatar}" autoplay loop muted style="width:100%; height:100%; object-fit:cover;"></video>
                            </div>
                            <div>
                                <h3 style="margin:0; font-size:16px; font-weight:700;">${config.botName}</h3>
                                <small style="opacity:0.9; font-size:11px;">Assistant Virtuel</small>
                            </div>
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

        // --- LOGIQUE ---
        let isOpen = false;
        let hasGreeted = false;
        const toggleBtn = document.getElementById('forfy-toggle');
        const closeBtn = document.getElementById('forfy-close-btn');
        const sendBtn = document.getElementById('forfy-send');
        const inputField = document.getElementById('forfy-input');
        const windowDiv = document.getElementById('forfy-window');
        const bubbleDiv = document.getElementById('forfy-bubble');
        const msgsDiv = document.getElementById('forfy-messages');

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
                if (lowerText.includes(key)) { response = knowledgeBase[key]; break; }
            }
            setTimeout(() => addBotMessage(response), 600);
        }

        function addUserMessage(text) {
            const d = document.createElement('div'); d.className = 'msg msg-user'; d.textContent = text;
            msgsDiv.appendChild(d); msgsDiv.scrollTop = msgsDiv.scrollHeight;
        }

        function addBotMessage(text) {
            const d = document.createElement('div'); d.className = 'msg msg-bot'; d.innerHTML = text;
            msgsDiv.appendChild(d); msgsDiv.scrollTop = msgsDiv.scrollHeight;
        }

        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);
        sendBtn.addEventListener('click', sendMessage);
        inputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initForfy);
    } else {
        initForfy();
    }
})();
