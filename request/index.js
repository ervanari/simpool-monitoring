/** @format */

const axios = require("axios");

const get = async (path, token, params = null) => {
  return await axios({
    url: process.env.API_URL + path,
    method: "GET",
    headers: {
      authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    params: params,
  });
};

const post = async (path, token, params = null) => {
  return await axios({
    url: process.env.API_URL + path,
    method: "POST",
    headers: {
      authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    data: params,
  });
};

const put = async (path, token, params = null) => {
  return await axios({
    url: process.env.API_URL + path,
    method: "PUT",
    headers: {
      authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    data: params,
  });
};

const Loginpost = async (path, token, params = null) => {
  return await axios({
    url: process.env.API_URL + path,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: params,
  });
};

const actget = async (path, token, params = null) => {
  return await axios({
    url: "http://116.0.1.72:3003/" + path,
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      origin: "http://localhost:3002",
    },
    data: params,
  });
};

const actpost = async (path, token, params = null) => {
  return await axios({
    url: "http://116.0.1.72:3003/" + path,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      origin: "http://localhost:3002",
    },
    data: params,
  });
};

const postmutation = async (path, token, params = null) => {
  return await axios({
    url: process.env.API_URL + path,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      api_key: "47d13777-186d-4dc5-b2c3-30f906c69e74",
    },
  });
};

module.exports = { get, post, Loginpost, put, actget, actpost, postmutation };
