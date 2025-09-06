/**
 * Mobile TimeTap - Mobile-optimized JavaScript functionality
 */

class MobileTimeTapApp {
    constructor() {
        this.currentEmployee = null;
        this.clockInterval = null;
        this.notificationTimeout = null;
        this.currentTheme = 'auto';
        this.currentTab = 'clock';
        
        this.initializeApp();
        this.initializeTheme();
        this.bindEvents();
        this.startClock();
        this.loadEmployees();
        this.updateDashboard();
        this.initializeCalculator();
        this.initializeCalendar();
        this.initializeMessaging();
    }

    /**
     * Initialize the application
     */
    initializeApp() {
        this.elements = {
            // Clock elements
            digitalClock: document.getElementById('digitalClock'),
            clockDate: document.getElementById('clockDate'),
            currentTime: document.getElementById('currentTime'),
            currentDate: document.getElementById('currentDate'),
            employeeSelect: document.getElementById('employeeSelect'),
            clockInBtn: document.getElementById('clockInBtn'),
            clockOutBtn: document.getElementById('clockOutBtn'),
            statusIndicator: document.getElementById('statusIndicator'),
            addEmployeeBtn: document.getElementById('addEmployeeBtn'),
            onlineCount: document.getElementById('onlineCount'),
            employeePreview: document.getElementById('employeePreview'),

            // Navigation
            navTabs: document.querySelectorAll('.nav-tab'),
            tabContents: document.querySelectorAll('.tab-content'),

            // Team elements
            employeeGrid: document.getElementById('employeeGrid'),
            totalEmployees: document.getElementById('totalEmployees'),
            workingNow: document.getElementById('workingNow'),
            refreshTeam: document.getElementById('refreshTeam'),

            // Calendar elements
            calendarGrid: document.getElementById('calendarGrid'),
            currentMonthYear: document.getElementById('currentMonthYear'),
            prevMonth: document.getElementById('prevMonth'),
            nextMonth: document.getElementById('nextMonth'),
            calendarSidebar: document.getElementById('calendarSidebar'),
            selectedDateTitle: document.getElementById('selectedDateTitle'),
            dateEmployees: document.getElementById('dateEmployees'),

            // Messaging elements
            messagesDisplay: document.getElementById('messagesDisplay'),
            messageInput: document.getElementById('messageInput'),
            sendMessageBtn: document.getElementById('sendMessageBtn'),
            refreshMessages: document.getElementById('refreshMessages'),
            messageCount: document.getElementById('messageCount'),
            priorityMessage: document.getElementById('priorityMessage'),

            // Tools elements
            calculatorTool: document.getElementById('calculatorTool'),
            exportTool: document.getElementById('exportTool'),
            settingsTool: document.getElementById('settingsTool'),

            // Calculator elements
            calculatorDisplay: document.getElementById('calculatorDisplay'),
            calculatorModal: document.getElementById('calculatorModal'),
            closeCalculatorBtn: document.getElementById('closeCalculatorBtn'),

            // Modal elements
            addEmployeeModal: document.getElementById('addEmployeeModal'),
            employeeName: document.getElementById('employeeName'),
            employeeId: document.getElementById('employeeId'),
            saveEmployeeBtn: document.getElementById('saveEmployeeBtn'),
            cancelBtn: document.getElementById('cancelBtn'),
            closeModalBtn: document.getElementById('closeModalBtn'),

            // Theme toggle
            themeToggle: document.getElementById('themeToggle'),
            themeToggleThumb: document.getElementById('themeToggleThumb'),

            // Notification
            notification: document.getElementById('notification')
        };

        this.calendar = {
            currentDate: new Date(),
            selectedDate: null
        };

        this.calculator = {
            display: '0',
            previousValue: null,
            operation: null,
            waitingForOperand: false
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Navigation tabs
        this.elements.navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchTab(tab.dataset.tab);
            });
        });

        // Employee selection
        this.elements.employeeSelect.addEventListener('change', (e) => {
            this.selectEmployee(e.target.value);
        });

        // Clock buttons
        this.elements.clockInBtn.addEventListener('click', () => {
            this.clockIn();
        });

        this.elements.clockOutBtn.addEventListener('click', () => {
            this.clockOut();
        });

        // Add employee modal
        this.elements.addEmployeeBtn.addEventListener('click', () => {
            this.showAddEmployeeModal();
        });

        this.elements.saveEmployeeBtn.addEventListener('click', () => {
            this.saveNewEmployee();
        });

        this.elements.cancelBtn.addEventListener('click', () => {
            this.hideAddEmployeeModal();
        });

        this.elements.closeModalBtn.addEventListener('click', () => {
            this.hideAddEmployeeModal();
        });

        // Calendar navigation
        this.elements.prevMonth.addEventListener('click', () => {
            this.navigateMonth(-1);
        });

        this.elements.nextMonth.addEventListener('click', () => {
            this.navigateMonth(1);
        });

        // Messaging
        this.elements.sendMessageBtn.addEventListener('click', () => {
            this.sendMessage();
        });

        this.elements.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.elements.refreshMessages.addEventListener('click', () => {
            this.loadMessages();
        });

        // Tools
        this.elements.calculatorTool.addEventListener('click', () => {
            this.showCalculator();
        });

        this.elements.exportTool.addEventListener('click', () => {
            this.exportData();
        });

        this.elements.settingsTool.addEventListener('click', () => {
            this.showSettings();
        });

        // Calculator
        this.elements.closeCalculatorBtn.addEventListener('click', () => {
            this.hideCalculator();
        });

        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => {
            this.cycleTheme();
        });

        // Modal outside click
        this.elements.addEmployeeModal.addEventListener('click', (e) => {
            if (e.target === this.elements.addEmployeeModal) {
                this.hideAddEmployeeModal();
            }
        });

        this.elements.calculatorModal.addEventListener('click', (e) => {
            if (e.target === this.elements.calculatorModal) {
                this.hideCalculator();
            }
        });

        // Touch events for mobile
        this.initializeTouchEvents();
    }

    /**
     * Initialize touch events for mobile
     */
    initializeTouchEvents() {
        // Swipe navigation for tabs
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Horizontal swipe (minimum 50px)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - next tab
                    this.swipeToNextTab();
                } else {
                    // Swipe right - previous tab
                    this.swipeToPreviousTab();
                }
            }
        });

        // Long press for context menu
        let longPressTimer;
        let longPressTarget;

        document.addEventListener('touchstart', (e) => {
            longPressTarget = e.target;
            longPressTimer = setTimeout(() => {
                this.handleLongPress(e.target, e);
            }, 500);
        });

        document.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        });

        document.addEventListener('touchmove', () => {
            clearTimeout(longPressTimer);
        });
    }

    /**
     * Handle long press events
     */
    handleLongPress(target, event) {
        if (target.classList.contains('employee-card')) {
            this.showEmployeeContextMenu(target, event);
        } else if (target.classList.contains('message-item')) {
            this.showMessageContextMenu(target, event);
        }
    }

    /**
     * Show employee context menu
     */
    showEmployeeContextMenu(card, event) {
        const employeeId = card.dataset.employeeId;
        const employee = window.dataManager.getEmployee(employeeId);
        
        if (confirm(`Actions for ${employee.name}:\n\n1. View Details\n2. Edit\n3. Delete\n\nChoose an option (1-3):`)) {
            // Handle context menu selection
            this.showNotification('Context menu feature coming soon!', 'info');
        }
    }

    /**
     * Show message context menu
     */
    showMessageContextMenu(messageItem, event) {
        const messageId = messageItem.dataset.messageId;
        
        if (confirm('Message Actions:\n\n1. Copy\n2. Reply\n3. Delete\n\nChoose an option (1-3):')) {
            // Handle context menu selection
            this.showNotification('Context menu feature coming soon!', 'info');
        }
    }

    /**
     * Switch between tabs
     */
    switchTab(tabName) {
        // Update active tab
        this.elements.navTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });

        // Update active content
        this.elements.tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            }
        });

        this.currentTab = tabName;

        // Load tab-specific content
        switch (tabName) {
            case 'team':
                this.updateDashboard();
                break;
            case 'calendar':
                this.renderCalendar();
                break;
            case 'chat':
                this.loadMessages();
                break;
            case 'tools':
                this.updateTools();
                break;
        }

        // Add haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    /**
     * Swipe to next tab
     */
    swipeToNextTab() {
        const tabs = ['clock', 'team', 'calendar', 'chat', 'tools'];
        const currentIndex = tabs.indexOf(this.currentTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        this.switchTab(tabs[nextIndex]);
    }

    /**
     * Swipe to previous tab
     */
    swipeToPreviousTab() {
        const tabs = ['clock', 'team', 'calendar', 'chat', 'tools'];
        const currentIndex = tabs.indexOf(this.currentTab);
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        this.switchTab(tabs[prevIndex]);
    }

    /**
     * Initialize theme system
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem('timeTap_theme') || 'auto';
        this.currentTheme = savedTheme;
        this.applyTheme();
        this.updateThemeToggle();
    }

    /**
     * Cycle through themes
     */
    cycleTheme() {
        const themes = ['auto', 'light', 'dark'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.currentTheme = themes[nextIndex];
        
        this.applyTheme();
        this.updateThemeToggle();
        this.saveThemePreference();
        
        this.showNotification(`Theme: ${this.currentTheme}`, 'info');
    }

    /**
     * Apply the current theme
     */
    applyTheme() {
        const body = document.body;
        
        if (this.currentTheme === 'auto') {
            const hour = new Date().getHours();
            const isDayTime = hour >= 6 && hour < 18;
            
            if (isDayTime) {
                body.setAttribute('data-theme', 'light');
            } else {
                body.removeAttribute('data-theme');
            }
        } else {
            if (this.currentTheme === 'light') {
                body.setAttribute('data-theme', 'light');
            } else {
                body.removeAttribute('data-theme');
            }
        }
    }

    /**
     * Update theme toggle appearance
     */
    updateThemeToggle() {
        const toggle = this.elements.themeToggle;
        toggle.setAttribute('data-theme', this.currentTheme);
    }

    /**
     * Save theme preference
     */
    saveThemePreference() {
        localStorage.setItem('timeTap_theme', this.currentTheme);
    }

    /**
     * Start the clock
     */
    startClock() {
        this.updateClock();
        this.clockInterval = setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    /**
     * Update clock display
     */
    updateClock() {
        const now = new Date();
        
        // Update digital clock
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        this.elements.digitalClock.textContent = timeString;
        
        // Update date
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        this.elements.clockDate.textContent = dateString;
        
        // Update header time
        const headerTimeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        this.elements.currentTime.textContent = headerTimeString;
        
        // Update header date
        const headerDateString = now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        this.elements.currentDate.textContent = headerDateString;
        
        // Check auto theme every minute
        if (now.getSeconds() === 0) {
            this.checkAutoTheme();
        }
    }

    /**
     * Check auto theme
     */
    checkAutoTheme() {
        if (this.currentTheme === 'auto') {
            this.applyTheme();
        }
    }

    /**
     * Load employees
     */
    loadEmployees() {
        const employees = window.dataManager.getEmployees();
        
        // Populate dropdown
        this.elements.employeeSelect.innerHTML = '<option value="">Choose your profile...</option>';
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = employee.name;
            this.elements.employeeSelect.appendChild(option);
        });

        // Update online count
        this.updateOnlineCount();
        
        // Update messaging UI
        this.updateMessagingUI();
    }

    /**
     * Select an employee
     */
    selectEmployee(employeeId) {
        if (!employeeId) {
            this.currentEmployee = null;
            this.updateClockButtons();
            this.updateStatusIndicator();
            this.updateEmployeePreview(null);
            this.updateMessagingUI();
            return;
        }
        
        this.currentEmployee = window.dataManager.getEmployee(employeeId);
        this.updateClockButtons();
        this.updateStatusIndicator();
        this.updateEmployeePreview(this.currentEmployee);
        this.updateMessagingUI();
    }

    /**
     * Update clock button states
     */
    updateClockButtons() {
        if (!this.currentEmployee) {
            this.elements.clockInBtn.disabled = true;
            this.elements.clockOutBtn.disabled = true;
            return;
        }

        this.elements.clockInBtn.disabled = this.currentEmployee.isWorking;
        this.elements.clockOutBtn.disabled = !this.currentEmployee.isWorking;
    }

    /**
     * Update status indicator
     */
    updateStatusIndicator() {
        this.elements.statusIndicator.textContent = this.currentEmployee ? 
            `${this.currentEmployee.name} - ${this.currentEmployee.isWorking ? 'Currently Working' : 'Not Working'}` : 
            'Select your profile to begin';
    }

    /**
     * Update employee preview
     */
    updateEmployeePreview(employee) {
        const preview = this.elements.employeePreview;
        if (!preview) return;

        if (employee) {
            const previewName = preview.querySelector('.preview-name');
            const previewStatus = preview.querySelector('.preview-status');
            
            if (previewName) previewName.textContent = employee.name;
            if (previewStatus) {
                previewStatus.textContent = employee.isWorking ? 
                    'Currently Working' : 'Available';
            }
            
            preview.classList.add('visible');
        } else {
            preview.classList.remove('visible');
        }
    }

    /**
     * Update online count
     */
    updateOnlineCount() {
        const employees = window.dataManager.getEmployees();
        const onlineCount = employees.filter(emp => emp.isWorking).length;
        if (this.elements.onlineCount) {
            this.elements.onlineCount.textContent = onlineCount;
        }
    }

    /**
     * Update messaging UI
     */
    updateMessagingUI() {
        const canSendMessages = this.currentEmployee !== null;
        
        if (this.elements.messageInput) {
            this.elements.messageInput.disabled = !canSendMessages;
            this.elements.messageInput.placeholder = canSendMessages ? 
                'Type your message to the team...' : 
                'Select your profile to send messages';
        }
        
        if (this.elements.sendMessageBtn) {
            this.elements.sendMessageBtn.disabled = !canSendMessages;
        }
    }

    /**
     * Clock in
     */
    clockIn() {
        if (!this.currentEmployee) return;
        
        try {
            window.dataManager.clockIn(this.currentEmployee.id);
            this.currentEmployee.isWorking = true;
            this.updateClockButtons();
            this.updateStatusIndicator();
            this.updateEmployeePreview(this.currentEmployee);
            this.updateOnlineCount();
            this.updateDashboard();
            
            this.showNotification('Clocked in successfully!', 'success');
            
            // Add haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 50, 100]);
            }
        } catch (error) {
            this.showNotification('Failed to clock in', 'error');
        }
    }

    /**
     * Clock out
     */
    clockOut() {
        if (!this.currentEmployee) return;
        
        try {
            window.dataManager.clockOut(this.currentEmployee.id);
            this.currentEmployee.isWorking = false;
            this.updateClockButtons();
            this.updateStatusIndicator();
            this.updateEmployeePreview(this.currentEmployee);
            this.updateOnlineCount();
            this.updateDashboard();
            
            this.showNotification('Clocked out successfully!', 'success');
            
            // Add haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate([100, 50, 100]);
            }
        } catch (error) {
            this.showNotification('Failed to clock out', 'error');
        }
    }

    /**
     * Update dashboard
     */
    updateDashboard() {
        this.updateEmployeeGrid();
        this.updateTeamStats();
    }

    /**
     * Update employee grid
     */
    updateEmployeeGrid() {
        const employees = window.dataManager.getEmployees();
        const grid = this.elements.employeeGrid;
        
        if (!grid) return;
        
        grid.innerHTML = '';
        
        employees.forEach(employee => {
            const card = document.createElement('div');
            card.className = 'employee-card';
            card.dataset.employeeId = employee.id;
            
            card.innerHTML = `
                <div class="employee-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="employee-info">
                    <div class="employee-name">${employee.name}</div>
                    <div class="employee-id">ID: ${employee.id}</div>
                </div>
                <div class="employee-status ${employee.isWorking ? 'status-working' : 'status-available'}">
                    ${employee.isWorking ? 'Working' : 'Available'}
                </div>
            `;
            
            grid.appendChild(card);
        });
    }

    /**
     * Update team stats
     */
    updateTeamStats() {
        const employees = window.dataManager.getEmployees();
        const total = employees.length;
        const working = employees.filter(emp => emp.isWorking).length;
        
        if (this.elements.totalEmployees) {
            this.elements.totalEmployees.textContent = total;
        }
        
        if (this.elements.workingNow) {
            this.elements.workingNow.textContent = working;
        }
    }

    /**
     * Initialize calculator
     */
    initializeCalculator() {
        // Calculator button event listeners will be added when calculator is shown
    }

    /**
     * Show calculator
     */
    showCalculator() {
        this.elements.calculatorModal.classList.add('active');
        this.bindCalculatorEvents();
    }

    /**
     * Hide calculator
     */
    hideCalculator() {
        this.elements.calculatorModal.classList.remove('active');
    }

    /**
     * Bind calculator events
     */
    bindCalculatorEvents() {
        const buttons = document.querySelectorAll('.calc-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = button.dataset.action;
                const number = button.dataset.number;
                const operation = button.dataset.operation;
                
                if (action) {
                    this.handleCalculatorAction(action);
                } else if (number) {
                    this.inputNumber(number);
                } else if (operation) {
                    this.inputOperation(operation);
                }
            });
        });
    }

    /**
     * Handle calculator actions
     */
    handleCalculatorAction(action) {
        switch (action) {
            case 'clear':
                this.clearCalculator();
                break;
            case 'clearEntry':
                this.clearEntry();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'decimal':
                this.inputDecimal();
                break;
            case 'equals':
                this.performCalculation();
                break;
        }
    }

    /**
     * Input number to calculator
     */
    inputNumber(number) {
        if (this.calculator.waitingForOperand) {
            this.calculator.display = number;
            this.calculator.waitingForOperand = false;
        } else {
            this.calculator.display = this.calculator.display === '0' ? number : this.calculator.display + number;
        }
        this.updateCalculatorDisplay();
    }

    /**
     * Input operation to calculator
     */
    inputOperation(operation) {
        const inputValue = parseFloat(this.calculator.display);
        
        if (this.calculator.previousValue === null) {
            this.calculator.previousValue = inputValue;
        } else if (this.calculator.operation) {
            const currentValue = parseFloat(this.calculator.display);
            const newValue = this.performCalculation(this.calculator.previousValue, this.calculator.operation, currentValue);
            
            this.calculator.display = String(newValue);
            this.calculator.previousValue = newValue;
        }
        
        this.calculator.waitingForOperand = true;
        this.calculator.operation = operation;
        this.updateCalculatorDisplay();
    }

    /**
     * Perform calculation
     */
    performCalculation() {
        const inputValue = parseFloat(this.calculator.display);
        
        if (this.calculator.previousValue === null || this.calculator.operation === null) {
            return;
        }
        
        const newValue = this.calculate(this.calculator.previousValue, this.calculator.operation, inputValue);
        this.calculator.display = String(newValue);
        this.calculator.previousValue = null;
        this.calculator.operation = null;
        this.calculator.waitingForOperand = true;
        
        this.updateCalculatorDisplay();
    }

    /**
     * Calculate result
     */
    calculate(firstValue, operation, secondValue) {
        switch (operation) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '*':
                return firstValue * secondValue;
            case '/':
                return firstValue / secondValue;
            default:
                return secondValue;
        }
    }

    /**
     * Clear calculator
     */
    clearCalculator() {
        this.calculator.display = '0';
        this.calculator.previousValue = null;
        this.calculator.operation = null;
        this.calculator.waitingForOperand = false;
        this.updateCalculatorDisplay();
    }

    /**
     * Clear entry
     */
    clearEntry() {
        this.calculator.display = '0';
        this.updateCalculatorDisplay();
    }

    /**
     * Backspace
     */
    backspace() {
        if (this.calculator.display.length === 1) {
            this.calculator.display = '0';
        } else {
            this.calculator.display = this.calculator.display.slice(0, -1);
        }
        this.updateCalculatorDisplay();
    }

    /**
     * Input decimal
     */
    inputDecimal() {
        if (this.calculator.waitingForOperand) {
            this.calculator.display = '0.';
            this.calculator.waitingForOperand = false;
        } else if (this.calculator.display.indexOf('.') === -1) {
            this.calculator.display += '.';
        }
        this.updateCalculatorDisplay();
    }

    /**
     * Update calculator display
     */
    updateCalculatorDisplay() {
        this.elements.calculatorDisplay.textContent = this.calculator.display;
    }

    /**
     * Initialize calendar
     */
    initializeCalendar() {
        this.renderCalendar();
    }

    /**
     * Navigate month
     */
    navigateMonth(direction) {
        this.calendar.currentDate.setMonth(this.calendar.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    /**
     * Render calendar
     */
    renderCalendar() {
        this.updateCalendarTitle();
        this.renderCalendarDays();
    }

    /**
     * Update calendar title
     */
    updateCalendarTitle() {
        const monthYear = this.calendar.currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
        this.elements.currentMonthYear.textContent = monthYear;
    }

    /**
     * Render calendar days
     */
    renderCalendarDays() {
        const grid = this.elements.calendarGrid;
        if (!grid) return;
        
        grid.innerHTML = '';
        
        const year = this.calendar.currentDate.getFullYear();
        const month = this.calendar.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = this.createCalendarDay(date);
            grid.appendChild(dayElement);
        }
    }

    /**
     * Create calendar day element
     */
    createCalendarDay(date) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const isCurrentMonth = date.getMonth() === this.calendar.currentDate.getMonth();
        const isToday = this.isToday(date);
        
        if (!isCurrentMonth) {
            dayElement.style.opacity = '0.3';
        }
        
        if (isToday) {
            dayElement.classList.add('today');
        }
        
        dayElement.textContent = date.getDate();
        
        dayElement.addEventListener('click', () => {
            this.selectCalendarDate(date);
        });
        
        return dayElement;
    }

    /**
     * Check if date is today
     */
    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    /**
     * Select calendar date
     */
    selectCalendarDate(date) {
        this.calendar.selectedDate = date;
        this.updateDateSidebar();
    }

    /**
     * Update date sidebar
     */
    updateDateSidebar() {
        if (!this.calendar.selectedDate) return;
        
        const dateString = this.calendar.selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        this.elements.selectedDateTitle.textContent = dateString;
        
        // Show employee work status for selected date
        this.showDateEmployeeStatus();
    }

    /**
     * Show date employee status
     */
    showDateEmployeeStatus() {
        const employees = window.dataManager.getEmployees();
        const container = this.elements.dateEmployees;
        
        if (!container) return;
        
        container.innerHTML = '';
        
        employees.forEach(employee => {
            const card = this.createDateEmployeeCard(employee);
            container.appendChild(card);
        });
    }

    /**
     * Create date employee card
     */
    createDateEmployeeCard(employee) {
        const card = document.createElement('div');
        card.className = 'employee-card';
        
        card.innerHTML = `
            <div class="employee-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="employee-info">
                <div class="employee-name">${employee.name}</div>
                <div class="employee-id">ID: ${employee.id}</div>
            </div>
            <div class="employee-status ${employee.isWorking ? 'status-working' : 'status-available'}">
                ${employee.isWorking ? 'Working' : 'Available'}
            </div>
        `;
        
        return card;
    }

    /**
     * Initialize messaging
     */
    initializeMessaging() {
        this.loadMessages();
    }

    /**
     * Load messages
     */
    loadMessages() {
        try {
            const messages = window.dataManager.getMessages();
            this.displayMessages(messages);
            this.updateMessageCount(messages.length);
        } catch (error) {
            console.error('Error loading messages:', error);
            this.showNotification('Failed to load messages', 'error');
        }
    }

    /**
     * Display messages
     */
    displayMessages(messages) {
        const display = this.elements.messagesDisplay;
        if (!display) return;

        const welcomeMessage = display.querySelector('.welcome-message');
        display.innerHTML = '';
        
        if (messages.length === 0) {
            if (welcomeMessage) {
                display.appendChild(welcomeMessage);
            }
            return;
        }

        messages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            display.appendChild(messageElement);
        });

        display.scrollTop = display.scrollHeight;
    }

    /**
     * Create message element
     */
    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-item';
        messageDiv.dataset.messageId = message.id;

        const messageTime = new Date(message.timestamp).toLocaleString();
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <div class="message-sender">
                    <i class="fas fa-user-circle"></i>
                    ${message.sender}
                </div>
                <div class="message-time">${messageTime}</div>
            </div>
            <div class="message-content">${message.content}</div>
        `;

        return messageDiv;
    }

    /**
     * Send message
     */
    sendMessage() {
        if (!this.currentEmployee) {
            this.showNotification('Please select your profile first', 'warning');
            return;
        }

        const content = this.elements.messageInput.value.trim();
        if (!content) {
            this.showNotification('Please enter a message', 'warning');
            return;
        }

        const priority = this.elements.priorityMessage.checked;

        try {
            const messageData = {
                sender: this.currentEmployee.name,
                content: content,
                priority: priority
            };

            const newMessage = window.dataManager.addMessage(messageData);
            
            if (newMessage) {
                this.elements.messageInput.value = '';
                this.elements.priorityMessage.checked = false;
                this.loadMessages();
                this.showNotification('Message sent!', 'success');
            } else {
                this.showNotification('Failed to send message', 'error');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.showNotification('Failed to send message', 'error');
        }
    }

    /**
     * Update message count
     */
    updateMessageCount(count) {
        if (this.elements.messageCount) {
            this.elements.messageCount.textContent = count;
        }
    }

    /**
     * Update tools
     */
    updateTools() {
        // Tools tab specific updates
    }

    /**
     * Export data
     */
    exportData() {
        try {
            const employees = window.dataManager.getEmployees();
            const timeRecords = window.dataManager.getTimeRecords();
            
            const csvContent = [
                ['Employee', 'ID', 'Status', 'Total Hours'],
                ...employees.map(emp => [
                    emp.name,
                    emp.id,
                    emp.isWorking ? 'Working' : 'Available',
                    '0' // Placeholder for total hours
                ])
            ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `timetap-export-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showNotification('Failed to export data', 'error');
        }
    }

    /**
     * Show settings
     */
    showSettings() {
        this.showNotification('Settings feature coming soon!', 'info');
    }

    /**
     * Show add employee modal
     */
    showAddEmployeeModal() {
        this.elements.addEmployeeModal.classList.add('active');
        this.elements.employeeName.focus();
    }

    /**
     * Hide add employee modal
     */
    hideAddEmployeeModal() {
        this.elements.addEmployeeModal.classList.remove('active');
        this.elements.employeeName.value = '';
        this.elements.employeeId.value = '';
    }

    /**
     * Save new employee
     */
    saveNewEmployee() {
        const name = this.elements.employeeName.value.trim();
        const id = this.elements.employeeId.value.trim();
        
        if (!name || !id) {
            this.showNotification('Please fill in all fields', 'warning');
            return;
        }
        
        try {
            const employee = window.dataManager.addEmployee(name, id);
            
            if (employee) {
                this.hideAddEmployeeModal();
                this.loadEmployees();
                this.showNotification('Employee added successfully!', 'success');
                
                // Auto-select the new employee
                this.elements.employeeSelect.value = id;
                this.selectEmployee(id);
            } else {
                this.showNotification('Failed to add employee', 'error');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            this.showNotification('Failed to add employee', 'error');
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = this.elements.notification;
        if (!notification) return;
        
        const messageElement = notification.querySelector('.notification-message');
        const iconElement = notification.querySelector('.notification-icon');
        
        if (messageElement) messageElement.textContent = message;
        
        // Set icon based on type
        let icon = 'fas fa-info-circle';
        switch (type) {
            case 'success':
                icon = 'fas fa-check-circle';
                break;
            case 'error':
                icon = 'fas fa-exclamation-circle';
                break;
            case 'warning':
                icon = 'fas fa-exclamation-triangle';
                break;
        }
        
        if (iconElement) iconElement.className = icon;
        
        // Set notification type class
        notification.className = `notification ${type}`;
        
        // Show notification
        notification.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    /**
     * Cleanup when app is destroyed
     */
    destroy() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
        }
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mobileTimeTapApp = new MobileTimeTapApp();
});

// Handle service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
