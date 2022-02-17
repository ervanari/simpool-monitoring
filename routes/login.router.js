const express = require('express');
const router  = express.Router();
const request = require("../request")
const axios = require("axios")

router.post('/postLogin', async function(req, res, next) {
	var nbe = 0;
	var err = 0;
	var errorCount = [];
	try {
		const dataLogin = await request.Loginpost("admin/login", {}, req.body)
		
		// console.log("<<<==== statusCode2 ====>>>",dataLogin)
		if(dataLogin.data.statusCode == 200){
			try {
				req.session.token = dataLogin.data.data
				const dataUser = await request.get("admin/profile", dataLogin.data.data)
				req.session.user = {
					name: dataUser.data.data.email,
					role: dataUser.data.data.role,
					id: dataUser.data.data.id
				}
				res.redirect("/dashboard")
			} catch {
				res.redirect("/")
			}
		} else {
			req.session.loginMessage = "failed"
			res.redirect("/")
		}
	} catch (e){
		req.session.loginMessage = "failed"
		let block = req.session.loginMessage 
		
		let error = {
			err: e.response.data
		}
		errorCount.push(e.response.data)

		// console.log("<<<==== jancokk ====>>>", errorCount)
		
		res.redirect("/")
	}
});

router.get('/logout', function(req, res, next) {
	req.session.destroy(function(err) {
		res.redirect("/")
	})
});

module.exports = router;
