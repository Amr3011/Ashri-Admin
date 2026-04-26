const envApiUrl = import.meta.env.VITE_API_URL?.trim();

const defaultApiUrl = "https://ashri-api.vercel.app/api";

export const api_url = envApiUrl || defaultApiUrl;
