import axios from 'axios';

const local = axios.create({
    baseURL: 'http://127.0.0.1:8000'
});

export default local; 