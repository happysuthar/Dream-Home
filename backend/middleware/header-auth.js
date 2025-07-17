const response_code = require("../utilities/response-error-code");
const common = require("../utilities/common");
const { BYPASS_ROUTES } = require("../config/constant");
const jwt = require("jsonwebtoken");
const middleware = require('../middleware/validator');
const path = require("path");

class HeaderAuth {
   

    header = async (req, res, next) => {
        try {
            const headers = req.headers;

            const apiKey = headers['api-key'];
            if (!apiKey || middleware.decrypt(apiKey) != process.env.API_KEY) {
                return common.response(req, res, response_code.UNAUTHORIZED, "Invalid API Key", null);
            }

            const requestedRoute = path.basename(req.originalUrl.split("?")[0]);
            /*If req.originalUrl = /login?ref=home
Then req.originalUrl.split("?")[0] = /login */
            // console.log("Requested Route:", requestedRoute);

            if (BYPASS_ROUTES.includes(requestedRoute)) {
                return next();
            }

            const token = headers['token'];
            if (!token) {
                return common.response(req, res, response_code.UNAUTHORIZED, "Authorization Token is Missing", null);
            }

            try {
                // console.log(token);
                // console.log(1);
                
                const decoded = await this.getUserFromToken(token);
                // console.log("decoded",decoded);
                
                
                req.owner_id = decoded.id;
                // console.log("owenerId",req.owner_id);

                req.owner = decoded;
                next(); // go to the controller
            } catch (err) {
                console.log("JWT Decode Error:", err.message);
                return common.response(req, res, response_code.UNAUTHORIZED, "Invalid Access Token", null);
            }

        } catch (error) {
            console.log("Middleware Error:", error.message);
            return common.response(req, res, response_code.UNAUTHORIZED, "Internal Server Error", null);
        }
    };

    // Decode JWT Token
    getUserFromToken = async (token) => {
        try {
            // console.log(token);
            
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            throw new Error("Invalid or Expired JWT Token");
        }    };

}

module.exports = new HeaderAuth();
