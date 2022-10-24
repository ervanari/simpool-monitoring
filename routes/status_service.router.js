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

module.exports = router;
