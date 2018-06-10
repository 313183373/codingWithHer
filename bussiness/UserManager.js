class UserManager {

    static hasBooked(uid) {
        return !!this.userList[uid];
    }

    static getUser(uid) {
        return this.userList[uid];
    }

    static addUser(user) {
        this.userList[user.uid] = user
    }
}
UserManager.userList = {};
module.exports = UserManager;