const api_key = 'a2f05c95df66faa065b61cb42aae2c43';
const popularMoviesURL = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`;
const topRatedMoviesURL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&language=en-US&page=1`;
const movieImagesURL = 'http://image.tmdb.org/t/p/w185';

fetch(popularMoviesURL)
  .then(response => response.json())
  .then(response => {
    response.results.forEach(movie => {
      const movieContainer = document.createElement('div');
      movieContainer.className = 'item col-xs-2';

      const moviePoster = document.createElement('img');
      moviePoster.src = movieImagesURL + movie.poster_path;
      moviePoster.alt = movie.title;

      movieContainer.appendChild(moviePoster);
      document.getElementById('popular-movies').appendChild(movieContainer);
    });
  });