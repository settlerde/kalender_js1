// Globale Variablen
let currentDisplayDate = new Date();
let holidays = []; 
const monthNamesDe = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];
const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// Berechnet den Tag der Umschulungs Beginn
function daysCount() {
    const today = new Date();
    const startYear = new Date(today.getFullYear(), 1, 6); 
    const diffMs = today - startYear;
    const oneDayMs = 1000 * 60 * 60 * 24;
    return Math.floor(diffMs / oneDayMs) + 1;
}

const tagElement = document.getElementById('tagDesJahres');
if (tagElement) tagElement.innerHTML = daysCount();

// Render / Zeichnet das Kalender-Grid
function render() {
    const year = currentDisplayDate.getFullYear();
    const month = currentDisplayDate.getMonth();
    const calendarGrid = document.getElementById('calendarGrid');
    
    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';
    document.getElementById('aktuel-monat').innerText = `${monthNamesDe[month]} ${year}`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayIndex = new Date(year, month, 1).getDay();
    let dayOffsetCount = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

    // Wochentage Header
    weekDays.forEach(d => {
        const dayName = document.createElement('div');
        dayName.classList.add('dayCells', 'header');
        dayName.innerText = d;
        calendarGrid.appendChild(dayName);
    });

    // Leere Zellen
    for (let e = 0; e < dayOffsetCount; e++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('dayCells', 'empty');
        calendarGrid.appendChild(emptyCell);
    }

    // Tage generieren
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('dayCells');
        dayDiv.innerText = i;

    dayDiv.onclick = () => {
    // was 'onclick' passiert
    document.querySelectorAll('.dayCells').forEach(cell => cell.classList.remove('selected-day'));
    dayDiv.classList.add('selected-day');

    // datum speichert
    currentSelectedDay = i;
    const currentMonth = currentDisplayDate.getMonth() + 1;
    // '0' zu datum hinfügt
    const formattedDate = `${i < 10 ? '0' + i : i}.${currentMonth < 10 ? '0' + currentMonth + '.' : currentMonth}`;

    const displayElement = document.getElementById('selected-date-display');
    if (displayElement) {
        displayElement.innerText = `${formattedDate}`;
    }
    // ändert titel
    document.title = `Kalenderblatt vom | ${formattedDate}${currentDisplayDate.getFullYear()}`;

    showDayEvent(i, currentMonth);
};

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const holiday = holidays.find(h => h.date === dateStr);

        if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            dayDiv.classList.add('current-day');
        }
        
        if (holiday) {
            dayDiv.classList.add('holiday');
            dayDiv.title = holiday.localName;
        }
        calendarGrid.appendChild(dayDiv);
    }
}

// Aktualisierung anzeigen
async function updateCalendarView() {
    render(); 
    try {
        await Promise.all([
            loadHolidays(currentDisplayDate.getFullYear()),
            showDayEvent()
        ]);
    } catch (e) {
        console.error("Fehler:", e);
    }
}

document.getElementById('nextMonth').addEventListener('click', (e) => {
    e.preventDefault();
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
    updateCalendarView();
});

document.getElementById('prevMonth').addEventListener('click', (e) => {
    e.preventDefault();
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
    updateCalendarView();
});

document.addEventListener('DOMContentLoaded', () => {
    updateCalendarView();
});