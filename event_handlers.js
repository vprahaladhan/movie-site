document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('trailer').removeEventListener('click', trailerClickEventListener);
  if (document.getElementById('youtube-trailer')) {
    document.getElementById('movie-poster-container').innerHTML = `
      <p><img id="movie-poster" src="#" alt="Movie Poster"></p>`;
  };
});

document.getElementById('search-button').addEventListener('click', () => {
  clearMovieSearch();

  if (document.getElementById('search-keyword').value.length >= 5) {
    fetchMovies(`${searchMoviesURL}&query=${document.getElementById('search-keyword').value}`, 'search')
      .then(() => {
        document.getElementById('search-keyword').value = '';

        $('#movie-search').slick({
          slidesToShow: 5,
          slidesToScroll: 5,
          arrows: true,
          lazyLoad: 'ondemand',
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 884,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
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
      });
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