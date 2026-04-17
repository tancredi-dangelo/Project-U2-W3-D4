// API KEY
const API_KEY = "M2vRLz3HUmhhx5S8VWbdA0xnEsRFMIh8ck64bS3HB86B7Me7IErKrQDM";

// DOM ELEMENTS
const loadImagesBtn = document.getElementById("loadImages");
const loadSecondaryImagesBtn = document.getElementById("loadSecondaryImages");

const form = document.querySelector('form[role="search"]');
const input = document.querySelector('input[type="search"]');
const browseSection = document.getElementById("browseSection")

const catalogue = document.getElementById("imgCatalogue");


// IMAGE SETS
const urlSets = [
  "https://api.pexels.com/v1/search?query=hamsters",
  "https://api.pexels.com/v1/search?query=kittens",
  "https://api.pexels.com/v1/search?query=tigers",
  "https://api.pexels.com/v1/search?query=dogs",
  "https://api.pexels.com/v1/search?query=bears",
  "https://api.pexels.com/v1/search?query=birds"
];


let currentSet = 0;

// INIZIALIZE PHOTO CLASS
class PhotoElement {
  constructor(id, src, alt, photographer) {
    this.id = id;
    this.src = src;
    this.alt = alt;
    this.photographer = photographer;
  }
}

// fetchImages -> loadImages -> displayCards

// FETCH FUNCTION
const fetchImages = function (url) {

  return fetch(url, {
    headers: {
      authorization: API_KEY
    }
  })

    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP error: " + response.status);
      }

      return response.json();
    })

    .catch(error => {
      console.error(error);
      alert("Unknown error. Couldn't fetch data.");
    });
};



// DISPLAY CARDS FUNCTION
const displayCards = function (data) {

  catalogue.innerHTML = ""  

  data.photos.forEach(photo => {
    const newPhoto = new PhotoElement(
      photo.id,
      photo.src.medium,
      photo.alt,
      photo.photographer
    );

    const card = document.createElement("div");
    card.classList.add("col-6", "col-sm-4", "col-lg-3", "col-xl-2", "cardDiv");

    card.innerHTML = `
      <div class="card h-100">
        <img src="${newPhoto.src}" class="card-img-top" alt="${newPhoto.alt}">
        <div class="card-body">
          <h6 class="card-title">
          <a class="text-decoration-none" href="">${newPhoto.alt || "No title"}</a>
          </h6>
          <p class="card-text fw-bold">Photographer: ${newPhoto.photographer}</p>
          <small class="card-text">Id: ${newPhoto.id}</small>
        </div>
        <div class="d-flex align-items-center justify-content-center">
            <button class="btn btn-primary px-3 mx-2 my-3 card-view-buttons">View</button>
            <button class="btn btn-danger px-3 mx-2 my-3 card-delete-buttons">Delete</button>
        </div>
      </div>
    `;

    catalogue.appendChild(card);
  });

  catalogue.style.display = "";
};

const displayCardDetail = function(e) {

    const cardDiv = e.target.closest(".cardDiv");
    const photoId = cardDiv.querySelector("small").textContent.replace("Id: ", "");

    // get (and parse) the whole set of data
    const stored = localStorage.getItem("dataSet");      
    if (!stored) return;
    const data = JSON.parse(stored);  
    
    // find photo with id matching id
    const photo = data.photos.find(p => String(p.id) === photoId); 
    if (!photo) return;


    // display photo details
    const newPhoto = new PhotoElement(
      photo.id,
      photo.src.medium,
      photo.alt,
      photo.photographer
    )

    const card = document.createElement("div");
    card.classList.add("col-12", "cardDetailDiv", "d-flex", "align-items-center", "justify-content-center");

    card.innerHTML = `
      <div class="card h-200">
        <img src="${newPhoto.src}" class="card-img-top" alt="${newPhoto.alt}">
        <div class="card-body">
          <h6 class="card-title">
          <a class="text-decoration-none" href="">${newPhoto.alt || "No title"}</a>
          </h6>
          <p class="card-text fw-bold">Photographer: ${newPhoto.photographer}</p>
          <a class="card-text fw-bold text-decoration-none" href="${photo.photographer_url} ">View Photographer webpage</a>

          <small class="card-text">Id: ${newPhoto.id}</small>
        </div>
        <div class="d-flex align-items-center justify-content-center">
            <button class="btn btn-primary px-3 mx-2 my-3 card-view-buttons">View</button>
            <button class="btn btn-danger px-3 mx-2 my-3 card-delete-buttons">Delete</button>
        </div>
      </div>
    `;

    catalogue.appendChild(card);

};


// LOAD CURRENT SET
const loadImages = function () {

const url = urlSets[currentSet];

fetchImages(url).then(data => {

if (!data)  {
    alert("data not found.");
    return
}

displayCards(data);
localStorage.setItem("dataSet", JSON.stringify(data));

});
};


// TOGGLE SHOW / HIDE
const toggleImages = function (e) {

    e.preventDefault()

    if (catalogue.style.display === "none" || catalogue.innerHTML === "") {
        loadImages();

        loadImagesBtn.classList.remove("btn-primary");
        loadImagesBtn.classList.add("btn-warning");
        loadImagesBtn.innerText = "Hide";

    } else {

        catalogue.style.display = "none";

        loadImagesBtn.classList.remove("btn-warning");
        loadImagesBtn.classList.add("btn-primary");
        loadImagesBtn.innerText = "Load Photos";
    }
};

// CHANGE SET (NEXT)
const changePhotoSet = function (e) {

    e.preventDefault()

    currentSet = (currentSet + 1) % urlSets.length;
    catalogue.style.display = "";

    loadImagesBtn.classList.remove("btn-primary");
    loadImagesBtn.classList.add("btn-warning");
    loadImagesBtn.innerText = "Hide";
        
    loadImages()
};


// SEARCH PHOTOS FUNCTION
const searchPhotoSet = function (e) {

    e.preventDefault();

    const universalUrl = "https://api.pexels.com/v1/search?query=";
    const query = input.value.trim();

    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    const url = universalUrl + encodeURIComponent(query);

    fetchImages(url).then(data => {

        if (!data || !data.photos) {
            alert("Data not found.");
            return;
        }

        displayCards(data);
        localStorage.setItem("dataSet", JSON.stringify(data));

        })
        
};


// EVENT LISTENERS

loadImagesBtn.addEventListener("click", toggleImages);

loadSecondaryImagesBtn.addEventListener("click", changePhotoSet);

form.addEventListener("submit", searchPhotoSet);

catalogue.addEventListener("click", function(e) {
    if (e.target.classList.contains("card-view-buttons")) displayCardDetail(e);
    if (e.target.classList.contains("card-delete-buttons")) deleteCard(e);
});