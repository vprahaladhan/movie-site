let movieId;
let tmdbSession = {};
let currentPage = 1;
let totalPages, totalResults;

const getTMDBSession = () => {
  return fetch(`${theMovieDBURL}/authentication/guest_session/new?api_key=${api_key}`)
    .then(response => response.json())
    .then(result => tmdbSession = result.success && {
      session_id: result.guest_session_id,
      expires_at: new Date(result.expires_at)
    }
    );
};

const getMovieVoteCount = movieId => {
  return fetch(`${movieTrailerBaseURL}/${movieId}?api_key=${api_key}`)
    .then(response => response.json())
    .then(movie => {
      console.log('Movie vote count >> ', movie.vote_count);
      return movie.vote_count
    });
}

const getMovieTrailerURL = movieId => {
  return `${movieTrailerBaseURL}/${movieId}/videos?api_key=${api_key}&${language}`;
}

const clearMovieSearch = () => {
  const newMovieSearchDiv = document.createElement('div');
  newMovieSearchDiv.id = 'movie-search';
  newMovieSearchDiv.className = 'slick';
  newMovieSearchDiv.style = 'width: 90%; margin: 0 auto;'
  document.getElementById('movie-search').replaceWith(newMovieSearchDiv);
  currentPage = 1;
};

const trailerClickEventListener = () => {
  fetch(getMovieTrailerURL(movieId))
    .then(response => response.json())
    .then(({ results }) => {
      if (results.length !== 0 && results[0].site.toLowerCase() === 'youtube') {
        document.getElementById('movie-poster-container').innerHTML = `
          <iframe 
            id="youtube-trailer"
            width="400px" 
            height="400px"
            src="${youtubeTrailerURL}/${results[0].key}?autoplay=1">
          </iframe>
        `;
        document.getElementById('trailer').disabled = true;
      }
      else {
        alert('Sorry, No trailers available for the movie!')
      }
    });
};

const displayMovieDetailsModal = (event, movie) => {
  document.getElementById('movie-title').innerHTML = movie.title;
  document.getElementById('movie-poster').src = movie.poster_path ? moviePosterURL + movie.poster_path : 'assets/no-image.jpg';
  document.getElementById('movie-poster').alt = movie.title;
  document.getElementById('movie-overview').innerHTML = movie.overview;
  document.getElementById('release-date').innerHTML = `Released: ${movie.release_date}`;
  document.getElementById('average-vote').innerHTML = `Avg. vote: ${movie.vote_average}`;
  document.getElementById('like-icon').innerHTML = document.getElementById(`like-${movie.id}`).innerHTML; 

  document.getElementById('like-icon').onclick = event => {
    const likeIconState = document.getElementById(`like-icon`);
    likeIconState.innerHTML = likeIconState.innerHTML.includes('down') ? likedIcon : unlikedIcon;
    document.getElementById(`like-${movie.id}`).innerHTML = likeIconState.innerHTML;
  };

  movieId = movie.id;
  document.getElementById('trailer').addEventListener('click', trailerClickEventListener);
};

const createMovieSlide = movie => {
  const movieContainer = document.createElement('div');
  movieContainer.setAttribute('liked', 'false');
 
  const movieInnerContainer = document.createElement('div');
  movieInnerContainer.className = 'container';

  const trailer = document.createElement('button');
  trailer.setAttribute('data-toggle', 'modal');
  trailer.style = 'border: 0; background: none; border-radius: 0px; cursor: pointer;'

  const moviePoster = document.createElement('img');
  moviePoster.src = movie.poster_path ? movieImageURL + movie.poster_path : 'assets/no-image.jpg';
  moviePoster.alt = movie.title;
  
  const likeIcon = document.createElement('div');
  likeIcon.id = `like-${movie.id}`;
  likeIcon.className = "icon";
  likeIcon.innerHTML = likedIcon;

  trailer.appendChild(moviePoster);
  trailer.appendChild(likeIcon);
  movieInnerContainer.appendChild(trailer);
  movieContainer.appendChild(movieInnerContainer);

  trailer.addEventListener('click', event => {
    trailer.setAttribute('data-target', '#movie-details-modal');
    if (document.getElementById('trailer').disabled) {
      document.getElementById('trailer').disabled = false;
    };
    displayMovieDetailsModal(event, movie);
  });

  likeIcon.addEventListener('click', event => {
    event.stopPropagation();
    likeIcon.innerHTML = likeIcon.innerHTML.includes('down') ? likedIcon : unlikedIcon;
    movieContainer.setAttribute('liked', movieContainer.getAttribute('liked').includes('true') ? 'false' : 'true');
  });

  return movieContainer;
}

const fetchMovies = (url, category) => fetch(url)
  .then(response => response.json())
  .then(response => {
    if (category === 'search') {
      currentPage = response.page;
      totalPages = response.total_pages;
      totalResults = response.total_results;
    };

    response.results.forEach(movie => {
      let searchByCategory = '';
      switch (category) {
        case 'search': searchByCategory = 'movie-search'; break;
        case 'rated': searchByCategory = 'top-rated'; break;
        case 'popular': searchByCategory = 'most-popular'; break;
      }
      document.getElementById(searchByCategory).appendChild(createMovieSlide(movie));
    });
  });

const postMovieRating = rating => {
  fetch(`${movieTrailerBaseURL}/${movieId}/rating?api_key=${api_key}&guest_session_id=${tmdbSession.session_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      value: rating
    })
  }).then(response => response.json())
    .then(result => {
      if (result.success) {
        document.getElementById('movie-rating').value = '';
        document.getElementById('rating-success-msg').className = 'show';
        setTimeout(() => {
          document.getElementById('rating-success-msg').className = 'hide';
        }, 2000);
      };
    });
};

getTMDBSession();

fetchMovies(popularMoviesURL, 'popular')
  .then(() => {
    fetchMovies(topRatedMoviesURL, 'rated')
      .then(() => {
        initializeSlick('.slick')
      })
  });