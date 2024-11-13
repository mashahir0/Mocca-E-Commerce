import axios from 'axios';

// Initialize axios instance
const api = axios.create({
    baseURL: 'http://localhost:3000',
});

// Helper function to get tokens
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Set up interceptor
api.interceptors.request.use(async (config) => {
    let token = getAccessToken();
    console.log(token);
    
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If access token is expired, use refresh token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();

            // Request new access token using refresh token
            const response = await axios.post('/refresh-token', { refreshToken });
            if (response.status === 200) {
                const newAccessToken = response.data.accessToken;

                // Update localStorage and retry the original request
                localStorage.setItem('accessToken', newAccessToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
