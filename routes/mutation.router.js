/** @format */

const express = require("express");
const router = express.Router();
const request = require("../request");
const moment = require("moment");

router.get("/", async function (req, res, next) {
  try {
    const token = req.session.token;

    let header = {
      api_key: "47d13777-186d-4dc5-b2c3-30f906c69e74",
    };
    const getMutation = await request.get("mutation?limit=0&offset=0", token);


    let mutate = getMutation.data.data;
    // let mutasi = mutate.reverse();
    let dataAllMutations = [];

    for (let i in mutate) {
      let datetime = mutate[i].createdAt;
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
        balance: mutate[i].balance,
        number: mutate[i].number,
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

module.exports = router;
