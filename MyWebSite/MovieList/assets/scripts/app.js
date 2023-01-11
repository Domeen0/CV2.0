const addMovieModal = document.getElementById('add-modal');
const movieButton = document.querySelector('header button');




const toggleModal = () => {
    addMovieModal.classList.toggle('visible');
};

movieButton.addEventListener('click', toggleModal);