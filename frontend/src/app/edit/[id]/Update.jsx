import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { update_property } from "../../store/slice/productSlice";
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
      is_active: propertyData.is_active || 1,
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
      const token = JSON.parse(localStorage.getItem("token"));
      try {
        const res = await dispatch(
          update_property({
            propertyData: { ...values, id: propertyData.id },
            token,
          })
        ).unwrap();

        if (res.code == 1) {
          await Swal.fire({
            icon: "success",
            title: "Success",
            text: "Property updated successfully!",
            timer: 1800,
            showConfirmButton: false,
          });
          router.push("/dashboard");
        } else {
          Swal.fire("Error", res.message || "Update failed", "error");
        }
      } catch (err) {
        Swal.fire("Error", err.message || "Something went wrong", "error");
      }
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">


      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Update Property
        </h2>

        {[
          { label: "Title", name: "title", type: "text" },
          { label: "City", name: "city", type: "text" },
          { label: "Street", name: "street", type: "text" },
          { label: "Price", name: "price", type: "number" },
          { label: "Bedroom", name: "bedroom", type: "number" },
          { label: "Bathroom", name: "bathroom", type: "number" },
          { label: "Square Footage", name: "square_footage", type: "number" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block font-medium mb-1 text-gray-800"
            >
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={formik.values[name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formik.touched[name] && formik.errors[name]
                  ? "border-red-600"
                  : "border-gray-300"
              }`}
            />
            {formik.touched[name] && formik.errors[name] && (
              <p className="text-red-600 text-sm mt-1">{formik.errors[name]}</p>
            )}
          </div>
        ))}

        <div>
          <label
            htmlFor="type"
            className="block font-medium mb-1 text-gray-800"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.type && formik.errors.type
                ? "border-red-600"
                : "border-gray-300"
            }`}
          >
            <option value="">Select Type</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="condo">Condo</option>
            <option value="apartment">Apartment</option>
          </select>
          {formik.touched.type && formik.errors.type && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.type}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block font-medium mb-1 text-gray-800"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.description && formik.errors.description
                ? "border-red-600"
                : "border-gray-300"
            }`}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.description}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="features"
            className="block font-medium mb-1 text-gray-800"
          >
            Features
          </label>
          <textarea
            id="features"
            name="features"
            rows="3"
            value={formik.values.features}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formik.touched.features && formik.errors.features
                ? "border-red-600"
                : "border-gray-300"
            }`}
          />
          {formik.touched.features && formik.errors.features && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.features}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="is_active"
            className="block font-medium mb-1 text-gray-800"
          >
            Status
          </label>
          <select
            id="is_active"
            name="is_active"
            value={formik.values.is_active}
            onChange={formik.handleChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className={`w-full py-3 rounded-md text-white font-semibold transition-colors ${
            formik.isSubmitting
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {formik.isSubmitting ? "Updating..." : "Update Property"}
        </button>
      </form>
    </div>
  );
}
