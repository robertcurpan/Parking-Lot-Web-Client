
export function arrayRemoveTicket(arr, ticket) {
    return arr.filter(function(currentTicket) {
        return currentTicket.parkingSpot.id != ticket.parkingSpot.id;
    });
}


export function createTextFromErrorMessage(errorMessage) {
    var errorText = "";

    if (errorMessage === "unknown") {
        errorText = "Unknown error occured during operation!";
    } else if (errorMessage === "notFound") {
        errorText = "The parking spot with the given id does not exist!";
    } else if (errorMessage === "notAvailable") {
        errorText = "There is no free parking spot available for the current vehicle!";
    } else if (errorMessage === "optimisticLocking") {
        errorText = "Attempt to perform multiple operations at the same time. Try again!";
    } else if (errorMessage === "notOccupied") {
        errorText = "The parking spot with the given id is not occupied!";
    } else if (errorMessage === "tooExpensive") {
        errorText = "The vehicle's price must be at most 10.000!";
    }

    return errorText;
}


export function getParkingLotStatusAsString(parkingLotStatus) {
    let tickets = parkingLotStatus.tickets;
    let parkingSpots = parkingLotStatus.parkingSpots;
    let parkingLotStatusAsString = ""

    parkingLotStatusAsString += "<u>Parking Spots</u><br />";
    for(let parkingSpot of parkingSpots) {
        parkingLotStatusAsString += getParkingSpotAsString(parkingSpot) + "<br />";
    }
    parkingLotStatusAsString += "<br /><u>Tickets</u><br />";
    for (let ticket of tickets) {
        parkingLotStatusAsString += getTicketAsString(ticket) + "<br />";
    }
    parkingLotStatusAsString += "<br />";
    
    return parkingLotStatusAsString;
}

function getParkingSpotAsString(parkingSpot) {
    let parkingSpotAsString = parkingSpot.id + " [" + parkingSpot.spotType + "] -> electric: " + parkingSpot.electric;
    return parkingSpotAsString;
}

function getTicketAsString(ticket) {
    let ticketAsString = "[" + ticket.vehicle.driver.name + ", VIP: " + ticket.vehicle.driver.vipStatus + "] - " + ticket.vehicle.vehicleType + " (" + ticket.vehicle.price + ") -> spot ID: " + ticket.parkingSpot.id;
    return ticketAsString;
}