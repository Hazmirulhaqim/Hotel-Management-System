const supertest = require('supertest');
const request   = supertest('http://localhost:3000');

const { faker }    = require ('@faker-js/faker');
const { response } = require('express');

//FAKER FOR USER
const Uusername    = faker.internet.userName();
const Upass        = faker.internet.password();
const Uid          = faker.random.numeric(5);
const Uname        = faker.name.findName();

//FAKER FOR VISITOR
const Vid          = faker.random.numeric(4);
const Vname        = faker.name.findName();
const Vroom        = faker.random.alphaNumeric(4);
const Vfloor       = faker.random.numeric(1);
const Vemail	   = faker.internet.email()

describe('Express Route Test', function () {

    //USER LOGIN 
    it('STAFF LOGIN SUCCESSFULLY', async () => {
        return request
        .post('/login/user')
        .send({username: "Oswald74", password: "$2a$10$32fQJZG9XzaqTziXE0yleOFhKV3HLz48NkrAPYBcV2AoxAFeagapy" })
        .expect('Content-Type', /text/)
        .expect(200).then(response => {
            expect(response.text).toEqual("Login Staff Success")
        });
    });

    //USER LOGIN FAILED
    it('STAFF LOGIN FAILED', async () => {
        return request
        .post('/login/user')
        .send({username: "Oswald74", password: "1235" })
        .expect('Content-Type', /text/)
        .expect(404).then(response => {
            expect(response.text).toBe("invalid password");
        });
    })

    //USER REGISTER
    it('STAFF REGISTER', async()=>{
        return request
        .post('/register/user')
        .send({username : Uusername, password : Upass, id : Uid, name : Uname, role : "user"})
        .expect(200)
    }); 
    
    //USER DELETE
    it('delete user', async () => {
        return request
        .delete('/delete/user')
        .send({username: 'Fabiola9'})
        .expect(200)
    });

    //MANAGEMENT LOGIN
    it('SECURITY LOGIN SUCCESSFULLY', async () => {
        return request
        .post('/login/security')
        .send({usernameManagement: "chus", passwordManagement: "chus56" })
        .expect('Content-Type', /text/)
        .expect(200).then(response => {
            expect(response.body).toBe("Login Security Success")
        });
    });

    //REGISTER VISITOR
    it('CLIENT REGISTER SUCCESSFULLY', async()=>{
        return request
        .post('/register/visitor')
        .send({idVisitor : Vid, nameVisitor : Vname, email : Vemail, room : Vroom, floor : Vfloor})
        .expect(200) 
    });

    //UPDATE VISITOR ROOM
    it('UPDATE ROOM', async () => {
        return request
        .patch('/update/visitor/room')
        .send({name: 'ketam', room :"A002"})
        .expect(200)
    });

    //UPDATE VISITOR FLOOR
    it('UPDATE FLOOR', async () => {
        return request
        .patch('/update/visitor/floor')
        .send({name: 'ainin', floor :"F1"})
        .expect(200)
    });

    //DELETE VISITOR
    it('DELETE CLIENT', async () => {
    return request
        .delete('/delete/visitor')
        .send({name: 'Zafirah'})
        .expect(200)
    });
})

const jwt = require('jsonwebtoken');
function generateAccessToken(payload) {
    return jwt.sign(payload, "secretkey", {expiresIn:'1h'});
}

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
