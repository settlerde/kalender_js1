// current date
let currentDisplayDate = new Date();
const year = currentDisplayDate.getFullYear();
const month = currentDisplayDate.getMonth();

// days in current month
const daysInMonth = new Date(year, month + 1, 0).getDate();

// set first weekday (0 - So, 1 - Mo, ..., 6 - Sa)
let firstDayIndex = new Date(year, month, 1).getDay();
let dayOffsetCount = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

const monthNamesDe = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];
const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// calendar header
function calenderHeader() {
    const headerElement = document.getElementById('aktuel-monat');
    if (headerElement) {
        headerElement.innerHTML = `${monthNamesDe[month]} ${year}`;
    }
}

// render function
function calendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return; // proof of code

    // render weekdays
    for (let d of weekDays) {
        const dayNameCell = document.createElement('div');
        dayNameCell.classList.add('dayCells', 'font-weight-bold'); // Можно добавить стиль для шапки
        dayNameCell.innerText = d;
        calendarGrid.appendChild(dayNameCell);
    }

    // render offset - shift
    for (let e = 0; e < dayOffsetCount; e++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('dayCells', 'empty');
        calendarGrid.appendChild(emptyCell);
    }

    // render of calendar days
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('dayCells');
        dayDiv.innerText = i;
        calendarGrid.appendChild(dayDiv);
    }
}

// start functions
calenderHeader();
calendar();