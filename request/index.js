const axios = require("axios")

const get = async (path, token, params=null) => {
    return await axios({
        url : process.env.API_URL+path,
        method : "GET",
        Headers : { authorization : token },
        params : params
    })
}

const post = async (path, token, params=null) => {
    return await axios({
        url : process.env.API_URL+path,
        method : "POST",
        Headers : { authorization : token },
        data : params
    })
}

module.exports = { get, post }

