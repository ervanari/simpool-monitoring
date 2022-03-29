/** @format */

const express = require("express");
const router = express.Router();
const request = require("../request");
const moment = require("moment");
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
      return val.simNumber == undefined;
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
      //   console.log("<<<==== coundDeveice ====>>>", sendDataExp);

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
      res.render("pages/dashboard", {
        title: "Dashboard",
        user: req.session.user,
        dataDashboard: allData,
        dataPulsa: getPulsa.data.data,
        dataMutation: getMutation.data.data,
        active: portActive.length,
        off: portOff.length,
        booked: portBooked.length,
        idle: portIdle.length,
        // expired: portExpired,
        timeout: portTimeout.length,
      });
    } else {
      res.redirect("/auth/logout");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/auth/logout");
  }
});

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
    res.redirect("/post");
  }
});

router.post("/renewpulsa", async function (req, res, next) {
  try {
    const token = req.session.token;
    const dataRenew = await request.post("devices/ussdDial", token, req.body);

    if (dataRenew.data.statusCode === 200) {
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
});

router.post("/requestpulsa", async function (req, res, next) {
  try {
    const token = req.session.token;
    const reqpulsa = await request.post(
      "providers/requestBalance",
      token,
      req.body
    );
    // console.log(reqpulsa);
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
});

router.post("/search_data", async function (req, res, next) {
  try {
    const token = req.session.token;
    const dashboardData = await request.get("devices?limit=0&offset=0", token);
    const getPulsa = await request.get("providers/all", token);
    const getMutation = await request.get("mutation", token);
    let sendData = dashboardData.data.data.devices;
    let finds = dashboardData.data.data.devices;
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
      return val.simNumber == undefined;
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
      //   console.log("<<<==== coundDeveice ====>>>", sendDataExp);

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

    let newList = [];
    for (let i in finds) {
      let dataNumber = String(finds[i].simNumber).includes(req.body.elSearch);
      let dataPort = String(finds[i].port).includes(req.body.elSearch);
      if (dataNumber == true || dataPort == true) {
        newList.push(finds[i]);
      }
    }

    if (dashboardData) {
      res.render("pages/dashboard", {
        title: "Dashboard",
        user: req.session.user,
        dataDashboard: newList,
        dataPulsa: getPulsa.data.data,
        dataMutation: getMutation.data.data,
        active: portActive.length,
        off: portOff.length,
        booked: portBooked.length,
        idle: portIdle.length,
        timeout: portTimeout.length,
      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
});

router.get("/status_services", async function (req, res, next) {
  try {
    const StatusService = await request.actget("monitoring");
    const LogService = await request.actget("monitoring/log");

    if (StatusService) {
      res.render("pages/statusService", {
        title: "Status Service",
        user: req.session.user,
        dataService: StatusService.data.status,
        dataLog: LogService.data.data,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/control_service", async function (req, res, next) {
  try {
    console.log("############### " + req.body.run + " ##################");
    let data = {
      run: req.body.run,
    };

    axios({
      method: "post",
      url: "http://116.0.1.72:3003/monitoring/run",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        origin: "http://localhost:3002",
      },
      data: data,
    }).then(function (res) {
      console.log(res.data);
      if (res.status == 200 || res.status == 500) {
        res.redirect("/dashboard");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
