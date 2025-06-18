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
    fetch('https://bengaluru-raksha.onrender.com/api/v1/sos/send-sos', {
        method: 'POST',
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${yourToken}`
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

function openProfile() {
    document.getElementById("profileSection").classList.add('active');
    document.getElementById("overlay").classList.add('active')
}
document.getElementById('closeBtn').addEventListener('click', function() {
    document.getElementById('profileSection').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
});

document.getElementById('overlay').addEventListener('click', function() {
    document.getElementById("profileSection").classList.remove('active');
    document.getElementById("overlay").classList.remove('active');
});

async function logout() {
  try {
    const res = await fetch("https://bengaluru-raksha.onrender.com/api/v1/users/logout", {
      method: "POST",
      credentials: "include"  
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
        alert(data.message || "Logged out successfully!");
        localStorage.removeItem("accessToken");  
        window.location.href = "/login";     
    }
    else{
        alert(data.message || "Logged out failed!");
    }
  } catch (err) {
    alert("Logout failed. Please try again.");
    console.error(err);
  }
}

document.querySelectorAll(".star").forEach(star => {
  star.addEventListener("click", () => {
    const rating = parseInt(star.getAttribute("data-value"));
    document.getElementById("rating").value = rating;

    
    document.querySelectorAll(".star").forEach(s => s.classList.remove("selected"));
    for (let i = 0; i < rating; i++) {
      document.querySelectorAll(".star")[i].classList.add("selected");
    }
  });
});

document.getElementById("reportform").addEventListener("submit", async function (e) {
  e.preventDefault();

  const vehicleNumber = document.getElementById("vno").value.trim();
  const review = document.getElementById("rrep").value.trim();
  const stars = parseInt(document.getElementById("rating").value);

  if (!vehicleNumber || !stars) {
    alert("Please enter a vehicle number and select a rating.");
    return;
  }

  try {
    const res = await fetch("https://bengaluru-raksha.onrender.com/api/v1/rate-driver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ vehicleNumber, stars, review })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Review submitted successfully!");
      document.getElementById("reportform").reset();
      document.getElementById("rating").value = "0";
      document.querySelectorAll(".star").forEach(s => s.classList.remove("selected"));
    } else {
      alert(data.message || "Failed to submit rating.");
    }
  } catch (err) {
    alert("Error submitting rating.");
    console.error(err);
  }
});


// get vehicle review $$$

document.getElementById("searchform").addEventListener("submit", async function (e) {
  e.preventDefault();

  const vehicleNumber = document.getElementById("searchvno").value.trim();

  if (!vehicleNumber) {
    alert("Please enter a vehicle number to search.");
    return;
  }

  try {
    const res = await fetch(`https://bengaluru-raksha.onrender.com/api/v1/driver/${vehicleNumber}`);
    const data = await res.json();

    if (res.ok) {
      const d = data.data;
      const review = d.latestReview?.review || "No review yet";
      const stars = d.latestReview?.stars || "-";

      document.getElementById("driverDetails").innerHTML = `
        <p><strong>Vehicle Number:</strong> ${d.vehicleNumber}</p>
        <p><strong>Average Rating:</strong> ${d.averageRating} ⭐</p>
        <p><strong>Total Ratings:</strong> ${d.totalRatings}</p>
        <p><strong>Latest Review:</strong> ${review} (${stars} ⭐)</p>
      `;
    } else {
      alert(data.message || "Driver not found.");
      document.getElementById("driverDetails").innerHTML = "";
    }
  } catch (err) {
    alert("Error fetching driver details.");
    console.error(err);
  }
});
