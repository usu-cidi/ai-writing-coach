import axios from 'axios';

const devInstance = axios.create({
    baseURL: 'http://localhost/writing-coach/action.php',
    headers: {'Content-Type': 'application/json'}
});

export default devInstance;
