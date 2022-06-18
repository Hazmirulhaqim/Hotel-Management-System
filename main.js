const MongoClient = require("mongodb").MongoClient;
const User        = require("./user");
const Visitor     = require("./visitor");
const Security    = require("./security");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.wigci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true},
	).catch(err => {
	    console.error(err.stack)
	    process.exit(1)
    }).then(async client => {
	    console.log('Connected to MongoDB');
	    User.injectDB(client);
	    Visitor.injectDB(client);
		Security.injectDB(client);
    })

    const express      = require('express');
	const { userInfo } = require ("os");
    const app          = express()
    const port         = process.env.PORT || 3000

    const swaggerUi    = require('swagger-ui-express');
    const swaggerJsdoc = require('swagger-jsdoc');
    const options = {
	    definition: {
		    openapi: '3.0.0',
		    info: {
			    title: 'MyVMS API',
			    version: '1.0.0',
		    },
	},
	apis: ['./main.js'], 
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//USER LOGIN 
app.post('/login/user', async (req, res) => {
	//console.log(req.body)
	let user = await User.login(req.body.username, req.body.password, req.body.id, req.body.name, req.body.role)
	if (user == "invalid password" || user == "invalid username"){
		res.status(404)
	}
	else{
		return res.status(200).json({
			username			: user.username,
			"User ID"  		    : user.id,
			"User Name"		    : user.name,

			role	: user.role,
			token	: generateAccessToken({
				role: user.role
			}),
		});
	}
})

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username: 
 *           type: string
 *         password: 
 *           type: string
 *         User ID:
 *           type: string
 *         User Name:
 *           type: string     
 */

/**
 * @swagger
 * /login:
 *   post:
 *     description: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *               User ID:
 *                 type: string
 *               User Name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid username or password
 */


//REGISTER USER
app.post('/register/user', async (req, res) => {
    const reg = await Staff.register(req.body.username, req.body.password, req.body.id, req.body.name, req.body.role)
    if(req.user.role == "security"){
      if (reg == "username already existed"){
        return res.status(404).send("The username already existed")
    }
    else if(reg == "user id existed"){
        return res.status(404).send("The username already existed")
    }
    else{
        return res.status(200).send("New User registered")
    }
    }
    else{
      return res.status(403).send('Unauthorized')
    }
})

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     User:
//  *       type: object
//  *       properties:
//  *         username: 
//  *           type: string
//  *         password: 
//  *           type: string
//  *         User ID:
//  *           type: string
//  *         User Name:
//  *           type: string
//  */

// /**
//  * @swagger
//  * /register:
//  *   post:
//  *     description: Register Login
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema: 
//  *             type: object
//  *             properties:
//  *               username: 
//  *                 type: string
//  *               password: 
//  *                 type: string
//  *               User ID:
//  *                 type: string
//  *               User Name:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Successful Register User
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       401:
//  *         description: Invalid username or password
//  */


//DELETE USER
app.delete('/delete/user', async (req, res) => {
	const dels = await Staff.delete(req.body.username)
	if(req.user.role == "security"){
		if (dels == "user is not exist"){
		return res.status(404).send("User is not exist")
		}
		else {
		return res.status(200).json({
			status: "user deleted"
		})
		} 
	}
		else{
		return res.status(403).send('Unauthorized')
		} 
})

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     User:
//  *       type: object
//  *       properties:
//  *         username: 
//  *           type: string
//  *         password: 
//  *           type: string
//  */

// /**
//  * @swagger
//  * /delete:
//  *   delete:
//  *     description: User Delete
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema: 
//  *             type: object
//  *             properties:
//  *               username: 
//  *                 type: string
//  *               password: 
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Successful delete user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/User'
//  *       401:
//  *         description: Invalid username or password
//  */

//SECURITY LOGIN
app.post('/login/security', async (req, res) => {
    const sec = await Security.logins(req.body.usernameManagement, req.body.passwordManagement, req.body.nameManagement, req.body.contactManagement, req.body.role)
    if (sec == "invalid password"||sec == "invalid username"){
      return res.status(404).send("wrong password or username")
    }
    else{
        return res.status(200).json({
			//"Security Username" 	: sec.usernameSecurity,
			"Management Contact"    : sec.contactManagement,
		  	"Management Name"     	: sec.nameManagement,

          	role	: sec.role,
          	token	: generateAccessToken({
            	role: sec.role
          	}),
        });
    }
})

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Security:
//  *       type: object
//  *       properties:
//  *         username: 
//  *           type: string
//  *         password: 
//  *           type: string
//  *         Management Contact:
//  *           type: string
//  *         Management Name:
//  *           type: string
//  */

// /**
//  * @swagger
//  * /login/security:
//  *   post:
//  *     description: Security Login
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema: 
//  *             type: object
//  *             properties:
//  *               username: 
//  *                 type: string
//  *               password: 
//  *                 type: string
//  *               Management Contact:
//  *                 type: string
//  *               Management Name:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Successful login management
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Security'
//  *       401:
//  *         description: Invalid username or password
//  */


//REGISTER CLIENT 
app.post('/register/visitor', async (req, res) => {
    const regvstr = await Visitor.VisitorRegister(req.body.idVisitor, req.body.nameVisitor, req.body.email, req.body.room, req.body.floor)
    if(req.user.role == "user"){
    	if (regvstr == "Visitor id existed"){
        	return res.status(200).send("visitor id existed")
    	}
    	else{
    		return res.status(200).send("New visitor registered")}
    }
    else{
    	return res.status(403).send('Unauthorized')}
})

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Visitor:
//  *       type: object
//  *       properties:
//  *         Visitor ID:
//  *           type: string
//  *         Visitor Name:
//  *           type: string
//  *         Visitor email:
//  *           type: string
//  *         Visitor Room:
//  *           type: string
//  *         Visitor Floor:
//  *           type: string
//  */

// /**
//  * @swagger
//  * /register/visitor:
//  *   post:
//  *     description: Register Login Visitor
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema: 
//  *             type: object
//  *             properties:
//  *        		 Visitor ID:
//  *          	   type: string
//  *         		 Visitor Name:
//  *           	   type: string
//  *               Visitor email:
//  *                 type: string
//  *               Visitor Room:
//  *                 type: string
//  *               Visitor Floor:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Successful Register Visitor
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Visitor'
//  *       401:
//  *         description: Invalid username or password
//  */

//UPDATE VISITOR ROOM
app.patch('/update/visitor/room', async (req, res) => {
	const upvstrd = await Visitor.updateroom(req.body.name, req.body.room)
	if(req.user.role == "user"){
	  if (upvstrd == "Visitor is not exist"){
		return res.status(404).send("visitor does not exist")
	}
	else{
		return res.status(200).json({
			name	: upvstrd.name,
			Updated	: "room to visit updated"
	  	})
	}  
	}
	else{
		return res.status(403).send('Unauthorized')
	}
})


// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Visitor:
//  *       type: object
//  *       properties:
//  *         Visitor ID:
//  *           type: string
//  *         Visitor Name:
//  *           type: string
//  *         Visitor email:
//  *           type: string
//  *         Visitor Room:
//  *           type: string
//  *         Visitor Floor:
//  *           type: string
//  */

// /**
//  * @swagger
//  * /update/visitor/Date:
//  *   patch:
//  *     description: Update Client Date
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema: 
//  *             type: object
//  *             properties:
//  *               Visitor ID:
//  *                 type: string
//  *               Visitor Name:
//  *                 type: string
//  *               Visitor email:
//  *                 type: string
//  *               Visitor Room:
//  *                 type: string
//  *               Visitor Floor:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Room updated
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Visitor'
//  *       401:
//  *         description: Invalid username or password
//  */


//UPDATE VISITOR FLOOR
app.patch('/update/visitor/floor', async (req, res) => {
  	const upvstrt = await Visitor.updatetime(req.body.name, req.body.floor)
  	if(req.user.role == "user"){
    	if (upvstrt == "Visitor is not exist"){
      		return res.status(404).send("visitor does not exist")
  	}
  	else{
    return res.status(200).json({
      	name	: upvstrt.name,
      	Updated	: "Floor updated"
    })
  	}  
  	}
  	else{
    	return res.status(403).send('Unauthorized')
  	}
})

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Visitor:
//  *       type: object
//  *       properties:
//  *         Visitor ID:
//  *           type: string
//  *         Visitor Name:
//  *           type: string
//  *         Visitor email:
//  *           type: string
//  *         Visitor Room:
//  *           type: string
//  *         Visitor Floor:
//  *           type: string
//  */

// /**
//  * @swagger
//  * /update/visitor/Time:
//  *   patch:
//  *     description: Update Client Time
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema: 
//  *             type: object
//  *             properties:
//  *               Visitor ID:
//  *                 type: string
//  *               Visitor Name:
//  *                 type: string
//  *               Visitor email:
//  *                 type: string
//  *               Visitor Room:
//  *                 type: string
//  *               Visitor Floor:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Floor updated
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Visitor'
//  *       401:
//  *         description: Invalid username or password
//  */

//DELETE VISITOR
app.delete('/delete/visitor', async (req, res) => {
	const del = await Visitor.delete(req.body.name)
	if(req.user.role == "user"){
	  if (del == "visitor is not exist"){
		return res.status(404).send("visitor is not exist")
	}
	else {
		return res.status(200).json({
			status: "delete data from collection"
		})
	} 
	}
	else{
		return res.status(403).send('Unauthorized')
	 
	} 
})

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Visitor:
//  *       type: object
//  *       properties:
//  *         Visitor ID: 
//  *           type: string
//  *         Visitor Name: 
//  *           type: string
//  */

// /**
//  * @swagger
//  * /delete/visitor:
//  *   delete:
//  *     description: Client Deleted
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema: 
//  *             type: object
//  *             properties:
//  *               Visitor ID: 
//  *                 type: string
//  *               Visitor Name: 
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Successful delete visitor
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Visitor'
//  *       401:
//  *         description: Invalid username or password
//  */


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

const jwt = require('jsonwebtoken');
function generateAccessToken(payload) {
	return jwt.sign(payload, "my-super-secret", { expiresIn: '1h' });
}

//only authorized person can access
app.use((req, res, next)=>{
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
  
	jwt.verify(token, "secretkey", (err,user)=>{
		console.log(err)
	  	if (err) return res.sendStatus(403)
	  		req.user = user
		next()
	})
});
