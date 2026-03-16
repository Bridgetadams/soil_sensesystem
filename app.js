// ============================================
// DYNAMIC INPUT SUPPORT (+ Add Nutrient/Property)
// ============================================

// Add new nutrient/property input dynamically
function addDynamicInput() {
    const container = document.getElementById('dynamicInputs');
    if (!container) return;

    // Create input wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add('input-field', 'dynamic-field');

    // Create name input
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Nutrient Name';
    nameInput.classList.add('dyn-name');

    // Create value input
    const valueInput = document.createElement('input');
    valueInput.type = 'number';
    valueInput.placeholder = 'Value';
    valueInput.classList.add('dyn-value');

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '❌';
    removeBtn.style.marginLeft = '6px';
    removeBtn.addEventListener('click', () => wrapper.remove());

    wrapper.appendChild(nameInput);
    wrapper.appendChild(valueInput);
    wrapper.appendChild(removeBtn);
    container.appendChild(wrapper);
}

// Extend getRawValues to include dynamic inputs
function getRawValues() {
    const raw = {};
    const fields = ['PH', 'OC', 'Mg', 'N', 'P', 'K', 'Zn', 'Fe', 'Cu', 'Mn', 'Sand', 'Silt', 'Clay', 'CaCO3', 'CEC', 'Moisture_Content'];

    fields.forEach(col => {
        const id = col === 'Moisture_Content' ? 'f_Moisture_Content' : 'f_' + col;
        raw[col] = parseFloat(document.getElementById(id).value) || 0;
    });

    // Include dynamic features
    MODEL.clearDynamicFeatures(); // clear old ones
    document.querySelectorAll('.dynamic-field').forEach(wrapper => {
        const name = wrapper.querySelector('.dyn-name').value.trim();
        const value = parseFloat(wrapper.querySelector('.dyn-value').value);
        if (name && !isNaN(value)) {
            raw[name] = value;
            MODEL.addDynamicFeature(name, value);
        }
    });

    return raw;
}

// Attach Add Dynamic Input button
const addDynBtn = document.getElementById('addDynamicBtn');
if (addDynBtn) {
    addDynBtn.addEventListener('click', addDynamicInput);
}
