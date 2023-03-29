import './css/styles.css';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import { PixabayApi } from './js/fetchPhoto';

const formEl = document.querySelector('.search-form');
const gallaryDiv = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.hidden = true;

const pixabayApi = new PixabayApi();
let inputValue = '';
let gallery = new simpleLightbox('.gallery a', {
    captionsData: "title"
});

const formListener = formEl.addEventListener('submit', onFormSubmit)
const loadMoreListener = loadMoreBtn.addEventListener('click', onLoadMore)

async function onFormSubmit(ev) {
    ev.preventDefault();
    gallaryDiv.innerHTML = '';
    inputValue = ev.currentTarget.elements[0].value;
    let subBtn = ev.currentTarget.elements[1];

    if (!inputValue.trim()) {
        console.log(`Empty`)
        return
    }
    loadMoreBtn.hidden = false;
    const request = await createGallary(inputValue, 1);
    gallery.refresh()
};


async function createGallary(searchRequest, page) {
    pixabayApi.searchValue = searchRequest;
    pixabayApi.currentPage = page;
    const ApiRes = await pixabayApi.getPhoto();
    const markup = ApiRes.data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `

    <a rel="noopener noreferrer" class="gallery__link" href="${largeImageURL}">
            <img class="gallery__image" src="${webformatURL}" data-source="${largeImageURL}" alt="${tags}" loading="lazy" />
        <div class="info">
            <p class="info-item"><b>Likes: ${likes}</b></p>
            <p class="info-item"><b>Views: ${views}</b></p>
            <p class="info-item"><b>Comments: ${comments}</b></p>
            <p class="info-item"><b>Downloads: ${downloads}</b></p>
        </div>
    </a>
    `);
    gallaryDiv.insertAdjacentHTML('beforeEnd', markup.join(""));
    return ApiRes;
}

async function onLoadMore(el) {
    ++pixabayApi.currentPage
    const request = await createGallary(inputValue, pixabayApi.currentPage);
    console.log(!request.data.hits.length)
}

