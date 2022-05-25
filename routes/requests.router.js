/** @format */

const express = require("express");
const router = express.Router();
const request = require("../request");
const moment = require("moment");

router.post("/update", async function (req, res, next) {
  try {
    let dataStatus = "";
    let cekStatus = "";

    if (req.body.status == "true") {
      dataStatus = {
        id: req.body.id,
        status: false,
      };
    } else {
      dataStatus = {
        id: req.body.id,
        status: true,
      };
    }
    // console.log("<<<==== req.body.true ====>>>", req.body.status)
    const token = req.session.token;
    const dataRecive = await request.get("devices?limit=0&offset=0", token);
    let resDevice = dataRecive.data.data.devices;

    for (let i in resDevice) {
      if (resDevice[i].deviceKey === req.body.key) {
        try {
          const dataKey = await request.put(
            "devices/update-status",
            token,
            dataStatus
          );

          if (dataKey.status === 200) {
            req.session.alertnotif = "success";
            res.redirect("/dashboard");
          }
        } catch (err) {
          // res.redirect("/dashboard");
          alert(err);
          console.log(err);
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
});

router.post("/ussd", async function (req, res, next) {
  try {
    const token = req.session.token;
    const dataRenew = await request.post("devices/ussdDial", token, req.body);

    if (dataRenew.data.statusCode === 200) {
      req.session.alertnotif = "success";
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
});

router.post("/cek-pulsa", async function (req, res, next) {
  try {
    const token = req.session.token;
    const reqpulsa = await request.post(
      "providers/requestBalance",
      token,
      req.body
    );

    if (reqpulsa.data.statusCode == 200) {
      req.session.alertnotif = "success";
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
});

router.post("/filtering-provider", async function (req, res, next) {
  try {
    const token = req.session.token;
    const dashboardData = await request.get("devices?limit=0&offset=0", token);
    const getPulsa = await request.get("providers/all", token);
    const getMutation = await request.get("mutation", token);
    let sendData = dashboardData.data.data.devices;
    let finds = dashboardData.data.data.devices;
    let coundDeveice = dashboardData.data.data.devices;
    let sendDataExp = {};
    const newList = [];

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
      return val.simNumber == undefined;
    });
    sendData.sort(function (a, b) {
      return a.port.localeCompare(b.port);
    });

    finds.forEach((val, idx) => {
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
      let dataNumber = String(val.server).includes(req.body.eldata);
      if (dataNumber == true) {
        newList.push({
          _id: val._id,
          isActive: val.isActive,
          simNumber: val.simNumber,
          isBooked: val.isBooked,
          port: val.port,
          dial_message: val.dial_message,
          deviceKey: val.deviceKey,
          simExp: sendDataExp,
          provider: providerCard[1],
        });
      }
      if (req.body.eldata == "all") {
        newList.push({
          _id: val._id,
          isActive: val.isActive,
          simNumber: val.simNumber,
          isBooked: val.isBooked,
          port: val.port,
          dial_message: val.dial_message,
          deviceKey: val.deviceKey,
          simExp: sendDataExp,
          provider: providerCard[1],
        });
      }
    });

    if (dashboardData) {
      res.render(
        "pages/dashboard",
        {
          title: "Dashboard",
          user: req.session.user,
          dataDashboard: newList,
          dataPulsa: getPulsa.data.data,
          dataMutation: getMutation.data.data,
          active: portActive.length,
          off: portOff.length,
          booked: portBooked.length,
          idle: portIdle.length - portOff.length - portTimeout.length,
          timeout: portTimeout.length,
          alertnotif: req.session.alertnotif,
        },
        (req.session.alertnotif = undefined)
      );
    }
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
});

module.exports = router;
