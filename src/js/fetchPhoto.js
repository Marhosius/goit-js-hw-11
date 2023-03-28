import Notiflix from 'notiflix';
import axios from 'axios';
const API_KEY = `34827210-dfbfa3fa5ea498ab11e20bf55`;
const BASE_URL = 'https://pixabay.com/api/';
const SEARCH_TYPE = `photo`;
const SAFE_SEARCH = false;
let currentPage = 1;
let perPage = 40;
let searchValue = `cars`;

const getPhoto = () => axios.get(`${BASE_URL}?key=${API_KEY}&q=${searchValue}&image_type=${SEARCH_TYPE}&page=${currentPage}&per_page=${perPage}&orientation=horizontal&safesearch=${SAFE_SEARCH}`);

getPhoto().then(({ data }) => {
    console.log(data);
}).catch(console.warn);
