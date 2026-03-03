// global variable
let currentDisplayDate = new Date();
const year = currentDisplayDate.getFullYear();
const month = currentDisplayDate.getMonth();
const daysInMonth = new Date(year, month + 1, 0).getDate();
const dayNummber = new Date(year, month, 1).getDay()
console.log(dayNummber)
console.log(daysInMonth)

// months and week days arrays
const monthNamesDe = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
]
const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]

function calenderHeader() {
    let monatJahr = `${monthNamesDe[month]} ${year}`;
    document.getElementById('aktuel-monat').innerHTML = monatJahr;
}
calenderHeader()

function calendar() {
    for (let d of weekDays) {
        const dayNameCells = document.getElementById('calendarGrid');
        const dayNames = document.createElement('div');
        dayNames.classList.add('dayCells')
        dayNames.innerText = d;
        dayNameCells.appendChild(dayNames);
    }

    for (e = 6; e > dayNummber; e--) {
        const emptyCells = document.getElementById('calendarGrid');
        const dayOffset = document.createElement('div');
        dayOffset.classList.add('dayCells');
        emptyCells.appendChild(dayOffset);
    }

    for (i = 1; i <= daysInMonth; i++) {
        const calendarGrid = document.getElementById('calendarGrid');
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('dayCells')
        dayDiv.innerText = i;
        calendarGrid.appendChild(dayDiv);
    }
}
calendar()
