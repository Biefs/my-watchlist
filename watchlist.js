const myWatchList = JSON.parse(localStorage.getItem('myWatchList')) || []
const moviesContainer = document.querySelector('.main__wrapper')


document.addEventListener('click', (e)=>{
    if(e.target.dataset.removeId){
        removeMovie(e.target.dataset.removeId)
    }
})

function removeMovie(id){
    myWatchList.splice(myWatchList.findIndex(movie => movie.imdbID === id), 1)
    renderMyWatchList()  
}

function renderMyWatchList(){
    if(!myWatchList.length){
        moviesContainer.innerHTML = `
        <div class="watchlist-placeholder">
            <p>Your watchlist is looking a little empty...</p>
            <a class="btn" href="/index.html"><i class="fa-sharp fa-solid fa-circle-plus"></i> Let’s add some movies!</a>
        </div> `
    } else {
        let moviesHtml = ``
        myWatchList.forEach(movie => {
            moviesHtml +=`
            <div class="film" data-film-id=${movie.imdbID}>
                <img class="film__img" src="${movie.Poster}" alt="film">
                <div class="film__info-container">
                    <div class="film__title-rating">
                        <h3>${movie.Title}</h3>
                        <p class="rating"><i class="fa-solid fa-star" style="color: #fec854;"></i> ${movie.imdbRating}</p>
                    </div>
                    <div class="film__info">
                        <span class="film__length">${movie.Runtime}</span>
                        <span class="film__tags">${movie.Genre}</span>
                        <button data-remove-id="${movie.imdbID}" class="btn watch-add"><i class="fa-solid fa-circle-minus"></i> Remove</button>
                    </div>
                    ${setReadMoreBtn(movie.Plot, movie.imdbID)}
                </div>
            </div>
            <hr>
            `
        });
        moviesContainer.innerHTML = moviesHtml
    }
    localStorage.setItem('myWatchList', JSON.stringify(myWatchList))
}



function setReadMoreBtn(plot, id){
    const numOfChar = 375
    if(plot.length < numOfChar){
        return `<p class="film__plot">${plot}</p>`
    } else if(plot.length > numOfChar) {
        const displayText = plot.slice(0, numOfChar)
        const moreText = plot.slice(numOfChar)
        return `<p class="film__plot">${displayText}<span class="dots">...</span><span class="more hide">${moreText}</span> <span data-plot-id="${id}" class="read-more">Read more</span></p>`
    }
}

renderMyWatchList()