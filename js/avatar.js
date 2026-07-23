// ===== AVATAR MANAGER - مشترك في كل الصفحات =====

const AvatarManager = {

    // جيب الـ studentId
    getStudentId() {
        return localStorage.getItem('studentId') || '262001';
    },

    // جيب مفتاح الصورة
    getPhotoKey() {
        return 'avatar_' + this.getStudentId();
    },

    // جيب الصورة المحفوظة
    getSavedPhoto() {
        return localStorage.getItem(this.getPhotoKey());
    },

    // طبّق الصورة على الـ Header Avatar
    applyToHeader() {
        const headerAvatar = document.getElementById('headerAvatar');
        if (!headerAvatar) return;

        const savedPhoto = this.getSavedPhoto();
        const studentId = this.getStudentId();
        const initials = studentId.slice(-2);

        if (savedPhoto) {
            headerAvatar.innerHTML = `
                <img src="${savedPhoto}" 
                     alt="Profile" 
                     style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
            `;
        } else {
            headerAvatar.innerHTML = `<span>${initials}</span>`;
        }
    },

    // طبّق على البروفايل الكبير (صفحة البروفايل بس)
    applyToBigAvatar() {
        const bigCircle = document.getElementById('bigAvatarCircle');
        if (!bigCircle) return;

        const savedPhoto = this.getSavedPhoto();
        const studentId = this.getStudentId();
        const initials = studentId.slice(-2);

        if (savedPhoto) {
            bigCircle.innerHTML = `
                <img src="${savedPhoto}" 
                     alt="Profile"
                     style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;">
            `;
        } else {
            bigCircle.innerHTML = `<span id="bigAvatarText">${initials}</span>`;
        }
    },

    // طبّق في كل الأماكن مرة واحدة
    applyAll() {
        this.applyToHeader();
        this.applyToBigAvatar();
    },

    // احفظ صورة جديدة
    savePhoto(base64) {
        localStorage.setItem(this.getPhotoKey(), base64);
        this.applyAll();
    },

    // امسح الصورة
    removePhoto() {
        localStorage.removeItem(this.getPhotoKey());
        this.applyAll();
    }
};

// شغّل تلقائياً لما الصفحة تفتح
document.addEventListener('DOMContentLoaded', function () {
    AvatarManager.applyAll();
});