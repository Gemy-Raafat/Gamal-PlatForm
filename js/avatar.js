const AvatarManager = {

    getStudentId() {
        return localStorage.getItem('studentId') || '262001';
    },

    applyToHeader() {
        const el = document.getElementById('headerAvatar');
        if (!el) return;
        const studentId = this.getStudentId();
        const initials = studentId.slice(-2);

        if (typeof CloudStorage !== 'undefined') {
            CloudStorage.getAvatar(studentId).then(base64 => {
                if (base64) {
                    el.innerHTML = '<img src="' + base64 + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
                } else {
                    el.innerHTML = '<span>' + initials + '</span>';
                }
            });
        } else {
            el.innerHTML = '<span>' + initials + '</span>';
        }
    },

    applyToBigAvatar() {
        const el = document.getElementById('bigAvatarCircle');
        if (!el) return;
        const studentId = this.getStudentId();
        const initials = studentId.slice(-2);

        if (typeof CloudStorage !== 'undefined') {
            CloudStorage.getAvatar(studentId).then(base64 => {
                if (base64) {
                    el.innerHTML = '<img src="' + base64 + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
                } else {
                    el.innerHTML = '<span id="bigAvatarText">' + initials + '</span>';
                }
            });
        } else {
            el.innerHTML = '<span id="bigAvatarText">' + initials + '</span>';
        }
    },

    applyAll() {
        this.applyToHeader();
        this.applyToBigAvatar();
    },

    savePhoto(base64) {
        const studentId = this.getStudentId();
        localStorage.setItem('avatar_' + studentId, base64);
        if (typeof CloudStorage !== 'undefined') {
            CloudStorage.saveAvatar(studentId, base64);
        }
        this.applyAll();
    },

    removePhoto() {
        const studentId = this.getStudentId();
        localStorage.removeItem('avatar_' + studentId);
        if (typeof CloudStorage !== 'undefined') {
            CloudStorage.removeAvatar(studentId);
        }
        this.applyAll();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => AvatarManager.applyAll(), 500);
});