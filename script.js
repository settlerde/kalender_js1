// global variable
let currentDisplayDate = new Date();
const month = currentDisplayDate.getMonth();
const year = currentDisplayDate.getFullYear();
const daysInMonth = new Date(year, month + 1, 0).getDate();
console.log(daysInMonth);

// months and week days arrays
const monthNamesDe = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];
const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function calenderHeader() {
    let monatJahr = `${monthNamesDe[month]} ${year}`;
    document.getElementById('aktuel-monat').innerHTML = monatJahr;
}
calenderHeader();

function calendar() {
    for (i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-days')
        dayDiv.appendChild()
    }
}
calendar();

/*function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthHeader = document.getElementById('aktuel-monat');

    // ШАГ Б: Логика отступа (Offset)
    const firstDayIndex = new Date(year, month, 1).getDay();
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    for (let i = 0; i < offset; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('emptyCells'); // Твой стиль из CSS
        grid.appendChild(emptyDiv);
    }

    // ШАГ В: Рисуем числа
    for (let d = 1; d <= daysInMonth; d++) {
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date'); // Твой голубой квадрат из CSS
        dateDiv.innerText = d;
        grid.appendChild(dateDiv);
    }
    if (d === currentDisplayDate.getDay()) {
        dayDiv.classList.add('current-day');
    }
}

// start
renderCalendar();

// Находим кнопки в HTML
const prevBtn = document.getElementById('rückwerts-btn');
const nextBtn = document.getElementById('vorwärts-btn');

// Кнопка НАЗАД
prevBtn.addEventListener('click', () => {
    // Уменьшаем месяц на 1
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
    // Перерисовываем календарь
    renderCalendar();
    }
)

// Кнопка ВПЕРЕД
nextBtn.addEventListener('click', () => {
    // Увеличиваем месяц на 1
    currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
    // Перерисовываем календарь
    renderCalendar();
    }
)
*/
