"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { show_products, logout } from "../store/slice/productSlice";
import Swal from "sweetalert2";

export default function Products() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { prods, loading, error } = useSelector((state) => state.products);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedBed, setSelectedBed] = useState("Any");
  const [selectedBathroom, setSelectedBathroom] = useState("Any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const user_role = JSON.parse(localStorage.getItem("user_role"));

      if (!token) {
        router.push("/login");
        return;
      }

      if (user_role === "buyer") {
        router.push("/products");
      } else {
        router.push("/dashboard");
      }

      dispatch(show_products(token));
    } catch (e) {
      console.error("Token parsing error:", e.message);
      router.push("/login");
    }
  }, [dispatch, router]);

  const Logout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = JSON.parse(localStorage.getItem("token"));
        dispatch(logout({ token }));
        localStorage.clear();
        router.push("/login");
        Swal.fire("Logged out!", "You have been successfully logged out.", "success");
      }
    });
  };

  const clearFilters = () => {
    setSelectedType("All");
    setSelectedCity("All");
    setSelectedBed("Any");
    setSelectedBathroom("Any");
    setMinPrice("");
    setMaxPrice("");
    setSearchTerm("");
  };

  const propertyTypes = ["All", "apartment", "house", "villa", "condo"];
  const bed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const bathroom = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const cityOptions = useMemo(() => {
    if (!prods) return [];
    const uniqueCities = new Set();
    prods.forEach((property) => {
      if (property.city) uniqueCities.add(property.city);
    });
    return ["All", ...Array.from(uniqueCities)];
  }, [prods]);

  const filteredProperties = useMemo(() => {
    if (!prods) return [];

    return prods.filter((property) => {
      const matchesType = selectedType === "All" || property.type === selectedType;
      const matchesCity = selectedCity === "All" || property.city === selectedCity;
      const matchesBed = selectedBed === "Any" || property.bedroom === selectedBed;
      const matchesBathroom = selectedBathroom === "Any" || property.bathroom === selectedBathroom;
      const price = parseFloat(property.price);
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      const matchesPrice = price >= min && price <= max;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        property.title?.toLowerCase().includes(searchLower) ||
        property.street?.toLowerCase().includes(searchLower) ||
        property.city?.toLowerCase().includes(searchLower) ||
        property.zip_code?.toString().includes(searchLower);

      return matchesType && matchesCity && matchesBed && matchesBathroom && matchesPrice && matchesSearch;
    });
  }, [prods, selectedType, selectedCity, selectedBed, selectedBathroom, minPrice, maxPrice, searchTerm]);

  const handleViewDetails = (id) => {
    Swal.fire({
      title: "Loading...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        setTimeout(() => {
          router.push(`/products/${id}`);
          Swal.close();
        }, 500);
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-blue-500 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-blue-500 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-blue-500 rounded"></div>
              <div className="h-4 bg-blue-500 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Properties</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search properties..."
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 flex-grow min-w-[200px]"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition duration-200 flex items-center gap-2 w-full sm:w-auto"
              >
                {filtersOpen ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Hide Filters
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Show Filters
                  </>
                )}
              </button>
              <button
                onClick={Logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200 flex items-center gap-2 w-full sm:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {filtersOpen && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full">
            <div className="flex flex-wrap gap-4 items-center w-full">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type} className="capitalize">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <select
                  value={selectedBed}
                  onChange={(e) =>
                    e.target.value === "Any" ? setSelectedBed("Any") : setSelectedBed(parseInt(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Any">Any</option>
                  {bed.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <select
                  value={selectedBathroom}
                  onChange={(e) =>
                    e.target.value === "Any" ? setSelectedBathroom("Any") : setSelectedBathroom(parseInt(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Any">Any</option>
                  {bathroom.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="text"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="text"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-700 mb-1 invisible">Clear</label>
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Properties Section */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <img
                    src={`http://localhost:8080/api/v1/read/${property.images}`}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">{property.title}</h2>
                  <p className="text-gray-600 text-sm mb-2 truncate">
                    {property.street}, {property.city}, {property.zip_code}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="flex items-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      {property.bedroom} beds
                    </span>
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {property.bathroom} baths
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-blue-600 font-bold">
                      ${property.price.toLocaleString()}
                      <span className="text-gray-500 text-sm font-normal ml-1">({property.square_footage} sqft)</span>
                    </p>
                    <button
                      onClick={() => handleViewDetails(property.id)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-200 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}