'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { product_listing } from '../../../store/slice/productSlice'; 
import Update from './Update';

export default function EditPropertyPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const { product, loading } = useSelector((state) => state.products);

  useEffect(() => {
   
      dispatch(product_listing());
    
  }, [dispatch]);
// console.log("sellerData",sellerData);

  const property = product.find((p) => p.id == parseInt(id));

  if (loading || !property) return <p>Loading property data...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>
      <Update propertyData={property} />
    </div>
  );
}
