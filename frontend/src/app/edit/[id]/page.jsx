'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { getSellerProperties } from '../../store/slice/productSlice'; 
import Update from './Update';
import Link from 'next/link';

export default function EditPropertyPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const { sellerData, loading } = useSelector((state) => state.products);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      dispatch(getSellerProperties(token));
    }
  }, [dispatch]);
// console.log("sellerData",sellerData);

  const property = sellerData.find((p) => p.id == parseInt(id));

  if (loading || !property) return <p>Loading property data...</p>;

  return (
    <div className="p-6">
<Link
  href="/dashboard"
  className="inline-block mb-6 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200"
>
  &larr; Back to Dashboard
</Link>

    <Update propertyData={property} />
    </div>
  );
}
