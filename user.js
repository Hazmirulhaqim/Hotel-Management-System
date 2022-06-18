let users;
const bcrypt = require('bcryptjs');

class User {
	static async injectDB(conn) {
		users = await conn.db("Tiara-Resort").collection("staff")
	}

   
	static async register(username, password, id, name) {
		return users.findOne({        
			'username': username,    
			}).then(async user =>{
		   		if (user) {
					if ( user.username == username ){
			 			return "username already existed"
					}
		   		}
		   		else{
					// TODO: Save user to database
					const salt = await bcrypt.genSalt(10);
					const hashed = await bcrypt.hash(password, salt)
					await users.insertOne({
					username			: username,
					password			: hashed,
					"User ID"        	: id, 
					"User Name" 	  	: name,
					});

					return "new user registered"
				}
			})
	}
    
    static async login(username, userpassword) {
        // TODO: Check if username exists
        return users.findOne({         
            'username' : username
        }).then(async user =>{
    
        // TODO: Validate password,username
        if (user) {
            if(user.password != userpassword){
                return "invalid password";
            }
            
            // TODO: Return user object
            else{
                return "Login User Success";
            }
        }
    
        else{
            return "invalid username";
        }    
        })
    }

	//TODO : To update data into database
	static async update(username) {
		return users.findOne({
			'username' : username
		}).then(async user =>{
		//console.log(user)

		if (user){
		return users.updateOne({ 
			'username' : username},
			{"$set" : {"User name" : "ketam"}
		}).then(result => {
			console.log(result)
		})
		}
		else {
			return "username is not match"
		}
		})
	}

    //TODO : To delete data from database
	static async delete (username){
    	return users.findOne({
      		'username' : username,
    	}).then(async user =>{

		if (user){
			if (user.username == username){
				await users.deleteOne({username:username})
					return "delete data successfully"
			}
		}
		else {
			return "user doesn't exist"
		}
  	    })
	}

	//TODO : To view the data
	static async view(username){
		const exist= await users.findOne({username: username})
		   if(exist){
			 const user= await users.findOne(
			   {username : username}
			   ).then(result=>{ 
				 console.log(result)})
			   return exist
		   }
		   else{
			 return "Username cannot be found"
			  }
	  }
}

module.exports = User;
