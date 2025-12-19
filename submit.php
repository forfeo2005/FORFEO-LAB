<?php
/* BACKEND PHP POUR WEB3FORMS - FORFEO LAB
   Sécurise la clé API et gère l'envoi des formulaires.
*/

// --- CONFIGURATION ---
// Ta clé API Web3Forms (intégrée)
$access_key = "c7c665be-ec7f-4455-9a5e-11ebb323fff9";

// Page de redirection après succès
$redirect_url = "confirmation.html";
// ---------------------

// Vérifie si la requête est bien de type POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Récupère toutes les données du formulaire
    $data = $_POST;

    // 2. Ajoute la clé API (côté serveur, donc invisible pour l'utilisateur)
    $data['access_key'] = $access_key;

    // 3. Configuration de l'envoi vers Web3Forms via cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.web3forms.com/submit");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Exécution de la requête
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // 4. Gestion de la réponse
    if ($http_code == 200) {
        // Succès : On redirige vers la page de confirmation
        header("Location: " . $redirect_url);
        exit();
    } else {
        // Erreur : On affiche un message
        echo "<h3>Erreur lors de l'envoi du formulaire.</h3>";
        echo "<p>Code erreur : " . $http_code . "</p>";
        echo "<p>Réponse API : " . htmlspecialchars($response) . "</p>";
        echo "<p><a href='javascript:history.back()'>Retourner au formulaire</a></p>";
    }

} else {
    // Si l'utilisateur essaie d'ouvrir le fichier php directement
    header("Location: index.html");
    exit();
}
?>
