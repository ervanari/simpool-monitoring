/** @format */

const express = require("express");
const router = express.Router();
const request = require("../request");
const moment = require("moment");

// router.get("/", async function (req, res, next) {
//   try {
//     const token = req.session.token;
//     let data = {
//       number: "081324688152",
//       from: "2021-03-29 00:00:01",
//       to: "2022-03-29 23:59:01",
//       limit: 100,
//       offset: 0,
//       sort: "desc",
//     };

//     const reqmutations = await request.post("mutation", token, data);
//     console.log("#################" + reqmutations + "################");

//     if (reqmutations) {
//       res.render("pages/mutations", {
//         title: "Mutation",
//         user: req.session.user,
//         // dataMutation: allData,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.redirect("/dashboard");
//   }
// });

// router.get("/", async function (req, res) {
//   try {
//     const token = req.session.token;
//     let data = {
//       number: "081324688152",
//       from: "2021-03-29 00:00:01",
//       to: "2022-03-29 23:59:01",
//       limit: 100,
//       offset: 0,
//       sort: "desc",
//     };

//     let header = {
//       api_key: "47d13777-186d-4dc5-b2c3-30f906c69e74",
//     };
// axios({
//   method: "post",
//   url: process.env.API_URL + "mutation",
//   headers: {
//     "Content-Type": "application/json",
//     api_key: "47d13777-186d-4dc5-b2c3-30f906c69e74",
//   },
//   data: datas,
// }).then(function (res) {
//   result = res.data;
// });
//     const reqmutations = await request.post("mutation", data, {
//       headers: header,
//     });
//     console.log("#################" + reqmutations + "################");

//     if (reqmutations) {
//       res.render("pages/mutations", {
//         title: "Mutation",
//         user: req.session.user,
//         // dataMutation: allData,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.redirect("/dashboard");
//   }
//   res.send("kuntul");
// });

module.exports = router;
