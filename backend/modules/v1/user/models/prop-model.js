const { features } = require('process');
const { category } = require('../../../../config/constant');
const database = require('../../../../config/database');
const CODES = require('../../../../utilities/response-error-code');

const BlogModel = {
    async property_list(){
        try {
            let sql = 'select id,images,title,type,street,city,zip_code,price,bedroom,bathroom,square_footage from tbl_property where is_active=1 and is_deleted=0 group by id order by created_at desc';

            let [result] = await database.query(sql);

            // console.log(result);
            
            if (result.length > 0) {
                return {
                    code : CODES.SUCCESS,
                    message : 'Data Found',
                    data : result
                };
            } else {
                return {
                    code : CODES.NO_DATA_FOUND,
                    message : 'No Data Found',
                    data : null
                };
            }
        } catch (error) {
            return {
                code : CODES.OPERATION_FAILED,
                message : 'Something Went Wrong',
                data : null
            };
        }
    },

    async property_by_id(id){
        try {
            let sql = `select p.id,u.full_name,u.email,u.country_code,u.mobile_number,p.images, p.title,
            p.description,p.type,p.features,p.bedroom,p.bathroom,p.square_footage,p.street,p.city,
            p.zip_code,p.price from tbl_property p
            join tbl_user u on u.id = p.user_id where p.id=?`;
            

            let [result] = await database.query(sql,id);

            // console.log("result",[result]);
            
            if (result.length > 0) {
                return {
                    code : CODES.SUCCESS,   
                    message : 'Data Found',
                    data :result[0]
                };
            } else {
                return {
                    code : CODES.NO_DATA_FOUND,
                    message : 'No Data Found',
                    data : null
                };
            }
        } catch (error) {
            return {
                code : CODES.OPERATION_FAILED,
                message : 'Something Went Wrong',
                data : null
            };
        }
    },

async property_list_by_token(id) {
    try {
        const user_id = id;
        // console.log("id in model",user_id);
        
        const [propertyResult] = await database.query(
            `SELECT id, description,features,title, type, street, city, zip_code, price, bedroom, bathroom, square_footage ,images,is_active
             FROM tbl_property 
             WHERE is_deleted = 0 AND user_id = ?
             ORDER BY created_at DESC`,
            [user_id]
        );

        if (propertyResult.length > 0) {
            return {
                code: CODES.SUCCESS,
                message: 'Data Found',
                data: propertyResult
            };
        } else {
            return {
                code: CODES.NO_DATA_FOUND,
                message: 'No properties found for this user',
                data: null
            };
        }
    } catch (error) {
        console.error("Error in property_list_by_token:", error);
        return {
            code: CODES.OPERATION_FAILED,
            message: 'Something went wrong',
            data: null
        };
    }
},


async add_property(requestData, user_id) {
    try {
        const {
            title,
            description,
            type,
            features,
            bedroom,
            bathroom,
            square_footage,
            street,
            city,
            zip_code,
            price,
            image 
        } = requestData;
        
        const id = user_id;
        
        const [result] = await database.query(
            `INSERT INTO tbl_admin_request 
                (user_id, title, description, type, features, bedroom, bathroom, square_footage, street, city, zip_code, price, images)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                title,
                description,
                type,
                features,
                bedroom,
                bathroom,
                square_footage,
                street,
                city,
                zip_code,
                price,
                image
            ]
        );
        

        return {
            code: CODES.SUCCESS,
            message: 'request sent to admin',
            data: { property_id: result.insertId }
        };

    } catch (error) {
        console.error("Error in add_property:", error);
        return {
            code: CODES.OPERATION_FAILED,
            message: 'Failed to add property',
            data: null
        };
    }
},

async approve_request(req, res) {
    const id = req;
    console.log("id",id);
    
  
    try {
      const [rows] = await database.query(`SELECT * FROM tbl_admin_request WHERE id = ?`, [id]);
  
      if (!rows.length) {
        return {
            code: CODES.NO_DATA_FOUND,
            message: 'No properties found for this user',
            data: null
        };
          }
  
      const property = rows[0];
  
      await database.query(
        `INSERT INTO tbl_property (user_id, title, description, type, features, bedroom, bathroom, square_footage, street, city, zip_code, price, images)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          property.user_id,
          property.title,
          property.description,
          property.type,
          property.features,
          property.bedroom,
          property.bathroom,
          property.square_footage,
          property.street,
          property.city,
          property.zip_code,
          property.price,
          property.images
        ]
      );
  
      // Delete from request table
      await database.query(`DELETE FROM tbl_admin_request WHERE id = ?`, [id]);
  
      return {
        code: CODES.SUCCESS,
        message: 'prop approve',
        data: {  }
    };  
    } catch (err) {
      console.error("Approve request failed:", err);
      return {
        code: CODES.OPERATION_FAILED,
        message: 'Failed to approve',
        data: null
    };
    }
  }
,  


async delete_property(requestData){
    try {
        const id = requestData.id;
        console.log("id",id);
        
        const [result] = await database.query(
            `update tbl_property set is_deleted = 1 where id = ?`,
            [id]
        ); 

        if (result.affectedRows > 0) {
            return {
                code: CODES.SUCCESS,
                message: 'delete successfull',
                data: id
            };
        } else {
            return {
                code: CODES.NO_DATA_FOUND,
                message: 'something went wrong',
                data: null
            };
        }
    } catch (error) {
        console.error("Error deleting property", error);
        return {
            code: CODES.OPERATION_FAILED,
            message: 'Something went wrong',
            data: null
        };
    }
},


    async update_property(requestData) {
        try {
            const data = {
                ...(requestData.title != undefined && requestData.title != '') && { title: requestData.title },
                ...(requestData.description != undefined && requestData.description != '') && { description: requestData.description },
                ...(requestData.features != undefined && requestData.features != '') && { features: requestData.features },

                ...(requestData.type != undefined && requestData.type != '') && { type: requestData.type },
                ...(requestData.city != undefined && requestData.city != '') && { city: requestData.city },
                ...(requestData.street != undefined && requestData.street != '') && { street: requestData.street },
                ...(requestData.price != undefined && requestData.price != '') && { price: requestData.price },
                ...(requestData.bedroom != undefined && requestData.bedroom != '') && { bedroom: requestData.bedroom },
                ...(requestData.bathroom != undefined && requestData.bathroom != '') && { bathroom: requestData.bathroom },
                ...(requestData.square_footage != undefined && requestData.square_footage != '') && { square_footage: requestData.square_footage },
                ...(requestData.is_active != undefined) && { is_active: requestData.is_active }, 
            };
            // console.log("data in model",data);
            
            

            if (Object.keys(data).length == 0) { //const data = { name: 'John' }; Object.keys(data); // ['name']

                return {
                    code: responseCode.INVALID_REQUEST,
                    message: 'No valid fields provided for update',
                    data: null
                };
            }

            const sql = `UPDATE tbl_property SET ? WHERE id = ?`;
            await database.query(sql, [data, requestData.id]);

            return {
                code: CODES.SUCCESS,
                message: 'Property updated successfully',
                data: requestData
            };
        } catch (error) {
            console.error("Update property error:", error);
            return {
                code: CODES.OPERATION_FAILED,
                message: 'Something went wrong during update',
                data: null
            };
        }
    },

    async logout(id){
        try {
            const user_id = id;
            
            const [result] = await database.query(
                `update tbl_user set is_login = 0 where id = ?`,
                [user_id]
            ); 
    
            if (result.affectedRows > 0) {
                return {
                    code: CODES.SUCCESS,
                    message: 'logged out',
                    data: user_id
                };
            } else {
                return {
                    code: CODES.NO_DATA_FOUND,
                    message: 'logout error',
                    data: null
                };
            }
        } catch (error) {
            console.error(error);
            return {
                code: CODES.OPERATION_FAILED,
                message: 'Something went wrong',
                data: null
            };
        }
    },

    async admin_property_list(){
        try {
            console.log(1);
            
            let sql = 'select id,user_id,images,title,type,street,city,zip_code,price,features,description,bedroom,bathroom,square_footage,is_active,is_deleted from tbl_property group by id order by created_at desc';

            let [result] = await database.query(sql);

            // console.log(result);
            
            if (result.length > 0) {
                return {
                    code : CODES.SUCCESS,
                    message : 'Data Found',
                    data : result
                };
            } else {
                return {
                    code : CODES.NO_DATA_FOUND,
                    message : 'No Data Found',
                    data : null
                };
            }
        } catch (error) {
            return {
                code : CODES.OPERATION_FAILED,
                message : 'Something Went Wrong',
                data : null
            };
        }
    },

    async admin_update_property(requestData) {
        try {
            const data = {
                ...(requestData.title != undefined && requestData.title != '') && { title: requestData.title },
                ...(requestData.description != undefined && requestData.description != '') && { description: requestData.description },
                ...(requestData.features != undefined && requestData.features != '') && { features: requestData.features },

                ...(requestData.type != undefined && requestData.type != '') && { type: requestData.type },
                ...(requestData.city != undefined && requestData.city != '') && { city: requestData.city },
                ...(requestData.street != undefined && requestData.street != '') && { street: requestData.street },
                ...(requestData.price != undefined && requestData.price != '') && { price: requestData.price },
                ...(requestData.bedroom != undefined && requestData.bedroom != '') && { bedroom: requestData.bedroom },
                ...(requestData.bathroom != undefined && requestData.bathroom != '') && { bathroom: requestData.bathroom },
                ...(requestData.square_footage != undefined && requestData.square_footage != '') && { square_footage: requestData.square_footage },
                ...(requestData.is_active != undefined) && { is_active: requestData.is_active }, 
                ...(requestData.is_deleted != undefined) && { is_deleted: requestData.is_deleted }, 

            };
            // console.log("data in model",data);
            
            

            if (Object.keys(data).length == 0) { //const data = { name: 'John' }; Object.keys(data); // ['name']

                return {
                    code: responseCode.INVALID_REQUEST,
                    message: 'No valid fields provided for update',
                    data: null
                };
            }

            const sql = `UPDATE tbl_property SET ? WHERE id = ?`;
            await database.query(sql, [data, requestData.id]);

            return {
                code: CODES.SUCCESS,
                message: 'Property updated successfully',
                data: requestData
            };
        } catch (error) {
            console.error("Update property error:", error);
            return {
                code: CODES.OPERATION_FAILED,
                message: 'Something went wrong during update',
                data: null
            };
        }
    },

    async admin_request_list(){
        try {
            console.log(1);
            
            let sql = 'select * from tbl_admin_request';

            let [result] = await database.query(sql);

            // console.log(result);
            
            if (result.length > 0) {
                return {
                    code : CODES.SUCCESS,
                    message : 'Data Found',
                    data : result
                };
            } else {
                return {
                    code : CODES.NO_DATA_FOUND,
                    message : 'No Data Found',
                    data : null
                };
            }
        } catch (error) {
            return {
                code : CODES.OPERATION_FAILED,
                message : 'Something Went Wrong',
                data : null
            };
        }
    },

}
    
module.exports = BlogModel;