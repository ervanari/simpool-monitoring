const express = require('express');
const router  = express.Router();
const request = require("../request")

router.post('/postLogin', async function(req, res, next) {
	try {
		const dataLogin = await request.post("auth/login", {}, req.body)
		if(dataLogin.data.message === "success"){
			req.session.token = dataLogin.data.data.token
			res.redirect("/dashboard")
		} else {
			res.redirect("/")
		}
	} catch {
		res.redirect("/")
	}
});

router.get('/logout', function(req, res, next) {
	req.session.destroy(function(err) {
		res.redirect("/")
	})
});

module.exports = router;
