"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { product_listing } from "../store/slice/productSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);
  const router = useRouter();

  useEffect(() => {
    dispatch(product_listing());
  }, [dispatch]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from the admin dashboard.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-blue-500 text-xl">Loading Properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Admin Dashboard - Properties</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

<button
  onClick={() => {
    Swal.fire({
      title: "Loading...",
      text: "Redirecting to Property Requests",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      timer: 3000,
      showConfirmButton: false,
    });

    setTimeout(() => {
      router.push("/admin/request");
    }, 3000);
  }}
  className="mb-6 inline-block px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
>
  Property Requests
</button>


      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">No.</th>
              <th className="text-left px-4 py-2">Image</th>
              <th className="text-left px-4 py-2">Title</th>
              <th className="text-left px-4 py-2">Type</th>
              <th className="text-left px-4 py-2">City</th>
              <th className="text-left px-4 py-2">Price</th>
              <th className="text-left px-4 py-2">Bedrooms</th>
              <th className="text-left px-4 py-2">Bathrooms</th>
              <th className="text-left px-4 py-2">Sqft</th>
              <th className="text-left px-4 py-2">Active Status</th>
              <th className="text-left px-4 py-2">Delete Status</th>
              <th className="text-left px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {product.map((property, index) => (
              <tr key={property.id} className="border-t border-gray-200">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <img
                    src={`http://localhost:8080/api/v1/read/${property.images}`}
                    alt={property.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2">{property.title}</td>
                <td className="px-4 py-2">{property.type}</td>
                <td className="px-4 py-2">{property.city}</td>
                <td className="px-4 py-2">${property.price}</td>
                <td className="px-4 py-2">{property.bedroom}</td>
                <td className="px-4 py-2">{property.bathroom}</td>
                <td className="px-4 py-2">{property.square_footage} sqft</td>
                <td className="px-4 py-2">{property.is_active}</td>
                <td className="px-4 py-2">{property.is_deleted}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => router.push(`/admin/edit/${property.id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
