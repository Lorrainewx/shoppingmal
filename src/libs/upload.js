import axios from 'axios';
import env from '../config/env';

const ajaxUrl = env === 'development'
    ? 'http://www.ftdolls.com' : env === 'production'
        ? '' : 'https://debug.url.com';


export default ajaxUrl;
