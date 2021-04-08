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

export const unlikedIcon = '<i class="far fa-2x fa-thumbs-down"></i>';
export const likedIcon = '<i class="far fa-2x fa-thumbs-up"></i>';

export const initializeSlick = element => {
  $(element).slick({
    slidesToShow: 5,
    slidesToScroll: 5,
    lazyLoad: 'ondemand',
    arrows: true,
    infinite: false,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 884,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: false
        }
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: false
        }
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false
        }
      }
    ]
  });
};