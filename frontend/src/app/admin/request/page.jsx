"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { admin_request_list ,approve_request} from "../../store/slice/productSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { request, loading, error } = useSelector((state) => state.products);
  const router = useRouter();

  useEffect(() => {
    dispatch(admin_request_list());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-blue-500 text-xl">Loading Requests...</div>
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
      <Link
  href="/admin"
  className="inline-block mb-4 px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
>
  ← Back to Dashboard
</Link>

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Property Requests</h1>
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
              <th className="text-left px-4 py-2">Approve Status</th>
              <th className="text-left px-4 py-2">Action</th>
              
            </tr>
          </thead>
          <tbody>
  {request && request.length > 0 ? (
    request.map((property, index) => (
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
        <td className="px-4 py-2">{property.is_approved}</td>
        <td className="px-4 py-2">
<button
  onClick={() => {
    Swal.fire({
      title: "Approving...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      timer: 2000,
    }).then(() => {
      dispatch(approve_request(property.id)).then(() => {
        Swal.fire({
          title: "Approved!",
          text: "The property has been approved.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      });
    });
  }}
  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
>
  Approve
</button>

        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="12" className="text-center py-4 text-gray-500">
        No property requests found.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}
