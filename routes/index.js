/** @format */

const express = require("express");
const router = express.Router();
const request = require("../request");
// const moment = require("moment");
const moment = require("moment-timezone");
const axios = require("axios");

router.get("/", async function (req, res, next) {
  const loginMessage = req.session.loginMessage;
  res.render(
    "pages/login",
    {
      title: "Login",
      message: loginMessage,
    },
    (req.session.loginMessage = null)
  );
});

router.get("/dashboard", async function (req, res, next) {
  try {
    const token = req.session.token;
    const dashboardData = await request.get("devices?limit=0&offset=0", token);
    const getPulsa = await request.get("providers/all", token);
    const getMutation = await request.get("mutation", token);
    let sendData = dashboardData.data.data.devices;
    let coundDeveice = dashboardData.data.data.devices;
    let sendDataExp = {};
    const allData = [];

    let portActive = coundDeveice.filter((val) => {
      return val.isActive == true;
    });
    let portOff = coundDeveice.filter((val) => {
      return val.isActive == false;
    });
    let portBooked = coundDeveice.filter((val) => {
      return val.isBooked == true;
    });
    let portIdle = coundDeveice.filter((val) => {
      return val.isBooked == false;
    });
    let portTimeout = coundDeveice.filter((val) => {
      return val.simNumber == undefined || val.simNumber == "";
    });
    let portSuccess = getPulsa.data.data.filter((val) => {
      return val.number;
    });
    sendData.sort(function (a, b) {
      return a.port.localeCompare(b.port);
    });

    coundDeveice.forEach((val, idx) => {
      if (val.dial_message) {
        if (val.dial_message.match(/\d{2}([\/.-])\d{2}\1\d{4}/g) != null) {
          sendDataExp = val.dial_message.match(/\d{2}([\/.-])\d{2}\1\d{4}/g);
        } else {
          sendDataExp = "Unconnected";
        }
      } else {
        sendDataExp = "Unconnected";
      }
      let providerCard = val.server.split(":");
      allData.push({
        _id: val._id,
        isActive: val.isActive,
        simNumber: val.simNumber,
        isBooked: val.isBooked,
        port: val.port,
        dial_message: val.dial_message,
        deviceKey: val.deviceKey,
        simExp: sendDataExp,
      });
    });

    if (dashboardData) {
      res.render(
        "pages/dashboard",
        {
          title: "Dashboard",
          user: req.session.user,
          dataDashboard: allData,
          dataPulsa: getPulsa.data.data,
          dataMutation: getMutation.data.data,
          active: portActive.length,
          off: portOff.length,
          booked: portBooked.length,
          idle: portIdle.length - portOff.length - portTimeout.length,
          alertnotif: req.session.alertnotif,
          timeout: portTimeout.length,
        },
        (req.session.alertnotif = undefined)
      );
    } else {
      res.redirect("/auth/logout");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/auth/logout");
  }
});

// router.get("/bulk_transfer_pulsa", async function (req, res, next) {
//   try {
//     const token = req.session.token;

//     const getNumber = await request.get("providers/all", token);

//     const getHisBulk = await request.get(
//       "exchange/history?limit=0&offset=0",
//       token
//     );

//     if (getNumber) {
//       res.render(
//         "pages/bulkTransfer",
//         {
//           title: "Bulk Trasfer",
//           user: req.session.user,
//           dataNumber: getNumber.data.data,
//           dataHistoryBulk: getHisBulk.data.data.exchanges,
//           moment: moment,
//           alertnotif: req.session.alertnotif,
//         },
//         (req.session.alertnotif = undefined)
//       );
//     }
//   } catch (err) {
//     console.log(err);
//     res.redirect("/transfer_pulsa");
//   }
// });

// router.post("/req_bulk_transfer_pulsa", async function (req, res, next) {
//   try {
//     const token = req.session.token;

//     const reqPulsaBulk = await request.post(
//       "exchange/transfer",
//       token,
//       req.body
//     );

//     if (reqPulsaBulk.data.statusCode === 200) {
//       req.session.alertnotif = "success";
//       res.redirect("/dashboard");
//     }
//   } catch (err) {
//     console.log(err);
//     res.redirect("/transfer_pulsa");
//   }
// });

module.exports = router;
