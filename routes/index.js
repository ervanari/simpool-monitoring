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
    res.redirect("/post");
  }
});

router.post("/renewpulsa", async function (req, res, next) {
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

router.post("/requestpulsa", async function (req, res, next) {
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

router.get("/status_services", async function (req, res, next) {
  try {
    const token = req.session.token;
    const StatusService = await request.actget("monitoring");
    const LogService = await request.get("activities?limit=0&offset=0", token);

    console.log("LogService ==>> ", LogService);

    if (StatusService) {
      res.render(
        "pages/statusService",
        {
          title: "Status Service",
          user: req.session.user,
          dataServiceStatus: StatusService.data.status,
          dataServiceKey: StatusService.data.key,
          dataLog: LogService.data.data.activities,
          alertnotif: req.session.alertnotif,
        },
        (req.session.alertnotif = undefined)
      );
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/control_service", async function (req, res, next) {
  try {
    let data = {
      run: req.body.run,
      key: req.body.keyser,
    };
    const rest = res;
    const reqs = req;
    // const service_control = await request.actpost(
    //   "http://116.0.1.72:3003/monitoring/run",
    //   data
    // );
    // console.log("service_control ==>> ", service_control);

    axios({
      method: "post",
      url: "http://116.0.1.72:3003/monitoring/run",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        origin: "http://localhost:3002",
      },
      data: data,
    }).then(function (res) {
      if (res.status == 200) {
        reqs.session.alertnotif = "success";
        rest.redirect("/status_services");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/mutationpay", async function (req, res, next) {
  try {
    const token = req.session.token;

    let header = {
      api_key: "47d13777-186d-4dc5-b2c3-30f906c69e74",
    };
    const getMutation = await request.get("mutation", token, {
      headers: header,
    });

    const mutate = getMutation.data.data;
    let mutasi = mutate.reverse();
    let dataAllMutations = [];

    // mutasi.sort(function (a, b) {
    //   return b - a;
    // });

    for (let i in mutasi) {
      let datetime = mutasi[i].createdAt;
      let mutdate = new Date(datetime);
      const asiaDate = mutdate.toLocaleString("id", {
        weekday: "short",
        month: "short",
        year: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Asia/Jakarta",
        timeZoneName: "short",
      });

      dataAllMutations.push({
        createdAt: asiaDate,
        balance: mutasi[i].balance,
        number: mutasi[i].number,
      });
    }

    if (getMutation) {
      res.render("pages/mutations", {
        title: "Mutation",
        user: req.session.user,
        dataMutation: dataAllMutations,
        moment: moment,
      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
});

router.get("/inbox", async function (req, res, next) {
  try {
    const token = req.session.token;

    const getInbox = await request.get("sms?limit=0&offset=0", token);

    const ibx = getInbox.data.data.sms;
    let dataAllInbox = [];

    for (let i in ibx) {
      let datetime = ibx[i].createdAt;
      let mutdate = new Date(datetime);
      const asiaDate = mutdate.toLocaleString("id", {
        weekday: "short",
        month: "short",
        year: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Asia/Jakarta",
        timeZoneName: "short",
      });
      dataAllInbox.push({
        createat: asiaDate,
        ports: ibx[i].device,
        pesan: ibx[i].message,
        frompesan: ibx[i].from,
        notujuan: ibx[i].to,
      });
    }

    if (getInbox) {
      res.render("pages/inbox", {
        title: "Inbox",
        user: req.session.user,
        dataInbox: dataAllInbox,
        moment: moment,
      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
});

router.get("/transfer_pulsa", async function (req, res, next) {
  try {
    const token = req.session.token;
    const getNumber = await request.get("providers/all", token);

    const getHisSingle = await request.get(
      "exchange/history?limit=0&offset=0",
      token
    );

    if (getNumber) {
      res.render(
        "pages/singleTransfer",
        {
          title: "Single Transfer",
          user: req.session.user,
          dataNumber: getNumber.data.data,
          dataHistory: getHisSingle.data.data.exchanges,
          moment: moment,
          alertnotif: req.session.alertnotif,
        },
        (req.session.alertnotif = undefined)
      );
    }
  } catch (err) {
    console.log(err);
    res.redirect("/transfer_pulsa");
  }
});

router.post("/req_transfer_pulsa", async function (req, res, next) {
  try {
    const token = req.session.token;

    let sendData = {
      port: req.body.port,
      phone: req.body.phone,
      amount: parseInt(req.body.amount),
      provider: req.body.provider,
    };

    const reqPulsa = await request.post("exchange/transfer", token, sendData);
    // console.log(reqPulsa);

    if (reqPulsa.data.statusCode === 200) {
      req.session.alertnotif = "success";
      res.redirect("/transfer_pulsa");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/transfer_pulsa");
  }
});

router.get("/bulk_transfer_pulsa", async function (req, res, next) {
  try {
    const token = req.session.token;

    const getNumber = await request.get("providers/all", token);

    const getHisBulk = await request.get(
      "exchange/history?limit=0&offset=0",
      token
    );

    if (getNumber) {
      res.render(
        "pages/bulkTransfer",
        {
          title: "Bulk Trasfer",
          user: req.session.user,
          dataNumber: getNumber.data.data,
          dataHistoryBulk: getHisBulk.data.data.exchanges,
          moment: moment,
          alertnotif: req.session.alertnotif,
        },
        (req.session.alertnotif = undefined)
      );
    }
  } catch (err) {
    console.log(err);
    res.redirect("/transfer_pulsa");
  }
});

router.post("/req_bulk_transfer_pulsa", async function (req, res, next) {
  try {
    const token = req.session.token;

    const reqPulsaBulk = await request.post(
      "exchange/transfer",
      token,
      req.body
    );

    if (reqPulsaBulk.data.statusCode === 200) {
      req.session.alertnotif = "success";
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/transfer_pulsa");
  }
});

module.exports = router;
