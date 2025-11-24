document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentDateDisplay = document.getElementById('currentDateDisplay');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');

    let currentDate = new Date();
    let medicationData = {};

    // Load data from localStorage
    function loadData() {
        const storedData = localStorage.getItem('medicationData');
        if (storedData) {
            medicationData = JSON.parse(storedData);
        }
    }

    // Save data to localStorage
    function saveData() {
        localStorage.setItem('medicationData', JSON.stringify(medicationData));
    }

    // Helper to format date as YYYY-MM-DD
    function formatDateKey(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // Render the calendar
    function renderCalendar() {
        calendarGrid.innerHTML = '';
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update header
        currentDateDisplay.textContent = `${year}年 ${month + 1}月`;

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);
        
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day-cell', 'empty');
            calendarGrid.appendChild(emptyCell);
        }

        // Create day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = formatDateKey(year, month, day);
            const dayData = medicationData[dateKey] || { morning: false, afternoon: false, evening: false };
            
            const cell = document.createElement('div');
            cell.classList.add('day-cell');
            
            // Highlight today
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                cell.classList.add('today');
            }

            // Date number
            const dateNum = document.createElement('div');
            dateNum.classList.add('date-number');
            dateNum.textContent = day;
            cell.appendChild(dateNum);

            // Pills Container
            const pillsContainer = document.createElement('div');
            pillsContainer.classList.add('pills-container');

            // Morning Pill
            const morningPill = createPill('morning', dayData.morning, dateKey);
            pillsContainer.appendChild(morningPill);

            // Afternoon Pill
            const afternoonPill = createPill('afternoon', dayData.afternoon, dateKey);
            pillsContainer.appendChild(afternoonPill);

            // Evening Pill
            const eveningPill = createPill('evening', dayData.evening, dateKey);
            pillsContainer.appendChild(eveningPill);

            cell.appendChild(pillsContainer);
            calendarGrid.appendChild(cell);
        }
    }

    function createPill(type, isActive, dateKey) {
        const pill = document.createElement('div');
        pill.classList.add('pill', `pill-${type}`);
        
        if (isActive) {
            pill.classList.add('active');
        } else {
            pill.classList.add('unselected');
        }

        pill.addEventListener('click', () => {
            togglePill(dateKey, type, pill);
        });

        return pill;
    }

    function togglePill(dateKey, type, pillElement) {
        // Initialize data for this date if it doesn't exist
        if (!medicationData[dateKey]) {
            medicationData[dateKey] = { morning: false, afternoon: false, evening: false };
        }

        // Toggle state
        medicationData[dateKey][type] = !medicationData[dateKey][type];
        
        // Update UI
        if (medicationData[dateKey][type]) {
            pillElement.classList.remove('unselected');
            pillElement.classList.add('active');
        } else {
            pillElement.classList.remove('active');
            pillElement.classList.add('unselected');
        }

        // Save
        saveData();
    }

    // Event Listeners for Navigation
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Initialize
    loadData();
    renderCalendar();
});
