const express = require('express');
const router  = express.Router();
const request = require("../request")
const axios = require("axios")

router.post('/postLogin', async function(req, res, next) {
	try {
		const dataLogin = await request.Loginpost("admin/login", {}, req.body)
		
		// console.log("<<<==== statusCode2 ====>>>",dataLogin)
		if(dataLogin.data.statusCode == 200){
			req.session.token = dataLogin.data.data
			const dataUser = await request.get("admin/profile", dataLogin.data.data)
			req.session.user = {
				name: dataUser.data.data.email,
				role: dataUser.data.data.role,
				id: dataUser.data.data.id
			}
			res.redirect("/dashboard")
		} else {
			req.session.loginMessage = "failed"
			res.redirect("/")
		}
	} catch {
		req.session.loginMessage = "failed"
		let block = req.session.loginMessage 
		
		if(block > 2){
			console.log("<<<==== statusCode ====>>>", block)
		}

		res.redirect("/")
	}
});

router.get('/logout', function(req, res, next) {
	req.session.destroy(function(err) {
		res.redirect("/")
	})
});

module.exports = router;
