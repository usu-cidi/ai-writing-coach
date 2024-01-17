import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://elearn.usu.edu/ludovic/writing-coach/public/action.php',
    headers: {'Content-Type': 'application/json'}
});

export default instance;
