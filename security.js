let management;
const bcrypt = require("bcryptjs")

class Management{
    static async injectDB(conn) {
        management = await conn.db("Tiara Resort").collection("security")}

    static async logins(usernameManagement,passwordManagement){
        return management.findOne({         
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

module.exports = Management;