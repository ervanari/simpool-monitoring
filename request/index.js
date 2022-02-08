const axios = require("axios")

const get = async (path, token, params=null) => {
    return await axios({
        url : process.env.API_URL+path,
        method : "GET",
        headers : { 
            "authorization" : "Bearer " + token,
            "Content-Type" : "application/json"
        },
        params : params
    })
}

const post = async (path, token, params=null) => {
    return await axios({
        url : process.env.API_URL+path,
        method : "POST",
        headers : { 
            "authorization" : "Bearer " + token, 
            "Content-Type" : "application/json"
        },
        data : params
    })
}

const put = async (path, token, params=null) => {
    return await axios({
        url : process.env.API_URL+path,
        method : "PUT",
        headers : { 
            "authorization" : "Bearer " + token, 
            "Content-Type" : "application/json"
        },
        data : params
    })
}

const Loginpost = async (path, token, params=null) => {
    return await axios({
        url : process.env.API_URL+path,
        method : "POST",
        headers : { 
            "Content-Type" : "application/json"
        },
        data : params
    })
}

module.exports = { get, post, Loginpost, put}

