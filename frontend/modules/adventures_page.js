
import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // 1. Extracts the city id from the URL's Query Param and returns it
  const urlParams = new URLSearchParams(search);
  const currCity = urlParams.get("city");
  return currCity

  // Another Method
  // let searchQueryStrArray = search.split("=")
  // return searchQueryStrArray[searchQueryStrArray.length-1]
}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // 1. Fetches adventures using the Backend API and return the data

  try {

    const fetchAdventuresFromApi = await fetch(`${config.backendEndpoint}/adventures/?city=${city}`)
    const fetchAdventuresArray = await fetchAdventuresFromApi.json()

    return fetchAdventuresArray

  } catch (error) {

    return null
  }

}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // 1. Populates the Adventure Cards and insert those details into the DOM
  const adventureCardDomEle = document.getElementById("data")
  adventures.forEach(adventureObj => {
    const adventureCardDivEle = document.createElement("div")
    // adventureDetailURL = window.location.href + "/detail/?adventure=${adventureObj.id}"
    adventureCardDivEle.setAttribute("class","col-6 col-lg-3 position-relative mb-3")
    adventureCardDivEle.innerHTML = `
        <p class="category-banner">${adventureObj.category}</p>
        <a href="detail/?adventure=${adventureObj.id}" id="${adventureObj.id}">
          <div class="card activity-card">
            <img src="${adventureObj.image}" alt="${adventureObj.name}" class="activity-card-image"/>
            <div class="d-flex justify-content-between flex-wrap w-100 px-3 m-2">
                <h5 class="text-capitalize">${adventureObj.name}</h5>
                <p class="card-text">&#8377;${adventureObj.costPerHead}</p>
            </div>
            <div class="d-flex justify-content-between flex-wrap w-100 px-3 m-2">
                <h5 class="text-capitalize">Duration</h5>
                <p class="card-text">${adventureObj.duration} Hours</p>
            </div>
          </div>
        </a>
    `
    adventureCardDomEle.append(adventureCardDivEle)
  });
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // 1. Filters adventures based on Duration and return filtered list
  const filterByDurationFunction = (adventure) => adventure.duration>=low && adventure.duration<=high
  const durationFilteredList = list.filter(filterByDurationFunction)
  return durationFilteredList

}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // 1. Filters adventures based on their Category and return filtered list
  const filterByCategoryFunction = (adventure) => categoryList.includes(adventure.category)
  const categoryFilteredList = list.filter(filterByCategoryFunction)
  return categoryFilteredList
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // 1. Handles the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invokes the filterByDuration() and/or filterByCategory() methods

  const durationFilter = filters["duration"];
  const categoryFilter = filters["category"];

  // if (durationFilter.length === 0 && categoryFilter.length === 0) {
  //   return list;
  // }

  let filteredList = list;

  if (durationFilter.length !== 0) {
    const [low, high] = durationFilter.split('-').map(Number);
    filteredList = filterByDuration(filteredList, low, high);
  }

  if (categoryFilter.length !== 0) {
    filteredList = filterByCategory(filteredList, categoryFilter);
  }

  return filteredList;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // 1. Stores the filters as a String to localStorage
  localStorage.setItem("filters",JSON.stringify(filters))

  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // 1. Gets the filters from localStorage and returns String read as an object

  const filters = JSON.parse(localStorage.getItem("filters"))

  return filters;
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Updates duration filter with correct value
// 2. Updates the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // 1. Uses the filters given as input, updates the Duration Filter value and Generates Category Pills
  const categoryFilterList = filters["category"];
  if (categoryFilterList.length>0){
    const categoryDivElement = document.getElementById("category-list")
    categoryFilterList.forEach(
      (filter) =>{
        //can use div insted of p
        const filterPara = document.createElement("p")
        filterPara.textContent = filter
        filterPara.className = "category-filter"
        categoryDivElement.append(filterPara)
      }
    )
  }

  // sets the duration from local storage
  setDurationFilterFromLocalStorage()

  // runs this function at DOMContentLoad
  addNewAdventure()
}

function setDurationFilterFromLocalStorage() {
  const durationFromLocalStorage = JSON.parse(localStorage.getItem("filters"));
  if (durationFromLocalStorage !== null) {
    document.getElementById("duration-select").value = durationFromLocalStorage.duration;
  }
}


// Creates a new Adventure, when a user clicks on 'add new adventure' button
const addNewAdventure = () =>{
  const newAdventureButton = document.getElementById("new-adventure")
  const urlParams = new URLSearchParams(window.location.search);
  const currCity = urlParams.get("city");
  newAdventureButton.addEventListener("click",async()=>{
    try {

      const response = await fetch(`${config.backendEndpoint}/adventures/new`,{
        method : "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
          },
        body : JSON.stringify({
          "city" : currCity,
          })
      })
  
      if (response.ok){
        alert("New Adventure Added Successfully")
      }else{
        alert("Failed to Add New Adventure")
      }
      location.reload()
    } catch (error) {
      console.log(error)
    }
  })
}


export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
  addNewAdventure,
};
