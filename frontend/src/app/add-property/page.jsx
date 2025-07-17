"use client";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { add_property } from "../store/slice/productSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { decrypt, encrypt } from "../utilities/encdec";

const AddProperty = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const initialValues = {
    title: "",
    description: "",
    type: "",
    features: "",
    bedroom: "",
    bathroom: "",
    square_footage: "",
    street: "",
    city: "",
    zip_code: "",
    price: "",
    image: '',
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    type: Yup.string().required("Property type is required"),
    features: Yup.string().required("Features are required"),
    bedroom: Yup.number().required("Bedrooms are required").min(0).max(10),
    bathroom: Yup.number().required("Bathrooms are required").min(0).max(10),
    square_footage: Yup.number().required("Square footage is required").min(0),
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    zip_code: Yup.string().required("Zip code is required"),
    price: Yup.number().required("Price is required").min(0),
  });

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const encryptedApiKey = encrypt(apiKey);
    const token = JSON.parse(localStorage.getItem("token"));

    try {
      const response = await fetch(
        "http://localhost:8080/v1/user/upload-image",
        {
          method: "POST",
          body: formData,
          headers: {
            "api-key": encryptedApiKey,
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed with status " + response.status);
      }

      const textResponse = await response.text();
      const decryptedData = decrypt(textResponse);
      return decryptedData.data.filename;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const token = JSON.parse(localStorage.getItem("token"));

    try {
      const imageFilename = await uploadImage(selectedFiles[0]);

      if (!imageFilename) {
        Swal.fire({
          icon: "error",
          title: "Image upload failed",
        });
        setSubmitting(false);
        return;
      }

      const propertyData = {
        ...values,
        image: imageFilename,
      };

      const response = await dispatch(add_property({ propertyData, token }));

      if (response?.payload?.code == "1") {
        Swal.fire({
          title: "Request sent to admin",
          icon: "success",
          draggable: true,
        }).then(() => {
          router.push("/dashboard");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: response?.payload?.message || "Failed to add property",
        });
      }
    } catch (error) {
      console.error("Error during add property submission:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            
            <h1 className="text-2xl font-bold text-gray-800">Add New Property</h1>
            <p className="mt-1 text-sm text-gray-600">
              Fill in the details below to list your property
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="px-6 py-4" encType="multipart/form-data">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <Field
                        name="title"
                        type="text"
                        id="title"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Field
                        name="description"
                        as="textarea"
                        id="description"
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Property Type
                      </label>
                      <Field
                        name="type"
                        as="select"
                        id="type"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Property Type</option>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                      </Field>
                      <ErrorMessage
                        name="type"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">
                        Features
                      </label>
                      <Field
                        name="features"
                        as="textarea"
                        id="features"
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <ErrorMessage
                        name="features"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                        Property Image
                      </label>
                      <input
                        type="file"
                        id="image"
                        name="images"
                        multiple
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="bedroom" className="block text-sm font-medium text-gray-700 mb-1">
                          Bedrooms
                        </label>
                        <Field
                          name="bedroom"
                          type="number"
                          id="bedroom"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <ErrorMessage
                          name="bedroom"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      <div>
                        <label htmlFor="bathroom" className="block text-sm font-medium text-gray-700 mb-1">
                          Bathrooms
                        </label>
                        <Field
                          name="bathroom"
                          type="number"
                          id="bathroom"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <ErrorMessage
                          name="bathroom"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="square_footage" className="block text-sm font-medium text-gray-700 mb-1">
                        Size (Square Footage)
                      </label>
                      <Field
                        name="square_footage"
                        type="number"
                        id="square_footage"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <ErrorMessage
                        name="square_footage"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <Field
                        name="street"
                        type="text"
                        id="street"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <ErrorMessage
                        name="street"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <Field
                          name="city"
                          type="text"
                          id="city"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>

                      <div>
                        <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                          Zip Code
                        </label>
                        <Field
                          name="zip_code"
                          type="text"
                          id="zip_code"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <ErrorMessage
                          name="zip_code"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <Field
                        name="price"
                        type="number"
                        id="price"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Add Property"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;