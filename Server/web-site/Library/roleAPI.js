var UserModel = require('../Schema/UserModel')

const roleAPI = {
    isAdmin: function(roleString) {
        switch (roleString) {
        case 'Administrator':
        case 'Developer':
            return true
            break;
        default:
            return false
            break;
        }
    },
    isSalesman: function(roleString) {
        switch (roleString) {
        case 'Salesman':
            return true
            break;
        default:
            return false
            break;
        }
    },
    codetoRole: async function(code) {
        let user = await UserModel.findOne({
            loginCode: code
        })
        return user.role
    }
}

module.exports = roleAPI;
