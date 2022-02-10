const express = require('express');
const router = express.Router();
const request = require("../request")
const moment = require("moment")

router.get('/', async function(req, res, next) {
	const loginMessage = req.session.loginMessage
  	res.render('pages/login', { 
		title: 'Login',
		message : loginMessage
	}, req.session.loginMessage = null)
});

router.get('/dashboard', async function(req, res, next) {
	try {
		const token = req.session.token
		const dashboardData = await request.get("devices?limit=0&offset=0", token)
		const getPulsa = await request.get("providers/all", token)
		const getMutation = await request.get("mutation", token)
		// console.log("<<<==== dashboardData ====>>>", dashboardData.data)
		
		if(dashboardData){
			res.render('pages/dashboard', { 
				title: 'Dashboard',
				user : req.session.user,
				dataDashboard: dashboardData.data.data,
				dataPulsa: getPulsa.data.data,
				dataMutation: getMutation.data.data
			});
		} else {
			res.redirect("/auth/logout")
		}
	} catch {
		res.redirect("/auth/logout")
	}
});

router.post('/update', async function(req, res, next) {
    try {
		let dataStatus = ""
		let cekStatus = ""

		if(req.body.status == "true"){
			dataStatus = {
				id: req.body.id, 
				status: false
			}
		}else{
			dataStatus = {
				id: req.body.id, 
				status: true 
			}
		}
		// console.log("<<<==== req.body.true ====>>>", req.body.status)
		const token = req.session.token
		const dataRecive = await request.get("devices?limit=0&offset=0", token)
		let resDevice = dataRecive.data.data.devices

		for(let i in resDevice){
			if(resDevice[i].deviceKey === req.body.key){
				const dataKey = await request.put("devices/update-status", token, dataStatus)
				if(dataKey.status === 200){
					res.redirect("/dashboard")
				} else {
					res.redirect("/post")
				}
			}
		}
	} catch {
		res.redirect("/post")
	}
});

router.post('/renewpulsa', async function(req, res, next) {
    try {
		const token = req.session.token
		const dataRenew = await request.get("devices?limit=0&offset=0", token)

		console.log("<<<==== dataRenew ====>>>", dataRenew.data.statusCode)

		if(dataRenew){
			res.render('modals/general_modals/modal_renew_pulsa', { 
				title: 'Dashboard',
				dataDial: dashboardData.data.data,
			});
		}
	} catch {
		res.redirect("/dashboard")
	}
});

module.exports = router;
