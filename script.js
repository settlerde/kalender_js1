// global let variable and arrays
let currentDisplayDate = new Date();

const monthNamesDe = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];
const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

//dies wird tage berechnen seit jahresbeginn
function daysCount() {
    const startYear = new Date(currentDisplayDate.getFullYear(), 1, 6);
    const diffMs = currentDisplayDate - startYear;
    const oneDayMs = 1000 * 60 * 60 * 24;
    const dayNumber = Math.floor(diffMs / oneDayMs) + 1;
    return dayNumber;
}
document.getElementById('tagDesJahres').innerHTML = daysCount();

function render() {
    const year = currentDisplayDate.getFullYear();
    const month = currentDisplayDate.getMonth();
    const calendarGrid = document.getElementById('calendarGrid');
    
    // clear calendar html while clicking prev/next btn
    calendarGrid.innerHTML = '';
    document.getElementById('aktuel-monat').innerText = `${monthNamesDe[month]} ${year}`;

    // set propper month insteed index
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayIndex = new Date(year, month, 1).getDay();
    // setting offset
    let dayOffsetCount = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

    // rendering weekdays
    for (let d of weekDays) {
        const dayName = document.createElement('div');
        dayName.classList.add('dayCells', 'header');
        dayName.innerText = d;
        calendarGrid.appendChild(dayName);
    }

    // rendering empty cells for offset
    for (let e = 0; e < dayOffsetCount; e++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('dayCells', 'empty');
        calendarGrid.appendChild(emptyCell);
    }

    // rendering number of days in current month
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('dayCells');
        dayDiv.innerText = i;

        // geting current day to highlight it
        if (i === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear()) {
            dayDiv.classList.add('current-day');
        }

        calendarGrid.appendChild(dayDiv); // storing all this staff in its plays in grid
    }

async function showDayEvent() {
    const today = new Date();
    const url = `https://de.wikipedia.org/api/rest_v1/feed/onthisday/events/${today.getMonth() + 1}/${today.getDate()}`;
    
    // fionde Element zum Aufzeichen
    const el = document.getElementById('ereignisse'); 
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        // nehme 3 Ereignisse
        const topEvents = data.events.slice(0, 5);
        
        // Ergebnis schreiben in innerHTML (damit tags html functionieren <br>)
        el.innerHTML = topEvents
            .map(ev => `${ev.year}: ${ev.text}`)
            .join('<br><br>');
            
    } 
    catch (err) {
        // wenn nicht geladen wird
        if (el) el.innerText = "Ladefehler";
    }
}

// Запуск
showDayEvent();
}

// button listeners
document.getElementById('prevMonth').onclick = () => {
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
    render();
};

document.getElementById('nextMonth').onclick = () => {
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
    render();
};

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