// document.addEventListener('DOMContentLoaded', function() {
//     const sosButton = document.getElementById('sos-btn');
//     const kaeButton = document.getElementById('kae-btn');
//     sosButton.addEventListener('click', function() {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(function(position) {
//                 const latitude = position.coords.latitude;
//                 const longitude = position.coords.longitude;
//                 alert(`Your location is:\nLatitude: ${latitude}\nLongitude: ${longitude}`);
//                 fetch('http://localhost:8000/api/v1/sos/send-sos', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({ latitude, longitude })
//                 })
//                 .then(response => response.json())
//                 .then(data => {
//                     alert('SOS sent successfully!');
//                     console.log('Server Response:', data);
//                 })
//                 .catch(error => {
//                     alert('Failed to send SOS: ' + error.message);
//                     console.error('Error:', error);
//                 });

//             }, function(error) {
//                 alert('Error getting location: ' + error.message);
//             });
//         } else {
//             alert('Geolocation is not supported by this browser.');
//         }
//     });
//     kaeButton.addEventListener('click', function() {
//         window.location.href = 'homepage.html';
//     });
// });

document.addEventListener('DOMContentLoaded', function() {
    const sosButton = document.getElementById('sos-btn');
    const kaeButton = document.getElementById('kae-btn');

    sosButton.addEventListener('click', handleSOSClick);
    kaeButton.addEventListener('click', handleKAEClick);
});

function handleSOSClick() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
    }

    navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);
}

function handleLocationSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    alert(`Your location is:\nLatitude: ${latitude}\nLongitude: ${longitude}`);
    sendLocationToServer(latitude, longitude);
}

function handleLocationError(error) {
    alert('Error getting location: ' + error.message);
}

function sendLocationToServer(latitude, longitude) {
    fetch('http://localhost:8000/api/v1/sos/send-sos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latitude, longitude })
    })
    .then(response => response.json())
    .then(handleServerSuccess)
    .catch(handleServerError);
}

function handleServerSuccess(data) {
    alert('SOS sent successfully!');
    console.log('Server Response:', data);
}

function handleServerError(error) {
    alert('Failed to send SOS: ' + error.message);
    console.error('Error:', error);
}

function handleKAEClick() {
    window.location.href = 'homepage.html';
}