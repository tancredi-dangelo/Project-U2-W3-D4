// API KEY
const API_KEY = "M2vRLz3HUmhhx5S8VWbdA0xnEsRFMIh8ck64bS3HB86B7Me7IErKrQDM";

// DOM ELEMENTS
const loadImagesBtn = document.getElementById("loadImages");
const loadSecondaryImagesBtn = document.getElementById("loadSecondaryImages");
const catalogue = document.getElementById("imgCatalogue");
const input = document.getElementById("searchPhotos")

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

// PHOTO CLASS
class PhotoElement {
  constructor(id, src, alt, photographer) {
    this.id = id;
    this.src = src;
    this.alt = alt;
    this.photographer = photographer;
  }
}

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

// DISPLAY FUNCTION
const displayCards = function (data) {
  catalogue.innerHTML = "";

  data.photos.forEach(photo => {
    const newPhoto = new PhotoElement(
      photo.id,
      photo.src,
      photo.alt,
      photo.photographer
    );

    const card = document.createElement("div");
    card.classList.add("col-6", "col-md-4", "col-lg-3");

    card.innerHTML = `
              <div class="card mb-4 shadow-sm">
                <img
                  src="${newPhoto.src}"
                  class="bd-placeholder-img card-img-top"
                />
                <div class="card-body">
                  <h5 class="card-title">${newPhoto.alt}</h5>
                  <p class="card-text">
                    Photographer: ${newPhoto.photographer}
                  </p>
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div class="btn-group">
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                      >
                        Edit
                      </button>
                    </div>
                    <small class="text-muted">9 mins</small>
                  </div>
                </div>
              </div>
    `;

    catalogue.appendChild(card);
  });

  catalogue.style.display = "";
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
const searchPhotoSet = function(e) {

    e.preventDefault

    input.value

}


// EVENT LISTENERS
loadImagesBtn.addEventListener("click", toggleImages);
loadSecondaryImagesBtn.addEventListener("click", changePhotoSet);
