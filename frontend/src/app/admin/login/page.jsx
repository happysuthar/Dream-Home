"use client";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { admin_login } from '../../store/slice/productSlice';
import { useRouter } from "next/navigation";
import { useState } from 'react';

const LoginForm = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const initialValues = {
        email_id: '',
        password: '',
    };

    const validationSchema = Yup.object({
        email_id: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required'),
    });

const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    setSuccess(false);
    
    try {
        const payload = {
            email: values.email_id,
            password: values.password,
        };

        const response = await dispatch(admin_login(payload)).unwrap();
        // console.log("response", response.code);

        if (response.code === "0") {
            setError("Invalid credentials");
            return;
        }

        if (response.code === "1") {
            setSuccess(true);
            router.push('/admin');
        }
    } catch (err) {
        console.error('Login error:', err);
        setError('Failed to login. Please try again.');
    } finally {
        setSubmitting(false);
    }
};


    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md mt-20 mb-20">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            </div>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, isValid }) => (
                    <Form className="space-y-6">
                        <div>
                            <label htmlFor="email_id" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <Field 
                                name="email_id" 
                                type="email" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                            <ErrorMessage 
                                name="email_id" 
                                component="div" 
                                className="text-red-500 text-xs mt-1" 
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <Field 
                                name="password" 
                                type="password" 
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                            <ErrorMessage 
                                name="password" 
                                component="div" 
                                className="text-red-500 text-xs mt-1" 
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !isValid}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium ${isSubmitting || !isValid ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : 'Login'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default LoginForm;