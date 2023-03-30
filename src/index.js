import './css/styles.css';
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import { PixabayApi } from './js/fetchPhoto';
import throttle from 'lodash.throttle';

const formEl = document.querySelector('.search-form');
const gallaryDiv = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const bodyEl = document.querySelector('body');
const checkEl = document.querySelector('.autoload_check');
loadMoreBtn.style.display = `none`;

const pixabayApi = new PixabayApi();
let inputValue = '';
let gallery = new simpleLightbox('.gallery a', {
    captionsData: "title"
});


const setBg = async (value) => {
    const ApiRes = await pixabayApi.getByID(value);
    bodyEl.style.backgroundImage = `url(${ApiRes.data.hits[0].largeImageURL})`;
    bodyEl.style.backgroundRepeat = `no-repeat`;
    bodyEl.style.backgroundPosition = `50 % 50 %`;
    bodyEl.style.backgroundAttachment = `fixed`;
    bodyEl.style.backgroundSize = `cover`;
};

try {
    setBg(2529172)
} catch (error) {
    console.log(error)
}


const formListener = formEl.addEventListener('submit', onFormSubmit)
const loadMoreListener = loadMoreBtn.addEventListener('click', onLoadMore)

async function onFormSubmit(ev) {
    ev.preventDefault();
    gallaryDiv.innerHTML = '';
    inputValue = ev.currentTarget.elements[0].value;

    window.removeEventListener("scroll", throtledhandleInfiniteScroll);

    if (!inputValue.trim()) {
        Notiflix.Notify.warning(`Enter some request to get started`)
        loadMoreBtn.style.display = `none`;
        return
    }


    const request = await createGallary(inputValue, 1);

    if (!request.data.totalHits) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        formEl.reset();
        loadMoreBtn.style.display = `none`;
        return
    }

    gallery.refresh()
    Notiflix.Notify.success(`Hooray! We found ${request.data.totalHits} images.`)

    if (request.data.totalHits > 40) {
        if (checkEl.checked) {
            let scrollListener = window.addEventListener("scroll", throtledhandleInfiniteScroll);
            formEl.reset();
            return
        }
        loadMoreBtn.style.display = `block`;
        formEl.reset();
        return
    }
    formEl.reset();
};


async function createGallary(searchRequest, page) {
    pixabayApi.searchValue = searchRequest;
    pixabayApi.currentPage = page;
    const ApiRes = await pixabayApi.getPhoto();
    const markup = ApiRes.data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads, id }) => `

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
    if (!request.data.hits.length) {
        loadMoreBtn.style.display = `none`;
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
        return
    }

    const { height: cardHeight } = gallaryDiv.firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });

}

const handleInfiniteScroll = async () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOfPage) {
        ++pixabayApi.currentPage
        const request = await createGallary(inputValue, pixabayApi.currentPage);
        if (!request.data.hits.length) {
            loadMoreBtn.style.display = `none`;
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")

            window.removeEventListener("scroll", throtledhandleInfiniteScroll);
            return
        }
    }
};

const throtledhandleInfiniteScroll = throttle(handleInfiniteScroll, 300);
