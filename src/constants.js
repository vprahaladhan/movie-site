export const api_key = process.env.TMDB_API_KEY;
export const language = 'language=en-US';

export const theMovieDBURL = 'https://api.themoviedb.org/3';
export const searchMoviesURL = `${theMovieDBURL}/search/movie?api_key=${api_key}&${language}&include_adult=false`;
export const popularMoviesURL = `${theMovieDBURL}/movie/popular?api_key=${api_key}&${language}&page=1`;
export const topRatedMoviesURL = `${theMovieDBURL}/movie/top_rated?api_key=${api_key}&${language}&page=1`;
export const movieTrailerBaseURL = `${theMovieDBURL}/movie`;
export const movieImageURL = 'https://image.tmdb.org/t/p/w185';
export const moviePosterURL = 'https://image.tmdb.org/t/p/w342';
export const youtubeTrailerURL = 'https://www.youtube.com/embed';