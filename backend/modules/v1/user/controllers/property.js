const Model = require("../models/prop-model");
const common = require("../../../../utilities/common");
const middleware = require("../../../../middleware/validator");

const BlogController = {
  async property_list(req, res) {
    try {
      const { code, message, data } = await Model.property_list();
      return common.response(req, res, code, message, data);
    } catch (error) {
      console.error("Product list error:", error);
      return common.response(
        req,
        res,
        CODES.OPERATION_FAILED,
        { keyword: "Something_went_wrong" },
        {}
      );
    }
  },
  async admin_property_list(req, res) {
    try {
      const { code, message, data } = await Model.admin_property_list();
      return common.response(req, res, code, message, data);
    } catch (error) {
      console.error("Product list error:", error);
      return common.response(
        req,
        res,
        CODES.OPERATION_FAILED,
        { keyword: "Something_went_wrong" },
        {}
      );
    }
  },

  async admin_request_list(req, res) {
    try {
      const { code, message, data } = await Model.admin_request_list();
      return common.response(req, res, code, message, data);
    } catch (error) {
      console.error("Product list error:", error);
      return common.response(
        req,
        res,
        CODES.OPERATION_FAILED,
        { keyword: "Something_went_wrong" },
        {}
      );
    }
  },

  async property_by_id(req, res) {
    try {
      const id = req.params.id;
      const { code, message, data } = await Model.property_by_id(id);
      return common.response(req, res, code, message, data);
    } catch (error) {
      console.error("Product list error:", error);
      return common.response(
        req,
        res,
        CODES.OPERATION_FAILED,
        { keyword: "Something_went_wrong" },
        {}
      );
    }
  },

  async property_list_by_token(req, res) {
    try {
      // const token = req.headers['token'];
      const id = req.owner_id;
      // console.log("id by owner in controller",id);

      // console.log("token",token);

      const { code, message, data } = await Model.property_list_by_token(id);
      return common.response(req, res, code, message, data);
    } catch (error) {
      console.error("Property by token error:", error);
      return common.response(
        req,
        res,
        CODES.OPERATION_FAILED,
        "Something went wrong",
        null
      );
    }
  },

  async add_property(req, res) {
    try {
      const user_id = req.owner_id;

      const requestData = middleware.decrypt(req.body);
      console.log("req data", requestData);

      console.log("Parsed requestData", requestData);

      const { code, message, data } = await Model.add_property(
        requestData,
        user_id
      );
      return common.response(req, res, code, message, data);
    } catch (error) {
      console.error("Add Property error:", error);
      return common.response(
        req,
        res,
        CODES.OPERATION_FAILED,
        "Something went wrong",
        null
      );
    }
  },

  async delete_property(req, res) {
    try {
      let requestData = middleware.decrypt(req.body);
      console.log("reqbody", requestData);

      const { code, message, data } = await Model.delete_property(requestData);

      return common.response(req, res, code, message, data);
    } catch (error) {
      console.error("Add Property error:", error);
      return common.response(
        req,
        res,
        CODES.OPERATION_FAILED,
        "Something went wrong",
        null
      );
    }
  },

  async update_property(req, res) {
    try {
      let requestData = middleware.decrypt(req.body);

      console.log("data in controller", requestData);

      const { code, message, data } = await Model.update_property(requestData);

      return common.response(req, res, code, message, data);
    } catch (error) {
      console.error("Add Property error:", error);
      return common.response(
        req,
        res,
        CODES.OPERATION_FAILED,
        "Something went wrong",
        null
      );
    }
  },

  async admin_update_property(req, res) {
    try {
      let requestData = middleware.decrypt(req.body);

      console.log("data in controller", requestData);

      const { code, message, data } = await Model.admin_update_property(requestData);

      return common.response(req, res, code, message, data);
    } catch (error) {
      console.error("Add Property error:", error);
      return common.response(
        req,
        res,
        CODES.OPERATION_FAILED,
        "Something went wrong",
        null
      );
    }
  },

  async logout(req, res) {
    try {
      const id = req.owner_id;
      // console.log("reqbody",requestData);

      const { code, message, data } = await Model.logout(id);

      return common.response(req, res, code, message, data);
    } catch (error) {
      console.error("Add Property error:", error);
      return common.response(
        req,
        res,
        CODES.OPERATION_FAILED,
        "Something went wrong",
        null
      );
    }
  },

  async uploadImage(req, res) {
    console.log("req.file", req.file);

    if (!req.file) {
      return common.response(req, res, 0, "No image uploaded", {});
    }

    const data = {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
    };

    return common.response(req, res, 1, { keyword: "image-success" }, data);
  },

  async approve_request(req, res) {
    try {
      console.log("in controller");
      console.log("rew.ody",req.body);
      
      const requestData = middleware.decrypt(req.body);
      const  id  = requestData;
      console.log("id in cont",id);
      
  
      const { code, message, data } = await Model.approve_request(id);
      return common.response(req, res, code, message, data);
    } catch (error) {
      console.error("Approve Property error:", error);
      return common.response(
        req,
        res,
        CODES.OPERATION_FAILED,
        "Something went wrong during approval",
        null
      );
    }
  }

  
};
module.exports = BlogController;
 