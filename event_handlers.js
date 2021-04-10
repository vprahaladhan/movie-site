let keyword = '';

document.getElementById('modal-close').onclick = () => {
  if (document.getElementById('youtube-trailer')) {
    document.getElementById('movie-poster-container').innerHTML = `
      <p><img id="movie-poster" src="#" alt="Movie Poster"></p>`;
  };
};

document.getElementById('search-button').addEventListener('click', () => {
  clearMovieSearch();
  keyword = document.getElementById('search-keyword').value;

  if (keyword.length >= 1) {
    fetchMovies(`${searchMoviesURL}&query=${keyword}&page=${currentPage}`, 'search')
      .then(() => document.getElementById('search-keyword').value = '');
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

document.getElementById('liked-filter').onclick = ({ target }) => {
  if (target.innerText === 'Show Only Liked') {
    $('#movie-search').slick('slickFilter','[liked="true"]');
    target.innerText = 'Show All';
  }
  else {
    $('#movie-search').slick('slickUnfilter');
    target.innerText = 'Show Only Liked';
  }
}

// document.getElementById('liked-filter').onclick = ({ target }) => {
//   if (target.innerText === 'Show Only Liked') {
//     $('.slick').slick('slickFilter','[liked="true"]');
//     target.innerText = 'Show All';
//   }
//   else {
//     $('.slick').slick('slickUnfilter');
//     target.innerText = 'Show Only Liked';
//   };
// }