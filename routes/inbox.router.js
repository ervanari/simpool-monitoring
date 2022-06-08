/** @format */

const express = require("express");
const router = express.Router();
const request = require("../request");
const moment = require("moment");

router.get("/", async function (req, res, next) {
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

module.exports = router;
