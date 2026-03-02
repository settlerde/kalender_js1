// global variable
let currentDisplayDate = new Date(); 
// months array
const monthNamesDe = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
];
// main calendar function
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthHeader = document.getElementById('aktuel-monat');

    // Берем данные из нашей переменной
    const year = currentDisplayDate.getFullYear();
    const month = currentDisplayDate.getMonth();

    // Обновляем текст заголовка
    monthHeader.innerText = `${monthNamesDe[month]} ${year}`;

    // ПОЛНАЯ ОЧИСТКА СЕТКИ
    grid.innerHTML = '';

    // ШАГ А: Рисуем заголовки дней недели заново
    const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    weekDays.forEach(day => {
        const dayDiv = document.createElement('div');
        // Если это Сб или Вс - даем твой красный класс из CSS
        if (day === "Sa" || day === "So") {
            dayDiv.classList.add('weekend-header');
        } else {
            // Для остальных можно создать класс .weekday-header или оставить пустым
            dayDiv.classList.add('weekday-header'); 
        }
        dayDiv.innerText = day;
        grid.appendChild(dayDiv);
        }
    )

    // ШАГ Б: Логика отступа (Offset)
    const firstDayIndex = new Date(year, month, 1).getDay();
    const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    for (let i = 0; i < offset; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('emptyCells'); // Твой стиль из CSS
        grid.appendChild(emptyDiv);
    }

    // ШАГ В: Рисуем числа
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date'); // Твой голубой квадрат из CSS
        dateDiv.innerText = d;
        grid.appendChild(dateDiv);
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
