const MongoClient   = require("mongodb").MongoClient;
const Management    = require("./security")

const jwt = require('jsonwebtoken');
const { request } = require("express");

function generateAccessToken(payload) {
    return jwt.sign(payload, "secretkey", {expiresIn:'1h'});
}

describe("Management Details", () => {
    let client;
    beforeAll(async () => {
        client = await MongoClient.connect(
            "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.wigci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            { useNewUrlParser: true },
        );
        Management.injectDB(client);
    })
  
    afterAll(async () => {
        await client.close();
    })
  
    test("Management login successfully", async () => {
        const res = await Management.logins("chus", "chus56")
        expect(res).toBe("Login Management Success")
    })
})

    function verifyToken(req,res,next){
    const authHeader=req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    jwt.verify(token, "secretkey", (err,user)=>{
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
