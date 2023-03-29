import './css/styles.css';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import { PixabayApi } from './js/fetchPhoto';

const formEl = document.querySelector('.search-form');
const gallaryDiv = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const pixabayApi = new PixabayApi();

const formListener = formEl.addEventListener('submit', onFormSubmit)

async function onFormSubmit(ev) {
    ev.preventDefault();
    gallaryDiv.innerHTML = '';
    let inputValue = ev.currentTarget.elements[0].value;
    let subBtn = ev.currentTarget.elements[1];

    if (!inputValue.trim()) {
        console.log(`Empty`)
        return
    }

    await createGallary(inputValue);
    let gallery = new simpleLightbox('.gallery a', {
        captionsData: "title"
    });

};


async function createGallary(searchRequest) {
    pixabayApi.searchValue = searchRequest;
    const ApiRes = await pixabayApi.getPhoto();
    const markup = ApiRes.data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `

    <a rel="noopener noreferrer" class="gallery__link" href="${largeImageURL}">
        <div class="photo-card">
            <img class="gallery__image" src="${webformatURL}" data-source="${largeImageURL}" alt="${tags}" loading="lazy" />
            <div class="info">
        <p class="info-item"><b>Likes:${likes}</b></p>
        <p class="info-item"><b>Views:${views}</b></p>
        <p class="info-item"><b>Comments:${comments}</b></p>
        <p class="info-item"><b>Downloads:${downloads}</b></p>
            </div>
        </div>
    </a>
    `);
    gallaryDiv.insertAdjacentHTML('beforeEnd', markup.join(""));
}


