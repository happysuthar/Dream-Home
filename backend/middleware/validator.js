const validator = require('Validator');
const crypto = require('crypto');
const CODES = require('../utilities/response-error-code');
require('dotenv').config({path : './../.env'});
const key = process.env.KEY
const iv = process.env.IV

const middleware = {
    async checkValidationRule(requestData , rules , message ){

        const v = await validator.make(requestData ,rules);
        // console.log(v);
        

        if (v.fails()) {

            // console.log("fails");
            
            const errors = v.getErrors();
            let error = "";

            for(const key in errors){
                error = errors[key][0];
                break;
            }
            let responseData = {
                code : CODES.OPERATION_FAILED,
                message : error ,
                data : {}
            }
            
            return responseData;
        } else {
            return false;
        }

    },
    encrypt(requestData){
        try {
            if (!requestData) {
                return null;
            }else{
                const data = ((typeof requestData) == 'object') ? JSON.stringify(requestData) : requestData;
                const cipher = crypto.createCipheriv('AES-256-CBC' , key , iv);
                let encrypted = cipher.update(data , 'utf-8' ,'hex');
                encrypted += cipher.final('hex');
                return encrypted;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    decrypt(requestData){
        try {
            if (!requestData) {
                return {}
            }else{
                const decipher = crypto.createDecipheriv('AES-256-CBC' , key , iv);
                let decrypted = decipher.update(requestData , 'hex' , 'utf-8');
                decrypted += decipher.final('utf-8');
                return (this.isJSON(decrypted)) ? JSON.parse(decrypted) : decrypted;
            }
        } catch (error) {
            console.log(error);
            return requestData;
        }
    },
    isJSON(data){
        try {
            JSON.parse(data);
            return true;
        } catch (error) {
            return false;
        }
    }
}
module.exports = middleware;