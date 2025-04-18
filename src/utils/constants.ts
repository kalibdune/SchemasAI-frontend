const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

if (!API_URL) {
    throw new Error('VITE_API_URL is not defined');
}

if (!BASE_URL) {
    throw new Error('VITE_BASE_URL is not defined');
}

export { API_URL, BASE_URL };
