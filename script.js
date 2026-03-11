// global var
let currentDisplayDate = new Date();
let holidays = []; // all holidays are hier

const monthNamesDe = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];
const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// year count
function daysCount() {
    const today = new Date();
    const startYear = new Date(today.getFullYear(), 1, 6); // beginn seit 02.06.2026
    const diffMs = today - startYear;
    const oneDayMs = 1000 * 60 * 60 * 24;
    return Math.floor(diffMs / oneDayMs) + 1;
}
document.getElementById('tagDesJahres').innerHTML = daysCount();

async function loadHolidays(year) {
    try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/DE`);
        const allGermanHolidays = await res.json();
        
        holidays = allGermanHolidays.filter(h => 
            h.counties === null || h.counties.includes('DE-HE')
        );

        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        const currentHoliday = holidays.find(h => h.date === todayStr);
        const banner = document.getElementById('holiday-banner');

        if (currentHoliday) {
            banner.innerHTML = `<div class="marquee">🎉 HEUTE: ${currentHoliday.localName}</div>`;
            banner.className = 'active-holiday';
        } else {
            banner.innerHTML = `<div class="marquee">📡 STATUS: Heute gibt es keine Feiertage.</div>`;
            banner.className = 'no-holiday';
        }
        banner.style.display = 'block';
        // disapier in 10 sec
        setTimeout(() => {
            banner.style.opacity = '0';
            setTimeout(() => {
                banner.style.display = 'none';
            }, 3000); // wait for end
        }, 10000); // 10000 ms = 10 sec
        render(); 
    } catch (err) {
        console.error("Ошибка API", err);
        render();
    }
}
// rendering main function
function render() {
    const year = currentDisplayDate.getFullYear();
    const month = currentDisplayDate.getMonth();
    const calendarGrid = document.getElementById('calendarGrid');
    
    calendarGrid.innerHTML = '';
    document.getElementById('aktuel-monat').innerText = `${monthNamesDe[month]} ${year}`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayIndex = new Date(year, month, 1).getDay();
    let dayOffsetCount = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;
    // week days
    for (let d of weekDays) {
        const dayName = document.createElement('div');
        dayName.classList.add('dayCells', 'header');
        dayName.innerText = d;
        calendarGrid.appendChild(dayName);
    }
    // empty cells (Offset)
    for (let e = 0; e < dayOffsetCount; e++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('dayCells', 'empty');
        calendarGrid.appendChild(emptyCell);
    }
    // days rendering
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('dayCells');
        dayDiv.innerText = i;
        // check date for holidays
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const holiday = holidays.find(h => h.date === dateStr);
        // marking today
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('current-day');
        }
        // marking holiday
        if (holiday) {
            dayDiv.classList.add('holiday');
            dayDiv.title = holiday.localName; // says what a holiday
        }
        calendarGrid.appendChild(dayDiv);
    }
}
// set wiki API
async function showDayEvent() {
    const month = currentDisplayDate.getMonth() + 1;
    const day = (currentDisplayDate.getMonth() === new Date().getMonth()) ? new Date().getDate() : 1;
    
    const url = `https://de.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
    const el = document.getElementById('ereignisse'); 
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        const topEvents = data.events.slice(0, 5);
        
        el.innerHTML = topEvents
            .map(ev => `<div class="event-item"><b>${ev.year}</b>: ${ev.text}</div>`)
            .join('<br><br>');
    } catch (err) {
        if (el) el.innerText = "Ladefehler";
    }
    async function loadHolidays(year) {
    try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/DE`);
        const allGermanHolidays = await res.json();
        
        holidays = allGermanHolidays.filter(h => 
            h.counties === null || h.counties.includes('DE-HE')
        );

        // check if today is holiday
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        const currentHoliday = holidays.find(h => h.date === todayStr);
        const banner = document.getElementById('holiday-banner');

        if (currentHoliday) {
            banner.innerHTML = `🎉 Heute ist Feiertag: <span>${currentHoliday.localName}</span>`;
            banner.style.display = 'block';
        } else {
            banner.style.display = 'Heute ist kein Feiertag.'; // Скрываем, если праздника нет
        }

        render(); 
    } catch (err) {
        console.error("Fehler API", err);
        render();
    }
    }
}
// btn listener
document.getElementById('prevMonth').onclick = () => {
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
    // holidays of another year
    loadHolidays(currentDisplayDate.getFullYear());
    showDayEvent();
};

document.getElementById('nextMonth').onclick = () => {
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
    loadHolidays(currentDisplayDate.getFullYear());
    showDayEvent();
};

loadHolidays(currentDisplayDate.getFullYear());
showDayEvent();

/*async function getHistorischeEreignisse() {
    let result; 
    try {
        const response = await fetch("https://history.muffinlabs.com/date/2/14");
        const data = await response.json();
        result = data.data.Events;
        console.log(result);
        return result;
    } catch (error) { 
        console.error(error);
    }
}

async function renderHistorischeErignisse() {
    let historischeErignisse = document.getElementById("ereignisse");
    console.log(historischeErignisse);
    let events = await getHistorischeEreignisse();
        for (let i = 0; i < events.length; i++){
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('eventDiv');
            eventDiv.innerText = events[i].year + ": " + events[i].text;
            historischeErignisse.appendChild(eventDiv);
            if (i==5){
                break;
            }
        }
}*/

// start function
render();
//renderHistorischeErignisse();