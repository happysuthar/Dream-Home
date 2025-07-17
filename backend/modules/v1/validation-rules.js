const { sendOTP } = require("./authentication/model/auth-model");

let rules = {
    signUp: {
        full_name: "required",
        email: "required|email",
        password: "required",  
        device_token: "required",
    },


    login: {
        email: "required|email",
        password: "required",
    },

}
module.exports = rules;