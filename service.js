import { ParkingLotHttpRequests } from './requests.js';
import { arrayRemoveTicket } from './utils.js';


export class ParkingLotService {
    constructor() {
        this.parkingLotHttpRequests = new ParkingLotHttpRequests();
    }

    async generateParkingTicket(vehicle) {
        let ticket = await this.parkingLotHttpRequests.generateParkingTicketRequest(vehicle);
        return ticket;
    }
    
    async leaveParkingLot(parkingSpot) {
        let ticket = await this.parkingLotHttpRequests.leaveParkingLotRequest(parkingSpot);
        return ticket;
    }

    async getParkingSpots() {
        let parkingSpots = await this.parkingLotHttpRequests.getParkingSpotsRequest();
        return parkingSpots;
    }

    async getTickets() {
        let tickets = await this.parkingLotHttpRequests.getTicketsRequest();
        return tickets;
    }

    updateParkingLotStatusWhenDriverParks(parkingLotStatus, ticket) {
        // Vom updata parkingLotStatus (Adaugam ticket-ul in lista de tickets si modificam vehicleId + version in parkingSpots)
        parkingLotStatus.tickets.push(ticket);
        this.updateParkingSpotInParkingLotStatus(parkingLotStatus, ticket.parkingSpot);

        return parkingLotStatus;
    }
    
    updateParkingLotStatusWhenDriverLeaves(parkingLotStatus, ticket) {
        // Vom updata parkingLotStatus (Scoatem ticket-ul din lista de tickets si scoatem vehicleId din parkingSPot + updatam versiunea)
        parkingLotStatus.tickets = arrayRemoveTicket(parkingLotStatus.tickets, ticket);
        this.updateParkingSpotInParkingLotStatus(parkingLotStatus, ticket.parkingSpot);
    
        return parkingLotStatus;
    }

    updateParkingSpotInParkingLotStatus(parkingLotStatus, parkingSpot) {
        for(let index = 0; index < parkingLotStatus.parkingSpots.length; ++index) {
            if(parkingLotStatus.parkingSpots[index].id == parkingSpot.id) {
                parkingLotStatus.parkingSpots[index] = parkingSpot;
                break;
            }
        }
    }

    

}


