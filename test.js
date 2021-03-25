const api_key = 'a2f05c95df66faa065b61cb42aae2c43';
const popularMoviesURL = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`;
const topRatedMoviesURL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&language=en-US&page=1`;
const movieTrailerBaseURL = 'https://api.themoviedb.org/3/movie';
const movieImagesURL = 'http://image.tmdb.org/t/p/w185';

const getMovieTrailerURL = movieId => {
  return `${movieTrailerBaseURL}/${movieId}/videos?api_key=${api_key}&language=en-US`;
}

const fetchMovies = (url, topRated = false) => fetch(url)
  .then(response => response.json())
  .then(response => {
    response.results.forEach((movie, index) => {
      const movieContainer = document.createElement('div');
      movieContainer.className = `item ${index === 0 ? 'active' : ''}`;

      const movieInnerContainer = document.createElement('div');
      movieInnerContainer.className = 'col-xs-2';

      const trailer = document.createElement('button');

      const moviePoster = document.createElement('img');
      moviePoster.src = movieImagesURL + movie.poster_path;
      moviePoster.alt = movie.title;

      trailer.appendChild(moviePoster);
      movieInnerContainer.appendChild(trailer);
      movieContainer.appendChild(movieInnerContainer);
      document.getElementById(topRated ? 'top-rated-inner' : 'most-popular-inner').appendChild(movieContainer);

      movieContainer.addEventListener('click', () => {
        alert('Clicked trailer!');
        fetch(getMovieTrailerURL(movie.id))
          .then(response => response.json())
          .then(({ results }) => {
            if (results[0].site.toLowerCase() === 'youtube') {
              window.open(`https://www.youtube.com/watch?v=${results[0].key}`, '_blank');
            }
          });
      });
    });
  });

fetchMovies(popularMoviesURL);

fetchMovies(topRatedMoviesURL, true);