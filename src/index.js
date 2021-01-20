// write your code here
// DOM Elements
const ramenMenu = document.getElementById("ramen-menu")
const ramenDetail = document.getElementById("ramen-detail")
const ratingForm = document.getElementById("ramen-rating")
const newRamenForm = document.getElementById("new-ramen")

//Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    getRamen()
        .then(ramenArray => {
            // console.log("Success", ramenArray)
            renderAllRamens(ramenArray)
            getRamen()
                .then(ramenArray => {
                    renderRamenDetails(ramenArray[0])
                })
        })
})

ratingForm.addEventListener("submit", handleRamenRatingSubmit)
newRamenForm.addEventListener("submit", handleNewRamenSubmit)

//Fetches
function getRamen(id) {
    if (!id) {
        return fetch("http://localhost:3000/ramens")
            .then(resp => resp.json())
    } else {
        return fetch(`http://localhost:3000/ramens/${id}`)
            .then(resp => resp.json())
    }
}

function updateRamen(id, updatedRamen) {
    return fetch(`http://localhost:3000/ramens/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRamen)
    })
        .then(resp => resp.json())
}

function createNewRamen(newRamenObj) {
    return fetch("http://localhost:3000/ramens", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRamenObj)
    })
        .then(resp => resp.json())
}

function deleteRamen(id) {
    return fetch(`http://localhost:3000/ramens/${id}`, {
        method: 'DELETE'
    })
        .then(resp => resp.json())
}

//Event Handlers
function handleRamenRatingSubmit(event) {
    event.preventDefault()
    const id = ratingForm.dataset.id
    const updatedRamen = {
        rating: event.target.rating.value,
        comment: event.target.comment.value
    }
    updateRamen(id, updatedRamen)
        .then(savedRamen => {
            renderRamenDetails(savedRamen)
        })

}

function handleNewRamenSubmit(event) {
    event.preventDefault()
        const newRamen = {
            name: event.target.name.value,
            restaurant: event.target.restaurant.value,
            image: event.target.image.value,
            rating: event.target.rating.value,
            comment: event.target.comments.value
        }
   
    createNewRamen(newRamen)
        .then(newRamenObj => {
            // console.log("Success", newRamen)
            getRamen(newRamenObj.id)
                .then(savedRamen => {
                    renderRamenDetails(savedRamen)
                    getRamen()
                        .then(ramenArray => {
                            renderAllRamens(ramenArray)
                        })
                })
        })
    event.target.reset()
}

//Renders
function renderAllRamens(ramenArray) {
    ramenMenu.innerHTML = null
    ramenArray.forEach(function (ramen) {
        const ramenImg = document.createElement("img")
        ramenImg.dataset.id = ramen.id
        ramenImg.src = ramen.image
        ramenImg.alt = ramen.name
        ramenImg.addEventListener("click", function () {
            getRamen(ramenImg.dataset.id)
                .then(ramenObj => {
                    renderRamenDetails(ramenObj)
                })    
        })
        ramenMenu.append(ramenImg)
    })
    
}

function renderRamenDetails(ramenObj) {
    ramenDetail.dataset.id = ramenObj.id
    const deleteBtn = ratingForm.querySelector("#delete-button")
    deleteBtn.addEventListener("click", function (event) {
        event.preventDefault()
        ramenMenu.innerHTML = null
        deleteRamen(ramenDetail.dataset.id)
        getRamen()
            .then(ramenArray => {
                // console.log(ramenArray)
                renderAllRamens(ramenArray)
                getRamen()
                    .then(ramenArray => {
                        renderRamenDetails(ramenArray[0])
                    })
            })
    })
    ratingForm.dataset.id = ramenObj.id
    const rating = document.getElementById("rating")
    const comment = document.getElementById("comment")
    rating.value = ramenObj.rating
    comment.value = ramenObj.comment
    const image = ramenDetail.querySelector("img")
    const name = ramenDetail.querySelector("h2")
    const restaurant = ramenDetail.querySelector("h3")
    image.src = ramenObj.image
    image.alt = ramenObj.name
    name.textContent = ramenObj.name
    restaurant.textContent = ramenObj.restaurant
}