const CloudStorage = {

    save(collection, data) {
        return db.ref(collection).set(data)
            .then(() => { console.log('✅ Saved: ' + collection); return true; })
            .catch(err => { console.error('❌ Save error:', err); return false; });
    },

    add(collection, item) {
        return this.get(collection).then(current => {
            const list = current || [];
            item.id = item.id || Date.now();
            list.push(item);
            return this.save(collection, list);
        });
    },

    get(collection) {
        return db.ref(collection).once('value')
            .then(snapshot => snapshot.val())
            .catch(err => { console.error('❌ Read error:', err); return null; });
    },

    listen(collection, callback) {
        db.ref(collection).on('value', snapshot => {
            callback(snapshot.val());
        });
    },

    remove(collection, index) {
        return this.get(collection).then(current => {
            const list = current || [];
            list.splice(index, 1);
            return this.save(collection, list);
        });
    },

    saveGrade(studentId, gradeData) {
        return db.ref('grades/' + studentId).push(gradeData);
    },

    getGrades(studentId) {
        return db.ref('grades/' + studentId).once('value')
            .then(snapshot => {
                const data = snapshot.val();
                if (!data) return [];
                return Object.values(data);
            });
    },

    getAllGrades() {
        return db.ref('grades').once('value')
            .then(snapshot => snapshot.val() || {});
    },

    saveAvatar(studentId, base64) {
        return db.ref('avatars/' + studentId).set(base64);
    },

    getAvatar(studentId) {
        return db.ref('avatars/' + studentId).once('value')
            .then(snapshot => snapshot.val());
    },

    removeAvatar(studentId) {
        return db.ref('avatars/' + studentId).remove();
    }
};

console.log('✅ Cloud Storage ready');