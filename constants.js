const api_key = 'a2f05c95df66faa065b61cb42aae2c43';
const language = 'language=en-US';

const theMovieDBURL = 'https://api.themoviedb.org/3';
const searchMoviesURL = `${theMovieDBURL}/search/movie?api_key=${api_key}&${language}&include_adult=false`;
const popularMoviesURL = `${theMovieDBURL}/movie/popular?api_key=${api_key}&${language}&page=1`;
const topRatedMoviesURL = `${theMovieDBURL}/movie/top_rated?api_key=${api_key}&${language}&page=1`;
const movieTrailerBaseURL = `${theMovieDBURL}/movie`;
const movieImageURL = 'https://image.tmdb.org/t/p/w185';
const moviePosterURL = 'https://image.tmdb.org/t/p/w342';
const youtubeTrailerURL = 'https://www.youtube.com/embed';

const unlikedIcon = '<i class="far fa-2x fa-thumbs-down"></i>';
const likedIcon = '<i class="far fa-2x fa-thumbs-up"></i>';