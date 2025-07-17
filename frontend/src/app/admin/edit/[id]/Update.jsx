import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { admin_update_property } from "../../../store/slice/productSlice";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";

export default function Update({ propertyData }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      title: propertyData.title || "",
      type: propertyData.type || "",
      city: propertyData.city || "",
      street: propertyData.street || "",
      price: propertyData.price || "",
      bedroom: propertyData.bedroom || "",
      bathroom: propertyData.bathroom || "",
      square_footage: propertyData.square_footage || "",
      description: propertyData.description || "",
      features: propertyData.features || "",
      is_active: propertyData.is_active,
      is_deleted: propertyData.is_deleted,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      type: Yup.string().required("Type is required"),
      city: Yup.string().required("City is required"),
      street: Yup.string().required("Street is required"),
      price: Yup.number().required("Price is required").min(1),
      bedroom: Yup.number().required("Bedroom is required").min(1).max(10),
      bathroom: Yup.number().required("Bathroom is required").min(1).max(10),
      square_footage: Yup.number()
        .required("Square footage is required")
        .min(1),
      description: Yup.string().required("Description is required"),
      features: Yup.string().required("Features are required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await dispatch(
          admin_update_property({
            propertyData: { ...values, id: propertyData.id },
          })
        ).unwrap();

        if (res.code == 1) {
          Swal.fire("Success", "Property updated successfully!", "success");
          router.push("/admin");
        } else {
          Swal.fire("Error", res.message || "Update failed", "error");
        }
      } catch (err) {
        Swal.fire("Error", err.message || "Something went wrong", "error");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </Link>

        <form onSubmit={formik.handleSubmit} className="bg-white shadow rounded-lg p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Update Property</h2>
            <p className="text-gray-600 mt-1">Edit the property details below</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Property title"
              />
              {formik.touched.title && formik.errors.title && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Type</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
                <option value="apartment">Apartment</option>
              </select>
              {formik.touched.type && formik.errors.type && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.type}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="City"
              />
              {formik.touched.city && formik.errors.city && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.city}</p>
              )}
            </div>

            {/* Street */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input
                type="text"
                name="street"
                value={formik.values.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Street address"
              />
              {formik.touched.street && formik.errors.street && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.street}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
              {formik.touched.price && formik.errors.price && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.price}</p>
              )}
            </div>

            {/* Bedroom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input
                type="number"
                name="bedroom"
                value={formik.values.bedroom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Number of bedrooms"
                min="1"
                max="10"
              />
              {formik.touched.bedroom && formik.errors.bedroom && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.bedroom}</p>
              )}
            </div>

            {/* Bathroom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input
                type="number"
                name="bathroom"
                value={formik.values.bathroom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Number of bathrooms"
                min="1"
                max="10"
              />
              {formik.touched.bathroom && formik.errors.bathroom && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.bathroom}</p>
              )}
            </div>

            {/* Square Footage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Square Footage</label>
              <input
                type="number"
                name="square_footage"
                value={formik.values.square_footage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Square feet"
                min="1"
              />
              {formik.touched.square_footage && formik.errors.square_footage && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.square_footage}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Detailed description of the property"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
              )}
            </div>

            {/* Features */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
              <textarea
                name="features"
                value={formik.values.features}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="List of features (comma separated)"
              />
              {formik.touched.features && formik.errors.features && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.features}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="is_active"
                value={formik.values.is_active}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>

            {/* Delete Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delete Status</label>
              <select
                name="is_deleted"
                value={formik.values.is_deleted}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={0}>Not deleted</option>
                <option value={1}>Deleted</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : "Update Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}