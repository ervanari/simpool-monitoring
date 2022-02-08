const express = require('express');
const router = express.Router();
const request = require("../request")

router.get('/', async function(req, res, next) {
  	res.render('pages/login', { title: 'Express' });
});

router.get('/dashboard', async function(req, res, next) {
	try {

		// const token = req.session.token
		// const dashboardData = await request.get("", token, null)

		// if(dashboardData){
			console.log("req.session.token => ", req.session.token);
			res.render('pages/dashboard', { title: 'Dashboard' });
		// } else {
		// 	res.redirect("/")	
		// }
	} catch {
		res.redirect("/")
	}
});

router.get('/category', async function(req, res, next) {
  	res.render('pages/category', { title: 'Express' });
});

router.get('/post', async function(req, res, next) {
  	res.render('pages/post', { title: 'Express' });
});

router.get('/generateApi', async function(req, res, next) {
  	res.render('pages/generateApi', { title: 'Express' });
});

router.get('/addUser', async function(req, res, next) {
  	res.render('pages/newUser', { title: 'Express' });
});

router.get('/listUser', async function(req, res, next) {
  	res.render('pages/allUser', { title: 'Express' });
});

module.exports = router;
