/**
 * Work Clock-In/Out Application
 * Main JavaScript functionality
 */

class WorkClockApp {
    constructor() {
        this.currentEmployee = null;
        this.clockInterval = null;
        this.notificationTimeout = null;
        this.currentTheme = 'auto';
        
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
        // Get DOM elements
        this.elements = {
            // Time displays
            currentTime: document.getElementById('currentTime'),
            currentDate: document.getElementById('currentDate'),
            digitalClock: document.getElementById('digitalClock'),
            clockDate: document.getElementById('clockDate'),
            
            // Employee selection
            employeeSelect: document.getElementById('employeeSelect'),
            addEmployeeBtn: document.getElementById('addEmployeeBtn'),
            
            // Clock buttons
            clockInBtn: document.getElementById('clockInBtn'),
            clockOutBtn: document.getElementById('clockOutBtn'),
            statusIndicator: document.getElementById('statusIndicator'),
            
            // Dashboard
            employeeGrid: document.getElementById('employeeGrid'),
            activityLog: document.getElementById('activityLog'),
            exportBtn: document.getElementById('exportBtn'),
            clearDataBtn: document.getElementById('clearDataBtn'),
            calculatorToggle: document.getElementById('calculatorToggle'),
            calendarToggle: document.getElementById('calendarToggle'),
            
            // Calculator
            calculatorSection: document.getElementById('calculatorSection'),
            closeCalculator: document.getElementById('closeCalculator'),
            calculatorDisplay: document.getElementById('calculatorDisplay'),
            calculatorHistory: document.getElementById('calculatorHistory'),
            
            // Calendar
            calendarSection: document.getElementById('calendarSection'),
            closeCalendar: document.getElementById('closeCalendar'),
            prevMonth: document.getElementById('prevMonth'),
            nextMonth: document.getElementById('nextMonth'),
            todayBtn: document.getElementById('todayBtn'),
            currentMonthYear: document.getElementById('currentMonthYear'),
            calendarDays: document.getElementById('calendarDays'),
            calendarEmployeeFilter: document.getElementById('calendarEmployeeFilter'),
            calendarViewType: document.getElementById('calendarViewType'),
            selectedDateTitle: document.getElementById('selectedDateTitle'),
            dateEmployees: document.getElementById('dateEmployees'),
            
            // Schedule Modal
            scheduleModal: document.getElementById('scheduleModal'),
            scheduleModalTitle: document.getElementById('scheduleModalTitle'),
            closeScheduleModal: document.getElementById('closeScheduleModal'),
            scheduleEmployee: document.getElementById('scheduleEmployee'),
            scheduleDate: document.getElementById('scheduleDate'),
            scheduleStartTime: document.getElementById('scheduleStartTime'),
            scheduleEndTime: document.getElementById('scheduleEndTime'),
            scheduleType: document.getElementById('scheduleType'),
            scheduleNotes: document.getElementById('scheduleNotes'),
            scheduleRecurring: document.getElementById('scheduleRecurring'),
            recurringOptions: document.getElementById('recurringOptions'),
            recurringType: document.getElementById('recurringType'),
            recurringEnd: document.getElementById('recurringEnd'),
            cancelScheduleBtn: document.getElementById('cancelScheduleBtn'),
            deleteScheduleBtn: document.getElementById('deleteScheduleBtn'),
            saveScheduleBtn: document.getElementById('saveScheduleBtn'),
            
            // Theme Toggle
            themeToggle: document.getElementById('themeToggle'),
            themeToggleThumb: document.getElementById('themeToggleThumb'),
            themeLabel: document.getElementById('themeLabel'),
            
            // Team Messaging
            messagesDisplay: document.getElementById('messagesDisplay'),
            messageInput: document.getElementById('messageInput'),
            sendMessageBtn: document.getElementById('sendMessageBtn'),
            refreshMessages: document.getElementById('refreshMessages'),
            messageCount: document.getElementById('messageCount'),
            priorityMessage: document.getElementById('priorityMessage'),
            senderInfo: document.getElementById('senderInfo'),
            onlineCount: document.getElementById('onlineCount'),
            employeePreview: document.getElementById('employeePreview'),
            clearAllMessages: document.getElementById('clearAllMessages'),
            exportMessages: document.getElementById('exportMessages'),
            
            // Modal
            addEmployeeModal: document.getElementById('addEmployeeModal'),
            employeeName: document.getElementById('employeeName'),
            employeeId: document.getElementById('employeeId'),
            saveEmployeeBtn: document.getElementById('saveEmployeeBtn'),
            cancelBtn: document.getElementById('cancelBtn'),
            closeModalBtn: document.getElementById('closeModalBtn'),
            
            // Notification
            notification: document.getElementById('notification')
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Employee selection
        this.elements.employeeSelect.addEventListener('change', (e) => {
            this.selectEmployee(e.target.value);
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

        // Clock buttons
        this.elements.clockInBtn.addEventListener('click', () => {
            this.clockIn();
        });

        this.elements.clockOutBtn.addEventListener('click', () => {
            this.clockOut();
        });

        // Dashboard actions
        this.elements.exportBtn.addEventListener('click', () => {
            this.exportData();
        });

        this.elements.clearDataBtn.addEventListener('click', () => {
            this.clearAllData();
        });

        // Calculator toggle
        this.elements.calculatorToggle.addEventListener('click', () => {
            this.toggleCalculator();
        });

        this.elements.closeCalculator.addEventListener('click', () => {
            this.hideCalculator();
        });

        // Calendar toggle
        this.elements.calendarToggle.addEventListener('click', () => {
            this.toggleCalendar();
        });

        this.elements.closeCalendar.addEventListener('click', () => {
            this.hideCalendar();
        });

        // Schedule modal events
        this.elements.closeScheduleModal.addEventListener('click', () => {
            this.hideScheduleModal();
        });

        this.elements.cancelScheduleBtn.addEventListener('click', () => {
            this.hideScheduleModal();
        });

        this.elements.saveScheduleBtn.addEventListener('click', () => {
            this.saveSchedule();
        });

        this.elements.deleteScheduleBtn.addEventListener('click', () => {
            this.deleteSchedule();
        });

        this.elements.scheduleRecurring.addEventListener('change', (e) => {
            this.toggleRecurringOptions(e.target.checked);
        });

        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => {
            this.cycleTheme();
        });

        // Team Messaging events
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

        this.elements.clearAllMessages.addEventListener('click', () => {
            this.clearAllMessages();
        });

        this.elements.exportMessages.addEventListener('click', () => {
            this.exportMessages();
        });

        // Modal outside click
        this.elements.addEmployeeModal.addEventListener('click', (e) => {
            if (e.target === this.elements.addEmployeeModal) {
                this.hideAddEmployeeModal();
            }
        });

        this.elements.scheduleModal.addEventListener('click', (e) => {
            if (e.target === this.elements.scheduleModal) {
                this.hideScheduleModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAddEmployeeModal();
                this.hideScheduleModal();
            }
        });

        // Form submission
        const form = this.elements.addEmployeeModal.querySelector('.modal-body');
        form.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.saveNewEmployee();
            }
        });
    }

    /**
     * Start the real-time clock
     */
    startClock() {
        this.updateClock();
        this.clockInterval = setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    /**
     * Update clock displays
     */
    updateClock() {
        const now = new Date();
        
        // Header time
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
        });
        this.elements.currentTime.textContent = timeString;
        
        // Header date
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        this.elements.currentDate.textContent = dateString;
        
        // Main clock
        const clockTimeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        this.elements.digitalClock.textContent = clockTimeString;
        
        // Clock date
        const clockDateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        this.elements.clockDate.textContent = clockDateString;
        
        // Update dashboard if needed (every minute)
        if (now.getSeconds() === 0) {
            this.updateDashboard();
            // Check auto theme every minute
            this.checkAutoTheme();
        }
    }

    /**
     * Load employees into dropdown
     */
    loadEmployees() {
        const employees = window.dataManager.getEmployees();
        const select = this.elements.employeeSelect;
        
        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        // Add employee options
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = `${employee.name} (${employee.id})`;
            select.appendChild(option);
        });
        
        // Reset selection if current employee doesn't exist
        if (this.currentEmployee && !employees.find(emp => emp.id === this.currentEmployee.id)) {
            this.selectEmployee('');
        }

        // Update calendar if it exists
        if (this.calendar) {
            this.loadCalendarEmployees();
            this.renderCalendar();
            
            // Update online count and messaging UI
            this.updateOnlineCount();
            this.updateMessagingUI();
        }
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
        
        const isClockIn = this.currentEmployee.status === 'in';
        this.elements.clockInBtn.disabled = isClockIn;
        this.elements.clockOutBtn.disabled = !isClockIn;
    }

    /**
     * Update status indicator
     */
    updateStatusIndicator() {
        const indicator = this.elements.statusIndicator;
        const statusText = indicator.querySelector('.status-text');
        
        if (!this.currentEmployee) {
            statusText.textContent = 'Select an employee to begin';
            indicator.className = 'status-indicator neutral';
            return;
        }
        
        const employee = this.currentEmployee;
        if (employee.status === 'in') {
            const clockInTime = window.dataManager.formatTime(employee.clockInTime);
            statusText.textContent = `${employee.name} is clocked in since ${clockInTime}`;
            indicator.className = 'status-indicator clocked-in';
        } else {
            statusText.textContent = `${employee.name} is currently clocked out`;
            indicator.className = 'status-indicator clocked-out';
        }
    }

    /**
     * Clock in functionality
     */
    clockIn() {
        if (!this.currentEmployee) return;
        
        const now = window.dataManager.getCurrentTime();
        
        // Update employee status
        window.dataManager.updateEmployee(this.currentEmployee.id, {
            status: 'in',
            clockInTime: now,
            clockOutTime: null
        });
        
        // Add time record
        window.dataManager.addTimeRecord({
            employeeId: this.currentEmployee.id,
            employeeName: this.currentEmployee.name,
            action: 'clock_in'
        });
        
        // Update current employee data
        this.currentEmployee = window.dataManager.getEmployee(this.currentEmployee.id);
        
        // Update UI
        this.updateClockButtons();
        this.updateStatusIndicator();
        this.updateDashboard();
        
        // Show notification
        this.showNotification('Successfully clocked in!', 'success');
        
        // Play sound (optional)
        this.playNotificationSound();
    }

    /**
     * Clock out functionality
     */
    clockOut() {
        if (!this.currentEmployee) return;
        
        const now = window.dataManager.getCurrentTime();
        
        // Calculate today's hours
        const dailyHours = window.dataManager.calculateDailyHours(this.currentEmployee.id);
        
        // Update employee status
        window.dataManager.updateEmployee(this.currentEmployee.id, {
            status: 'out',
            clockOutTime: now,
            totalHoursToday: dailyHours
        });
        
        // Add time record
        window.dataManager.addTimeRecord({
            employeeId: this.currentEmployee.id,
            employeeName: this.currentEmployee.name,
            action: 'clock_out'
        });
        
        // Update current employee data
        this.currentEmployee = window.dataManager.getEmployee(this.currentEmployee.id);
        
        // Update UI
        this.updateClockButtons();
        this.updateStatusIndicator();
        this.updateDashboard();
        
        // Show notification
        this.showNotification('Successfully clocked out!', 'success');
        
        // Play sound (optional)
        this.playNotificationSound();
    }

    /**
     * Show add employee modal
     */
    showAddEmployeeModal() {
        this.elements.employeeName.value = '';
        this.elements.employeeId.value = '';
        this.elements.addEmployeeModal.style.display = 'block';
        this.elements.employeeName.focus();
    }

    /**
     * Hide add employee modal
     */
    hideAddEmployeeModal() {
        this.elements.addEmployeeModal.style.display = 'none';
    }

    /**
     * Save new employee
     */
    saveNewEmployee() {
        const name = this.elements.employeeName.value.trim();
        const id = this.elements.employeeId.value.trim();
        
        if (!name || !id) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        const employee = { name, id };
        const validation = window.dataManager.validateEmployee(employee);
        
        if (!validation.isValid) {
            this.showNotification(validation.errors[0], 'error');
            return;
        }
        
        if (window.dataManager.addEmployee(employee)) {
            this.hideAddEmployeeModal();
            this.loadEmployees();
            this.updateDashboard();
            this.showNotification('Employee added successfully!', 'success');
            
            // Auto-select the new employee
            this.elements.employeeSelect.value = id;
            this.selectEmployee(id);
        } else {
            this.showNotification('Failed to add employee', 'error');
        }
    }

    /**
     * Update dashboard
     */
    updateDashboard() {
        this.updateEmployeeGrid();
        this.updateActivityLog();
    }

    /**
     * Update employee grid
     */
    updateEmployeeGrid() {
        const employees = window.dataManager.getEmployees();
        const grid = this.elements.employeeGrid;
        
        if (employees.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No employees added yet</h3>
                    <p>Click "Add Employee" to get started</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = '';
        
        employees.forEach(employee => {
            const dailyHours = window.dataManager.calculateDailyHours(employee.id);
            const isOvertime = dailyHours > 8;
            
            const card = document.createElement('div');
            card.className = 'employee-card fade-in';
            card.innerHTML = `
                <div class="employee-header">
                    <div>
                        <div class="employee-name">${employee.name}</div>
                        <div class="employee-id">ID: ${employee.id}</div>
                    </div>
                    <span class="status-badge ${employee.status}">
                        ${employee.status === 'in' ? 'Clocked In' : 'Clocked Out'}
                    </span>
                </div>
                <div class="employee-stats">
                    <div class="stat-item">
                        <div class="stat-label">Hours Today</div>
                        <div class="stat-value ${isOvertime ? 'overtime' : ''}">${dailyHours.toFixed(2)}h</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Current Status</div>
                        <div class="stat-value">
                            ${employee.status === 'in' ? 
                                (employee.clockInTime ? window.dataManager.formatTime(employee.clockInTime) : 'Active') : 
                                (employee.clockOutTime ? window.dataManager.formatTime(employee.clockOutTime) : 'Inactive')
                            }
                        </div>
                    </div>
                </div>
            `;
            
            grid.appendChild(card);
        });
    }

    /**
     * Update activity log
     */
    updateActivityLog() {
        const records = window.dataManager.getRecordsForDate();
        const log = this.elements.activityLog;
        
        if (records.length === 0) {
            log.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <h3>No activity today</h3>
                    <p>Clock in/out activities will appear here</p>
                </div>
            `;
            return;
        }
        
        // Sort records by timestamp (newest first)
        records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        log.innerHTML = '';
        
        records.forEach(record => {
            const entry = document.createElement('div');
            entry.className = `log-entry ${record.action.replace('_', '-')}`;
            entry.innerHTML = `
                <div class="log-info">
                    <div class="log-employee">${record.employeeName}</div>
                    <div class="log-action">
                        ${record.action === 'clock_in' ? 'Clocked In' : 'Clocked Out'}
                    </div>
                </div>
                <div class="log-time">${window.dataManager.formatTime(record.timestamp)}</div>
            `;
            
            log.appendChild(entry);
        });
    }

    /**
     * Export data to CSV
     */
    exportData() {
        try {
            const csvContent = window.dataManager.exportToCSV();
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `work_clock_data_${window.dataManager.getCurrentDate()}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                this.showNotification('Data exported successfully!', 'success');
            } else {
                this.showNotification('Export not supported in this browser', 'error');
            }
        } catch (error) {
            console.error('Export error:', error);
            this.showNotification('Failed to export data', 'error');
        }
    }

    /**
     * Clear all data
     */
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            if (window.dataManager.clearAllData()) {
                this.currentEmployee = null;
                this.loadEmployees();
                this.updateDashboard();
                this.updateClockButtons();
                this.updateStatusIndicator();
                this.elements.employeeSelect.value = '';
                this.showNotification('All data cleared successfully!', 'info');
            } else {
                this.showNotification('Failed to clear data', 'error');
            }
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = this.elements.notification;
        const icon = notification.querySelector('.notification-icon');
        const text = notification.querySelector('.notification-text');
        
        // Set content
        text.textContent = message;
        notification.className = `notification ${type}`;
        
        // Set icon based on type
        switch (type) {
            case 'success':
                icon.className = 'notification-icon fas fa-check-circle';
                break;
            case 'error':
                icon.className = 'notification-icon fas fa-exclamation-circle';
                break;
            case 'info':
                icon.className = 'notification-icon fas fa-info-circle';
                break;
            default:
                icon.className = 'notification-icon fas fa-bell';
        }
        
        // Show notification
        notification.classList.add('show');
        
        // Clear existing timeout
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
        
        // Hide after 4 seconds
        this.notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }

    /**
     * Play notification sound (optional)
     */
    playNotificationSound() {
        try {
            // Create a simple beep sound using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Silently fail if audio is not supported
            console.log('Audio notification not supported');
        }
    }

    /**
     * Initialize calculator
     */
    initializeCalculator() {
        this.calculator = {
            currentValue: '0',
            previousValue: '',
            operation: null,
            waitingForNewValue: false,
            history: ''
        };

        // Bind calculator button events
        const calculatorButtons = document.querySelectorAll('.calc-btn');
        calculatorButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleCalculatorInput(e.target);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (this.elements.calculatorSection.classList.contains('show')) {
                this.handleCalculatorKeyboard(e);
            }
        });
    }

    /**
     * Toggle calculator visibility
     */
    toggleCalculator() {
        if (this.elements.calculatorSection.classList.contains('show')) {
            this.hideCalculator();
        } else {
            this.showCalculator();
        }
    }

    /**
     * Show calculator
     */
    showCalculator() {
        this.elements.calculatorSection.classList.add('show');
        this.elements.calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Hide calculator
     */
    hideCalculator() {
        this.elements.calculatorSection.classList.remove('show');
    }

    /**
     * Handle calculator button input
     */
    handleCalculatorInput(button) {
        const { calculator } = this;
        
        if (button.dataset.number) {
            this.inputNumber(button.dataset.number);
        } else if (button.dataset.operation) {
            this.inputOperation(button.dataset.operation);
        } else if (button.dataset.action) {
            switch (button.dataset.action) {
                case 'clear':
                    this.clearCalculator();
                    break;
                case 'clear-entry':
                    this.clearEntry();
                    break;
                case 'backspace':
                    this.backspace();
                    break;
                case 'decimal':
                    this.inputDecimal();
                    break;
                case 'equals':
                    this.calculate();
                    break;
            }
        }
        
        this.updateCalculatorDisplay();
    }

    /**
     * Handle keyboard input for calculator
     */
    handleCalculatorKeyboard(e) {
        e.preventDefault();
        
        const key = e.key;
        
        if (key >= '0' && key <= '9') {
            this.inputNumber(key);
        } else if (['+', '-', '*', '/'].includes(key)) {
            this.inputOperation(key);
        } else if (key === 'Enter' || key === '=') {
            this.calculate();
        } else if (key === '.') {
            this.inputDecimal();
        } else if (key === 'Backspace') {
            this.backspace();
        } else if (key === 'Escape') {
            this.clearCalculator();
        } else if (key === 'Delete') {
            this.clearEntry();
        }
        
        this.updateCalculatorDisplay();
    }

    /**
     * Input number
     */
    inputNumber(num) {
        const { calculator } = this;
        
        if (calculator.waitingForNewValue) {
            calculator.currentValue = num;
            calculator.waitingForNewValue = false;
        } else {
            calculator.currentValue = calculator.currentValue === '0' ? num : calculator.currentValue + num;
        }
    }

    /**
     * Input operation
     */
    inputOperation(nextOperation) {
        const { calculator } = this;
        const inputValue = parseFloat(calculator.currentValue);

        if (calculator.previousValue === '') {
            calculator.previousValue = inputValue;
        } else if (calculator.operation) {
            const currentValue = calculator.previousValue || 0;
            const newValue = this.performCalculation(currentValue, inputValue, calculator.operation);

            calculator.currentValue = String(newValue);
            calculator.previousValue = newValue;
        }

        calculator.waitingForNewValue = true;
        calculator.operation = nextOperation;
        calculator.history = `${calculator.previousValue} ${this.getOperationSymbol(nextOperation)}`;
    }

    /**
     * Perform calculation
     */
    performCalculation(firstValue, secondValue, operation) {
        switch (operation) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '*':
                return firstValue * secondValue;
            case '/':
                return secondValue !== 0 ? firstValue / secondValue : 0;
            default:
                return secondValue;
        }
    }

    /**
     * Get operation symbol for display
     */
    getOperationSymbol(operation) {
        switch (operation) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            default: return '';
        }
    }

    /**
     * Calculate result
     */
    calculate() {
        const { calculator } = this;
        const inputValue = parseFloat(calculator.currentValue);

        if (calculator.previousValue !== '' && calculator.operation) {
            const newValue = this.performCalculation(calculator.previousValue, inputValue, calculator.operation);
            
            calculator.history = `${calculator.previousValue} ${this.getOperationSymbol(calculator.operation)} ${inputValue} =`;
            calculator.currentValue = String(newValue);
            calculator.previousValue = '';
            calculator.operation = null;
            calculator.waitingForNewValue = true;
        }
    }

    /**
     * Clear calculator
     */
    clearCalculator() {
        this.calculator = {
            currentValue: '0',
            previousValue: '',
            operation: null,
            waitingForNewValue: false,
            history: ''
        };
    }

    /**
     * Clear entry
     */
    clearEntry() {
        this.calculator.currentValue = '0';
    }

    /**
     * Backspace
     */
    backspace() {
        const { calculator } = this;
        
        if (calculator.currentValue.length > 1) {
            calculator.currentValue = calculator.currentValue.slice(0, -1);
        } else {
            calculator.currentValue = '0';
        }
    }

    /**
     * Input decimal
     */
    inputDecimal() {
        const { calculator } = this;
        
        if (calculator.waitingForNewValue) {
            calculator.currentValue = '0.';
            calculator.waitingForNewValue = false;
        } else if (calculator.currentValue.indexOf('.') === -1) {
            calculator.currentValue += '.';
        }
    }

    /**
     * Update calculator display
     */
    updateCalculatorDisplay() {
        const { calculator } = this;
        
        // Format the current value
        let displayValue = calculator.currentValue;
        if (displayValue.length > 12) {
            displayValue = parseFloat(displayValue).toExponential(6);
        }
        
        this.elements.calculatorDisplay.textContent = displayValue;
        this.elements.calculatorHistory.textContent = calculator.history;
    }

    /**
     * Initialize calendar
     */
    initializeCalendar() {
        this.calendar = {
            currentDate: new Date(),
            selectedDate: null,
            viewType: 'month',
            filteredEmployee: ''
        };

        this.currentSchedule = null; // For editing existing schedules

        // Bind calendar events
        this.elements.prevMonth.addEventListener('click', () => {
            this.navigateMonth(-1);
        });

        this.elements.nextMonth.addEventListener('click', () => {
            this.navigateMonth(1);
        });

        this.elements.todayBtn.addEventListener('click', () => {
            this.goToToday();
        });

        this.elements.calendarEmployeeFilter.addEventListener('change', (e) => {
            this.calendar.filteredEmployee = e.target.value;
            this.renderCalendar();
        });

        this.elements.calendarViewType.addEventListener('change', (e) => {
            this.calendar.viewType = e.target.value;
            this.renderCalendar();
        });

        this.loadCalendarEmployees();
        this.renderCalendar();
    }

    /**
     * Toggle calendar visibility
     */
    toggleCalendar() {
        if (this.elements.calendarSection.classList.contains('show')) {
            this.hideCalendar();
        } else {
            this.showCalendar();
        }
    }

    /**
     * Show calendar
     */
    showCalendar() {
        this.elements.calendarSection.classList.add('show');
        this.elements.calendarSection.scrollIntoView({ behavior: 'smooth' });
        this.loadCalendarEmployees();
        this.renderCalendar();
    }

    /**
     * Hide calendar
     */
    hideCalendar() {
        this.elements.calendarSection.classList.remove('show');
    }

    /**
     * Load employees into calendar filter
     */
    loadCalendarEmployees() {
        const employees = window.dataManager.getEmployees();
        const filter = this.elements.calendarEmployeeFilter;
        
        // Clear existing options except the first one
        while (filter.children.length > 1) {
            filter.removeChild(filter.lastChild);
        }
        
        // Add employee options
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = employee.name;
            filter.appendChild(option);
        });
    }

    /**
     * Navigate month
     */
    navigateMonth(direction) {
        this.calendar.currentDate.setMonth(this.calendar.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    /**
     * Go to today
     */
    goToToday() {
        this.calendar.currentDate = new Date();
        this.calendar.selectedDate = new Date();
        this.renderCalendar();
        this.updateDateSidebar();
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
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const month = monthNames[this.calendar.currentDate.getMonth()];
        const year = this.calendar.currentDate.getFullYear();
        this.elements.currentMonthYear.textContent = `${month} ${year}`;
    }

    /**
     * Render calendar days
     */
    renderCalendarDays() {
        const { currentDate, selectedDate, filteredEmployee } = this.calendar;
        const today = new Date();
        
        // Get first day of month and number of days
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const daysContainer = this.elements.calendarDays;
        daysContainer.innerHTML = '';
        
        // Generate 42 days (6 weeks)
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = this.createCalendarDay(date, currentDate, today, selectedDate, filteredEmployee);
            daysContainer.appendChild(dayElement);
        }
    }

    /**
     * Create calendar day element
     */
    createCalendarDay(date, currentMonth, today, selectedDate, filteredEmployee) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        // Add classes
        if (date.getMonth() !== currentMonth.getMonth()) {
            dayDiv.classList.add('other-month');
        }
        
        if (date.toDateString() === today.toDateString()) {
            dayDiv.classList.add('today');
        }
        
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
            dayDiv.classList.add('selected');
        }
        
        // Day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayDiv.appendChild(dayNumber);
        
        // Employee indicators
        const employeesDiv = document.createElement('div');
        employeesDiv.className = 'day-employees';
        
        const dateString = date.toISOString().split('T')[0];
        const employees = window.dataManager.getEmployees();
        
        employees.forEach(employee => {
            // Filter by employee if selected
            if (filteredEmployee && employee.id !== filteredEmployee) {
                return;
            }
            
            const workStatus = this.getEmployeeWorkStatus(employee.id, dateString);
            const indicator = document.createElement('div');
            indicator.className = `employee-indicator ${workStatus.status}`;
            indicator.dataset.tooltip = `${employee.name}: ${workStatus.hours}h`;
            indicator.dataset.employeeId = employee.id;
            indicator.dataset.date = dateString;
            
            employeesDiv.appendChild(indicator);
        });
        
        dayDiv.appendChild(employeesDiv);
        
        // Schedule indicators
        const scheduleIndicators = document.createElement('div');
        scheduleIndicators.className = 'schedule-indicators';
        const schedules = window.dataManager.getSchedulesForDate(dateString);
        
        schedules.forEach(schedule => {
            if (!filteredEmployee || schedule.employeeId === filteredEmployee) {
                const indicator = document.createElement('div');
                indicator.className = `schedule-indicator ${schedule.type}`;
                indicator.dataset.tooltip = `${schedule.startTime}-${schedule.endTime}`;
                scheduleIndicators.appendChild(indicator);
            }
        });
        
        if (schedules.length > 0) {
            dayDiv.classList.add('has-schedule');
        }
        
        dayDiv.appendChild(scheduleIndicators);
        
        // Add schedule button
        const addBtn = document.createElement('button');
        addBtn.className = 'add-schedule-btn';
        addBtn.innerHTML = '+';
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showScheduleModal(date);
        });
        dayDiv.appendChild(addBtn);
        
        // Click event for day selection
        dayDiv.addEventListener('click', () => {
            this.selectCalendarDate(date);
        });
        
        return dayDiv;
    }

    /**
     * Get employee work status for a date
     */
    getEmployeeWorkStatus(employeeId, dateString) {
        const dailyHours = window.dataManager.calculateDailyHours(employeeId, dateString);
        
        let status = 'off';
        if (dailyHours > 6) {
            status = 'working';
        } else if (dailyHours > 0) {
            status = 'partial';
        }
        
        return {
            status: status,
            hours: dailyHours.toFixed(1)
        };
    }

    /**
     * Select calendar date
     */
    selectCalendarDate(date) {
        // Remove previous selection
        const previousSelected = this.elements.calendarDays.querySelector('.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // Add selection to clicked day
        const dayElements = this.elements.calendarDays.children;
        for (let dayElement of dayElements) {
            const dayNumber = parseInt(dayElement.querySelector('.day-number').textContent);
            const dayDate = new Date(this.calendar.currentDate.getFullYear(), this.calendar.currentDate.getMonth(), dayNumber);
            
            if (dayDate.toDateString() === date.toDateString()) {
                dayElement.classList.add('selected');
                break;
            }
        }
        
        this.calendar.selectedDate = new Date(date);
        this.updateDateSidebar();
    }

    /**
     * Update date sidebar
     */
    updateDateSidebar() {
        const { selectedDate } = this.calendar;
        
        if (!selectedDate) {
            this.elements.selectedDateTitle.textContent = 'Select a date';
            this.elements.dateEmployees.innerHTML = '<p>Click on a calendar date to see employee details.</p>';
            return;
        }
        
        const dateString = selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        this.elements.selectedDateTitle.textContent = dateString;
        
        // Get employees for this date
        const employees = window.dataManager.getEmployees();
        const dateKey = selectedDate.toISOString().split('T')[0];
        
        if (employees.length === 0) {
            this.elements.dateEmployees.innerHTML = '<p>No employees added yet.</p>';
            return;
        }
        
        let hasData = false;
        this.elements.dateEmployees.innerHTML = '';
        
        employees.forEach(employee => {
            const workStatus = this.getEmployeeWorkStatus(employee.id, dateKey);
            const records = window.dataManager.getEmployeeRecordsForDate(employee.id, dateKey);
            
            if (workStatus.hours > 0 || records.length > 0) {
                hasData = true;
            }
            
            const card = this.createDateEmployeeCard(employee, workStatus, records, dateKey);
            this.elements.dateEmployees.appendChild(card);
        });
        
        if (!hasData) {
            const noDataMsg = document.createElement('p');
            noDataMsg.textContent = 'No work activity recorded for this date.';
            noDataMsg.style.textAlign = 'center';
            noDataMsg.style.color = '#999';
            noDataMsg.style.fontStyle = 'italic';
            this.elements.dateEmployees.appendChild(noDataMsg);
        }

        // Add schedules section
        this.addSchedulesSection(dateKey);
    }

    /**
     * Create date employee card
     */
    createDateEmployeeCard(employee, workStatus, records, dateKey) {
        const card = document.createElement('div');
        card.className = `date-employee-card ${workStatus.status}`;
        
        const header = document.createElement('div');
        header.className = 'employee-card-header';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'employee-card-name';
        nameDiv.textContent = employee.name;
        
        const statusDiv = document.createElement('div');
        statusDiv.className = `employee-card-status ${workStatus.status}`;
        statusDiv.textContent = workStatus.status === 'working' ? 'Full Day' : 
                               workStatus.status === 'partial' ? 'Partial' : 'Off';
        
        header.appendChild(nameDiv);
        header.appendChild(statusDiv);
        
        const details = document.createElement('div');
        details.className = 'employee-card-details';
        
        if (workStatus.hours > 0) {
            const hoursDiv = document.createElement('div');
            hoursDiv.className = 'work-time';
            hoursDiv.innerHTML = `<span>Total Hours:</span><span>${workStatus.hours}h</span>`;
            details.appendChild(hoursDiv);
            
            // Show clock in/out times
            if (records.length > 0) {
                const times = this.getWorkTimes(records);
                if (times.firstClockIn) {
                    const clockInDiv = document.createElement('div');
                    clockInDiv.className = 'work-time';
                    clockInDiv.innerHTML = `<span>First Clock In:</span><span>${window.dataManager.formatTime(times.firstClockIn)}</span>`;
                    details.appendChild(clockInDiv);
                }
                
                if (times.lastClockOut) {
                    const clockOutDiv = document.createElement('div');
                    clockOutDiv.className = 'work-time';
                    clockOutDiv.innerHTML = `<span>Last Clock Out:</span><span>${window.dataManager.formatTime(times.lastClockOut)}</span>`;
                    details.appendChild(clockOutDiv);
                }
                
                if (times.sessions > 1) {
                    const sessionsDiv = document.createElement('div');
                    sessionsDiv.className = 'work-time';
                    sessionsDiv.innerHTML = `<span>Sessions:</span><span>${times.sessions}</span>`;
                    details.appendChild(sessionsDiv);
                }
            }
        } else {
            details.innerHTML = '<em>No work activity recorded</em>';
        }
        
        card.appendChild(header);
        card.appendChild(details);
        
        return card;
    }

    /**
     * Get work times from records
     */
    getWorkTimes(records) {
        const sorted = records.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        let firstClockIn = null;
        let lastClockOut = null;
        let sessions = 0;
        
        for (const record of sorted) {
            if (record.action === 'clock_in') {
                if (!firstClockIn) {
                    firstClockIn = record.timestamp;
                }
                sessions++;
            } else if (record.action === 'clock_out') {
                lastClockOut = record.timestamp;
            }
        }
        
        return {
            firstClockIn,
            lastClockOut,
            sessions
        };
    }

    /**
     * Add schedules section to sidebar
     */
    addSchedulesSection(dateKey) {
        const schedules = window.dataManager.getSchedulesForDate(dateKey);
        
        if (schedules.length === 0) return;

        const schedulesDiv = document.createElement('div');
        schedulesDiv.className = 'date-schedules';
        
        const title = document.createElement('h4');
        title.textContent = 'Scheduled Activities';
        schedulesDiv.appendChild(title);

        schedules.forEach(schedule => {
            const employee = window.dataManager.getEmployee(schedule.employeeId);
            if (!employee) return;

            const scheduleItem = document.createElement('div');
            scheduleItem.className = `schedule-item ${schedule.type}`;
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'schedule-time';
            timeDiv.textContent = `${schedule.startTime} - ${schedule.endTime}`;
            
            const employeeDiv = document.createElement('div');
            employeeDiv.textContent = employee.name;
            employeeDiv.style.fontWeight = '500';
            employeeDiv.style.marginBottom = '4px';
            
            const typeDiv = document.createElement('div');
            typeDiv.className = 'schedule-type';
            typeDiv.textContent = schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1);
            
            scheduleItem.appendChild(employeeDiv);
            scheduleItem.appendChild(timeDiv);
            scheduleItem.appendChild(typeDiv);
            
            if (schedule.notes) {
                const notesDiv = document.createElement('div');
                notesDiv.className = 'schedule-notes';
                notesDiv.textContent = schedule.notes;
                scheduleItem.appendChild(notesDiv);
            }
            
            // Click to edit
            scheduleItem.addEventListener('click', () => {
                this.showScheduleModal(null, schedule);
            });
            
            schedulesDiv.appendChild(scheduleItem);
        });

        this.elements.dateEmployees.appendChild(schedulesDiv);
    }

    /**
     * Show schedule modal
     */
    showScheduleModal(date = null, schedule = null) {
        this.currentSchedule = schedule;
        
        // Load employees into dropdown
        this.loadScheduleEmployees();
        
        if (schedule) {
            // Edit mode
            this.elements.scheduleModalTitle.textContent = 'Edit Schedule';
            this.elements.scheduleEmployee.value = schedule.employeeId;
            this.elements.scheduleDate.value = schedule.date;
            this.elements.scheduleStartTime.value = schedule.startTime;
            this.elements.scheduleEndTime.value = schedule.endTime;
            this.elements.scheduleType.value = schedule.type || 'work';
            this.elements.scheduleNotes.value = schedule.notes || '';
            this.elements.scheduleRecurring.checked = false;
            this.elements.deleteScheduleBtn.style.display = 'block';
        } else {
            // Add mode
            this.elements.scheduleModalTitle.textContent = 'Add Schedule';
            this.elements.scheduleEmployee.value = '';
            this.elements.scheduleDate.value = date ? date.toISOString().split('T')[0] : '';
            this.elements.scheduleStartTime.value = '09:00';
            this.elements.scheduleEndTime.value = '17:00';
            this.elements.scheduleType.value = 'work';
            this.elements.scheduleNotes.value = '';
            this.elements.scheduleRecurring.checked = false;
            this.elements.deleteScheduleBtn.style.display = 'none';
        }
        
        this.toggleRecurringOptions(false);
        this.elements.scheduleModal.style.display = 'block';
        this.elements.scheduleEmployee.focus();
    }

    /**
     * Hide schedule modal
     */
    hideScheduleModal() {
        this.elements.scheduleModal.style.display = 'none';
        this.currentSchedule = null;
    }

    /**
     * Load employees into schedule dropdown
     */
    loadScheduleEmployees() {
        const employees = window.dataManager.getEmployees();
        const select = this.elements.scheduleEmployee;
        
        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        // Add employee options
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = employee.name;
            select.appendChild(option);
        });
    }

    /**
     * Toggle recurring options
     */
    toggleRecurringOptions(show) {
        this.elements.recurringOptions.style.display = show ? 'block' : 'none';
        if (show) {
            // Set default end date to one month from schedule date
            const scheduleDate = new Date(this.elements.scheduleDate.value || Date.now());
            scheduleDate.setMonth(scheduleDate.getMonth() + 1);
            this.elements.recurringEnd.value = scheduleDate.toISOString().split('T')[0];
        }
    }

    /**
     * Save schedule
     */
    saveSchedule() {
        const scheduleData = {
            employeeId: this.elements.scheduleEmployee.value,
            date: this.elements.scheduleDate.value,
            startTime: this.elements.scheduleStartTime.value,
            endTime: this.elements.scheduleEndTime.value,
            type: this.elements.scheduleType.value,
            notes: this.elements.scheduleNotes.value
        };

        // Validate schedule
        const validation = window.dataManager.validateSchedule({
            ...scheduleData,
            id: this.currentSchedule?.id
        });

        if (!validation.isValid) {
            this.showNotification(validation.errors[0], 'error');
            return;
        }

        try {
            if (this.currentSchedule) {
                // Update existing schedule
                const updated = window.dataManager.updateSchedule(this.currentSchedule.id, scheduleData);
                if (updated) {
                    this.showNotification('Schedule updated successfully!', 'success');
                } else {
                    this.showNotification('Failed to update schedule', 'error');
                    return;
                }
            } else {
                // Create new schedule
                const created = window.dataManager.addSchedule(scheduleData);
                if (created) {
                    this.showNotification('Schedule created successfully!', 'success');
                    
                    // Handle recurring schedules
                    if (this.elements.scheduleRecurring.checked) {
                        const recurringSchedules = window.dataManager.createRecurringSchedules(
                            created,
                            this.elements.recurringType.value,
                            this.elements.recurringEnd.value
                        );
                        
                        // Save all recurring schedules
                        const currentSchedules = window.dataManager.getSchedules();
                        const allSchedules = [...currentSchedules, ...recurringSchedules];
                        window.dataManager.saveSchedules(allSchedules);
                        
                        this.showNotification(`Created ${recurringSchedules.length + 1} recurring schedules!`, 'success');
                    }
                } else {
                    this.showNotification('Failed to create schedule', 'error');
                    return;
                }
            }

            this.hideScheduleModal();
            this.renderCalendar();
            this.updateDateSidebar();
        } catch (error) {
            console.error('Error saving schedule:', error);
            this.showNotification('Error saving schedule', 'error');
        }
    }

    /**
     * Delete schedule
     */
    deleteSchedule() {
        if (!this.currentSchedule) return;

        if (confirm('Are you sure you want to delete this schedule?')) {
            try {
                if (window.dataManager.removeSchedule(this.currentSchedule.id)) {
                    this.showNotification('Schedule deleted successfully!', 'success');
                    this.hideScheduleModal();
                    this.renderCalendar();
                    this.updateDateSidebar();
                } else {
                    this.showNotification('Failed to delete schedule', 'error');
                }
            } catch (error) {
                console.error('Error deleting schedule:', error);
                this.showNotification('Error deleting schedule', 'error');
            }
        }
    }

    /**
     * Initialize theme system
     */
    initializeTheme() {
        // Load saved theme preference or default to auto
        const savedTheme = localStorage.getItem('timeTap_theme') || 'auto';
        this.currentTheme = savedTheme;
        this.applyTheme();
        this.updateThemeToggle();
    }

    /**
     * Cycle through themes: auto -> light -> dark -> auto
     */
    cycleTheme() {
        const themes = ['auto', 'light', 'dark'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.currentTheme = themes[nextIndex];
        
        this.applyTheme();
        this.updateThemeToggle();
        this.saveThemePreference();
        
        // Show notification
        const themeNames = {
            'auto': 'Auto (Day/Night)',
            'light': 'Light Theme',
            'dark': 'Dark Theme'
        };
        this.showNotification(`Switched to ${themeNames[this.currentTheme]}`, 'info');
    }

    /**
     * Apply the current theme
     */
    applyTheme() {
        const body = document.body;
        
        if (this.currentTheme === 'auto') {
            // Auto detect based on time
            const hour = new Date().getHours();
            const isDayTime = hour >= 6 && hour < 18; // 6 AM to 6 PM is day
            
            if (isDayTime) {
                body.setAttribute('data-theme', 'light');
            } else {
                body.removeAttribute('data-theme'); // Default to dark
            }
        } else {
            if (this.currentTheme === 'light') {
                body.setAttribute('data-theme', 'light');
            } else {
                body.removeAttribute('data-theme'); // Default to dark
            }
        }
    }

    /**
     * Update theme toggle appearance
     */
    updateThemeToggle() {
        const toggle = this.elements.themeToggle;
        const label = this.elements.themeLabel;
        
        toggle.setAttribute('data-theme', this.currentTheme);
        
        const labels = {
            'auto': 'Auto',
            'light': 'Light',
            'dark': 'Dark'
        };
        
        label.textContent = labels[this.currentTheme];
    }

    /**
     * Save theme preference
     */
    saveThemePreference() {
        localStorage.setItem('timeTap_theme', this.currentTheme);
    }

    /**
     * Update theme every hour when on auto mode
     */
    checkAutoTheme() {
        if (this.currentTheme === 'auto') {
            this.applyTheme();
        }
    }

    /**
     * Initialize messaging system
     */
    initializeMessaging() {
        this.loadMessages();
        this.updateOnlineCount();
        this.updateMessagingUI();
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
     * Update messaging UI based on current employee
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
        
        if (this.elements.senderInfo) {
            const senderSpan = this.elements.senderInfo.querySelector('span');
            if (senderSpan) {
                senderSpan.textContent = this.currentEmployee ? 
                    `Sending as ${this.currentEmployee.name}` : 
                    'Select your profile to send messages';
            }
        }
    }

    /**
     * Load and display messages
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
     * Display messages in the UI
     */
    displayMessages(messages) {
        const display = this.elements.messagesDisplay;
        if (!display) return;

        // Clear existing messages except welcome message
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

        // Scroll to bottom
        display.scrollTop = display.scrollHeight;
    }

    /**
     * Create a message element
     */
    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-item ${message.priority ? 'priority' : ''}`;
        messageDiv.dataset.messageId = message.id;

        const messageTime = new Date(message.timestamp).toLocaleString();
        const isOwnMessage = this.currentEmployee && message.sender === this.currentEmployee.name;
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <div class="message-sender">
                    <i class="fas fa-user-circle"></i>
                    ${message.sender}
                    ${isOwnMessage ? '<span class="own-message-badge">You</span>' : ''}
                </div>
                <div class="message-actions">
                    <div class="message-time">${messageTime}</div>
                    ${isOwnMessage ? `
                        <button class="delete-message-btn" title="Delete message">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="message-content">${message.content}</div>
        `;

        // Add delete event listener
        if (isOwnMessage) {
            const deleteBtn = messageDiv.querySelector('.delete-message-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    this.deleteMessage(message.id);
                });
            }
        }

        return messageDiv;
    }

    /**
     * Send a new message
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
                // Clear form
                this.elements.messageInput.value = '';
                this.elements.priorityMessage.checked = false;
                
                // Reload messages
                this.loadMessages();
                
                // Show confirmation
                this.showNotification(
                    priority ? 'Priority message sent!' : 'Message sent!', 
                    'success'
                );
            } else {
                this.showNotification('Failed to send message', 'error');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.showNotification('Failed to send message', 'error');
        }
    }

    /**
     * Delete a message
     */
    deleteMessage(messageId) {
        if (!this.currentEmployee) {
            this.showNotification('You must be logged in to delete messages', 'warning');
            return;
        }

        // Confirm deletion
        if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
            return;
        }

        try {
            const success = window.dataManager.deleteMessage(messageId);
            
            if (success) {
                this.showNotification('Message deleted successfully', 'success');
                this.loadMessages(); // Reload messages
            } else {
                this.showNotification('Failed to delete message', 'error');
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            this.showNotification('Failed to delete message', 'error');
        }
    }

    /**
     * Clear all messages
     */
    clearAllMessages() {
        if (!this.currentEmployee) {
            this.showNotification('You must be logged in to clear messages', 'warning');
            return;
        }

        // Confirm deletion
        if (!confirm('Are you sure you want to delete ALL messages? This action cannot be undone and will remove all team messages.')) {
            return;
        }

        try {
            // Clear messages from localStorage
            localStorage.removeItem('timeTap_messages');
            
            // Reload messages display
            this.loadMessages();
            
            this.showNotification('All messages cleared successfully', 'success');
        } catch (error) {
            console.error('Error clearing messages:', error);
            this.showNotification('Failed to clear messages', 'error');
        }
    }

    /**
     * Export messages to CSV
     */
    exportMessages() {
        try {
            const messages = window.dataManager.getMessages();
            
            if (messages.length === 0) {
                this.showNotification('No messages to export', 'info');
                return;
            }

            // Create CSV content
            const csvContent = [
                ['Sender', 'Message', 'Priority', 'Timestamp'],
                ...messages.map(msg => [
                    msg.sender,
                    msg.content.replace(/"/g, '""'), // Escape quotes
                    msg.priority ? 'Yes' : 'No',
                    new Date(msg.timestamp).toLocaleString()
                ])
            ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `team-messages-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Messages exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting messages:', error);
            this.showNotification('Failed to export messages', 'error');
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
     * Cleanup when the app is destroyed
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.workClockApp = new WorkClockApp();
});

// Handle page visibility changes to update clock when page becomes visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.workClockApp) {
        window.workClockApp.updateClock();
        window.workClockApp.updateDashboard();
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.workClockApp) {
        window.workClockApp.destroy();
    }
});
