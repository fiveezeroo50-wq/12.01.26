// Telpu nomu aprēķina sistēma

// Tarifu definīcija
const tariffs = {
    workday: 25,    // EUR stundā darba dienās
    weekend: 35     // EUR stundā brīvdienās
};

// DOM elementu atlase
const rentalForm = document.getElementById('rental-form');
const hoursInput = document.getElementById('hours');
const dayTypeSelect = document.getElementById('day-type');
const resultDisplay = document.getElementById('result-display');
const calculateButton = document.getElementById('calculate-btn');
const selectedDayInput = document.getElementById('selected-day');
const openCalendarButton = document.getElementById('open-calendar-btn');
const selectedDayBadge = document.getElementById('selected-day-badge');

const monthLabel = 'Maijs';
const STORAGE_KEY = 'telpu-noma:selected-day';

// Funkcija cenas aprēķināšanai
function calculateRentalPrice(hours, dayType) {
    if (!hours || hours <= 0) {
        return null;
    }

    const hourlyRate = tariffs[dayType];
    if (!hourlyRate) {
        return null;
    }

    const totalPrice = hours * hourlyRate;
    return {
        hours: hours,
        dayType: dayType,
        hourlyRate: hourlyRate,
        totalPrice: totalPrice,
        selectedDay: selectedDayInput?.value ? `${monthLabel} ${selectedDayInput.value}.` : null
    };
}

// Funkcija rezultāta attēlošanai
function displayResult(result) {
    if (!result) {
        resultDisplay.innerHTML = '<p class="error-message">Lūdzu, aizpildiet visus laukus pareizi!</p>';
        resultDisplay.className = 'result-display error';
        return;
    }

    const dayTypeText = result.dayType === 'workday' ? 'Darba diena' : 'Brīvdiena';
    const dayTypeClass = result.dayType === 'workday' ? 'workday' : 'weekend';

    resultDisplay.innerHTML = `
        <div class="result-content ${dayTypeClass}">
            <h2>Aprēķina rezultāts</h2>
            <div class="result-details">
                <p><strong>Stundu skaits:</strong> ${result.hours} st.</p>
                <p><strong>Dienas veids:</strong> ${dayTypeText}</p>
                <p><strong>Izvēlētā diena:</strong> ${result.selectedDay ?? 'Nav izvēlēta'}</p>
                <p><strong>Stundas tarifs:</strong> ${result.hourlyRate} EUR/st.</p>
                <p class="total-price"><strong>Kopējā cena:</strong> ${result.totalPrice.toFixed(2)} EUR</p>
            </div>
        </div>
    `;
    resultDisplay.className = 'result-display success';
}

// Funkcija formas validācijai
function validateInput(hours, dayType, selectedDay) {
    if (!hours || hours <= 0) {
        return false;
    }
    if (!dayType || (dayType !== 'workday' && dayType !== 'weekend')) {
        return false;
    }
    if (!selectedDay) {
        return false;
    }
    return true;
}

function setSelectedDayUI(dayNumber) {
    if (selectedDayInput) selectedDayInput.value = dayNumber ? String(dayNumber) : '';

    if (selectedDayBadge) {
        selectedDayBadge.textContent = dayNumber ? `${monthLabel} ${dayNumber}.` : 'Nav izvēlēta';
        selectedDayBadge.classList.toggle('has-value', Boolean(dayNumber));
    }
}

function readSelectedDayFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const day = parseInt(raw);
        if (!Number.isFinite(day) || day < 1 || day > 31) return null;
        return day;
    } catch {
        return null;
    }
}

function writeSelectedDayToStorage(day) {
    try {
        if (!day) localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, String(day));
        return true;
    } catch {
        return false;
    }
}

// Galvenā aprēķina funkcija
function handleFormSubmit(event) {
    event.preventDefault();

    const hours = parseInt(hoursInput.value);
    const dayType = dayTypeSelect.value;
    const selectedDay = selectedDayInput?.value ? parseInt(selectedDayInput.value) : null;

    if (!validateInput(hours, dayType, selectedDay)) {
        displayResult(null);
        return;
    }

    const result = calculateRentalPrice(hours, dayType);
    displayResult(result);
}

// Event listener formas iesniegšanai
rentalForm.addEventListener('submit', handleFormSubmit);

// Papildu: dinamisks stila maiņa atkarībā no izvēles
dayTypeSelect.addEventListener('change', function() {
    const selectedValue = this.value;
    if (selectedValue === 'weekend') {
        calculateButton.style.backgroundColor = '#e74c3c';
        calculateButton.textContent = 'Aprēķināt cenu (Brīvdiena)';
    } else if (selectedValue === 'workday') {
        calculateButton.style.backgroundColor = '#27ae60';
        calculateButton.textContent = 'Aprēķināt cenu';
    } else {
        calculateButton.style.backgroundColor = '#3498db';
        calculateButton.textContent = 'Aprēķināt cenu';
    }
});

let lastSeenDay = readSelectedDayFromStorage();
if (lastSeenDay) setSelectedDayUI(lastSeenDay);

openCalendarButton?.addEventListener('click', () => {
    // IMPORTANT: don't use noopener/noreferrer here, otherwise the calendar window
    // can't send the selected day back via window.opener (needed especially in Firefox).
    window.open('calendar.html', 'calendarWindow', 'width=980,height=760');
});

window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    const day = readSelectedDayFromStorage();
    lastSeenDay = day;
    setSelectedDayUI(day);
});

// Fallback: droša sinhronizācija arī tad, ja "storage" events nestrādā (piem. file:// režīmā)
setInterval(() => {
    const day = readSelectedDayFromStorage();
    if (day === lastSeenDay) return;
    lastSeenDay = day;
    setSelectedDayUI(day);
}, 500);

// Galvenais kanāls: kalendāra logs nosūta izvēli ar postMessage
window.addEventListener('message', (event) => {
    const data = event?.data;
    if (!data || data.type !== 'telpu-noma:selected-day') return;

    const day = data.day ? parseInt(data.day) : null;
    const normalizedDay = Number.isFinite(day) && day >= 1 && day <= 31 ? day : null;

    setSelectedDayUI(normalizedDay);
    writeSelectedDayToStorage(normalizedDay);
    lastSeenDay = normalizedDay;
});

// Konsoles ziņojums par sistēmas ielādi
console.log('Telpu nomu sistēma ielādēta un gatava lietošanai');
// Telpu nomu aprēķina sistēma

// Tarifu definīcija
const tariffs = {
    workday: 25,    // EUR stundā darba dienās
    weekend: 35     // EUR stundā brīvdienās
};

// DOM elementu atlase
const rentalForm = document.getElementById('rental-form');
const hoursInput = document.getElementById('hours');
const dayTypeSelect = document.getElementById('day-type');
const resultDisplay = document.getElementById('result-display');
const calculateButton = document.getElementById('calculate-btn');

// Funkcija cenas aprēķināšanai
function calculateRentalPrice(hours, dayType) {
    if (!hours || hours <= 0) {
        return null;
    }

    const hourlyRate = tariffs[dayType];
    if (!hourlyRate) {
        return null;
    }

    const totalPrice = hours * hourlyRate;
    return {
        hours: hours,
        dayType: dayType,
        hourlyRate: hourlyRate,
        totalPrice: totalPrice
    };
}

// Funkcija rezultāta attēlošanai
function displayResult(result) {
    if (!result) {
        resultDisplay.innerHTML = '<p class="error-message">Lūdzu, aizpildiet visus laukus pareizi!</p>';
        resultDisplay.className = 'result-display error';
        return;
    }

    const dayTypeText = result.dayType === 'workday' ? 'Darba diena' : 'Brīvdiena';
    const dayTypeClass = result.dayType === 'workday' ? 'workday' : 'weekend';

    resultDisplay.innerHTML = `
        <div class="result-content ${dayTypeClass}">
            <h2>Aprēķina rezultāts</h2>
            <div class="result-details">
                <p><strong>Stundu skaits:</strong> ${result.hours} st.</p>
                <p><strong>Dienas veids:</strong> ${dayTypeText}</p>
                <p><strong>Stundas tarifs:</strong> ${result.hourlyRate} EUR/st.</p>
                <p class="total-price"><strong>Kopējā cena:</strong> ${result.totalPrice.toFixed(2)} EUR</p>
            </div>
        </div>
    `;
    resultDisplay.className = 'result-display success';
}

// Funkcija formas validācijai
function validateInput(hours, dayType) {
    if (!hours || hours <= 0) {
        return false;
    }
    if (!dayType || (dayType !== 'workday' && dayType !== 'weekend')) {
        return false;
    }
    return true;
}

// Galvenā aprēķina funkcija
function handleFormSubmit(event) {
    event.preventDefault();

    const hours = parseInt(hoursInput.value);
    const dayType = dayTypeSelect.value;

    if (!validateInput(hours, dayType)) {
        displayResult(null);
        return;
    }

    const result = calculateRentalPrice(hours, dayType);
    displayResult(result);
}

// Event listener formas iesniegšanai
rentalForm.addEventListener('submit', handleFormSubmit);

// Papildu: dinamisks stila maiņa atkarībā no izvēles
dayTypeSelect.addEventListener('change', function() {
    const selectedValue = this.value;
    if (selectedValue === 'weekend') {
        calculateButton.style.backgroundColor = '#e74c3c';
        calculateButton.textContent = 'Aprēķināt cenu (Brīvdiena)';
    } else if (selectedValue === 'workday') {
        calculateButton.style.backgroundColor = '#27ae60';
        calculateButton.textContent = 'Aprēķināt cenu';
    } else {
        calculateButton.style.backgroundColor = '#3498db';
        calculateButton.textContent = 'Aprēķināt cenu';
    }
});

// Konsoles ziņojums par sistēmas ielādi
console.log('Telpu nomu sistēma ielādēta un gatava lietošanai');
