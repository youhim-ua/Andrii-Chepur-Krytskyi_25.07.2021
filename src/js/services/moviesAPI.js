const allMoviesURL = 'https://my-json-server.typicode.com/moviedb-tech/movies/list';
const oneMovieURL = (id) => `https://my-json-server.typicode.com/moviedb-tech/movies/list/${id}`;


const getAllMovies = async () => {
  try {
    const result = await fetch(allMoviesURL);
    const movies = await result.json();
    return movies;
  } catch (error) {
    console.log(error.massage)
  }
}

const getOneMovie = async (id) => {
  try {
    const result = await fetch(oneMovieURL(id));
    const movie = await result.json();
    return movie;
  } catch (error) {
    console.log(error.massage)
  }
}

export {
  getAllMovies,
  getOneMovie
}