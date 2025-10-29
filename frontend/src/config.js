const config = {
  API_BASE_URL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001' 
    : 'https://production-url.com'
};

export default config;