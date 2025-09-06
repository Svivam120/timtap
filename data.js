/**
 * Data Management Utilities for Work Clock Application
 * Handles localStorage operations and data persistence
 */

class DataManager {
    constructor() {
        this.STORAGE_KEYS = {
            EMPLOYEES: 'workClock_employees',
            TIME_RECORDS: 'workClock_timeRecords',
            SCHEDULES: 'workClock_schedules',
            SETTINGS: 'workClock_settings',
            MESSAGES: 'timeTap_messages'
        };
        this.initializeStorage();
    }

    /**
     * Initialize storage with default data if not exists
     */
    initializeStorage() {
        if (!this.getEmployees()) {
            this.saveEmployees([]);
        }
        if (!this.getTimeRecords()) {
            this.saveTimeRecords([]);
        }
        if (!this.getSchedules()) {
            this.saveSchedules([]);
        }
        if (!this.getSettings()) {
            this.saveSettings({
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                dateFormat: 'MM/DD/YYYY',
                timeFormat: '12h',
                overtimeThreshold: 8
            });
        }
    }

    /**
     * Employee Management
     */
    getEmployees() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.EMPLOYEES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading employees:', error);
            return [];
        }
    }

    saveEmployees(employees) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
            return true;
        } catch (error) {
            console.error('Error saving employees:', error);
            return false;
        }
    }

    addEmployee(employee) {
        const employees = this.getEmployees();
        const newEmployee = {
            id: employee.id,
            name: employee.name,
            status: 'out',
            clockInTime: null,
            clockOutTime: null,
            totalHoursToday: 0,
            createdAt: new Date().toISOString(),
            ...employee
        };
        employees.push(newEmployee);
        return this.saveEmployees(employees);
    }

    updateEmployee(employeeId, updates) {
        const employees = this.getEmployees();
        const index = employees.findIndex(emp => emp.id === employeeId);
        if (index !== -1) {
            employees[index] = { ...employees[index], ...updates };
            return this.saveEmployees(employees);
        }
        return false;
    }

    removeEmployee(employeeId) {
        const employees = this.getEmployees();
        const filtered = employees.filter(emp => emp.id !== employeeId);
        return this.saveEmployees(filtered);
    }

    getEmployee(employeeId) {
        const employees = this.getEmployees();
        return employees.find(emp => emp.id === employeeId);
    }

    /**
     * Time Records Management
     */
    getTimeRecords() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.TIME_RECORDS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading time records:', error);
            return [];
        }
    }

    saveTimeRecords(records) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.TIME_RECORDS, JSON.stringify(records));
            return true;
        } catch (error) {
            console.error('Error saving time records:', error);
            return false;
        }
    }

    addTimeRecord(record) {
        const records = this.getTimeRecords();
        const newRecord = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            date: this.getCurrentDate(),
            ...record
        };
        records.push(newRecord);
        return this.saveTimeRecords(records);
    }

    getEmployeeRecordsForDate(employeeId, date = null) {
        const targetDate = date || this.getCurrentDate();
        const records = this.getTimeRecords();
        return records.filter(record => 
            record.employeeId === employeeId && record.date === targetDate
        );
    }

    getRecordsForDate(date = null) {
        const targetDate = date || this.getCurrentDate();
        const records = this.getTimeRecords();
        return records.filter(record => record.date === targetDate);
    }

    /**
     * Schedule Management
     */
    getSchedules() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.SCHEDULES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading schedules:', error);
            return [];
        }
    }

    saveSchedules(schedules) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
            return true;
        } catch (error) {
            console.error('Error saving schedules:', error);
            return false;
        }
    }

    addSchedule(schedule) {
        const schedules = this.getSchedules();
        const newSchedule = {
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            ...schedule
        };
        schedules.push(newSchedule);
        return this.saveSchedules(schedules) ? newSchedule : null;
    }

    updateSchedule(scheduleId, updates) {
        const schedules = this.getSchedules();
        const index = schedules.findIndex(schedule => schedule.id === scheduleId);
        if (index !== -1) {
            schedules[index] = { ...schedules[index], ...updates, updatedAt: new Date().toISOString() };
            return this.saveSchedules(schedules) ? schedules[index] : null;
        }
        return null;
    }

    removeSchedule(scheduleId) {
        const schedules = this.getSchedules();
        const filtered = schedules.filter(schedule => schedule.id !== scheduleId);
        return this.saveSchedules(filtered);
    }

    getSchedule(scheduleId) {
        const schedules = this.getSchedules();
        return schedules.find(schedule => schedule.id === scheduleId);
    }

    getEmployeeSchedulesForDate(employeeId, date = null) {
        const targetDate = date || this.getCurrentDate();
        const schedules = this.getSchedules();
        return schedules.filter(schedule => 
            schedule.employeeId === employeeId && schedule.date === targetDate
        );
    }

    getSchedulesForDate(date = null) {
        const targetDate = date || this.getCurrentDate();
        const schedules = this.getSchedules();
        return schedules.filter(schedule => schedule.date === targetDate);
    }

    getEmployeeSchedulesForDateRange(employeeId, startDate, endDate) {
        const schedules = this.getSchedules();
        return schedules.filter(schedule => 
            schedule.employeeId === employeeId && 
            schedule.date >= startDate && 
            schedule.date <= endDate
        );
    }

    getSchedulesForDateRange(startDate, endDate) {
        const schedules = this.getSchedules();
        return schedules.filter(schedule => 
            schedule.date >= startDate && 
            schedule.date <= endDate
        );
    }

    createRecurringSchedules(baseSchedule, recurringType, endDate) {
        const schedules = [];
        const startDate = new Date(baseSchedule.date);
        const end = new Date(endDate);
        let currentDate = new Date(startDate);

        while (currentDate <= end) {
            if (currentDate.toISOString().split('T')[0] !== baseSchedule.date) {
                const recurringSchedule = {
                    ...baseSchedule,
                    date: currentDate.toISOString().split('T')[0],
                    isRecurring: true,
                    parentId: baseSchedule.id || this.generateId()
                };
                schedules.push(recurringSchedule);
            }

            // Increment date based on recurring type
            switch (recurringType) {
                case 'daily':
                    currentDate.setDate(currentDate.getDate() + 1);
                    break;
                case 'weekly':
                    currentDate.setDate(currentDate.getDate() + 7);
                    break;
                case 'monthly':
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    break;
                default:
                    return schedules;
            }
        }

        return schedules;
    }

    validateSchedule(schedule) {
        const errors = [];
        
        if (!schedule.employeeId) {
            errors.push('Employee is required');
        }
        
        if (!schedule.date) {
            errors.push('Date is required');
        }
        
        if (!schedule.startTime) {
            errors.push('Start time is required');
        }
        
        if (!schedule.endTime) {
            errors.push('End time is required');
        }
        
        if (schedule.startTime && schedule.endTime) {
            const start = new Date(`2000-01-01T${schedule.startTime}`);
            const end = new Date(`2000-01-01T${schedule.endTime}`);
            
            if (start >= end) {
                errors.push('End time must be after start time');
            }
        }
        
        // Check for conflicts with existing schedules
        if (schedule.employeeId && schedule.date && schedule.startTime && schedule.endTime) {
            const conflicts = this.checkScheduleConflicts(schedule);
            if (conflicts.length > 0) {
                errors.push(`Schedule conflicts with existing schedule: ${conflicts[0].startTime} - ${conflicts[0].endTime}`);
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    checkScheduleConflicts(schedule) {
        const existingSchedules = this.getEmployeeSchedulesForDate(schedule.employeeId, schedule.date);
        const conflicts = [];
        
        const newStart = new Date(`2000-01-01T${schedule.startTime}`);
        const newEnd = new Date(`2000-01-01T${schedule.endTime}`);
        
        for (const existing of existingSchedules) {
            // Skip if checking against the same schedule (for updates)
            if (existing.id === schedule.id) continue;
            
            const existingStart = new Date(`2000-01-01T${existing.startTime}`);
            const existingEnd = new Date(`2000-01-01T${existing.endTime}`);
            
            // Check for overlap
            if ((newStart < existingEnd && newEnd > existingStart)) {
                conflicts.push(existing);
            }
        }
        
        return conflicts;
    }

    /**
     * Settings Management
     */
    getSettings() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading settings:', error);
            return null;
        }
    }

    saveSettings(settings) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    /**
     * Utility Functions
     */
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    getCurrentDate() {
        const now = new Date();
        return now.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    getCurrentTime() {
        return new Date().toISOString();
    }

    formatTime(time, format = '12h') {
        const date = new Date(time);
        if (format === '24h') {
            return date.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
        return date.toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: 'numeric', 
            minute: '2-digit' 
        });
    }

    formatDate(date, format = 'MM/DD/YYYY') {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        
        switch (format) {
            case 'DD/MM/YYYY':
                return `${day}/${month}/${year}`;
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            default:
                return `${month}/${day}/${year}`;
        }
    }

    /**
     * Calculate total hours worked for an employee on a specific date
     */
    calculateDailyHours(employeeId, date = null) {
        const records = this.getEmployeeRecordsForDate(employeeId, date);
        let totalMinutes = 0;
        let currentClockIn = null;

        // Sort records by timestamp
        records.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        for (const record of records) {
            if (record.action === 'clock_in') {
                currentClockIn = new Date(record.timestamp);
            } else if (record.action === 'clock_out' && currentClockIn) {
                const clockOut = new Date(record.timestamp);
                const sessionMinutes = (clockOut - currentClockIn) / (1000 * 60);
                totalMinutes += sessionMinutes;
                currentClockIn = null;
            }
        }

        // If still clocked in, calculate time until now
        if (currentClockIn) {
            const now = new Date();
            const sessionMinutes = (now - currentClockIn) / (1000 * 60);
            totalMinutes += sessionMinutes;
        }

        return totalMinutes / 60; // Convert to hours
    }

    /**
     * Export data to CSV format
     */
    exportToCSV(startDate = null, endDate = null) {
        const employees = this.getEmployees();
        const records = this.getTimeRecords();
        
        // Filter records by date range if provided
        let filteredRecords = records;
        if (startDate || endDate) {
            filteredRecords = records.filter(record => {
                const recordDate = record.date;
                if (startDate && recordDate < startDate) return false;
                if (endDate && recordDate > endDate) return false;
                return true;
            });
        }

        // Create CSV header
        const csvData = [
            ['Date', 'Employee ID', 'Employee Name', 'Action', 'Time', 'Daily Hours']
        ];

        // Group records by employee and date
        const dailyHours = {};
        
        filteredRecords.forEach(record => {
            const employee = employees.find(emp => emp.id === record.employeeId);
            const employeeName = employee ? employee.name : 'Unknown';
            
            // Calculate daily hours for this employee and date
            const key = `${record.employeeId}_${record.date}`;
            if (!dailyHours[key]) {
                dailyHours[key] = this.calculateDailyHours(record.employeeId, record.date);
            }

            csvData.push([
                this.formatDate(record.date),
                record.employeeId,
                employeeName,
                record.action === 'clock_in' ? 'Clock In' : 'Clock Out',
                this.formatTime(record.timestamp),
                dailyHours[key].toFixed(2)
            ]);
        });

        // Convert to CSV string
        return csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    }

    /**
     * Get all messages
     */
    getMessages() {
        try {
            const messages = localStorage.getItem(this.STORAGE_KEYS.MESSAGES);
            return messages ? JSON.parse(messages) : [];
        } catch (error) {
            console.error('Error getting messages:', error);
            return [];
        }
    }

    /**
     * Save messages array
     */
    saveMessages(messages) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
            return true;
        } catch (error) {
            console.error('Error saving messages:', error);
            return false;
        }
    }

    /**
     * Add a new message
     */
    addMessage(messageData) {
        try {
            const messages = this.getMessages();
            const newMessage = {
                id: Date.now().toString(),
                sender: messageData.sender,
                content: messageData.content,
                priority: messageData.priority || false,
                timestamp: new Date().toISOString(),
                ...messageData
            };
            
            messages.unshift(newMessage); // Add to beginning for most recent first
            
            // Keep only last 100 messages
            if (messages.length > 100) {
                messages.splice(100);
            }
            
            this.saveMessages(messages);
            return newMessage;
        } catch (error) {
            console.error('Error adding message:', error);
            return null;
        }
    }

    /**
     * Delete a message
     */
    deleteMessage(messageId) {
        try {
            const messages = this.getMessages();
            const filteredMessages = messages.filter(msg => msg.id !== messageId);
            this.saveMessages(filteredMessages);
            return true;
        } catch (error) {
            console.error('Error deleting message:', error);
            return false;
        }
    }

    /**
     * Get messages for a specific date range
     */
    getMessagesForDateRange(startDate, endDate) {
        try {
            const messages = this.getMessages();
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            return messages.filter(message => {
                const messageDate = new Date(message.timestamp);
                return messageDate >= start && messageDate <= end;
            });
        } catch (error) {
            console.error('Error getting messages for date range:', error);
            return [];
        }
    }

    /**
     * Clear all data (with confirmation)
     */
    clearAllData() {
        try {
            localStorage.removeItem(this.STORAGE_KEYS.EMPLOYEES);
            localStorage.removeItem(this.STORAGE_KEYS.TIME_RECORDS);
            localStorage.removeItem(this.STORAGE_KEYS.SCHEDULES);
            localStorage.removeItem(this.STORAGE_KEYS.MESSAGES);
            this.initializeStorage();
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }

    /**
     * Get storage usage information
     */
    getStorageInfo() {
        const employees = this.getEmployees();
        const records = this.getTimeRecords();
        const schedules = this.getSchedules();
        
        return {
            employeeCount: employees.length,
            recordCount: records.length,
            scheduleCount: schedules.length,
            oldestRecord: records.length > 0 ? 
                records.reduce((oldest, record) => 
                    record.timestamp < oldest.timestamp ? record : oldest
                ).timestamp : null,
            latestRecord: records.length > 0 ? 
                records.reduce((latest, record) => 
                    record.timestamp > latest.timestamp ? record : latest
                ).timestamp : null
        };
    }

    /**
     * Validate employee data
     */
    validateEmployee(employee) {
        const errors = [];
        
        if (!employee.name || employee.name.trim().length === 0) {
            errors.push('Employee name is required');
        }
        
        if (!employee.id || employee.id.trim().length === 0) {
            errors.push('Employee ID is required');
        }
        
        // Check for duplicate ID
        const employees = this.getEmployees();
        if (employees.some(emp => emp.id === employee.id)) {
            errors.push('Employee ID already exists');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

// Create global instance
window.dataManager = new DataManager();
