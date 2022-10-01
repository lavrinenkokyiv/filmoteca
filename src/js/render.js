import { dataMovieList, dataGenre } from './API/api';
import SweetScroll from 'sweet-scroll';
import emptyImg from '../images/no-image.jpg';
const headerEl = document.querySelector('header');
const galleryListEl = document.querySelector('#gallery-list');
const baseUrtlImg = 'https://image.tmdb.org/t/p/original/';
const page = 1;
const language = 'en-US';
const pageNavDivEl = document.querySelector('.pagination');
const prevBtnEl = document.querySelector('.pagination_previousBtn');
const nextBtnEl = document.querySelector('.pagination_nextBtn');
const currentPageEl = document.querySelector('.pagination_currentPage');
const firstPageEl = document.querySelector('.pagination_firstPage');
const lastPageEl = document.querySelector('.pagination_lastPage');
const leftPointsEl = document.querySelector('.pagination_leftPoints');
const rightPointsEl = document.querySelector('.pagination_rightPoints');
const rightFirstPageEl = document.querySelector('.pagination_rightFirstPage');
const rightSecondPageEl = document.querySelector('.pagination_rightSecondPage');
const leftFirstPageEl = document.querySelector('.pagination_leftFirstPage');
const leftSecondPageEl = document.querySelector('.pagination_leftSecondPage');
const galleryContainer = document.querySelector('.gallery .container');

const watchedListBtn = document.getElementById('js-WatchedButton');
const queueListBtn = document.getElementById('js-QueueButton');
const movieListRef = document.getElementById('gallery-list');

watchedListBtn.addEventListener('click', renderWatchedList);
queueListBtn.addEventListener('click', renderQueueList);

let currentPage = 1;
let totalPages = 1;
const scroller = new SweetScroll({ duration: 6000 });

async function getAllGenres(language) {
  return await dataGenre(language);
}

async function request(page, language) {
  const data = await dataMovieList(page, language);
  renderFilmCards(data);
  pageNavigation(data);
}
async function renderFilmCards(data) {
  const genresData = (await getAllGenres(language)).genres;
  let imgSrc = null;
  const filmList = data.results
    .map(
      ({ id, title, vote_average, genre_ids, release_date, poster_path }) => {
        if (poster_path) {
          imgSrc = `${baseUrtlImg}${poster_path}`;
        }
        if (poster_path === null) {
          imgSrc = imgSrc = emptyImg;
        }
        const allGenres = [];
        genresData
          .map(genre => {
            if (genre_ids.includes(genre.id)) {
              allGenres.push(genre.name);
            }
          })
          .join(', ');
        return `<li data-movie-id="${id}" class="card__item">
    <a class="card__link" href = "">
        <img class="card__img"
        src="${imgSrc}"
        alt="${title}"
        loading=lazy
    />
    
    <h2 class="card__title">${title}</h2>
    <div class="card__text">
        <p class="card__info">${allGenres} | ${release_date
          .split('', 4)
          .join('')}</p>
        <div class="card__rating">${vote_average
          .toString()
          .split('', 3)
          .join('')}</div>
    </div>
    </a>

</li>`;
      }
    )
    .join('');
  galleryListEl.innerHTML = filmList;
}

request(1);
async function pageNavigation(data) {
  if (data.total_results <= 20) {
    pageNavDivEl.style.display = 'none';
    return;
  } else {
    pageNavDivEl.style.display = 'flex';
  }
  currentPage = data.page;
  totalPages = data.total_pages;
  leftFirstPageEl.textContent = currentPage - 1;
  leftSecondPageEl.textContent = currentPage - 2;
  rightFirstPageEl.textContent = currentPage + 1;
  rightSecondPageEl.textContent = currentPage + 2;
  currentPageEl.textContent = currentPage;
  lastPageEl.textContent = totalPages;

  if (!currentPage > 0) {
    return;
  }

  if (currentPage === 1) {
    prevBtnEl.setAttribute('disabled', true);
  } else {
    prevBtnEl.removeAttribute('disabled');
  }

  if (currentPage === totalPages) {
    nextBtnEl.setAttribute('disabled', true);
  } else {
    nextBtnEl.removeAttribute('disabled');
  }

  if (currentPage > 4) {
    leftPointsEl.style.display = 'block';
  } else {
    leftPointsEl.style.display = 'none';
  }

  if (Number(leftFirstPageEl.textContent) <= 1) {
    leftFirstPageEl.style.display = 'none';
  } else if (currentPage > 2) {
    leftFirstPageEl.style.display = 'block';
  }

  if (Number(leftSecondPageEl.textContent) <= 1) {
    leftSecondPageEl.style.display = 'none';
  } else {
    if (currentPage > 1) {
      leftSecondPageEl.style.display = 'block';
    }
  }

  if (Number(leftSecondPageEl.textContent) <= -1) {
    firstPageEl.style.display = 'none';
  } else {
    firstPageEl.style.display = 'block';
  }

  if (totalPages - currentPage <= 3) {
    rightPointsEl.style.display = 'none';
    rightFirstPageEl.textContent = currentPage + 1;
    rightSecondPageEl.textContent = currentPage + 2;
  } else {
    rightPointsEl.style.display = 'block';
  }

  if (totalPages - Number(rightFirstPageEl.textContent) <= 0) {
    rightFirstPageEl.style.display = 'none';
  } else if (totalPages - currentPage >= 0) {
    rightFirstPageEl.textContent = currentPage + 1;
    rightSecondPageEl.textContent = currentPage + 2;
    rightFirstPageEl.style.display = 'block';
  }

  if (totalPages - Number(rightSecondPageEl.textContent) <= 0) {
    rightSecondPageEl.style.display = 'none';
  } else {
    if (totalPages - currentPage >= 0) {
      rightSecondPageEl.style.display = 'block';
    }
  }
  if (Number(lastPageEl.textContent) === currentPage) {
    lastPageEl.style.display = 'none';
  } else {
    lastPageEl.style.display = 'block';
  }
}

pageNavDivEl.addEventListener('click', e => {
  if (e.target.textContent === 'next') {
    currentPage++;
    request(currentPage);
    scroller.to('header');
  }
  if (e.target.textContent === 'prev') {
    currentPage--;
    request(currentPage);
    scroller.to('header');
  }
  if (isFinite(e.target.textContent)) {
    request(e.target.textContent);
    scroller.to('header');
  }
});

export function renderWatchedList() {
  const parsedWatched = JSON.parse(localStorage.getItem('watched'));

  pageNavDivEl.remove();
  if (!parsedWatched || parsedWatched.length === 0) {
    galleryContainer.innerHTML =
      '<h1 class="alert">No movies here yet</h1><img class="alert-img" src="https://i.kym-cdn.com/entries/icons/original/000/019/277/confusedtravolta.jpg" alt="Confused Travolta">';
    return;
  }

  let imgSrc = null;
  const filmList = parsedWatched
    .map(({ id, title, vote_average, genres, release_date, poster_path }) => {
      if (poster_path) {
        imgSrc = `${baseUrtlImg}${poster_path}`;
      }
      if (poster_path === null) {
        imgSrc = imgSrc = emptyImg;
      }
      const allGenres = [];
      genres
        .map(genre => {
          allGenres.push(genre.name);
        })
        .join(', ');
      return `<li data-movie-id="${id}" class="card__item">
    <a class="card__link" href = "">
        <img class="card__img"
        src="${imgSrc}"
        alt="${title}"
        loading=lazy
    />
    
    <h2 class="card__title">${title}</h2>
    <div class="card__text">
        <p class="card__info">${allGenres} | ${release_date
        .split('', 4)
        .join('')}</p>
        <div class="card__rating">${vote_average
          .toString()
          .split('', 3)
          .join('')}</div>
    </div>
    </a>

</li>`;
    })
    .join('');
  galleryListEl.innerHTML = filmList;
}

export function renderQueueList() {
  const parsedQueue = JSON.parse(localStorage.getItem('queue'));
  pageNavDivEl.remove();

  if (!parsedQueue || parsedQueue.length === 0) {
    galleryContainer.innerHTML =
      '<h1 class="alert">No movies here yet</h1><img class="alert-img" src="https://i.kym-cdn.com/entries/icons/original/000/019/277/confusedtravolta.jpg" alt="Confused Travolta">';
    return;
  }

  let imgSrc = null;
  const filmList = parsedQueue
    .map(({ id, title, vote_average, genres, release_date, poster_path }) => {
      if (poster_path) {
        imgSrc = `${baseUrtlImg}${poster_path}`;
      }
      if (poster_path === null) {
        imgSrc = imgSrc = emptyImg;
      }
      const allGenres = [];
      genres
        .map(genre => {
          allGenres.push(genre.name);
        })
        .join(', ');
      return `<li data-movie-id="${id}" class="card__item">
    <a class="card__link" href = "">
        <img class="card__img"
        src="${imgSrc}"
        alt="${title}"
        loading=lazy
    />
    
    <h2 class="card__title">${title}</h2>
    <div class="card__text">
        <p class="card__info">${allGenres} | ${release_date
        .split('', 4)
        .join('')}</p>
        <div class="card__rating">${vote_average
          .toString()
          .split('', 3)
          .join('')}</div>
    </div>
    </a>

</li>`;
    })
    .join('');
  galleryListEl.innerHTML = filmList;
}
