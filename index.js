let movieId;
let tmdbSession = {};

const api_key = 'a2f05c95df66faa065b61cb42aae2c43';
const language = 'language=en-US';

const theMovieDBURL = 'https://api.themoviedb.org/3';
const searchMoviesURL = `${theMovieDBURL}/search/movie?api_key=${api_key}&${language}&page=1&include_adult=false`;
const popularMoviesURL = `${theMovieDBURL}/movie/popular?api_key=${api_key}&${language}&page=1`;
const topRatedMoviesURL = `${theMovieDBURL}/movie/top_rated?api_key=${api_key}&${language}&page=1`;
const movieTrailerBaseURL = `${theMovieDBURL}/movie`;
const movieImageURL = 'http://image.tmdb.org/t/p/w185';
const moviePosterURL = 'http://image.tmdb.org/t/p/w342';
const youtubeTrailerURL = 'https://www.youtube.com/embed';

const getTMDBSession = () => {
  return fetch(`${theMovieDBURL}/authentication/guest_session/new?api_key=${api_key}`)
    .then(response => response.json())
    .then(result => tmdbSession = result.success && {
      session_id: result.guest_session_id,
      expires_at: new Date(result.expires_at)
    }
    );
};

const getMovieVoteCount = movieId => {
  return fetch(`${movieTrailerBaseURL}/${movieId}?api_key=${api_key}`)
    .then(response => response.json())
    .then(movie => {
      console.log('Movie vote count >> ', movie.vote_count);
      return movie.vote_count
    });
}

const getMovieTrailerURL = movieId => {
  return `${movieTrailerBaseURL}/${movieId}/videos?api_key=${api_key}&${language}`;
}

const clearMovieSearch = () => {
  const movieSearchDiv = document.getElementById('movie-search');

  const newMovieSearchDiv = document.createElement('div');
  movieSearchDiv.parentNode.insertBefore(newMovieSearchDiv, movieSearchDiv.nextSibling);
  movieSearchDiv.remove();

  newMovieSearchDiv.id = 'movie-search';
  newMovieSearchDiv.className = 'slick';
  newMovieSearchDiv.style = 'width: 90%; margin: 0 auto;'
};

const trailerClickEventListener = () => {
  fetch(getMovieTrailerURL(movieId))
    .then(response => response.json())
    .then(({ results }) => {
      if (results.length !== 0 && results[0].site.toLowerCase() === 'youtube') {
        document.getElementById('movie-poster-container').innerHTML = `
          <iframe 
            id="youtube-trailer"
            width="400px" 
            height="400px"
            src="${youtubeTrailerURL}/${results[0].key}?autoplay=1">
          </iframe>
        `;
        document.getElementById('trailer').disabled = true;
      }
      else {
        alert('Sorry, No trailers available for the movie!')
      }
    });
};

const playTrailer = (event, movie) => {
  movieId = movie.id;
  document.getElementById('trailer').addEventListener('click', trailerClickEventListener);
};

const displayMovieDetailsModal = (event, movie) => {
  document.getElementById('movie-title').innerHTML = movie.title;
  document.getElementById('movie-poster').src = moviePosterURL + movie.poster_path;
  document.getElementById('movie-poster').alt = movie.title;
  document.getElementById('movie-overview').innerHTML = movie.overview;
  document.getElementById('release-date').innerHTML = `Released: ${movie.release_date}`;
  document.getElementById('average-vote').innerHTML = `Avg. vote: ${movie.vote_average}`;
  getMovieVoteCount(movie.id)
    .then(voteCount => document.getElementById('total-votes').innerHTML = `Total votes: ${voteCount}`);
  playTrailer(event, movie);
};

const fetchMovies = (url, category) => fetch(url)
  .then(response => response.json())
  .then(response => {
    response.results.forEach(movie => {
      if (movie.poster_path) {
        const movieContainer = document.createElement('div');
        const movieInnerContainer = document.createElement('div');

        const trailer = document.createElement('button');
        trailer.setAttribute('data-toggle', 'modal');
        trailer.style = 'border: 0; background: none; border-radius: 0px; cursor: pointer;'

        const moviePoster = document.createElement('img');
        moviePoster.setAttribute('data-lazy', movieImageURL + movie.poster_path);
        moviePoster.alt = movie.title;

        trailer.appendChild(moviePoster);
        movieInnerContainer.appendChild(trailer);
        movieContainer.appendChild(movieInnerContainer);

        let searchByCategory = '';
        switch (category) {
          case 'search': searchByCategory = 'movie-search'; break;
          case 'rated': searchByCategory = 'top-rated'; break;
          case 'popular': searchByCategory = 'most-popular'; break;
        }
        document.getElementById(searchByCategory).appendChild(movieContainer);

        trailer.addEventListener('click', event => {
          trailer.setAttribute('data-target', '#movie-details-modal');
          if (document.getElementById('trailer').disabled) {
            document.getElementById('trailer').disabled = false;
          };
          displayMovieDetailsModal(event, movie);
        });
      }
    });
  });

const postMovieRating = rating => {
  fetch(`${movieTrailerBaseURL}/${movieId}/rating?api_key=${api_key}&guest_session_id=${tmdbSession.session_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      value: rating
    })
  }).then(response => {
    document.getElementById('movie-rating').value = '';
    fetch(`${movieTrailerBaseURL}/${movieId}?api_key=${api_key}`)
      .then(response => response.json())
      .then(movie => {
        console.log('Movie details > ', movie);
        document.getElementById('total-votes').innerHTML = `Total votes: ${movie.vote_count}`;
      })
  });
};

getTMDBSession();

fetchMovies(popularMoviesURL, 'popular');

fetchMovies(topRatedMoviesURL, 'rated');