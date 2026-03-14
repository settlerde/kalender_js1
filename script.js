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

// Lädt Feiertage aus der API
async function loadHolidays(year) {
    try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/DE`);
        holidays = await res.json();
        
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const currentHoliday = holidays.find(h => h.date === todayStr);
        const banner = document.getElementById('holiday-banner');

        if (banner) {
            const stilleTage = ["Karfreitag", "Allerheiligen", "Volkstrauertag", "Totensonntag"];
            if (currentHoliday) {
                let msg = `🎉 HEUTE: ${currentHoliday.localName}`;
                if (stilleTage.some(t => currentHoliday.name.includes(t))) msg += " 🤫 (Stiller Tag)";
                banner.innerHTML = `<div class="marquee">${msg}</div>`;
                banner.className = 'active-holiday';
            } else {
                banner.innerHTML = `<div class="marquee">📡 STATUS: Heute gibt es keine Feiertage.</div>`;
                banner.className = 'no-holiday';
            }

            banner.style.display = 'block';
            banner.style.opacity = '1';
            setTimeout(() => {
                banner.style.opacity = '0';
                setTimeout(() => { banner.style.display = 'none'; }, 1000);
            }, 10000);
        }
        render(); 
    } catch (err) {
        console.error("API Fehler", err);
        render();
    }
}

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

        // КЛИК НА ДЕНЬ
        dayDiv.onclick = () => {
    // 1. Выделение ячейки
    document.querySelectorAll('.dayCells').forEach(cell => cell.classList.remove('selected-day'));
    dayDiv.classList.add('selected-day');

    // 2. Запоминаем данные
    currentSelectedDay = i;
    const currentMonth = currentDisplayDate.getMonth() + 1;
    const currentYear = currentDisplayDate.getFullYear();

    // 3. Меняем заголовок в сайдбаре
    document.getElementById('selectedDateTitle').innerText = `Notiz: ${i}. ${monthNamesDe[currentMonth-1]}`;

    // 4. Грузим историю
    showDayEvent(i, currentMonth);

    // 5. Грузим заметку
    const key = `note-${currentYear}-${currentMonth}-${i}`;
    document.getElementById('dayNote').value = localStorage.getItem(key) || "";
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

// Lädt historische Ereignisse von Wikipedia
async function showDayEvent(day, month) {
    // Если параметры не переданы, берем 1-е число или текущий день
    if (!day || !month) {
        day = (currentDisplayDate.getMonth() === new Date().getMonth()) ? new Date().getDate() : 1;
        month = currentDisplayDate.getMonth() + 1;
    }

    const url = `https://de.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
    const el = document.getElementById('ereignisse'); 
    
    if (!el) return;
    el.innerHTML = "Lade Ereignisse..."; 

    try {
        const res = await fetch(url);
        const data = await res.json();

        let filtered = data.events.filter(ev => ev.selected);
        if (filtered.length === 0) filtered = data.events;

        const topEvents = filtered
            .sort(() => Math.random() - 0.5)
            .slice(0, 5)
            .sort((a, b) => a.year - b.year);
        
        el.innerHTML = topEvents
            .map(ev => `
                <div class="event-item" style="margin-bottom: 1rem; border-left: 0.1rem solid #f00797; padding-left: 1rem;">
                    <b style="color: #f00797;">${ev.year}</b>: ${ev.text}
                </div>
            `).join('');
            
    } catch (err) {
        el.innerText = "Keine Daten gefunden.";
    }
}

// Обновление вида
async function updateCalendarView() {
    render(); 
    try {
        await Promise.all([
            loadHolidays(currentDisplayDate.getFullYear()),
            showDayEvent() // Вызов без параметров загрузит 1-е число месяца
        ]);
    } catch (e) {
        console.error("Fehler:", e);
    }
}

// Слушатели кнопок
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

// Старт
document.addEventListener('DOMContentLoaded', () => {
    updateCalendarView();
});