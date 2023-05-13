import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // 1. Gets the Adventure Id from the URL
  const urlParams = new URLSearchParams(search)
  const adventureId = urlParams.get("adventure")
  return adventureId
  
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // 1. Fetches the details of the adventure by making an API call

  try {

    const adventureDetailsApi = await fetch(`${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`)
    const adventureDetailsJson = await adventureDetailsApi.json()
    return adventureDetailsJson

  } catch (error) {
    return null
  }


}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // 1. Adds the details of the adventure to the HTML DOM

  const adventureNameHeadingElem = document.getElementById("adventure-name")
  const adventureSubTitleElem = document.getElementById("adventure-subtitle")
  const adventurePhotoGalleryElem = document.getElementById("photo-gallery")
  const adventureExperienceContentElem = document.getElementById("adventure-content")

  // we can also use .innerHTML instead of textContent to retain html 
  adventureNameHeadingElem.textContent = adventure.name
  adventureSubTitleElem.textContent = adventure.subtitle
  adventureExperienceContentElem.textContent = adventure.content

  adventure.images.forEach(
    (imgSrc) => {
      const adventureImageDivElem = document.createElement("div")

      adventureImageDivElem.innerHTML = `
        <img src="${imgSrc}" alt="${adventure.name}" class="activity-card-image"/>
      `
      adventurePhotoGalleryElem.append(adventureImageDivElem)
    }
  )

}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // 1. Adds the bootstrap carousel to show the Adventure images
  const adventurePhotoGalleryElem = document.getElementById("photo-gallery")
  
  const adventureCarouselDivEle = document.createElement("div")
  adventureCarouselDivEle.className = "carousel slide"
  adventureCarouselDivEle.setAttribute("id","adventureCarousel")
  adventureCarouselDivEle.setAttribute("data-bs-ride","carousel")

  const adventureCarouselIndicatorDivElem = document.createElement("div")
  adventureCarouselIndicatorDivElem.className = "carousel-indicators"

  const adventureCarouselInnerDivElem = document.createElement("div")
  adventureCarouselInnerDivElem.className = "carousel-inner"
  
  images.forEach(
    (imgSrc, index) => {
      const buttonElem = document.createElement("button")
      buttonElem.setAttribute("type","button")
      buttonElem.setAttribute("data-bs-target","#adventureCarousel")
      buttonElem.setAttribute("data-bs-slide-to",`${index}`)
      buttonElem.setAttribute("aria-label",`Slide ${index+1}`)

      if (index===0){
        buttonElem.className = "active"
        buttonElem.setAttribute("aria-current", "true")
      }
      
      const carousalItemDivElem = document.createElement("div")
      carousalItemDivElem.className = "carousel-item"

      const imgElem = document.createElement("img")
      imgElem.classList.add("activity-card-image","d-block","w-100")
      imgElem.setAttribute("src", imgSrc);
      imgElem.setAttribute("alt", "img");

      carousalItemDivElem.append(imgElem)

      if (index===0){
        carousalItemDivElem.classList.add("active")
      }

      adventureCarouselIndicatorDivElem.append(buttonElem)
      adventureCarouselInnerDivElem.append(carousalItemDivElem)
    }
  )


  const prevButtonElem = document.createElement("button")
  prevButtonElem.className = "carousel-control-prev"
  prevButtonElem.setAttribute("type", "button")
  prevButtonElem.setAttribute("data-bs-target","#adventureCarousel")
  prevButtonElem.setAttribute("data-bs-slide","prev")
  prevButtonElem.innerHTML = `
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  `

  const nextButtonElem = document.createElement("button")
  nextButtonElem.className = "carousel-control-next"
  nextButtonElem.setAttribute("type", "button")
  nextButtonElem.setAttribute("data-bs-target","#adventureCarousel")
  nextButtonElem.setAttribute("data-bs-slide","next")
  nextButtonElem.innerHTML = `
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  `
  
  adventureCarouselDivEle.append(adventureCarouselIndicatorDivElem)
  adventureCarouselDivEle.append(adventureCarouselInnerDivElem)
  adventureCarouselDivEle.append(prevButtonElem)
  adventureCarouselDivEle.append(nextButtonElem)

  adventurePhotoGalleryElem.innerHTML = ""
  adventurePhotoGalleryElem.append(adventureCarouselDivEle)

}



//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // 1. If the adventure is already reserved, displays the sold-out message.

  const reservationSoldOutElem = document.getElementById("reservation-panel-sold-out")
  const reservationAvailableElem = document.getElementById("reservation-panel-available")

  if (adventure.available){
    reservationSoldOutElem.style.display = "none"
    reservationAvailableElem.style.display = "block"

    const adventureCostPerHead = document.getElementById("reservation-person-cost")
    adventureCostPerHead.textContent = adventure.costPerHead

  }else{
    reservationSoldOutElem.style.display = "block"
    reservationAvailableElem.style.display = "none"
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // 1. Calculates the cost based on number of persons and update the reservation-cost field
  const totalCost = adventure.costPerHead * parseInt(persons)
  const reservationCostElem = document.getElementById("reservation-cost")
  reservationCostElem.textContent = totalCost

}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {
  // 1. Captures the query details and makes a POST API call using fetch() to make the reservation
  // 2. If the reservation is successful, shows an alert with "Success!" and refresh the page. If the reservation fails, just shows an alert with "Failed!".
    const adventureForm = document.getElementById("myForm");
    adventureForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const { date, name, person } = adventureForm.elements;
      const advFormData = {
        name: name.value,
        date: date.value,
        person: person.value,
        adventure: adventure.id,
      };
      try {
        const response = await fetch(`${config.backendEndpoint}/reservations/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(advFormData),
        });


        if (response.ok){
          alert("Success !!!")
        }else{
          alert("Failed !!!")
        }
      } catch (error) {
        console.log(error)
      }
    });

}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // If user has already reserved this adventure, shows the reserved-banner, else don't
  const reservedBannerDivElem = document.getElementById("reserved-banner")
  if (adventure.reserved){
    reservedBannerDivElem.style.display = "block"
  }else{
    reservedBannerDivElem.style.display = "none"
  }

}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
