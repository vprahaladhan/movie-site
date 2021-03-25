const api_key = 'a2f05c95df66faa065b61cb42aae2c43';
const popularMoviesURL = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`;
const topRatedMoviesURL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&language=en-US&page=1`;
const movieTrailerBaseURL = 'https://api.themoviedb.org/3/movie';
const movieImageURL = 'http://image.tmdb.org/t/p/w185';
const moviePosterURL = 'http://image.tmdb.org/t/p/w342';
let movieId;
let trailerClickEventListener;

const getMovieTrailerURL = movieId => {
  return `${movieTrailerBaseURL}/${movieId}/videos?api_key=${api_key}&language=en-US`;
}

trailerClickEventListener = () => {
  fetch(getMovieTrailerURL(movieId))
    .then(response => response.json())
    .then(({ results }) => {
      if (results[0].site.toLowerCase() === 'youtube') {
        // document.getElementById('modal-body').innerHTML = `
        //   <iframe src="https://www.youtube.com/embed/${results[0].key}?autoplay=1" />
        // `;
        window.open(`https://www.youtube.com/watch?v=${results[0].key}`, '_blank');
      }
    });
};

const playTrailer = (event, movie) => {
  console.log('Play trailer event >> ', event);
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
  playTrailer(event, movie);
};

document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('trailer').removeEventListener('click', trailerClickEventListener);
});

const fetchMovies = (url, topRated = false) => fetch(url)
  .then(response => response.json())
  .then(response => {
    response.results.forEach(movie => {
      const movieContainer = document.createElement('div');
      const movieInnerContainer = document.createElement('div');
      
      const trailer = document.createElement('button');
      trailer.setAttribute('data-toggle', 'modal');
      trailer.style = 'border: 0; background: none; border-radius: 0px; cursor: pointer;'

      const moviePoster = document.createElement('img');
      moviePoster.src = movieImageURL + movie.poster_path;
      moviePoster.alt = movie.title;

      trailer.appendChild(moviePoster);
      movieInnerContainer.appendChild(trailer);
      movieContainer.appendChild(movieInnerContainer);
      document.getElementById(topRated ? 'top-rated' : 'most-popular').appendChild(movieContainer);

      trailer.addEventListener('click', event => {
        trailer.setAttribute('data-target', '#movie-details-modal');
        displayMovieDetailsModal(event, movie);
      });
    });
  });

fetchMovies(popularMoviesURL);

fetchMovies(topRatedMoviesURL, true);