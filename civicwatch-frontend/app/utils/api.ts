// import { getSession } from "next-auth/react";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
//   const session: any = await getSession();
//   const token = session?.accessToken;

//   // Check if body is FormData (used for file uploads)
//   const isFormData = options.body instanceof FormData;

//   const headers: any = {
//     ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
//     ...options.headers,
//   };

//   // Agar FormData (File) hai, toh Content-Type delete kar dein 
//   // taaki browser auto-boundary set kar sake
//   if (!isFormData) {
//     headers['Content-Type'] = 'application/json';
//   } else if (headers['Content-Type']) {
//     delete headers['Content-Type'];
//   }

//   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers,
//   });

//   if (!res.ok) {
//     throw new Error(`API Error: ${res.statusText}`);
//   }
  
//   return res.json();
// }

import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  const session: any = await getSession();
  const token = session?.accessToken;

  // Debugging log to verify token presence
  if (!token) {
    console.warn("⚠️ Warning: No access token found in session for request:", endpoint);
  }

  const isFormData = options.body instanceof FormData;

  const headers: any = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  } else if (headers['Content-Type']) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`API Error details [${res.status}]:`, errorBody);
    throw new Error(`API Error: ${res.statusText} (${res.status})`);
  }
  
  return res.json();
}