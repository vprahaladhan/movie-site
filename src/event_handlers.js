import { currentPage, clearMovieSearch, createMovieSlide, tmdbSession, getTMDBSession, postMovieRating } from './index';

document.getElementById('modal-close').onclick = () => {
  if (document.getElementById('youtube-trailer')) {
    document.getElementById('movie-poster-container').innerHTML = `
      <p><img id="movie-poster" src="#" alt="Movie Poster"></p>`;
  };
};

document.getElementById('search-button').addEventListener('click', () => {
  clearMovieSearch();

  if (document.getElementById('search-keyword').value.length >= 1) {
    const keyword = document.getElementById('search-keyword').value;
    fetchMovies(`${searchMoviesURL}&query=${keyword}&page=${currentPage}`, 'search')
      .then(() => {
        $('#movie-search').on('beforeChange', (event, slick, currentSlide, nextSlide) => {
          const slidesToShow = $('#movie-search').slick('slickGetOption', 'slidesToShow') * 2;
          if (currentSlide + slidesToShow >= (10 * (currentPage + 1))) {
            fetch(`${searchMoviesURL}&query=${keyword}&page=${++currentPage}`)
              .then(response => response.json())
              .then(({ results }) => results.forEach(movie => {
                $('#movie-search').slick('slickAdd', createMovieSlide(movie));
              }));
          }
        });
        initializeSlick();
      });
    document.getElementById('search-keyword').value = '';
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

const initializeSlick = () => {
  $('#movie-search').slick({
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
    lazyLoad: 'ondemand',
    infinite: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
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