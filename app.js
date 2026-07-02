// Set today's date as default
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('travelDate').value = today;
    
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    document.getElementById('travelTime').value = currentTime;

    // Load saved profile
    loadProfile();
    loadAnalytics();

    // Event listeners
    document.getElementById('routeForm').addEventListener('submit', handleRouteSearch);
});

// Handle route search form submission
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

    // Show loading state
    const btn = document.querySelector('.btn-primary');
    btn.disabled = true;
    btn.textContent = 'Finding routes...';

    try {
        // Get coordinates for locations
        const fromCoords = await geocodeAddress(from);
        const toCoords = await geocodeAddress(to);

        // Calculate routes (mock data for demo)
        const routes = generateMockRoutes(from, to, modes);

        // Display results
        displayRoutes(routes, from, to);

        // Show results section
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

// Generate mock routes (in real app, would come from backend)
function generateMockRoutes(from, to, modes) {
    const baseDistance = Math.random() * 20 + 5; // 5-25 km
    const baseDuration = Math.floor(baseDistance * 3 + Math.random() * 20); // minutes

    const routes = [];

    if(modes.includes('driving')) {
        routes.push({
            id: 'route-1',
            mode: 'driving',
            title: 'Car',
            icon: '🚗',
            distance: baseDistance,
            duration: baseDuration,
            cost: calculateCost(baseDistance, 'driving', document.getElementById('carType')?.value || 'sedan'),
            emissions: calculateEmissions(baseDistance, 'driving', document.getElementById('carType')?.value || 'sedan')
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

// Display routes
function displayRoutes(routes, from, to) {
    const routesList = document.getElementById('routesList');
    routesList.innerHTML = '';

    routes.forEach(route => {
        const template = document.getElementById('routeCardTemplate');
        const clone = template.content.cloneNode(true);

        clone.querySelector('.route-mode').textContent = route.icon;
        clone.querySelector('.route-title').textContent = route.title;
        clone.querySelector('.duration').textContent = formatDuration(route.duration * 60);
        clone.querySelector('.distance').textContent = formatDistance(route.distance * 1000);
        clone.querySelector('.cost').textContent = '$' + route.cost;
        clone.querySelector('.emissions').textContent = route.emissions + ' kg';

        const selectBtn = clone.querySelector('.select-route');
        selectBtn.addEventListener('click', () => {
            selectRoute(route, from, to);
        });

        routesList.appendChild(clone);
    });
}

// Select a route
function selectRoute(route, from, to) {
    displayRoute(from, to, route.mode);
    
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
            <h4>Environment Impact</h4>
            <p>${getImpactText(route.emissions)}</p>
        </div>
    `;

    document.getElementById('routeDetails').classList.remove('hidden');
    
    // Save to history
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

// Get environment impact text
function getImpactText(emissions) {
    const em = parseFloat(emissions);
    if(em === 0) return 'Zero emissions ✨';
    if(em < 1) return 'Very low impact 🟢';
    if(em < 3) return 'Low impact 🟢';
    if(em < 5) return 'Moderate impact 🟡';
    return 'High impact 🔴';
}

// Load profile
async function loadProfile() {
    const profile = localStorage.getItem('userProfile');
    if(profile) {
        const data = JSON.parse(profile);
        document.getElementById('homeAddress').value = data.homeAddress || '';
        document.getElementById('workAddress').value = data.workAddress || '';
        document.getElementById('carType').value = data.carType || 'sedan';
        document.getElementById('budget').value = data.budget || '';
    }
}

// Save profile
async function saveProfile() {
    const profile = {
        homeAddress: document.getElementById('homeAddress').value,
        workAddress: document.getElementById('workAddress').value,
        carType: document.getElementById('carType').value,
        budget: document.getElementById('budget').value,
        savedAt: new Date().toISOString()
    };

    localStorage.setItem('userProfile', JSON.stringify(profile));
    showNotification('Profile saved!', 'success');
}

// Load analytics
async function loadAnalytics() {
    const routes = JSON.parse(localStorage.getItem('routeHistory') || '[]');
    
    if(routes.length === 0) {
        return;
    }

    let totalDistance = 0;
    let totalCost = 0;
    let totalEmissions = 0;

    routes.forEach(route => {
        totalDistance += route.distance || 0;
        totalCost += route.cost || 0;
        totalEmissions += route.emissions || 0;
    });

    document.getElementById('totalDistance').textContent = totalDistance.toFixed(1) + ' km';
    document.getElementById('moneySaved').textContent = '$' + (totalCost * 0.3).toFixed(2); // Assume 30% savings
    document.getElementById('co2Saved').textContent = (totalEmissions * 0.4).toFixed(2) + ' kg'; // Eco mode savings
    
    const modes = {};
    routes.forEach(route => {
        modes[route.mode] = (modes[route.mode] || 0) + 1;
    });
    
    const favoriteMode = Object.keys(modes).reduce((a, b) => modes[a] > modes[b] ? a : b);
    document.getElementById('favoriteRoute').textContent = favoriteMode.charAt(0).toUpperCase() + favoriteMode.slice(1);

    // Draw chart
    drawCommutChart(routes);
}

// Draw commute chart
function drawCommutChart(routes) {
    const canvas = document.getElementById('commutChart');
    if(!canvas) return;

    const ctx = canvas.getContext('2d');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const costs = [12, 15, 10, 18, 22, 8, 5];

    // Simple bar chart
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / (days.length + 1);
    const maxCost = Math.max(...costs);

    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);

    costs.forEach((cost, index) => {
        const x = (index + 0.5) * barWidth + 20;
        const barHeight = (cost / maxCost) * (height * 0.8);
        const y = height * 0.8 - barHeight;

        // Draw bar
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(x, y, barWidth * 0.6, barHeight);

        // Draw label
        ctx.fillStyle = '#1f2937';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(days[index], x + barWidth * 0.3, height - 10);
        ctx.fillText('$' + cost, x + barWidth * 0.3, y - 5);
    });
}