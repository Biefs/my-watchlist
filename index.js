const formSearch = document.querySelector('.form-search')
const main = document.querySelector('.main')
const moviesContainer = document.querySelector('.main__wrapper')
const movies = []
const myWatchList = JSON.parse(localStorage.getItem('myWatchList')) || []


document.addEventListener('click', (e)=> {
    if(e.target.dataset.plotId){
        toggleReadMore(e.target.dataset.plotId)
    } else if (e.target.dataset.watchId){
        handleAddToWatchListClick(e.target.dataset.watchId)
        console.log(myWatchList)
    }
})


function handleAddToWatchListClick(id){
    const targetObject = movies.filter(movie => movie.imdbID == id)[0]
    if(!myWatchList.find(movie => movie.imdbID == targetObject.imdbID)){
        myWatchList.push(targetObject)
        document.querySelector(`[data-watch-id="${id}"]`).innerHTML = '<i class="fa-solid fa-check"></i> Added in Watchlist'
        document.querySelector(`[data-watch-id="${id}"]`).disabled = true
        localStorage.setItem('myWatchList', JSON.stringify(myWatchList))
    } 
}

function toggleReadMore(id){
    const film = document.querySelector(`[data-film-id="${id}"]`)
    const moreBtn = film.querySelector('.read-more')
    film.querySelector('.dots').classList.toggle('hide')
    film.querySelector('.more').classList.toggle('hide')
    moreBtn.textContent == 'Read more'?
    moreBtn.textContent = 'Read less':
    moreBtn.textContent = 'Read more'
}

formSearch.addEventListener('submit', async (e)=> {
    e.preventDefault()

    const input = document.querySelector('.form-search__input')
    const res = await fetch(`https://www.omdbapi.com/?s=${input.value}&apikey=88a4ba4e&plot=full`)
    const data = await res.json()

    if(data.Response == 'False'){
        main.style.background = 'none'
        moviesContainer.innerHTML = `<div class="no-info">Unable to find what you’re looking for. Please try another search.</div>`
    } else {
        const moviesID = await data.Search.map(movie => movie.imdbID)
        input.value = ''
        renderMovies(moviesID)
    }
})

function renderMovies(ids){
    //Change background when render items
    main.style.background = 'none'
    //Clear HTML
    moviesContainer.innerHTML = ``

    ids.forEach(async id => {
        const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=88a4ba4e&plot=full`)
        const data = await res.json()
        movies.push(data)
        
        moviesContainer.innerHTML +=  `
        <div class="film" data-film-id=${data.imdbID}>
            <img class="film__img" src="${data.Poster}" alt="film">
            <div class="film__info-container">
                <div class="film__title-rating">
                    <h3>${data.Title}</h3>
                    <p class="rating"><i class="fa-solid fa-star" style="color: #fec854;"></i> ${data.imdbRating}</p>
                </div>
                <div class="film__info">
                    <span class="film__length">${data.Runtime}</span>
                    <span class="film__tags">${data.Genre}</span>
                    ${setWatchlistBtn(data.imdbID)}
                </div>
                ${setReadMoreBtn(data.Plot, data.imdbID)}
            </div>
        </div>
        <hr>
        `
    })
}

function setWatchlistBtn(id){
    if(myWatchList.some(movie => movie.imdbID == id)){
        return `<button disabled data-watch-id="${id}" class="btn watch-add"><i class="fa-solid fa-check"></i> Added in Watchlist</button>`
    } else {
        return `<button data-watch-id="${id}" class="btn watch-add"><i class="fa-sharp fa-solid fa-circle-plus"></i> Watchlist</button>`
    }
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


