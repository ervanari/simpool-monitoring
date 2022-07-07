/** @format */

const express = require("express");
const router = express.Router();
const request = require("../request");
const moment = require("moment");

router.get("/", async function (req, res, next) {
  try {
    const token = req.session.token;
    const payload = {
        limit: 10,
        offset: 0,
        sort: "asc"
    }
    const historypay = await request.post("payment/history", token, payload);
    console.log("historypaydata ====>>>>",historypay.data.data.payments)

    if (historypay) {
      res.render("pages/historyPayment", {
        title: "History Payment",
        user: req.session.user,
        dataPayment: historypay.data.data.payments,
        dataInvoice: historypay.data.data.invoices,
        moment: moment,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
