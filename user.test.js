const MongoClient = require("mongodb").MongoClient;
const User = require("./user")
const { faker } = require('@faker-js/faker');

const username    = faker.internet.userName();
const password    = faker.internet.password();
const id          = faker.random.numeric(4);
const name        = faker.name.findName();

const jwt = require('jsonwebtoken');
const { request } = require("express");
function generateAccessToken(payload) {
	return jwt.sign(payload, "secretkey", {expiresIn:'1h'});
}

describe("User Details", () => {
  let client;
  beforeAll(async () => {
    client = await MongoClient.connect(
      "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.wigci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		{ useNewUrlParser: true },
		);
		User.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("User login successfully", async () => {
		const res = await User.login("Oswald74", "$2a$10$32fQJZG9XzaqTziXE0yleOFhKV3HLz48NkrAPYBcV2AoxAFeagapy")
        expect(res).toBe("Login User Success")
  	})

	test("User login failed", async () => {
		const res = await User.login("Oswald74", "1235")
		expect(res).toBe("invalid password")
	})

	test("New User registration", async () => {
		const res = await User.register(username, password ,id, name, "user")
		expect(res).toBe("new user registered")
	})

	test("Duplicate username", async () => {
		const res = await User.register(username, password ,id, name, "user")
		expect(res).toBe("username already existed")
	})

	test("Delete User", async () => {
		const res = await User.delete("Princess.Trantow20")
		expect(res).toBe("delete data successfully")
	})

	test("View",  async () => {
		const res = await User.view("Oswald74")
		expect(res.username).toBe("Oswald74")
	})

	});

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
