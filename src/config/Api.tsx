// import axios from 'axios';

// const instance = axios.create({
//     baseURL: 'http://127.0.0.1:8000',
//     withCredentials: true
// });

// export default instance; 

import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    withCredentials: true,
});

export default instance;
