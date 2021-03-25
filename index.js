const api_key = 'a2f05c95df66faa065b61cb42aae2c43';
const popularMoviesURL = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`;
const topRatedMoviesURL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&language=en-US&page=1`;
const movieTrailerBaseURL = 'https://api.themoviedb.org/3/movie';
const movieImagesURL = 'http://image.tmdb.org/t/p/w185';

const getMovieTrailerURL = movieId => {
  return `${movieTrailerBaseURL}/${movieId}/videos?api_key=${api_key}&language=en-US`;
}

fetch(popularMoviesURL)
  .then(response => response.json())
  .then(response => {
    response.results.forEach(movie => {
      const movieContainer = document.createElement('div');
      movieContainer.style = 'display: inline; margin: 5px;'

      const trailer = document.createElement('button');
      trailer.style =  'border: 0; background: none; cursor: pointer;';
      // trailer.dataToggle = 'modal';
      // trailer.dataTarget = 'modal-center';

      const moviePoster = document.createElement('img');
      moviePoster.src = movieImagesURL + movie.poster_path;
      moviePoster.alt = movie.title;

      trailer.appendChild(moviePoster);
      movieContainer.appendChild(trailer);
      document.getElementById('popular-movies').appendChild(movieContainer);

      trailer.addEventListener('click', () => {
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