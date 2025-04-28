document.addEventListener('DOMContentLoaded', function() {
    const sosButton = document.getElementById('sos-btn');
    const kaeButton = document.getElementById('kae-btn');
    sosButton.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                alert(`Your location is:\nLatitude: ${latitude}\nLongitude: ${longitude}`);
                fetch('http://localhost:8000/api/send-sos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ latitude, longitude })
                })
                .then(response => response.json())
                .then(data => {
                    alert('SOS sent successfully!');
                    console.log('Server Response:', data);
                })
                .catch(error => {
                    alert('Failed to send SOS: ' + error.message);
                    console.error('Error:', error);
                });

            }, function(error) {
                alert('Error getting location: ' + error.message);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });
    kaeButton.addEventListener('click', function() {
        window.location.href = 'homepage.html';
    });
});
