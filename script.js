var map = L.map('mapid').setView([51.505, -0.09], 2); // Centrer la carte sur une vue globale

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

var marker;
var actualPosition = { lat: 48.8566, lng: 2.3522 }; // Exemple: Paris
var guessLine;
var gameInProgress = true; // Variable pour suivre l'état du jeu

map.on('click', function(e) {
    if (gameInProgress) {
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker(e.latlng).addTo(map);
    } else {
        Toastify({
            text: "Game is over. Please reset to play again.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#f00",
        }).showToast();
    }
});

document.getElementById('validateBtn').addEventListener('click', function() {
    var playerName = document.getElementById('playerName').value;
    if (!playerName) {
        Toastify({
            text: "Please enter your name.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#f00",
        }).showToast();
        return;
    }

    if (marker) {
        var guessLatLng = marker.getLatLng();
        var distance = map.distance(guessLatLng, actualPosition) / 1000; // Convertir en kilomètres
        Toastify({
            text: `Distance: ${distance.toFixed(0)} km`, // Utiliser toFixed(0) pour arrondir à zéro décimale
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#007bff",
        }).showToast();

        // Supprimer le marker de la position correcte si existant
        map.eachLayer(function(layer) {
            if (layer.getLatLng && layer.getLatLng().equals(actualPosition)) {
                map.removeLayer(layer);
            }
        });

        // Ajouter un marker à la position correcte
        L.marker(actualPosition).addTo(map)
            .bindPopup('Position correcte')
            .openPopup();

        // Dessiner une ligne entre le guess et la position réelle
        if (guessLine) {
            map.removeLayer(guessLine);
        }
        guessLine = L.polyline([guessLatLng, actualPosition], { color: 'red' }).addTo(map);

        // Enregistrer le score dans le stockage local
        var scores = JSON.parse(localStorage.getItem('scores')) || [];
        scores.push({ name: playerName, distance: distance });
        localStorage.setItem('scores', JSON.stringify(scores));

        // Afficher le leaderboard
        displayLeaderboard();

        // Marquer la fin du jeu
        gameInProgress = false;
    } else {
        Toastify({
            text: "Please click on the map to place a pin.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#f00",
        }).showToast();
    }
});

document.getElementById('resetBtn').addEventListener('click', function() {
    var adminPassword = prompt('Please enter the admin password to reset the leaderboard:');
    var correctPassword = 'admin123'; // Change this to your desired password

    if (adminPassword === correctPassword) {
        if (confirm('Are you sure you want to reset the leaderboard?')) {
            localStorage.removeItem('scores');
            displayLeaderboard();
            Toastify({
                text: "Leaderboard reset successfully.",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#28a745",
            }).showToast();
        }
    } else {
        Toastify({
            text: "Incorrect password. Access denied.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#f00",
        }).showToast();
    }
});

document.getElementById('resetGameBtn').addEventListener('click', function() {
    // Réinitialiser la carte et les marqueurs
    if (marker) {
        map.removeLayer(marker);
        marker = null;
    }
    if (guessLine) {
        map.removeLayer(guessLine);
        guessLine = null;
    }

    // Réinitialiser le champ de saisie du nom du joueur
    document.getElementById('playerName').value = '';

    // Supprimer le marker de la position correcte si existant
    map.eachLayer(function(layer) {
        if (layer.getLatLng && layer.getLatLng().equals(actualPosition)) {
            map.removeLayer(layer);
        }
    });

    // Marquer le début d'un nouveau jeu
    gameInProgress = true;

    // Réinitialiser les notifications
    Toastify({
        text: "Game reset successfully.",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#28a745",
    }).showToast();
});

function displayLeaderboard() {
    var scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.sort((a, b) => a.distance - b.distance);

    var leaderboard = document.getElementById('leaderboard');
    if (!leaderboard) {
        leaderboard = document.createElement('div');
        leaderboard.id = 'leaderboard';
        document.body.appendChild(leaderboard);
    }

    leaderboard.innerHTML = '<h2>Leaderboard</h2>';
    scores.forEach((score, index) => {
        leaderboard.innerHTML += `<p>${index + 1}. ${score.name}: ${score.distance.toFixed(0)} km</p>`; // Utiliser toFixed(0) pour arrondir à zéro décimale
    });
}

// Afficher le leaderboard
displayLeaderboard();
