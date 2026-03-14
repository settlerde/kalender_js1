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
document.getElementById('tagDesJahres').innerHTML = daysCount();

// Lädt Feiertage aus der API
async function loadHolidays(year) {
    try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/DE`);
        const allGermanHolidays = await res.json();
        console.log(allGermanHolidays);
        // Filter für Hessen und Ostersonntag
        holidays = allGermanHolidays/*.filter(h => //callback variable 'h'
            h.counties === null || // Ein nationaler Feiertag
            h.counties.includes("DE-HE") || // -Landkreise – Erstellt von den API-Autoren (Name des Felds in den Daten)
            h.name === "Ostersonntag" || h.counties.includes("DE-BB")// manuell hinzugefügt
        );*/

        // Prüft, ob heute ein Feiertag ist
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const currentHoliday = holidays.find(h => h.date === todayStr);
        const banner = document.getElementById('holiday-banner');

        // Liste der stillen Tage
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

        /// Banner nach 10 Sek. ausblenden
        banner.style.display = 'block';
        banner.style.opacity = '1';
        setTimeout(() => {
            banner.style.opacity = '0';
            setTimeout(() => { banner.style.display = 'none'; }, 1000);
        }, 10000);

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

    // Leere Zellen vor dem ersten Tag
    for (let e = 0; e < dayOffsetCount; e++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('dayCells', 'empty');
        calendarGrid.appendChild(emptyCell);
    }

    // Tage generieren
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('dayCells');
        dayDiv.innerText = i;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const holiday = holidays.find(h => h.date === dateStr);

        // Heute markieren
        if (i === currentDisplayDate.getDate() && month === currentDisplayDate.getMonth() && year === currentDisplayDate.getFullYear()) {
            dayDiv.classList.add('current-day');
        }
        // Feiertag markieren
        if (holiday) {
            dayDiv.classList.add('holiday');
            dayDiv.title = holiday.localName;
        }
        calendarGrid.appendChild(dayDiv);
    }
}

// Lädt historische Ereignisse von Wikipedia
async function showDayEvent() {
    const month = currentDisplayDate.getMonth() + 1;
    const day = (currentDisplayDate.getMonth() === new Date().getMonth()) ? new Date().getDate() : 1;
    
    const url = `https://de.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
    const el = document.getElementById('ereignisse'); 
    
    try {
        const res = await fetch(url);
        const data = await res.json();

        // Wichtige herausfiltern
        let filtered = data.events.filter(ev => ev.selected);

        // Wenn nicht, nehmen alles
        if (filtered.length === 0) {
            filtered = data.events;
        }

        const topEvents = filtered
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);
                
        el.innerHTML = topEvents
            .map(ev => `<div class="event-item"><b>${ev.year}</b>: ${ev.text}</div>`)
            .join('<br>');
            
    } catch (err) {
        if (el) el.innerText = "Ladefehler";
    }
}

// Event-Listener für Buttons
document.getElementById('nextMonth').onclick = (event) => {
    event.preventDefault(); // Neustart wird abgebrochen.
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
    loadHolidays(currentDisplayDate.getFullYear());
    showDayEvent();
};

document.getElementById('prevMonth').onclick = (event) => {
    event.preventDefault(); // Neustart wird abgebrochen.
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
    loadHolidays(currentDisplayDate.getFullYear());
    showDayEvent();
};

// Start der Anwendung
loadHolidays(currentDisplayDate.getFullYear());
showDayEvent();