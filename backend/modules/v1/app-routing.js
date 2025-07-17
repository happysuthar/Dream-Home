let AuthRoute = require("./authentication/routes/routes");
let UserRoute = require("./user/routes/routes");

class Routing{
    v1(app){

        AuthRoute(app);
        UserRoute(app);

    }
}

module.exports = new Routing();