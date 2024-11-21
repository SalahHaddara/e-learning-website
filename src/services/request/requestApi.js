import axios from "axios";

axios.defaults.baseURL = "http://localhost/e-learning-website/backend";

export const requestApi = async ({route, method = "GET", body}) => {
    try {
        const response = await axios.request({
            url: `${route}.php`,
            method,
            data: body ? JSON.stringify(body) : undefined,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.token
            },
        });

        if (response.data.status === 'error') {
            throw new Error(response.data.message);
        }

        return response.data;
    } catch (error) {
        if (error.message) {
            throw new Error(error.message);
        }
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('An unexpected error occurred');
    }
};