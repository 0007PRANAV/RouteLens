document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('travelDate').value = today;
    
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    document.getElementById('travelTime').value = currentTime;

    loadProfile();
    loadAnalytics();
    document.getElementById('routeForm').addEventListener('submit', handleRouteSearch);
});

async function handleRouteSearch(e) {
    e.preventDefault();

    const from = document.getElementById('fromLocation').value;
    const to = document.getElementById('toLocation').value;
    const date = document.getElementById('travelDate').value;
    const time = document.getElementById('travelTime').value;

    const modes = [];
    document.querySelectorAll('.checkbox input:checked').forEach(checkbox => {
        modes.push(checkbox.value);
    });

    if(!from || !to) {
        showNotification('Please enter both locations', 'warning');
        return;
    }

    if(modes.length === 0) {
        showNotification('Please select at least one transport mode', 'warning');
        return;
    }

    const btn = document.querySelector('.btn-primary');
    btn.disabled = true;
    btn.textContent = 'Finding routes...';

    try {
        const routes = generateMockRoutes(from, to, modes);
        displayRoutes(routes, from, to);
        document.getElementById('results').classList.remove('hidden');
        showNotification('Routes found!', 'success');
    } catch(error) {
        console.error('Error:', error);
        showNotification('Error finding routes', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Find Routes';
    }
}

function generateMockRoutes(from, to, modes) {
    const baseDistance = Math.random() * 20 + 5;
    const baseDuration = Math.floor(baseDistance * 3 + Math.random() * 20);
    const routes = [];

    if(modes.includes('driving')) {
        routes.push({
            id: 'route-1',
            mode: 'driving',
            title: 'Car',
            icon: '🚗',
            distance: baseDistance,
            duration: baseDuration,
            cost: calculateCost(baseDistance, 'driving', 'sedan'),
            emissions: calculateEmissions(baseDistance, 'driving', 'sedan')
        });
    }

    if(modes.includes('transit')) {
        routes.push({
            id: 'route-2',
            mode: 'transit',
            title: 'Public Transit',
            icon: '🚌',
            distance: baseDistance * 1.1,
            duration: baseDuration + 15,
            cost: '2.50',
            emissions: (baseDistance * 0.05).toFixed(2)
        });
    }

    if(modes.includes('cycling')) {
        routes.push({
            id: 'route-3',
            mode: 'cycling',
            title: 'Bike',
            icon: '🚴',
            distance: baseDistance * 1.2,
            duration: baseDuration * 2,
            cost: '1.00',
            emissions: '0.00'
        });
    }

    if(modes.includes('walking')) {
        routes.push({
            id: 'route-4',
            mode: 'walking',
            title: 'Walking',
            icon: '🚶',
            distance: baseDistance * 1.3,
            duration: baseDuration * 3,
            cost: '0.00',
            emissions: '0.00'
        });
    }

    return routes;
}

function displayRoutes(routes, from, to) {
    const routesList = document.getElementById('routesList');
    routesList.innerHTML = '';

    routes.forEach(route => {
        const card = document.createElement('div');
        card.className = 'route-card';
        card.innerHTML = `
            <div class="route-header">
                <span class="route-mode">${route.icon}</span>
                <span class="route-title">${route.title}</span>
            </div>
            <div class="route-info">
                <div class="info-item">
                    <span class="label">Duration:</span>
                    <span class="value duration">${formatDuration(route.duration * 60)}</span>
                </div>
                <div class="info-item">
                    <span class="label">Distance:</span>
                    <span class="value distance">${formatDistance(route.distance * 1000)}</span>
                </div>
                <div class="info-item">
                    <span class="label">Cost:</span>
                    <span class="value cost">$${route.cost}</span>
                </div>
                <div class="info-item">
                    <span class="label">CO₂:</span>
                    <span class="value emissions">${route.emissions} kg</span>
                </div>
            </div>
            <button class="select-route">Select Route</button>
        `;

        card.querySelector('.select-route').addEventListener('click', () => {
            selectRoute(route, from, to);
        });

        routesList.appendChild(card);
    });
}

function selectRoute(route, from, to) {
    const detailsContainer = document.getElementById('detailsContainer');
    detailsContainer.innerHTML = `
        <div class="detail-item">
            <h4>Mode</h4>
            <p>${route.icon} ${route.title}</p>
        </div>
        <div class="detail-item">
            <h4>Distance</h4>
            <p>${formatDistance(route.distance * 1000)}</p>
        </div>
        <div class="detail-item">
            <h4>Duration</h4>
            <p>${formatDuration(route.duration * 60)}</p>
        </div>
        <div class="detail-item">
            <h4>Cost</h4>
            <p>$${route.cost}</p>
        </div>
        <div class="detail-item">
            <h4>CO₂ Emissions</h4>
            <p>${route.emissions} kg</p>
        </div>
        <div class="detail-item">
            <h4>Impact</h4>
            <p>${getImpactText(route.emissions)}</p>
        </div>
    `;

    document.getElementById('routeDetails').classList.remove('hidden');
    
    saveRoute({
        from: from,
        to: to,
        mode: route.mode,
        distance: route.distance,
        duration: route.duration,
        cost: parseFloat(route.cost),
        emissions: parseFloat(route.emissions),
        timestamp: new Date().toISOString()
    });

    showNotification(`${route.title} route selected!`, 'success');
}

function getImpactText(emissions) {
    const em = parseFloat(emissions);
    if(em === 0) return 'Zero ✨';
    if(em < 1) return 'Very Low 🟢';
    if(em < 3) return 'Low 🟢';
    if(em < 5) return 'Moderate 🟡';
    return 'High 🔴';
}

function loadProfile() {
    const profile = localStorage.getItem('userProfile');
    if(profile) {
        const data = JSON.parse(profile);
        document.getElementById('homeAddress').value = data.homeAddress || '';
        document.getElementById('workAddress').value = data.workAddress || '';
    }
}

function saveProfile() {
    const profile = {
        homeAddress: document.getElementById('homeAddress').value,
        workAddress: document.getElementById('workAddress').value,
        savedAt: new Date().toISOString()
    };
    localStorage.setItem('userProfile', JSON.stringify(profile));
    showNotification('Profile saved!', 'success');
}

function loadAnalytics() {
    const routes = JSON.parse(localStorage.getItem('routeHistory') || '[]');
    
    if(routes.length === 0) return;

    let totalDistance = 0;
    let totalCost = 0;
    let totalEmissions = 0;

    routes.forEach(route => {
        totalDistance += route.distance || 0;
        totalCost += route.cost || 0;
        totalEmissions += route.emissions || 0;
    });

    document.getElementById('totalDistance').textContent = totalDistance.toFixed(1) + ' km';
    document.getElementById('moneySaved').textContent = '$' + (totalCost * 0.3).toFixed(2);
    document.getElementById('co2Saved').textContent = (totalEmissions * 0.4).toFixed(2) + ' kg';
    
    const modes = {};
    routes.forEach(route => {
        modes[route.mode] = (modes[route.mode] || 0) + 1;
    });
    
    const favoriteMode = Object.keys(modes).reduce((a, b) => modes[a] > modes[b] ? a : b);
    document.getElementById('favoriteRoute').textContent = favoriteMode.charAt(0).toUpperCase() + favoriteMode.slice(1);
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}