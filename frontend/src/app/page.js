"use client";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation"; 

export default function Home() {
  const router = useRouter();

  const handleLogin = (path) => {
    Swal.fire({
      title: 'Redirecting...',
      text: 'Please wait',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      Swal.close(); 
      router.push(path);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-3xl font-bold mb-6 text-gray-800">Welcome To Dream Home🏠</div>
      <div className="flex gap-4">
        <button
          onClick={() => handleLogin("/admin/login")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Admin Login
        </button>
        <button
          onClick={() => handleLogin("/login")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          User Login
        </button>
      </div>
    </div>
  );
}
