const express = require('express');
const bodyParser = require('body-parser');//Parses incoming request bodies
const appRoutes = require('./modules/v1/app-routing.js');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const AuthRoute = require("./modules/v1/authentication/routes/routes.js");
const UserRoute = require("./modules/v1/user/routes/routes.js");
const headerAuth = require("./middleware/header-auth.js");

const app = express();
app.use(cors());

app.use(bodyParser.text());
app.use('/api/v1/read', express.static(__dirname + '/uploads'));
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/user", UserRoute);
app.use(headerAuth.header);
appRoutes.v1(app);


try {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
} catch (error) {
    console.log(error);
}
