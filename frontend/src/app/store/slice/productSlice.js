const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');
import { secureFetch } from '@/app/utilities/secureFetch';
import { act } from 'react';
const data = require('../../utilities/encdec')

export const signup = createAsyncThunk('products/signupUser', async (request_data) => {
    const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
    const url = 'http://localhost:8080/v1/auth/signup';

    const response = await secureFetch(url, request_data, 'POST', api_key);
    return response;
});

export const login = createAsyncThunk('products/loginUser', async (request_data) => {
    const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
    const url = 'http://localhost:8080/v1/auth/login';

    const response = await secureFetch(url, request_data, 'POST', api_key);
    return response;
});

export const show_products = createAsyncThunk('products/showProds', async (token) => {
    // console.log(1);
    
    const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
    // console.log("api",api_key);
    
    const url = 'http://localhost:8080/v1/user/property_list';

    // console.log("Slice req token", token);

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    // console.log("resp Show Products: ", response);
    return response;
});

export const product_listing = createAsyncThunk('products/showProdListing', async () => {
    console.log(1);

    const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
    // console.log("api",api_key);
    
    const url = 'http://localhost:8080/v1/user/admin_property_list';

    const response = await secureFetch(url, {}, 'GET', api_key);

    console.log("resp Show Products: ", response);
    return response;
});

export const admin_request_list = createAsyncThunk('products/showAdminRequest', async () => {
    console.log(1);

    const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
    // console.log("api",api_key);
    
    const url = 'http://localhost:8080/v1/user/admin_request_list';

    const response = await secureFetch(url, {}, 'GET', api_key);

    console.log("resp Show Products: ", response);
    return response;
});


export const approve_request = createAsyncThunk('products/approveRequest', async (id) => {
    console.log(1);

    const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
    // console.log("api",api_key);
    
    const url = 'http://localhost:8080/v1/user/approve_request';

    const response = await secureFetch(url, id, 'POST', api_key);

    // console.log("resp Show Products: ", response);
    return response;
});

export const get_property_by_id = createAsyncThunk('products/getPropertyById', async ({ id, token }) => {
    const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
    const url = `http://localhost:8080/v1/user/property/${id}`;

    const response = await secureFetch(url, {}, 'GET', api_key, token);
    // console.log("Response in ID: ", response);
    return response;
});

export const getSellerProperties = createAsyncThunk(
    'products/getSellerProperties',
    async (token) => {
      const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
      const url = 'http://localhost:8080/v1/user/property_listing';
      const response = await secureFetch(url, {}, 'GET', api_key, token);
      console.log("response",response);
      
      return response;
    }
  );

  export const add_property = createAsyncThunk('products/addProperty', async ({ propertyData, token }) => {
    const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
    const url = `http://localhost:8080/v1/user/add_property`;

    const response = await secureFetch(url, propertyData, 'POST', api_key, token);
    console.log("Response in Add Property: ", response);
    return response;
});
export const delete_property = createAsyncThunk('products/deleteProperty', async ({ propertyData, token }) => {
    const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
    const url = `http://localhost:8080/v1/user/delete_property`;
    // console.log("token in slice",token);
    // console.log("propid",propertyData);
        const response = await secureFetch(url, propertyData, 'POST', api_key, token);
    // console.log("Response in delete property: ", response);
    return response;
});

export const update_property = createAsyncThunk(
    'products/updateProperty',
    async ({ propertyData, token }) => {
      const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
      console.log("propdata",propertyData);
      
      const url = `http://localhost:8080/v1/user/update_property`;
      const response = await secureFetch(url, propertyData, 'POST', api_key, token);
      console.log("response in update",response);
      
      return response;
    }
  );

  export const admin_update_property = createAsyncThunk(
    'products/adminupdateProperty',
    async ({ propertyData }) => {
      const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
      console.log("propdata",propertyData);
      
      const url = `http://localhost:8080/v1/user/admin_update_property`;
      const response = await secureFetch(url, propertyData, 'POST', api_key);
      console.log("response in update",response);
      
      return response;
    }
  );

  export const logout = createAsyncThunk('products/logout', async ({ token }) => {
    const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
    const url = `http://localhost:8080/v1/user/logout`;
    // console.log("token in slice",token);
    // console.log("propid",propertyData);
        const response = await secureFetch(url,{}, 'POST', api_key, token);
    // console.log("Response in delete property: ", response);
    return response;
});

export const admin_login = createAsyncThunk('products/adminLogin', async (request_data) => {
    // console.log("in admin slice");
    
    const api_key = data.encrypt(process.env.NEXT_PUBLIC_API_KEY);
    const url = 'http://localhost:8080/v1/auth/admin_login';
    const response = await secureFetch(url, request_data, 'POST', api_key);
    // console.log("resonse in slice",response);
    
    return response;
});
  

const initialState = {
    user: null,
    token: null,
    prods: null,
    product:[],
    error: null,
    loading: false,
    cuurentProd: null,
    sellerData:null,
    request:[],
};

const prodSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(signup.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.user = action.payload.data.userInfo;
                    state.token = action.payload.data.user_token;
                    state.error = null;
                } else {
                    state.user = null;
                    state.token = null;
                    state.error = action.payload?.message || "Signup failed";
                }
            })
            .addCase(signup.rejected, (state, action) => {
                // console.log("rejeect");

                state.loading = false;
                state.error = action.error.message;
            }).addCase(login.pending, (state) => {
                // console.log("pending");

                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 200) {
                    state.user = action.payload.data.userInfo;
                    state.token = action.payload.data.user_token;
                    state.error = null;
                } else {
                    state.user = null;
                    state.token = null;
                    state.error = action.payload?.message || "Login failed";
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(show_products.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(show_products.fulfilled, (state, action) => {
                state.loading = false;
                // console.log(action.payload.code);
                if (action.payload?.code == 1) {
                    state.prods = action.payload.data;
                    state.error = null;
                } else {
                    state.prods = null;
                    state.error = action.payload?.message || "Login failed";
                }
            })
            .addCase(show_products.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(product_listing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(product_listing.fulfilled, (state, action) => {
                state.loading = false;
                // console.log(action.payload.code);
                if (action.payload?.code == 1) {
                    console.log(action.payload);
                    
                    state.product = action.payload.data;
                    state.error = null;
                } else {
                    state.product = null;
                    state.error = action.payload?.message || "Login failed";
                }
            })
            .addCase(product_listing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(admin_request_list.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(admin_request_list.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload.code);
                if (action.payload?.code == 1) {
                    console.log(action.payload);
                    
                    state.request = action.payload.data;
                    state.error = null;
                }
            })
            .addCase(admin_request_list.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(get_property_by_id.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(get_property_by_id.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.code == 1) {
                    state.cuurentProd = action.payload.data;
                    state.error = null;
                } else {
                    state.cuurentProd = null;
                    state.error = action.payload?.message || "Property not found";
                }
            })
            .addCase(get_property_by_id.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(getSellerProperties.pending, (state) => {
                // console.log("pending");

                state.loading = true;
                state.error = null;
            })
            .addCase(getSellerProperties.fulfilled, (state, action) => {
                // console.log("fullfilled");

                state.loading = false;
                if (action.payload?.code == 1) {
                    state.sellerData = action.payload.data;
                    // console.log(state.sellerData);

                    state.error = null;
                } else {
                    state.sellerData = null;
                    // state.error = action.payload?.message || "Failed to fetch seller properties";
                }
            })
            .addCase(getSellerProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(add_property.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(add_property.fulfilled, (state, action) => {
                state.loading = false;
                // if (action.payload?.code == 1) {
                    state.error = null;
                //     console.log("patload",action.payload);
                    
                //     state.sellerData.push(action.payload.data);
                // } else {
                //     state.error = action.payload?.message || "Failed to add property";
                // }
            })
            .addCase(add_property.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(delete_property.pending, (state) => {
                // console.log("del pending");
                
                state.loading = true;
                state.error = null;
            })
            .addCase(delete_property.fulfilled, (state, action) => {
                // console.log("del fullfill");

                state.loading = false;
                if (action.payload?.code == 1) {
                    state.error = null;
                    
                    const deletedId = action.payload.data;
                    // console.log("payload",action.payload);
                    // console.log("del id",deletedId);
                    
                     // Assuming your API returns the deleted property id
                    if (state.sellerData) {
                        state.sellerData = state.sellerData.filter(prop => prop.id !== deletedId);
                    }
                } else {
                    state.error = action.payload?.message || "Failed to delete property";
                }
                
                
            })
            .addCase(delete_property.rejected, (state, action) => {
                // console.log("del reject");

                state.loading = false;
                state.error = action.error.message;
            }).addCase(update_property.pending, (state) => {
                // console.log("pending");
                
                state.loading = true;
                state.error = null;
              })
              .addCase(update_property.fulfilled, (state, action) => {
                // console.log("full");

                state.loading = false;
                state.error = null;
          
                const updated = action.payload?.data;
                // console.log("payload",action.payload);
                
                if (updated) {
                  state.sellerData = state.sellerData.map((property) =>
                    property.id == updated.id ? updated : property
                  );
                }
              })
              .addCase(update_property.rejected, (state, action) => {
                // console.log("reject");

                state.loading = false;
                state.error = action.payload || 'Failed to update property';
              }).addCase(admin_update_property.pending, (state) => {
                // console.log("pending");
                
                state.loading = true;
                state.error = null;
              })
              .addCase(admin_update_property.fulfilled, (state, action) => {
                // console.log("full");

                state.loading = false;
                state.error = null;
          
                const updated = action.payload?.data;
                // console.log("payload",action.payload);
                
                if (updated) {
                  state.product = state.product.map((property) =>
                    property.id == updated.id ? updated : property
                  );
                }
              })
              .addCase(admin_update_property.rejected, (state, action) => {
                // console.log("reject");

                state.loading = false;
                state.error = action.payload || 'Failed to update property';
              }).addCase(admin_login.pending, (state) => {
                // console.log("pending");

                state.loading = true;
                state.error = null;
            })
            .addCase(admin_login.fulfilled, (state, action) => {
                state.loading = false
                    state.error = null;
            })
            .addCase(admin_login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(approve_request.pending, (state) => {
                // console.log("pending");

                state.loading = true;
                state.error = null;
            })
            .addCase(approve_request.fulfilled, (state, action) => {
                console.log("payload",action.payload);
                
                state.loading = false
                    state.error = null;
            })
            .addCase(approve_request.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
    }

});

export default prodSlice.reducer;