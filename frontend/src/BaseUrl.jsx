let baseUrl;

if (process.env.NODE_ENV === "production") {
   baseUrl = 'https://food-backend-qspa.onrender.com/api/v1';
} else {
    baseUrl = 'http://localhost:4000/api/v1';
}

export default baseUrl;
