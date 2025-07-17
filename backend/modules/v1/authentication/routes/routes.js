let Auth = require('./../controller/auth');

let AuthRoute = (app) => {

    app.post('/v1/auth/signup', Auth.signUp);

    app.post('/v1/auth/login', Auth.login);

    app.post('/v1/auth/admin_login', Auth.admin_login);

};

module.exports = AuthRoute;