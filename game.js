//Variables for the game
let marker;
let currentSergePosition = getSergeCurrentPos();
console.log("currentSergePosition", currentSergePosition)
let guessLine;
let gameInProgress = true; // Variable pour suivre l'état du jeu

// Observe game_container visibility changes and init map on visible
let observer = new MutationObserver(function () {
    if (!game_container.hidden) {
        initMap();
    }
});
observer.observe(game_container, {attributes: true, childList: true});

document.getElementById('validateBtn').addEventListener('click', async function () {
    await onValidateBtnClick();
});

// Afficher le leaderboard
displayLeaderboard();

// Functions for the game
function initMap() {
    map = L.map('map').setView([51.505, -0.09], 18); // Centrer la carte sur une vue globale

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18,
    }).addTo(map);
    map.setZoom(4);

    map.on('click', function (e) {
        onMapClick(e);
    });
}

async function getSergeCurrentPos() {
    const { data, error } = await db_client
        .from('Serge_Pos')
        .select('*')
        .order('position_date', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error fetching data:', error);
        alert('Erreur lors de la récupération des données: ' + error.message);
    } else {
        if (data.length > 0) {
            const latestPosition = data[0];
            return {
            id:latestPosition.id,
            pos:{ lat: latestPosition.lat, lng: latestPosition.lon}
            }
        }
        else {
            console.log('Aucune position trouvée.');
            alert('Aucune position trouvée.');
            }      
        }
    }

function onMapClick(e) {
    if (gameInProgress) {
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker(e.latlng).addTo(map);
    } else {
        Toastify({
            text: "You have already guessed the position. Retry new time.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#f00",
        }).showToast();
    }
}

async function onValidateBtnClick() {
    if (marker) {
        const guessLatLng = marker.getLatLng();
        
        try {
            const result = await currentSergePosition;
            const { lat, lng } = result.pos; // Destructuring pour extraire lat et lng de result.pos
        
            const distance = map.distance(guessLatLng, { lat, lng }) / 1000; // Convertir en kilomètres
        
            console.log('Distance calculée:', distance);
        
            Toastify({
                text: `Distance: ${distance.toFixed(0)} km`, // Utiliser toFixed(0) pour arrondir à zéro décimale
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#007bff",
            }).showToast();
    
            // Supprimer le marker de la position correcte si existant
            map.eachLayer(function (layer) {
                if (layer.getLatLng && layer.getLatLng().equals(result.pos)) {
                    map.removeLayer(layer);
                }
            });
    
            // Ajouter un marker à la position correcte
            L.marker(result.pos).addTo(map)
                .bindPopup('Position correcte')
                .openPopup();
    
            // Dessiner une ligne entre le guess et la position réelle
            if (guessLine) {
                map.removeLayer(guessLine);
            }
            guessLine = L.polyline([guessLatLng, result.pos], {color: 'red'}).addTo(map);
    
            // Centrer la vue et ajuster le zoom
            const bounds = L.latLngBounds([guessLatLng, result.pos]);
            let maxZoom;
            if (distance > 6000) {
                maxZoom = 3;
            } else if (distance <= 6000 && distance > 4000) {
                maxZoom = 4;
            } else {
                maxZoom = 8;
            }
            
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: maxZoom });
            
            const score = calculateScoreFromDistance(distance);
            await addScore(score);
    
            // Afficher le leaderboard
            displayLeaderboard();
    
            // Marquer la fin du jeu
            gameInProgress = false;
        } catch (error) {
            console.error('Erreur lors de l\'accès aux données de position:', error);
        }
    } else {
        Toastify({
            text: "Please click on the map to place a pin.",
            duration: 3000,
            gravity: "top",
            position: "center",
            backgroundColor: "#f00",
        }).showToast();
    }
}


/**
 * Get best scores from database
 * @param gameId
 * @param limit
 */
function getBestScores(gameId, limit) {
    //TODO retrieve best scores from database 'scores' table
    // with the current game position ID and limit
    return [
        {
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            score: 5000
        },
        {
            user_id: '123e4567-e89b-12d3-a456-426614174001',
            score: 4000
        },
        {
            user_id: '123e4567-e89b-12d3-a456-426614174002',
            score: 3000
        },
        {
            user_id: '123e4567-e89b-12d3-a456-426614174003',
            score: 2000
        },
        {
            user_id: '123e4567-e89b-12d3-a456-426614174004',
            score: 1000
        }
    ];
}

function displayLeaderboard() {
    // TODO retrieve current leaderboard from database 'scores' table
    // with the current game position ID
    const currentGameBestScores = getBestScores(currentSergePosition.id, 5);
    const allTimeBestScores = getBestScores(null, 5);

    const allTimeBoard = document.getElementById('allTimeBoard');
    const currentBoard = document.getElementById('currentBoard');

    allTimeBoard.innerHTML = '';
    currentBoard.innerHTML = '';

    allTimeBestScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<b>${index + 1}.</b> ${score.user_id} <b>${score.score}</b>`;
        allTimeBoard.appendChild(li);
    });

    currentGameBestScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<b>${index + 1}.</b> ${score.user_id} <b>${score.score}</b>`;
        currentBoard.appendChild(li);
    });
}

// Fonction pour ajouter un score
async function addScore(score) {
    const {data, error} = await db_client
        .from('scores')
        .insert([{
            serge_pos_id: currentSergePosition.id,
            user_id: db_client.auth.getUser().id,
            score: score
        }]);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Score added:', data);
    }
}

/** Calculate like geoguessr a score from the distance
 *
 * score = 5000 * (1 - (pi * r^2) / (area of map))
 *
 * Where:
 *
 * r is the distance away from the actual start point
 * pi is the mathematical constant pi
 * area of map is the area of the map being used
 * @param distance
 */
function calculateScoreFromDistance(distance) {
    const radius = 6371; // Earth's radius in kilometers
    const areaOfMap = 510100000; // Area of the map in square kilometers
    return 5000 * (1 - (Math.PI * Math.pow(distance, 2)) / areaOfMap);
}