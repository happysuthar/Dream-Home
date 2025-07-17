var encryptLib = require("cryptlib");

var s3BaseUrl = "https://amazonaws.com/demo/";

var constant = {

    app_name: "demo",
    key : process.env.KEY,

    encryptionKey: encryptLib.getHashSha256(process.env.KEY, 32),
    encryptionIV: process.env.IV,
    pageLimit : 3 ,

    profile_image: s3BaseUrl + "profile_image/",
    category: s3BaseUrl + "category_image/",
    post: s3BaseUrl + "post_image/",
    notification: s3BaseUrl + "notification_image/",
    blog: s3BaseUrl + "blog_image/",
    group: s3BaseUrl + "group_image/",
    profile_img: s3BaseUrl + "profile_image/",
    
    post_img: s3BaseUrl + "post_image/",

    app_url: "http://localhost:8080",
    BYPASS_ROUTES: ['login', 'signup','admin_login','admin_property_list','admin_update_property','admin_request_list','approve_request'],

    mailer_email: process.env.MAILER_EMAIL,
    mailer_password: process.env.MAILER_PASSWORD,
    from_email: process.env.MAILER_EMAIL, 
    host_mail: "smtp.gmail.com",
    port_base_url: "http://localhost:8080/",

    mailer_config: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_PASSWORD
        }
    },
    appID: "",
    appCertificate: "",

    twilio_account_sid: "",
    twilio_account_auth_token: "",

    is_production: true,

    encrypt: function(data) {
        return encryptLib.encrypt(JSON.stringify(data), constant.encryptionKey, constant.encryptionIV);
    },

    decryptPlain: function(data) {
        return encryptLib.decrypt(data, constant.encryptionKey, constant.encryptionIV);
    }
};

module.exports = constant;
