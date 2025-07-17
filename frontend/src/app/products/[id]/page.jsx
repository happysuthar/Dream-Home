"use client";
import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { get_property_by_id } from "../../store/slice/productSlice";
import Link from "next/link";
import Swal from "sweetalert2";

export default function PropertyDetails() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const { cuurentProd, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(get_property_by_id({ id: params.id, token }));
  }, [dispatch, params.id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-red-500 text-lg font-medium">{error}</p>
        <Link 
          href="/products" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

  if (!cuurentProd) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-gray-600 text-lg">Property not found.</p>
        <Link 
          href="/products" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

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
    full_name,
    email,
    country_code,
    mobile_number,
    images,
  } = cuurentProd;

  const handleContactSeller = async () => {
    try {
      Swal.fire({
        title: "Sending Email...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch("/api/send_mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: `Interest in your property: ${title}`,
          message: `Hello ${full_name},\n\nI am interested in your property at ${street}, ${city}, ${zip_code}. Please provide more details.\n\nThanks.`,
        }),
      });

      const data = await response.json();

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: data.message || "Email sent successfully",
      });
    } catch (err) {
      console.error(err);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Failed to send email",
        text: "Please try again later.",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/products"
        className="inline-flex items-center mb-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Properties
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Image and Property Details Section */}
        <div className="md:flex">
          {/* Image Section*/}
          <div className="md:w-1/2 mt-12">
            <div className="relative h-96 w-full">
              <img
                src={`http://localhost:8080/api/v1/read/${images}`}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Property Details Section*/}
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              <span className="text-2xl font-semibold text-blue-600">${price.toLocaleString()}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{type}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Bedrooms</p>
                <p className="font-medium">{bedroom}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Bathrooms</p>
                <p className="font-medium">{bathroom}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Area</p>
                <p className="font-medium">{square_footage} sq ft</p>
              </div>
            </div>

            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
              <p className="text-gray-700">{features}</p>
            </div>

            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{description}</p>
            </div>

            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-700">{street}, {city}, {zip_code}</p>
            </div>
          </div>
        </div>

        {/* Seller Information*/}
        <div className="border-t border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Seller Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="text-gray-600 w-24">Name:</span>
                <span className="font-medium">{full_name}</span>
              </p>
              <p className="flex items-center">
                <span className="text-gray-600 w-24">Email:</span>
                <span className="font-medium">{email}</span>
              </p>
              <p className="flex items-center">
                <span className="text-gray-600 w-24">Phone:</span>
                <span className="font-medium">{country_code} {mobile_number}</span>
              </p>
            </div>
            <div className="flex items-center justify-start md:justify-end">
              <button
                onClick={handleContactSeller}
                className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}