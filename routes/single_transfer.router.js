/** @format */

const express = require("express");
const router = express.Router();
const request = require("../request");
const moment = require("moment");

router.get("/", async function (req, res, next) {
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
    res.redirect("/single-transfer");
  }
});

router.post("/out", async function (req, res, next) {
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
      res.redirect("/single-transfer");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/single-transfer");
  }
});

module.exports = router;
