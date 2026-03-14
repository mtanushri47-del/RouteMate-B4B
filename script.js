// Global Storage
let rides = JSON.parse(localStorage.getItem('communityRides')) || [];

const save = () => localStorage.setItem('communityRides', JSON.stringify(rides));

// 🗑️ DELETE FUNCTION (Moved outside for global access)
window.removeRide = (index) => {
    rides.splice(index, 1);
    save();
    render();
};

// 🤝 JOIN FUNCTION
window.join = (index) => {
    if (rides[index].members < rides[index].size) {
        rides[index].members++;
        save();
        render();

        const colors = ['#9c27b0', '#ff5722', '#00bcd4', '#4caf50', '#ffc107'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const circle = document.getElementById('syncCircle');
        circle.style.backgroundColor = randomColor;
        circle.style.color = randomColor; 
        
        document.getElementById('handshakeModal').style.display = 'block';
    }
};

window.closeHandshake = () => {
    document.getElementById('handshakeModal').style.display = 'none';
};

// 🔄 RENDER FUNCTION
const render = () => {
    const list = document.getElementById('rideList');
    if (!list) return;
    list.innerHTML = '';
    const hub = document.getElementById('campusHub').value;

    const filtered = rides.filter(r => r.hub === hub);

    filtered.forEach((r, index) => {
        const card = document.createElement('div');
        card.className = 'ride-card';
        
        const fareVal = parseInt(r.fare) || 0;
        const memberVal = parseInt(r.members) || 1;
        const sizeVal = parseInt(r.size) || 1;
        const splitFare = Math.round(fareVal / memberVal);
        const isFull = memberVal >= sizeVal;

        card.innerHTML = `
            <button class="delete-btn" onclick="removeRide(${index})">🗑️</button>
            <span class="status-tag">${isFull ? 'FULL' : (sizeVal - memberVal) + ' SLOTS'}</span>
            <small>Stark (Verified) ✅</small>
            <h3>📍 ${r.pickup} ➔ ${r.dest}</h3>
            <p>Mode: <b>${r.mode}</b> | Time: ${r.time}</p>
            <p style="color:#2e7d32; font-weight:bold;">₹${splitFare} / person</p>
            <button class="join-btn" onclick="join(${index})" ${isFull ? 'disabled' : ''}>
                ${isFull ? 'Full' : 'Join & Split'}
            </button>
        `;
        list.appendChild(card);
    });
};

// INITIALIZATION
window.onload = () => {
    document.getElementById('postBtn').onclick = () => {
        const dest = document.getElementById('endLoc').value;
        const fare = document.getElementById('totalFare').value;
        if (!dest || !fare) return alert("Fill Destination & Fare!");

        rides.push({
            hub: document.getElementById('campusHub').value,
            pickup: document.getElementById('pickupSpot').value,
            time: document.getElementById('depTime').value,
            dest: dest,
            mode: document.getElementById('vehicleType').value,
            size: parseInt(document.getElementById('groupSize').value) || 2,
            fare: parseInt(fare),
            members: 1
        });

        save();
        render();
        document.getElementById('endLoc').value = "";
    };

    window.updatePulse = () => {
        const spot = document.getElementById('pickupSpot').value;
        const count = Math.floor(Math.random() * 5) + 2;
        document.getElementById('liveWaiters').innerText = `${count} people waiting at ${spot} now`;
    };

    document.getElementById('sosBtn').onclick = () => {
        document.getElementById('mainApp').style.filter = "invert(10%) sepia(90%) saturate(5000%) hue-rotate(0deg)";
        alert("🚨 SOS ALERT: Security notified!");
        setTimeout(() => document.getElementById('mainApp').style.filter = "none", 2000);
    };

    document.getElementById('campusHub').onchange = render;
    render();
};