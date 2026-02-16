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
