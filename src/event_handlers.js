import {  currentPage,
          setCurrentPage, 
          clearMovieSearch, 
          createMovieSlide, 
          tmdbSession, 
          getTMDBSession, 
          postMovieRating,
          fetchMovies } from './index';
import { searchMoviesURL, initializeSlick } from './constants';
let keyword;

document.getElementById('modal-close').onclick = () => {
  if (document.getElementById('youtube-trailer')) {
    document.getElementById('movie-poster-container').innerHTML = `
      <p><img id="movie-poster" src="#" alt="Movie Poster"></p>`;
  };
};

document.getElementById('search-button').addEventListener('click', () => {
  clearMovieSearch();
  keyword = document.getElementById('search-keyword').value;
  setCurrentPage(1);

  if (document.getElementById('search-keyword').value.length >= 1) {
    fetchMovies(`${searchMoviesURL}&query=${keyword}&page=${currentPage}`, 'search')
      .then(() => {
        initSlick();
        document.getElementById('search-keyword').value = '';
      });
  };
});

document.getElementById('movie-rating').addEventListener('input', () => {
  const rating = Number(document.getElementById('movie-rating').value);

  if (isNaN(rating) || rating < 0.5 || rating > 10.0) {
    document.getElementById('submit-rating').disabled = true;
  }
  else document.getElementById('submit-rating').disabled = false;
});

document.getElementById('submit-rating').addEventListener('click', () => {
  const rating = Number(document.getElementById('movie-rating').value);
  if (tmdbSession.session_id && tmdbSession.expires_at > new Date()) {
    postMovieRating(rating);
  }
  else {
    getTMDBSession()
      .then(() => postMovieRating(rating))
  };
});

document.getElementById('liked-filter').onclick = ({ target }) => {
  if (target.innerText === 'Show Only Liked') {
    $('#movie-search').slick('slickFilter','[liked="true"]');
    target.innerText = 'Show All';
  }
  else {
    $('#movie-search').slick('slickUnfilter');
    target.innerText = 'Show Only Liked';
  };
}

// document.getElementById('liked-filter').onclick = ({ target }) => {
//   if (target.innerText === 'Show Only Liked') {
//     $('.slick').slick('slickFilter','[liked="true"]');
//     target.innerText = 'Show All';
//   }
//   else {
//     $('.slick').slick('slickUnfilter');
//     target.innerText = 'Show Only Liked';
//   };
// }

const initSlick = () => {
  initializeSlick('#movie-search');

  $('#movie-search').on('beforeChange', (event, slick, currentSlide, nextSlide) => {
    const slidesToShow = $('#movie-search').slick('slickGetOption', 'slidesToShow') * 2;
    if (nextSlide === (currentPage * 20 - slidesToShow)) {
      fetch(`${searchMoviesURL}&query=${keyword}&page=${setCurrentPage(currentPage + 1)}`)
        .then(response => response.json())
        .then(({ results }) => results.forEach(movie => {
          $('#movie-search').slick('slickAdd', createMovieSlide(movie));
        }));
    }
  });
};