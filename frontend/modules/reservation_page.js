import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
  // 1. Fetches Reservations by invoking the REST API and returns them

  try {

    const reservationsApi = await fetch(`${config.backendEndpoint}/reservations/`)
    const reservationsJson = await reservationsApi.json()
    return reservationsJson

  } catch (error) {
    return null
  }

}

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {
  // 1. Adds the Reservations to the HTML DOM so that they show up in the table


  const noReservationBannerDivElem = document.getElementById("no-reservation-banner")
  const reservationTableParentDivElem = document.getElementById("reservation-table-parent")

  //Conditionally renders the no-reservation-banner and reservation-table-parent
  if (reservations.length===0){
    noReservationBannerDivElem.style.display = "block"
    reservationTableParentDivElem.style.display = "none"
  }else{
    noReservationBannerDivElem.style.display = "none"
    reservationTableParentDivElem.style.display = "block"

    const reservationTableElem = document.getElementById("reservation-table")

    reservations.forEach(reservation => {
      const reservedDate = new Date(reservation.date).toLocaleDateString("en-IN")
      const bookingDateFromReservation = new Date(reservation.time)
      const dateFromBooking = bookingDateFromReservation.toLocaleDateString("en-IN",{
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      const timeFromBooking = bookingDateFromReservation.toLocaleTimeString("en-IN");
      const bookingDate = dateFromBooking + ", " + timeFromBooking

  
      const trElem = document.createElement("tr")
      trElem.innerHTML = `
          <td>${reservation.id}</td>
          <td>${reservation.name}</td>
          <td>${reservation.adventureName}</td>
          <td>${reservation.person}</td>
          <td>${reservedDate}</td>
          <td>${reservation.price}</td>
          <td>${bookingDate}</td>
      `  
      const actionElem = document.createElement("a")
      
      actionElem.className = "reservation-visit-button"
      actionElem.href = `../detail/?adventure=${reservation.adventure}`
      actionElem.textContent = "Visit Adventure"
  
      const tdActionElem = document.createElement("td")
      tdActionElem.setAttribute("id", reservation.id)
      tdActionElem.appendChild(actionElem)
      trElem.appendChild(tdActionElem)
  
      reservationTableElem.appendChild(trElem)
    });
  }
}

export { fetchReservations, addReservationToTable };
