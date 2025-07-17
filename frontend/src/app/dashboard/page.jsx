"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  getSellerProperties,
  delete_property,
  logout,
} from "../store/slice/productSlice";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { sellerData, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const user_role = JSON.parse(localStorage.getItem("user_role"));

      if (!token) {
        router.push("/login");
        return;
      }

      if (user_role == "buyer") {
        router.push("/products");
      } else {
        router.push("/dashboard");
      }

      dispatch(getSellerProperties(token));
    } catch (e) {
      console.error("Token parsing error:", e.message);
      router.push("/login");
    }
  }, [dispatch, router]);

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this property?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      const token = JSON.parse(localStorage.getItem("token"));
      const propertyData = { id };
      dispatch(delete_property({ propertyData, token }));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your property has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  }

  
const Logout = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, logout",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    const token = JSON.parse(localStorage.getItem("token"));
    dispatch(logout({ token }));
    localStorage.clear();
    router.push("/");

    Swal.fire({
      icon: "success",
      title: "Logged out!",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};


  const handleEdit = async (id) => {
    Swal.fire({
      title: "Loading...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      Swal.close();
      router.push(`/edit/${id}`);
    }, 700);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>
      <button
        onClick={() => router.push("/add-property")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
      >
        + Add New Property
      </button>{" "}
      <button
        onClick={Logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
      {loading && <p>Loading seller properties...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && sellerData?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellerData.map((property) => (
            <div key={property.id} className="border p-4 rounded shadow">
              <img
                src={`http://localhost:8080/api/v1/read/${property.images}`}
                alt={property.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
              <h2 className="text-xl font-semibold">{property.title}</h2>
              <p>Type: {property.type}</p>
              <p>
                Location: {property.city}, {property.street}
              </p>
              <p>Price: ₹{property.price}</p>
              <p>Bedrooms: {property.bedroom}</p>
              <p>Bathrooms: {property.bathroom}</p>
              <p>Size: {property.square_footage} sq.ft</p>
              <p>Status: {property.is_active == 1 ? "Active" : "Inactive "}</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(property.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No seller properties found.</p>
      )}
    </div>
  );
}
