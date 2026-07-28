// ===== STORAGE MANAGER - نظام الحفظ الدائم =====

const StorageManager = {

    // كل المفاتيح اللي بنحفظ فيها بيانات
    KEYS: [
        'lectures',
        'assignments',
        'quizzes',
        'sheets',
        'grades',
        'timetables'
    ],

    // جيب كل البيانات في object واحد
    getAllData() {
        const data = {};
        this.KEYS.forEach(key => {
            data[key] = localStorage.getItem(key);
        });

        // كمان جيب صور الطلاب والبروفايلات
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('avatar_') || key.startsWith('profile_')) {
                data[key] = localStorage.getItem(key);
            }
        }

        return data;
    },

    // رجّع البيانات من object
    restoreData(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid backup file');
        }

        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                localStorage.setItem(key, data[key]);
            }
        });

        return true;
    },

    // نزّل ملف Backup
    downloadBackup() {
        const data = this.getAllData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().split('T')[0];
        a.download = `gamal-platform-backup-${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return true;
    },

    // ارفع ملف Backup
    uploadBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    StorageManager.restoreData(data);
                    resolve(true);
                } catch (err) {
                    reject(new Error('ملف الـ Backup تالف أو مش صحيح'));
                }
            };

            reader.onerror = function() {
                reject(new Error('فشل في قراءة الملف'));
            };

            reader.readAsText(file);
        });
    },

    // إحصائيات البيانات
    getStats() {
        const stats = {};
        this.KEYS.forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key) || '[]');
                stats[key] = Array.isArray(data) ? data.length : Object.keys(data).length;
            } catch {
                stats[key] = 0;
            }
        });

        // عدد الطلاب اللي عندهم صور
        let avatarCount = 0;
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).startsWith('avatar_')) avatarCount++;
        }
        stats.avatars = avatarCount;

        return stats;
    },

    // حجم البيانات المخزنة
    getStorageSize() {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            total += key.length + value.length;
        }
        // تحويل لـ KB أو MB
        const kb = (total * 2) / 1024; // UTF-16 = 2 bytes per char
        if (kb > 1024) {
            return (kb / 1024).toFixed(2) + ' MB';
        }
        return kb.toFixed(2) + ' KB';
    }
};

// ===== AUTO BACKUP كل 5 دقايق =====
(function autoBackup() {
    // احفظ timestamp آخر backup
    const lastBackup = localStorage.getItem('lastAutoBackup');
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (!lastBackup || (now - parseInt(lastBackup)) > fiveMinutes) {
        // احفظ نسخة احتياطية تلقائية
        const data = StorageManager.getAllData();
        try {
            localStorage.setItem('autoBackup', JSON.stringify(data));
            localStorage.setItem('lastAutoBackup', now.toString());
        } catch (e) {
            console.warn('Auto backup failed - storage might be full');
        }
    }

    // كرر كل 5 دقايق
    setTimeout(autoBackup, fiveMinutes);
})();

// ===== استرجاع تلقائي لو البيانات فضيت فجأة =====
window.addEventListener('load', function() {
    const lectures = localStorage.getItem('lectures');
    const autoBackup = localStorage.getItem('autoBackup');

    // لو مفيش بيانات بس في auto backup، استرجع
    if (!lectures && autoBackup) {
        try {
            const data = JSON.parse(autoBackup);
            StorageManager.restoreData(data);
            console.log('✅ Data auto-restored from backup');
        } catch (e) {
            console.warn('Auto restore failed');
        }
    }
});