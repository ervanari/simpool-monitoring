/** @format */

const express = require("express");
const router = express.Router();
const request = require("../request");
const moment = require("moment");
const axios = require("axios");

router.get("/", async function (req, res, next) {
  try {
    const token = req.session.token;
    const StatusService = await request.actget("monitoring");
    const LogService = await request.get("activities?limit=0&offset=0", token);

    // console.log("LogService ==>> ", LogService);

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
        rest.redirect("/service");
      } else {
        rest.redirect("/service");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
