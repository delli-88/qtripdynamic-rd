import config from "../conf/index.js";

async function init() {
  //Fetches list of all cities along with their images and description
  let cities = await fetchCities();

  //Updates the DOM with the cities
  if (cities) {
    cities.forEach((key) => {
      addCityToDOM(key.id, key.city, key.description, key.image);
    });
  }
}

//Implementation of fetch call
async function fetchCities() {
  // 1. Fetches cities using the Backend API and return the data
  try {
    const fetchCitiesFromApi = await fetch(`${config.backendEndpoint}/cities`)
    const fetchCitiesArray = await fetchCitiesFromApi.json()
    return fetchCitiesArray

  } catch (error) {
    return null
  }

}

//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  // 1. Populates the City details and inserts those details into the DOM
  const contentDataEle = document.getElementById("data")
  const cityCardDivEle = document.createElement("div")
  cityCardDivEle.setAttribute("class", "col-6 col-lg-3 mb-4");
  cityCardDivEle.innerHTML = `
      <a href="pages/adventures/?city=${id}" id="${id}">
      <div class="tile rounded">
        <img src="${image}" alt="img_${city}" class="img-fluid rounded"/>
        <div class="tile-text text-center">
          <h5>${city}</h5>
          <p>${description}</p>
        </div>
      </div>
    </a>
  `
  contentDataEle.append(cityCardDivEle)
}

export { init, fetchCities, addCityToDOM };
