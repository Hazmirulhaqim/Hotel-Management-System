const supertest = require('supertest');
const request = supertest('http://localhost:3000');

describe('Express Route Test', function () {
	it('should return dibah server', async () => {
    	return request.get('/hello')
			.expect(200)
			.expect('Content-Type', /text/)
			.then(res => {
				expect(res.text).toBe('Hello BENR2423');
    	});
  	})

  	it('login successfully', async () => {
    	return request
			.post('/login')
			.send({username: 'muhammad', password: 'momo78' })
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
					expect.objectContaining({
						_id  : expect.any(String),
						name : expect.any(String),
						age  : expect.any(Number),
					})
				);
		});
  	});

  	it('login failed', async () => {
    	return request
			.post('/login')
			.send({username: 'muhammad', password: "1111" })
			.expect('Content-Type', /text/)
			.expect(404)
			.then(response => {
				expect(response.text).toEqual("Login failed")
		});
  	});

  	it('register', async () => {
    	return request
			.post('/register')
			.send({username : 'adibah', password: "dibah412" })
			.expect('Content-Type', /text/)
			.expect(200)
			.then(response => {
				expect(response.text).toEqual("new user registered");
		});
  	});

 	it('register failed', async () => {
    	return request
      		.post('/register')
      		.send({username: 'lattyfa', password: "12489"})
      		.expect('Content-Type', /text/)
      		.expect(404).then(response => {
        		expect(response.text).toEqual("the username already exist");
      	});
  	});

 	it('update successfully', async () => {
    	return request
        	.patch('/update')
    	    .send({username: 'muhammad'})
        	.expect(200)
 	});
  
 	// it('delete successfully', async () => {
    // 	return request
	// 		.delete('/delete')
	// 		.send({username : 'asilaa', password: "bhyvux"})
	// 		.expect('Content-Type', /text/)
	// 		.expect(200).then(response => {
	// 			expect(response.text).toEqual("delete successfully");
	// 	});
 	// })
});
