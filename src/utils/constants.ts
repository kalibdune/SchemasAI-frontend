if (!import.meta.env.VITE_BASE_URL) {
    throw new Error('Environment variable VITE_API_URL is not defined')
}

const BASE_URL: string = import.meta.env.VITE_BASE_URL


export { BASE_URL }