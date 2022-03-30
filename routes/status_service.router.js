/** @format */

const express = require("express");
const router = express.Router();
const request_act = require("../request");
const moment = require("moment");

// router.get("/status_services", async function (req, res, next) {
//   try {
//     const token = req.session.token;
//     const StatusService = await request.actget("monitoring");
//     const LogService = await request.actget("monitoring/log");
//     console.log(
//       "############### " + StatusService.data.status + " ##################"
//     );

//     // var getMonitoring = "";
//     // axios({
//     //   method: "get",
//     //   url: "http://116.0.1.72:3003/monitoring",
//     //   headers: {
//     //     "Content-Type": "application/json;charset=UTF-8",
//     //     origin: "http://localhost:3002",
//     //   },
//     // }).then(function (res) {
//     //   getMonitoring = res.data.status;
//     //   console.log("############### " + getMonitoring + " ##################");
//     // });

//     if (StatusService) {
//       res.render("pages/statusService", {
//         title: "Status Service",
//         user: req.session.user,
//         dataService: StatusService.data.status,
//         dataLog: LogService.data.data,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

module.exports = router;
