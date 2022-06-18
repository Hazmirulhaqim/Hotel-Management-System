let visitors;
class Visitor {
	static async injectDB(conn) {
		visitors = await conn.db("Tiara-Resort").collection("visitor")}

    //REGISTER VISITOR
    static async VisitorRegister(idVisitor, nameVisitor, email, room, floor) 
    {
        return visitors.findOne({        
        'Visitor Name': nameVisitor,    
        }).then(async user =>{
    
        if (user) {
        if (user.idVisitor == idVisitor ){
            return "visitor id existed"
        }
        }
        else
        {
            await visitors.insertOne({      
            "Visitor ID"			: idVisitor,
            "Visitor Name"      	: nameVisitor,
            "Visitor Email"			: email,
            
      
            "Visitor room"		    : room,
            "Visitor Floor"		    : floor,
            })

            return "new visitor registered"
        }
        }) 
    }

    //VIEW VISITOR
    static async vwvisitor(nameVisitor){
        const exist= await visitors.findOne({"Visitor Name" : nameVisitor})
           if(exist){
             const user = await visitors.findOne(
               {"Visitor Name" : nameVisitor}
               ).then(result=>{ 
                 console.log(result)})
               return exist
           }
           else{
             return "Username cannot be found"
              }
      }
    
    
    //UPDATE VISITOR ROOM
    static async updateroom(nameVisitor,room) {
        const exist = await visitors.findOne({name: nameVisitor})
        if(exist){
            const data = await visitors.updateOne({"Visitor Name" : nameVisitor},
            {"$set":{ "Room" : room}} 
            ).then(result=>{ 
                console.log(result)})
                return exist
        }
        else{
           return "Visitor is not exist"}     
    }

    //UPDATE FLOOR
    static async updatefloor(nameVisitor,floor) {
        const exist= await visitors.findOne({"Visitor Name": nameVisitor})
        if(exist){
            const data= await visitors.updateOne(
            {"Visitor Name" : nameVisitor},
            {"$set":{ floor:floor}}
            ).then(result=>{ 
                console.log(result)})
                return exist
        }
        else{
            return "Visitor is not exist"
        }           
    }


    //DELETE VISITOR
    static async delete(nameVisitor) {
    const exist= await visitors.findOne({"Visitor Name": nameVisitor})
        if(exist){
            const data = await visitors.deleteOne({"Visitor Name" : nameVisitor})
                return exist
        }
        else{
            return "Visitor is not exist"
        }
    }
}

module.exports = Visitor;
