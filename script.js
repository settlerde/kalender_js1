// global let variable and arrays
let currentDisplayDate = new Date();

const monthNamesDe = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];
const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

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

// start function
render();