const monthLabel = 'Maijs';
const totalDaysInMonth = 30;
const takenDays = new Set([2, 5, 7, 11, 14, 18, 21, 25, 29]);

const STORAGE_KEY = 'telpu-noma:selected-day';

const calendarGrid = document.getElementById('calendar-grid');
const statusEl = document.getElementById('calendar-status');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');

let selectedDay = null;

function setStatus(text, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.toggle('error', isError);
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

function notifyOpener(day) {
    try {
        if (!window.opener) return false;
        window.opener.postMessage({ type: 'telpu-noma:selected-day', day }, '*');
        return true;
    } catch {
        return false;
    }
}

function renderSelection() {
    const buttons = calendarGrid?.querySelectorAll?.('button[data-day]');
    buttons?.forEach((btn) => {
        const btnDay = parseInt(btn.getAttribute('data-day'));
        const isSelected = selectedDay === btnDay;
        btn.classList.toggle('is-selected', isSelected);
        btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    if (selectedDay) setStatus(`Izvēlēts: ${monthLabel} ${selectedDay}.`, false);
    else setStatus('Nav izvēlēta.', false);
}

function buildCalendar() {
    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';

    // vienkāršs "mēneša sākuma" nobīdes efekts skaistumam (nav īsts kalendārs)
    const fakeStartOffset = 3; // 0..6
    for (let i = 0; i < fakeStartOffset; i++) {
        const spacer = document.createElement('div');
        spacer.className = 'calendar-spacer';
        spacer.setAttribute('aria-hidden', 'true');
        calendarGrid.appendChild(spacer);
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
        const isTaken = takenDays.has(day);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `calendar-day big ${isTaken ? 'is-taken' : 'is-available'}`;
        button.textContent = String(day);
        button.setAttribute('data-day', String(day));
        button.setAttribute('role', 'gridcell');
        button.setAttribute('aria-disabled', isTaken ? 'true' : 'false');
        button.disabled = isTaken;

        button.addEventListener('click', () => {
            if (isTaken) {
                setStatus(`Diena ${monthLabel} ${day}. ir aizņemta.`, true);
                return;
            }
            selectedDay = day;
            renderSelection();
        });

        calendarGrid.appendChild(button);
    }
}

buildCalendar();

selectedDay = readSelectedDayFromStorage();
renderSelection();

clearBtn?.addEventListener('click', () => {
    selectedDay = null;
    renderSelection();
    notifyOpener(null);
});

saveBtn?.addEventListener('click', () => {
    if (!selectedDay) {
        setStatus('Izvēlies dienu pirms saglabāšanas.', true);
        return;
    }
    const ok = writeSelectedDayToStorage(selectedDay);
    const sent = notifyOpener(selectedDay);

    if (!ok && !sent) {
        setStatus('Neizdevās saglabāt (localStorage nav pieejams) un nevar nosūtīt uz galveno logu.', true);
        return;
    }

    if (!ok && sent) {
        setStatus(`Nosūtīts uz galveno logu: ${monthLabel} ${selectedDay}. Vari aizvērt šo logu.`, false);
        return;
    }

    setStatus(`Saglabāts: ${monthLabel} ${selectedDay}. Vari aizvērt šo logu.`, false);
});

