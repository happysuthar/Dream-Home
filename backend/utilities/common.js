const middleware = require('../middleware/validator');
const jwt = require('jsonwebtoken');
const database = require("./../config/database");
const constant = require("./../config/constant");
let nodemailer = require("nodemailer");


class Common {

    // =============== Node mailer =========================//
    async requestValidation(v) {
        if (v.fails()) {
            const Validator_errors = v.getErrors();
            const error = Object.values(Validator_errors)[0][0];
            return {
                code: true,
                message: error
            };
        } 
        return {
            code: false,
            message: ""
        };
    }


    async sendMail(subject, to_email, htmlContent) {
        try {
            if (!to_email || to_email.trim() == "") {
                throw new Error("Recipient email is empty or undefined!");
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: constant.mailer_email,
                    pass: constant.mailer_password
                }
            });

            const mailOptions = {
                from: constant.from_email,
                to: to_email,
                subject: subject,
                html: htmlContent,
                text: "Please enable HTML to view this email.",
            };

            const info = await transporter.sendMail(mailOptions);
            // console.log(info)
;
            return { success: true, info };
        } catch (error) {
            console.log(error);
            return { success: false, error };
        }
    }
    
    //======================= Response ======================//
    
    async response(req, res, code, message, data) {
        try {
    
            const payload = {
                code,
                message,
                data
            };
    
            // Ensure middleware.encrypt is correctly encrypting payload
            res.send(middleware.encrypt(payload));  // Send the encrypted payload
        } catch (error) {
            console.error("Response error:", error);
            res.status(500).send({ code: 500, message: "Internal Server Error" });
        }
    }
    


    // ================= other functions ===================//

    generateOTP() {
        return Math.floor(1000 + Math.random() * 9000);
    }

    async getMessage(language, message) {
        try {
            let translatedMessage = await message.keyword;

            if (message.content) {
                for (const key of Object.keys(message.content)) {
                    translatedMessage = translatedMessage.replace(`{ ${key} }`, message.content[key]);
                }
            }

            return translatedMessage;
        } catch (error) {
            console.error("Error in getMessage:", error);
            return "Translation Error";
        }
    }

    async verifyToken(token) {
        const secret = 'your-refresh-token-secret';
    
        try {
        const decoded = jwt.verify(token, secret);
        return { success: true, data: decoded };
        } catch (error) {
        return { success: false, error: error.message };
        }
    }

    generateToken(user) {
        const payload = {
        id: user.id,
        email: user.email
        };
    
        const secret = '';
        const options = { expiresIn: '7d' };
    
        return jwt.sign(payload, secret, options);
    }

    async checkEmail(email) {
        try {
            let sql = "SELECT id FROM tbl_user WHERE email = ? AND is_active = 1 AND is_deleted = 0 ORDER BY id DESC";
            const [results] = await database.query(sql, [email]);
            console.log(results);
            
            if(results.length > 0){ 
                return true;
            } else{
                return false;
            }
        } catch (error) {
            throw error;
        }
    }

    async checkMobile(mobile_number) {
        try {
            let sql = "SELECT id FROM tbl_user WHERE mobile_number = ? AND is_active = 1 AND is_deleted = 0 ORDER BY id DESC";
            const [results] = await database.query(sql, [mobile_number]);
            if(results.length >  0){
                return true;
            } else{
                return false;
            }
        } catch (error) {
            throw error;
        }
    }
    
    async insertDevice(deviceData) {
        try{
            let sql = "INSERT INTO tbl_device SET ?";

            const [res] = await database.query(sql, deviceData);
            return !!res.insertId;
        } catch(error){
            return false;
        }
    }

    async updateDevice(deviceData,user_id) {
        try{
            let sql = "update tbl_device SET ? where user_id = ?";
            const [res] = await database.query(sql, [deviceData,user_id]);
            return !!res.user_id;
        } catch(error){
            return false;
        }
    }

    async getUserInfo(user_id) {
        try {
            let sql = `SELECT u.id, u.role,u.full_name, u.email, d.device_name, d.user_token, d.device_type FROM tbl_user AS u LEft JOIN tbl_device AS d ON u.id = d.user_id WHERE u.id = ? AND u.is_active = 1 AND u.is_deleted = 0`;

            const [res] = await database.query(sql, [user_id]);
            return res[0];
        } catch (error) {
            return false;
        }
    }


    async getUser(data) {
        try {
            let sql = `SELECT id, email, password, is_active FROM tbl_user WHERE ${data} AND is_active = 1 AND is_deleted = 0 ORDER BY id DESC`;
            const res = await database.query(sql);
            if (res[0].length > 0) {
                return res[0][0]; 
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }


    async updateDevice(user_id) {
        try {
                const updateSQL = `
                    UPDATE tbl_device SET
                    WHERE user_id = ${user_id}`;
                const [res] = await database.query(updateSQL);
                if(res.length > 0) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            return false;
        }
    }


    async updateUserData(user_id, data) {
        try {
            let sql = `UPDATE tbl_user SET ? WHERE id = ?`;
            const [result] = await database.query(sql, [data, user_id]);

            return result.affectedRows > 0;
        } catch (error) {
            return false;
        }
    }

    async deleteDeviceData(user_id) {
        try {
            let sql = `DELETE FROM tbl_device WHERE user_id = ?`;
            const [result] = await database.query(sql, [user_id]);
            
            return result.affectedRows > 0; 
        } catch (error) {
            return false;
        }
    }

    async updateDeviceData(data, user_id) {
        try {
            let sql = `UPDATE tbl_device SET ? WHERE user_id = ?`;
            console.log("Updating Device Data:", data);

            let [result] = await database.query(sql, [data, user_id]); 
            console.log("Update Result:", result);

            return result.affectedRows > 0; 
        } catch (error) {
            console.error("Error in updateDeviceData:", error);
            return false;
        }
    } 
}

module.exports = new Common();
