
let User = require('../controllers/property');
const upload = require("../../../../middleware/upload")

let UserRoute = (app) => {

    app.get('/v1/user/property_list', User.property_list);
    app.get('/v1/user/admin_property_list', User.admin_property_list);
    app.get('/v1/user/admin_request_list', User.admin_request_list);
    app.get('/v1/user/property/:id', User.property_by_id);
    app.get('/v1/user/property_listing', User.property_list_by_token);
    app.post('/v1/user/add_property', User.add_property);
    app.post('/v1/user/delete_property', User.delete_property);
    app.post('/v1/user/update_property', User.update_property);
    app.post('/v1/user/admin_update_property', User.admin_update_property);
    app.post('/v1/user/logout', User.logout);
    app.post('/v1/user/upload-image', upload.single('image'),User.uploadImage);
    app.post('/v1/user/approve_request', User.approve_request);

};

module.exports = UserRoute;
