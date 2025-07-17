"use client";

import { configureStore } from "@reduxjs/toolkit";
import prodReducer from "./slice/productSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            products: prodReducer
        },
    });
}