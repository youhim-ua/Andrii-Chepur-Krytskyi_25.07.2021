import { getAllMovies } from './services/moviesAPI';
import navBarTemplate from '../templates/navBar.hbs';
import movieCardGridTemplate from '../templates/galleryGridStyle.hbs';
import movieCardListTemplate from '../templates/galleryListStyle.hbs';
import favoriteSectionTemplate from '../templates/favoriteSection.hbs';
import favoriteListTemplate from '../templates/favoriteList.hbs';
import modalTemplate from '../templates/modal.hbs';


class Gallery {
  constructor() {
    this.allMoviesList = null,
    this.favoriteList = [],
    this.filteredList = null,  
    this.listOfGenres = null,
    this.currentGenre = null,
    this.refs = {
      mainRef: document.querySelector('main'),
      galleryTitleRef: document.querySelector('.movie-title')
    }
  }

  getMovieList() {
    getAllMovies().then(movies => {
      this.allMoviesList = movies;

      return movies;
    })
      .then(films => this.generateMovieList(films))
      .catch(error => console.log(error.message));
  }

  generateGenresList(list) {
    const genresList = list.reduce((acc, item) => {
      acc.push(...item.genres);
      return acc
    }, [])
      .map(genre => genre.toLowerCase())
      .filter((genre, index, array) => array.indexOf(genre) === index);
    
    this.listOfGenres = genresList;

    return genresList;
  }

  sortedMoviesByCurrentGenre(genre) {
    const filteredListOfMovies = this.allMoviesList.map(movie => {
        const genres = movie.genres.map(genre => genre.toLowerCase())
        return { ...movie, genres }
      })
        .filter(item => item.genres.includes(genre))

    const filteredMovies = filteredListOfMovies.length !== 0 ? filteredListOfMovies : this.allMoviesList;
    return filteredMovies;
  }

  filterByGenre() {
    const genresSelectRef = document.querySelector('.gallery-nav__select');

    let itemListRef = document.querySelectorAll(
        '.movie-list__item',
      );

    let handler = this.modalToggler(itemListRef);

    genresSelectRef.addEventListener('change', (e) => {
      const moviesListGridRef = document.querySelector('.movie-list');
      const moviesListRef = document.querySelector('.movie-list-line');

      this.currentGenre = e.target.value;

      const movies = this.sortedMoviesByCurrentGenre(e.target.value);

      let itemLineListRef = document.querySelectorAll(
        '.movie-list-line__item',
      );
      itemListRef = document.querySelectorAll(
        '.movie-list__item',
      );

      let nodesList = itemLineListRef.length !== 0 ? itemLineListRef : itemListRef;

      this.removeEventsToMovieCards(nodesList, handler);

      if (e.target.value === 'all' && moviesListRef) {
        moviesListRef.remove();
        this.refs.mainRef.insertAdjacentHTML('beforeend', movieCardListTemplate({ movies }));
        this.addActiveStars();
      } else if (e.target.value === 'all') {
        moviesListGridRef.remove();
        this.refs.mainRef.insertAdjacentHTML('beforeend', movieCardGridTemplate({ movies }));
        this.addActiveStars();
      } else if (moviesListGridRef) {
        moviesListGridRef.remove();
        this.refs.mainRef.insertAdjacentHTML('beforeend', movieCardGridTemplate({ movies }));
        this.addActiveStars();
      } else {
        moviesListRef.remove();
        this.refs.mainRef.insertAdjacentHTML('beforeend', movieCardListTemplate({ movies }));
        this.addActiveStars();
      }

      itemLineListRef = document.querySelectorAll(
        '.movie-list-line__item',
      );

      itemListRef = document.querySelectorAll(
        '.movie-list__item',
      );

      nodesList = itemLineListRef.length !== 0 ? itemLineListRef : itemListRef;

      handler = this.modalToggler(nodesList);
      
      return handler;
    })
  }

  generateMovieList(moviesList) {
    const genresList = this.generateGenresList(moviesList);
    const movies = this.allMoviesList;
    
    this.refs.galleryTitleRef.insertAdjacentHTML('afterend', navBarTemplate({ genresList }));
    this.refs.mainRef.insertAdjacentHTML('beforeend', movieCardGridTemplate({ movies }));
    const handler = this.filterByGenre();
    this.viewsSwitcher(movies, handler);
    this.generateFavoriteSection();
    this.loadFavoriteFromLocalStorage();
    this.addActiveStars();
    this.addToFavorite();
    // this.modalToggler();
  }

  generateFavoriteSection() {
    this.refs.mainRef.insertAdjacentHTML('afterend', favoriteSectionTemplate());
    this.generateFavoriteList();
    
    const showButtonRef = document.querySelector('.toggle-list-button');
    const favoriteSectionRef = document.querySelector('.favorite-box');
    
    showButtonRef.addEventListener('click', () => {
      favoriteSectionRef.classList.toggle('hidden');
    });
  }

  generateFavoriteList(favorite) {
    const favoriteTitleRef = document.querySelector('.favorite-box__title');

    favoriteTitleRef.insertAdjacentHTML('afterend', favoriteListTemplate({favorite}));
  }

  addToFavorite() {
    const addToFavoriteInputRef = document.querySelector('.movie-list__favorite-checkbox');
    
    document.addEventListener('change', (e) => {
      const targetInputClass = e.target.classList.value;
      const addToFavoriteInputClass = addToFavoriteInputRef.classList.value;

      if (targetInputClass === addToFavoriteInputClass) {
        const favoriteListRef = document.querySelector('.favorite-box__list');

        const currentMovieIndex = e.target.dataset.index;
        const result = this.allMoviesList.find(
          movie => +currentMovieIndex === movie.id
        );

        const isInTheFavoriteList = this.favoriteList.find(film => film.id === result.id);

        if (isInTheFavoriteList) {
          this.favoriteList = this.favoriteList.filter(film => film.id !== isInTheFavoriteList.id);

          this.addFavoriteToLocalStorage();

          favoriteListRef.remove();
          this.generateFavoriteList(this.favoriteList);
        } else {
          this.favoriteList.push(result);

          this.addFavoriteToLocalStorage();

          favoriteListRef.remove();
          this.generateFavoriteList(this.favoriteList);
        }
      }
      this.deleteActiveStars()
    })
  }

  addActiveStars() {
    const addToFavoriteInputRefList = document.querySelectorAll('.movie-list__favorite-checkbox');

    const idOfFavoriteMovies = this.favoriteList.map(movie => movie.id);
    
    Array.from(addToFavoriteInputRefList)
      .filter(node => idOfFavoriteMovies.includes(+node.dataset.index))
      .forEach(input => input.checked = true);
  }

  deleteActiveStars() {
    const addToFavoriteInputRefList = document.querySelectorAll('.movie-list__favorite-checkbox');

    const idOfFavoriteMovies = this.favoriteList.map(movie => movie.id);
    
    Array.from(addToFavoriteInputRefList)
      .filter(node => !idOfFavoriteMovies.includes(+node.dataset.index))
      .forEach(input => input.checked = false);
  }

  addFavoriteToLocalStorage() {
    try {
      const favoriteListToString = JSON.stringify(this.favoriteList);
      localStorage.setItem('favoriteList', favoriteListToString);
    } catch (error) {
      console.log(error.message);
    }
  }

  loadFavoriteFromLocalStorage() {
    try {
      const data = localStorage.getItem('favoriteList');

      if (!data) return;

      this.favoriteList = JSON.parse(data);
      
      this.generateFavoriteList(this.favoriteList);
    } catch (error) {
      console.log(error.message);
    }
  }

  viewsSwitcher(movies, handler) {
    const gridButtonRef = document.querySelector('.gallery-nav__check-grid');
    const listButtonRef = document.querySelector('.gallery-nav__check-list');
    // const itemListRef = document.querySelectorAll(
    //     '.movie-list__item',
    //   );
    

    gridButtonRef.addEventListener('click', () => {
      if (this.currentGenre) {
        movies = this.sortedMoviesByCurrentGenre(this.currentGenre);
      }

      const moviesListGridRef = document.querySelector('.movie-list');
      const moviesListRef = document.querySelector('.movie-list-line');
      
      if (moviesListGridRef) return;
      const itemLineListRef = document.querySelectorAll(
        '.movie-list-line__item',
      );

      this.removeEventsToMovieCards(itemLineListRef, handler);

      moviesListRef.remove();
      this.refs.mainRef.insertAdjacentHTML('beforeend', movieCardGridTemplate({ movies }));
      const itemListRef = document.querySelectorAll(
        '.movie-list__item',
      );
      this.modalToggler(itemListRef);
      this.addActiveStars();
    })

    listButtonRef.addEventListener('click', () => {
      if (this.currentGenre) {
        movies = this.sortedMoviesByCurrentGenre(this.currentGenre);
      }

      const moviesListGridRef = document.querySelector('.movie-list');
      const moviesListRef = document.querySelector('.movie-list-line');
      
      if (moviesListRef) return;
      
      const itemListRef = document.querySelectorAll(
        '.movie-list__item',
      );
      this.removeEventsToMovieCards(itemListRef, handler);

      moviesListGridRef.remove();
      this.refs.mainRef.insertAdjacentHTML('beforeend', movieCardListTemplate({ movies }));
      const itemLineListRef = document.querySelectorAll(
        '.movie-list-line__item',
      );
      this.modalToggler(itemLineListRef);
      this.addActiveStars();
    })
  }

  modalToggler(availableItems) {  
    const openModal = (e) => {
      const notListItem =
        e.target.nodeName !== 'svg'
        && e.target.nodeName !== 'INPUT'
        && e.target.nodeName !== 'path';
      
      if (notListItem) {
        const currentMovieID = e.currentTarget.id;
        const movie = this.allMoviesList.find(
          item => item.id === +currentMovieID,
        );

        this.refs.mainRef.insertAdjacentHTML('afterend', modalTemplate(movie));

        this.addActiveStars();

        const backdropRef = document.querySelector('.backdrop');
        const buttonCloseRef = document.querySelector('.modal__button-delete');

        const deleteHandler = () => {
          backdropRef.remove();
          this.addActiveStars();
          buttonCloseRef.removeEventListener('click', deleteHandler);
        };
      
        buttonCloseRef.addEventListener('click', deleteHandler);
      }  
    };

    this.addEventsToMovieCards(availableItems, openModal);

    return openModal;
  }

  addEventsToMovieCards(nodesArr, handler) {
    Array.from(nodesArr).forEach(item => {
      item.addEventListener('click', handler);
      console.log('+')
    });
  }

  removeEventsToMovieCards(nodesArr, handler) {
    Array.from(nodesArr).forEach(item => {
      item.removeEventListener('click', handler);
      console.log('-')
    });
  }

  createGallery() { 
    this.getMovieList(); 
  }
}

const moviesGallery = new Gallery;

moviesGallery.createGallery();
