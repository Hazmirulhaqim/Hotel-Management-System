let security;
const bcrypt = require("bcryptjs")

class Security{
    static async injectDB(conn) {
        security = await conn.db("Tiara-Resort").collection("management")}

    static async logins(usernameManagement,passwordManagement){
        return security.findOne({         
            'Management username' : usernameManagement
        }).then(async user =>{
    
        // TODO: Validate password,username
        if (user) {
            if(user.passwordManagement != passwordManagement && user.usernameManagement != usernameManagement){
                return "invalid password or username";
            }
        }
    
        else{
            return "Login Management Success";
        }    
        })
    }
}

module.exports = Security;
