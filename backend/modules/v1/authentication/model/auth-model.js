let database = require("../../../../config/database");
let bcrypt = require("bcrypt");
let CODES = require("../../../../utilities/response-error-code");
let common = require("../../../../utilities/common");
const moment = require("moment");
const jwt = require("jsonwebtoken");
class AuthModel {
  async signUp(requestData) {
    try {
      const checkEmailUnique = await common.checkEmail(requestData.email);
      if (!checkEmailUnique) {
        const checkMobileUnique = await common.checkMobile(
          requestData.mobile_number
        );
        if (!checkMobileUnique) {
          const signUpData = {
            role: requestData.role,
            full_name: requestData.full_name,
            email: requestData.email,
            password: bcrypt.hashSync(requestData.password, 10),
            country_code: requestData.country_code,
            mobile_number: requestData.mobile_number,
            // profile_img: requestData.profile_img,
          };
          // console.log(requestData);

          const sql = "INSERT INTO tbl_user SET ?";
          const [data] = await database.query(sql, [signUpData]);

          if (!data.insertId) {
            return {
              code: CODES.OPERATION_FAILED,
              message: "txt_user_registration_failed",
              data: null,
            };
          }

          const user_id = data.insertId;

          const user_token = jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

          const deviceData = {
            user_id,
            device_token: requestData.device_token,
            device_type: requestData.device_type,
            user_token,
            time_zone: requestData.time_zone,
            ...(requestData.os_version && {
              os_version: requestData.os_version,
            }),
            ...(requestData.app_version && {
              app_version: requestData.app_version,
            }),
            ...(requestData.device_name && {
              device_name: requestData.device_name,
            }),
          };
          console.log("device data", deviceData);

          const deviceInsert = await common.insertDevice(deviceData);
          console.log(deviceInsert);

          if (!deviceInsert) {
            return {
              code: CODES.OPERATION_FAILED,
              message: "txt_device_insertion_failed",
              data: null,
            };
          }

          const subject = "Welcome to Our App!";
          const message = `Hi ${requestData.full_name},\n\nWelcome to our app!  :)\n\nBest Regards,\n Dream Home`;
          common.sendMail(subject, requestData.email, message, (err, info) => {
            if (err) {
              console.log("Email send failed:", err);
            }
          });

          const userInfo = await common.getUserInfo(user_id);

          if (!userInfo) {
            return {
              code: CODES.OPERATION_FAILED,
              message: "txt_error_while_signup",
              data: null,
            };
          }

          return {
            code: CODES.SUCCESS,
            message: "Signup successfully",
            data: { userInfo },
          };
        }
        return {
          code: CODES.OPERATION_FAILED,
          message: "mobile number already exists",
          data: null,
        };
      }
      return {
        code: CODES.OPERATION_FAILED,
        message: "Email already exists",
        data: null,
      };
    } catch (error) {
      console.log(error);

      return {
        code: CODES.NOT_APPROVE,
        message: "something_was_went_wrong",
        data: null,
      };
    }
  }

  async login(requestData) {
    let sql = `email = '${requestData.email}' and is_deleted = 0`;
    let result = await common.checkEmail(requestData.email);

    if (!result) {
      return {
        code: CODES.OPERATION_FAILED,
        message: "Invalid Email",
        data: null,
      };
    }

    let userDetails = await common.getUser(sql);
    if (bcrypt.compareSync(requestData.password, userDetails.password)) {
      if (userDetails.is_active == 1) {
        const user_token = jwt.sign(
          { id: userDetails.id },//Payload
          process.env.JWT_SECRET,//secret
          { expiresIn: "7d" }// other opption
        );

        let deviceData = {
          user_token,
          device_token: requestData.device_token,
          device_type: requestData.device_type,
          ...(requestData.device_type != undefined &&
            requestData.device_type != "" && {
              device_type: requestData.device_type,
            }),
          ...(requestData.os_version != undefined &&
            requestData.os_version != "" && {
              os_version: requestData.os_version,
            }),
          ...(requestData.app_version != undefined &&
            requestData.app_version != "" && {
              app_version: requestData.app_version,
            }),
          ...(requestData.device_name != undefined &&
            requestData.device_name != "" && {
              device_name: requestData.device_name,
            }),
        };
        let user_id = userDetails.id;

        await common.updateDevice(deviceData, user_id);

        let updateData = {
          last_login: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
          is_login: 1,
        };

        await common.updateUserData(userDetails.id, updateData);
        let userInfo = await common.getUserInfo(userDetails.id);

        console.log("userinfo", userInfo);

        return {
          code: CODES.SUCCESS,
          message: "Login Successfull",
          data: userInfo,
        };
      } else {
        return {
          code: CODES.INACTIVE_ACCOUNT,
          message: "Inactive account",
          data: null,
        };
      }
    } else {
      return {
        code: CODES.OPERATION_FAILED,
        message: "Wrong password",
        data: null,
      };
    }
  }

  async admin_login(requestData) {
    let sql = `select * from tbl_admin where email_id = ? and password=?`;
    let [result] = await database.query(sql, [
      requestData.email,
      requestData.password,
    ]);
    // console.log("result in model",result);
    // console.log("result in model",result.length);

    if (result.length == 1) {
      return {
        code: CODES.SUCCESS,
        message: "Login Successfull",
        data: result,
      };
    } else {
      return {
        code: CODES.OPERATION_FAILED,
        message: "Invalid credentials",
        data: null,
      };
    }
  }
}
module.exports = new AuthModel();
