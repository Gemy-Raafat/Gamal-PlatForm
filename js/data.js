// Data Management
const DataManager = {
    // Lectures
    getLectures() {
        return JSON.parse(localStorage.getItem('lectures') || '[]');
    },
    
    // Quizzes
    getQuizzes() {
        return JSON.parse(localStorage.getItem('quizzes') || '[]');
    },
    
    // Assignments
    getAssignments() {
        return JSON.parse(localStorage.getItem('assignments') || '[]');
    },
    
    // Grades
    getGrades(studentId) {
        const allGrades = JSON.parse(localStorage.getItem('grades') || '{}');
        return allGrades[studentId] || [];
    },
    
    saveGrade(studentId, subject, grade) {
        let allGrades = JSON.parse(localStorage.getItem('grades') || '{}');
        if (!allGrades[studentId]) allGrades[studentId] = [];
        
        allGrades[studentId].push({
            subject,
            grade,
            date: new Date().toLocaleDateString('ar-EG')
        });
        
        localStorage.setItem('grades', JSON.stringify(allGrades));
    }
};