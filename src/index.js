import './styles/index.css';
import * as Utils from './constants';
import noImage from './assets/no-image.jpg'

export let movieId;
export let tmdbSession = {};
export let currentPage = 1;
export let totalPages, totalResults;

console.log(`Session URL > ${Utils.theMovieDBURL}/authentication/guest_session/new?api_key=${Utils.api_key}`);

export const setCurrentPage = pageNo => {
  currentPage = pageNo
  return currentPage; 
};

export const getTMDBSession = () => {
  return fetch(`${Utils.theMovieDBURL}/authentication/guest_session/new?api_key=${Utils.api_key}`)
    .then(response => {
      console.log('Response : session > ', response);
      return response.json()
    })
    .then(result => tmdbSession = result.success && {
      session_id: result.guest_session_id,
      expires_at: new Date(result.expires_at)
    });
};

export const getMovieVoteCount = movieId => {
  return fetch(`${Utils.movieTrailerBaseURL}/${movieId}?api_key=${Utils.api_key}`)
    .then(response => response.json())
    .then(movie => {
      console.log('Movie vote count >> ', movie.vote_count);
      return movie.vote_count
    });
}

export const getMovieTrailerURL = movieId => {
  return `${Utils.movieTrailerBaseURL}/${movieId}/videos?api_key=${Utils.api_key}&${Utils.language}`;
}

export const clearMovieSearch = () => {
  const newMovieSearchDiv = document.createElement('div');
  newMovieSearchDiv.id = 'movie-search';
  newMovieSearchDiv.className = 'slick';
  newMovieSearchDiv.style = 'width: 95%; margin: 0 auto;'
  document.getElementById('movie-search').replaceWith(newMovieSearchDiv);
};

export const trailerClickEventListener = () => {
  console.log('Movie ID > ', movieId);
  fetch(getMovieTrailerURL(movieId))
    .then(response => response.json())
    .then(({ results }) => {
      if (results.length !== 0 && results[0].site.toLowerCase() === 'youtube') {
        document.getElementById('movie-poster-container').innerHTML = `
          <iframe 
            id="youtube-trailer"
            width="400px" 
            height="400px"
            src="${Utils.youtubeTrailerURL}/${results[0].key}?autoplay=1">
          </iframe>
        `;
        document.getElementById('trailer').disabled = true;
      }
      else {
        alert('Sorry, No trailers available for the movie!')
      }
    });
};

export const displayMovieDetailsModal = (event, movie) => {
  document.getElementById('movie-title').innerHTML = movie.title;
  document.getElementById('movie-poster').src = movie.poster_path ? Utils.moviePosterURL + movie.poster_path : noImage;
  document.getElementById('movie-poster').alt = movie.title;
  document.getElementById('movie-overview').innerHTML = movie.overview;
  document.getElementById('release-date').innerHTML = `Released: ${movie.release_date}`;
  document.getElementById('average-vote').innerHTML = `Avg. vote: ${movie.vote_average}`;

  if (document.getElementById(`like-${movie.id}`).className.includes('liked')) {
    document.getElementById('like-icon').classList.add('liked');
  }

  document.getElementById('like-icon').onclick = () => {
    document.getElementById('like-icon').classList.toggle('liked');
    document.getElementById(`like-${movie.id}`).classList.toggle('liked');
  };

  movieId = movie.id;
  document.getElementById('trailer').addEventListener('click', trailerClickEventListener);
};

export const createMovieSlide = movie => {
  const movieContainer = document.createElement('div');
  const movieInnerContainer = document.createElement('div');
  movieInnerContainer.className = 'container';

  const trailer = document.createElement('button');
  trailer.setAttribute('data-toggle', 'modal');
  trailer.style = 'border: 0; background: none; border-radius: 0px; cursor: pointer;'

  const moviePoster = document.createElement('img');
  moviePoster.setAttribute('data-lazy', movie.poster_path ? Utils.movieImageURL + movie.poster_path : noImage);
  moviePoster.alt = movie.title;
  
  const likeIcon = document.createElement('div');
  likeIcon.id = `like-${movie.id}`;
  likeIcon.className = "btn btn-floating icon";
  likeIcon.innerHTML = '<i class="fa fa-heart"></i>';

  trailer.appendChild(moviePoster);
  trailer.appendChild(likeIcon);
  movieInnerContainer.appendChild(trailer);
  movieContainer.appendChild(movieInnerContainer);

  trailer.addEventListener('click', event => {
    trailer.setAttribute('data-target', '#movie-details-modal');
    if (document.getElementById('trailer').disabled) {
      document.getElementById('trailer').disabled = false;
    };
    displayMovieDetailsModal(event, movie);
  });

  likeIcon.addEventListener('click', event => {
    event.stopPropagation();
    likeIcon.classList.toggle('liked');
  });

  return movieContainer;
}

export const fetchMovies = (url, category) => fetch(url)
  .then(response => response.json())
  .then(response => {
    if (category === 'search') {
      currentPage = response.page;
      totalPages = response.total_pages;
      totalResults = response.total_results;
    };

    response.results.forEach(movie => {
      let searchByCategory = '';
      switch (category) {
        case 'search': searchByCategory = 'movie-search'; break;
        case 'rated': searchByCategory = 'top-rated'; break;
        case 'popular': searchByCategory = 'most-popular'; break;
      }
      document.getElementById(searchByCategory).appendChild(createMovieSlide(movie));
    });
  });

export const postMovieRating = rating => {
  fetch(`${Utils.movieTrailerBaseURL}/${movieId}/rating?api_key=${Utils.api_key}&guest_session_id=${tmdbSession.session_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      value: rating
    })
  }).then(response => response.json())
    .then(result => {
      if (result.success) {
        document.getElementById('movie-rating').value = '';
        document.getElementById('rating-success-msg').className = 'show';
        setTimeout(() => {
          document.getElementById('rating-success-msg').className = 'hide';
        }, 2000);
      };
    });
};

getTMDBSession();

fetchMovies(Utils.popularMoviesURL, 'popular');

fetchMovies(Utils.topRatedMoviesURL, 'rated');