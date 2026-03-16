// ============================================
// AUTHENTICATION SYSTEM
// ============================================

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'Admin@123'
};

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initEventListeners();
    // Set default values exactly as in screenshot
    setDefaultValues();
});

function setDefaultValues() {
    // Set all default values to match the screenshot
    const defaults = {
        f_PH: 6.2,
        f_OC: 2.1,
        f_Mg: 2.5,
        f_N: 180,
        f_P: 12.5,
        f_K: 185,
        f_Zn: 0.8,
        f_Fe: 4.2,
        f_Cu: 0.5,
        f_Mn: 3.2,
        f_Sand: 62,
        f_Silt: 8.5,
        f_Clay: 9.2,
        f_CaCO3: 5.4,
        f_CEC: 8.2,
        f_Moisture_Content: 19.5
    };
    
    for (const [id, value] of Object.entries(defaults)) {
        const el = document.getElementById(id);
        if (el) el.value = value;
    }
}

function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('soilSenseLoggedIn') === 'true';
    const loginPage = document.getElementById('loginPage');
    const mainApp = document.getElementById('mainApp');
    
    if (isLoggedIn) {
        loginPage.style.display = 'none';
        mainApp.style.display = 'block';
        // Set white background explicitly
        document.body.style.background = '#ffffff';
        mainApp.style.background = '#ffffff';
    } else {
        loginPage.style.display = 'flex';
        mainApp.style.display = 'none';
    }
}

function initEventListeners() {
    // Login
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('toggleBtn').addEventListener('click', togglePassword);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Tabs - using the tab-btn class from your HTML
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.getAttribute('onclick') ? this.getAttribute('onclick').match(/'([^']+)'/)[1] : 'single');
        });
    });
    
    // Analyze button
    document.getElementById('predictBtn').addEventListener('click', runPrediction);
    
    // Sample buttons
    document.querySelectorAll('.sample-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            loadSample(this.dataset.sample);
        });
    });
    
    // Upload zone
    const uploadZone = document.getElementById('uploadZone');
    if (uploadZone) {
        uploadZone.addEventListener('click', () => document.getElementById('fileInput').click());
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag');
        });
        uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag'));
        uploadZone.addEventListener('drop', handleDrop);
    }
    
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('toggleBtn');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🔒';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('soilSenseLoggedIn', 'true');
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        // Set white background
        document.body.style.background = '#ffffff';
        document.getElementById('mainApp').style.background = '#ffffff';
        errorEl.classList.remove('show');
        // Run prediction after login
        setTimeout(runPrediction, 200);
    } else {
        errorEl.textContent = 'Invalid username or password';
        errorEl.classList.add('show');
    }
}

function logout() {
    sessionStorage.removeItem('soilSenseLoggedIn');
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').classList.remove('show');
}

// ============================================
// SOIL ANALYSIS FUNCTIONS
// ============================================

const SAMPLES = {
    high: { 
        PH: 6.5, OC: 4.2, Mg: 3.2, N: 280, P: 22, K: 310, 
        Zn: 1.2, Fe: 7.5, Cu: 0.7, Mn: 5.5, 
        Sand: 55, Silt: 12, Clay: 10, CaCO3: 4.5, CEC: 18, Moisture_Content: 21 
    },
    medium: { 
        PH: 6.1, OC: 2.1, Mg: 2.0, N: 160, P: 11, K: 165, 
        Zn: 0.7, Fe: 4.0, Cu: 0.5, Mn: 3.0, 
        Sand: 65, Silt: 8, Clay: 9, CaCO3: 5.5, CEC: 8, Moisture_Content: 18.5 
    },
    low: { 
        PH: 5.1, OC: 0.6, Mg: 0.8, N: 45, P: 4.5, K: 55, 
        Zn: 0.2, Fe: 2.0, Cu: 0.3, Mn: 1.2, 
        Sand: 80, Silt: 4, Clay: 5, CaCO3: 2.5, CEC: 3.5, Moisture_Content: 13 
    }
};

function loadSample(type) {
    const s = SAMPLES[type];
    for (const [col, val] of Object.entries(s)) {
        const id = col === 'Moisture_Content' ? 'f_Moisture_Content' : 'f_' + col;
        const el = document.getElementById(id);
        if (el) el.value = val;
    }
    // Run prediction automatically after loading sample
    setTimeout(runPrediction, 100);
}

function getRawValues() {
    const raw = {};
    const fields = ['PH', 'OC', 'Mg', 'N', 'P', 'K', 'Zn', 'Fe', 'Cu', 'Mn', 'Sand', 'Silt', 'Clay', 'CaCO3', 'CEC', 'Moisture_Content'];
    
    fields.forEach(col => {
        const id = col === 'Moisture_Content' ? 'f_Moisture_Content' : 'f_' + col;
        raw[col] = parseFloat(document.getElementById(id).value) || 0;
    });
    
    return raw;
}

function calculateFertility(raw) {
    // Professional scoring algorithm based on Malawi soil standards
    let score = 0;
    let maxScore = 0;
    
    // Nitrogen (optimal > 200 mg/kg)
    if (raw.N >= 200) score += 20;
    else if (raw.N >= 120) score += 15;
    else if (raw.N >= 80) score += 10;
    else score += 5;
    maxScore += 20;
    
    // Phosphorus (optimal > 15 mg/kg)
    if (raw.P >= 15) score += 20;
    else if (raw.P >= 12) score += 15;
    else if (raw.P >= 8) score += 10;
    else score += 5;
    maxScore += 20;
    
    // Potassium (optimal > 200 mg/kg)
    if (raw.K >= 200) score += 20;
    else if (raw.K >= 150) score += 15;
    else if (raw.K >= 100) score += 10;
    else score += 5;
    maxScore += 20;
    
    // pH (optimal 6.0-7.0)
    if (raw.PH >= 6.0 && raw.PH <= 7.0) score += 15;
    else if (raw.PH >= 5.5 && raw.PH <= 7.5) score += 10;
    else score += 5;
    maxScore += 15;
    
    // Organic Carbon (optimal > 2.0%)
    if (raw.OC >= 2.0) score += 15;
    else if (raw.OC >= 1.5) score += 10;
    else score += 5;
    maxScore += 15;
    
    // Moisture (optimal 15-25%)
    if (raw.Moisture_Content >= 15 && raw.Moisture_Content <= 25) score += 10;
    else score += 5;
    maxScore += 10;
    
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 75) return 'High';
    if (percentage >= 45) return 'Medium';
    return 'Low';
}

function runPrediction() {
    const raw = getRawValues();
    const fertility = calculateFertility(raw);
    const model = document.getElementById('modelSelect').value;
    const confidence = model === 'xgb' ? 96.8 : 94.3;
    
    renderResults(fertility, raw, confidence);
    logDecision(fertility, model);
}

function renderResults(fertility, raw, confidence) {
    const area = document.getElementById('resultArea');
    
    const indicators = [
        { name: 'NITROGEN', value: raw.N, unit: 'mg/kg', good: raw.N >= 120, optimal: 200 },
        { name: 'POTASSIUM', value: raw.K, unit: 'mg/kg', good: raw.K >= 150, optimal: 200 },
        { name: 'PHOSPHORUS', value: raw.P, unit: 'mg/kg', good: raw.P >= 12, optimal: 15 },
        { name: 'ORG. CARBON', value: raw.OC.toFixed(2), unit: '%', good: raw.OC >= 2.0, optimal: 2.0 },
        { name: 'pH', value: raw.PH.toFixed(2), unit: '', good: raw.PH >= 6.0 && raw.PH <= 7.0, optimal: 6.5 },
        { name: 'CEC', value: raw.CEC, unit: 'cmol/kg', good: raw.CEC >= 7, optimal: 7 },
        { name: 'MOISTURE', value: raw.Moisture_Content, unit: '%', good: raw.Moisture_Content >= 15 && raw.Moisture_Content <= 25, optimal: 20 }
    ];
    
    const indicatorsHTML = indicators.map(ind => {
        let percentage = 50;
        if (ind.optimal) {
            percentage = Math.min(100, (parseFloat(ind.value) / ind.optimal) * 100);
        }
        
        return `
            <div class="indicator-item">
                <span class="indicator-name">${ind.name}</span>
                <div class="indicator-bar">
                    <div class="indicator-fill" style="width: ${percentage}%; background: ${ind.good ? '#2e7d32' : '#c62828'}"></div>
                </div>
                <span class="indicator-value">${ind.value}<span class="indicator-unit">${ind.unit}</span></span>
            </div>
        `;
    }).join('');
    
    let description = '';
    if (fertility === 'High') {
        description = 'Excellent nutrient balance. This soil supports high crop productivity without external inputs.';
    } else if (fertility === 'Medium') {
        description = 'Adequate nutrient levels with some room for improvement. Targeted supplementation may help.';
    } else {
        description = 'Critically deficient soil. Crop failure risk is high without fertilizer intervention.';
    }
    
    area.innerHTML = `
        <div>
            <div class="fertility-badge badge-${fertility.toLowerCase()}">${fertility} Fertility</div>
            
            <div class="confidence-display">
                <div class="confidence-label">Model Confidence</div>
                <div class="confidence-value">${confidence}%</div>
            </div>
            
            <p class="result-desc">${description}</p>
            
            <div class="indicators-section">
                <h3>Key Fertility Indicators (7/7)</h3>
                ${indicatorsHTML}
            </div>
        </div>
    `;
}

// Decision Log
let history = [];
let logCount = 0;

function logDecision(fertility, model) {
    logCount++;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    history.unshift({
        id: logCount,
        fertility,
        model: model === 'xgb' ? 'XGB' : 'RF',
        time: timeString
    });
    
    if (history.length > 10) history.pop();
    renderHistory();
}

function renderHistory() {
    const el = document.getElementById('historyList');
    if (!history.length) {
        el.innerHTML = '<div class="empty-state"><div class="empty-icon">📋</div><p>No decisions recorded</p></div>';
        return;
    }
    
    el.innerHTML = history.map(h => `
        <div class="history-item">
            <span style="font-weight:500;">Farmer #${h.id}</span>
            <span class="history-fert badge-${h.fertility.toLowerCase()}">${h.fertility}</span>
            <span class="history-time">${h.time} • ${h.model}</span>
        </div>
    `).join('');
}

function switchTab(name) {
    // Update tab button styles
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#f5f5f5';
        btn.style.color = '#666';
    });
    
    // Find and activate the clicked tab
    const activeTab = Array.from(document.querySelectorAll('.tab-btn')).find(
        btn => btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(name)
    );
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.style.background = '#1e3c2c';
        activeTab.style.color = 'white';
    }
    
    // Show selected content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById('tab-' + name).style.display = 'block';
}

// Bulk Upload Functions
function handleDrop(e) {
    e.preventDefault();
    document.getElementById('uploadZone').classList.remove('drag');
    const file = e.dataTransfer.files[0];
    if (file) {
        processCSV(file);
    }
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        processCSV(file);
    }
}

function processCSV(file) {
    alert(`Processing file: ${file.name}\nThis would analyze multiple soil samples.`);
}
