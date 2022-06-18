const MongoClient   = require("mongodb").MongoClient;
const Visitor       = require("./visitor")
const { faker }     = require('@faker-js/faker');

// const idClient      = faker.random.numeric(4);
// const nameClient    = faker.name.findName();
// const age           = faker.random.numeric(2);
// const gender        = faker.name.gender(true);
// const contactClient = faker.phone.phoneNumber();
// const company       = faker.company.bs();
// const idApp         = faker.random.numeric(6);
// const date          = faker.date.soon() ;
// const time          = faker.address.timeZone ;
//const purpose       = faker; 

describe("VISITOR DETAILS", () => {
	let visitor;
	beforeAll(async () => {
		visitor = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.wigci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		Visitor.injectDB(visitor);
	})

	afterAll(async () => {
		await visitor.close();
	})

    test("New Visitor Registration", async () => {
        const res = await Visitor.VisitorRegister("8765", "ketam" ,"ketamranggi69@gmail.com" ,"A022","F1")
        expect(res).toBe("new visitor registered")
    })


//   test("User duplicate staff number", async () => {
//     const res = await Visitor.VisitorRegister("Messi", "0187261523" ,"30" ,"Lestari","2.00PM","20/10/2022","Thiago","Father","Family","300A")
//     expect(res).toBe("visit id existed")
//   })

//   test("Find Client", async () => {
//     const res = await Visitor.vwvisitor("Arthur Shelby")
//     expect(res.id).toBe(nameClient),
//     expect(res.name).toBe(nameClient),
// 	expect(res.phonenumber).toBe(phonenumber),
// 	expect(res.visitid).toBe(visitid),
// 	expect(res.block).toBe(block),
// 	expect(res.time).toBe(time),
// 	expect(res.date).toBe(date),
// 	expect(res.tovisit).toBe(tovisit),
// 	expect(res.Relationship).toBe(Relationship),
// 	expect(res.reason).toBe(reason),
// 	expect(res.parking).toBe(parking)
//   })

    test("No visitor", async () => {
        const res = await Visitor.vwvisitor("paan")
        expect(res).toBe("Username cannot be found")
    })
    
    test("UPDATE ROOM", async()=>{
        const res = await Visitor.updateroom("ketam","A023")
        expect(res.name).toBe("ketam"),
        expect(res.room).toBe("A023")
    })

    test("UPDATE FLOOR", async()=>{
        const res = await Visitor.updatefloor("ketam","F2")
        expect(res.name).toBe("ketam"),
        expect(res.floor).toBe("F2")
    })

    test("DELETE", async () => {
        const res = await Visitor.delete("aina")
        expect(res.nameClient).toBe("aina")
    });

    test("View",  async () => {
        const res = await Visitor.vwvisitor("adibah")
        expect(res.username).toBe("adibah")
    })
})