    let AuthModel = require("../model/auth-model.js");
    let common = require("../../../../utilities/common.js");
    let middleware = require("../../../../middleware/validator.js");
    let { t } = require("localizify");
    const rules = require("../../validation-rules.js");
    const CODES = require("../../../../utilities/response-error-code.js");

    class AuthController {    
    
    async signUp(req, res) {
        try {
            // console.log(1);
            
            let requestData = middleware.decrypt(req.body);
            // console.log("reqdata",requestData);
            
            let message = {
            };
            // console.log(3);
            
            let keyword = {
                'email': t('rest_keyword_email'),
                'country_code': t('rest_keyword_country_code'),
                'mobile_number': t('rest_keyword_phone'),
                'password': t('rest_keyword_password'),
            };

            let response = await middleware.checkValidationRule(requestData, rules.signUp, message, keyword);
            if (response) {
                // console.log(res,req);
                // console.log("response",response);
                
                
                common.response(req, res, response.code, response.message, {});
            } else {
                const {code, message, data} = await AuthModel.signUp(requestData);
                // console.log(req,res);
                
                common.response(req, res, code, message, data);
            }
        } catch (error) {
            console.log(error);
            
            common.response(req, res, CODES.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {});
        }
    }

    async login(req, res) {
        try {
            let requestData = middleware.decrypt(req.body);
            // console.log("Login requestData:", requestData);

            let message = {};

            let keyword = {
                'email': t('rest_keyword_email'),
                'password': t('rest_keyword_password'),
            };

            let response = await middleware.checkValidationRule(requestData, rules.login, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            }
            else{
                const { code, message, data } = await AuthModel.login(requestData);
                return common.response(req, res, code, message, data);
            }

        } catch (error) {
            console.error("Login error:", error);
            return common.response(req, res, CODES.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {});
        }
    }

    async admin_login(req, res) {
        try {
            let requestData = middleware.decrypt(req.body);
            console.log("req data",requestData);
            
            // console.log("Login requestData:", requestData);

            let message = {};

            let keyword = {
                'email': t('rest_keyword_email'),
                'password': t('rest_keyword_password'),
            };

            let response = await middleware.checkValidationRule(requestData, rules.login, message, keyword);
            if (response) {
                return common.response(req, res, response.code, response.message, {});
            }   
            else{
                const { code, message, data } = await AuthModel.admin_login(requestData);
                return common.response(req, res, code, message, data);
            }

        } catch (error) {
            console.error("Login error:", error);
            return common.response(req, res, CODES.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {});
        }
    }



    }
    module.exports = new AuthController;