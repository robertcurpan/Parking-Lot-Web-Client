import { createRequire } from 'module'
import { hasUncaughtExceptionCaptureCallback } from 'process';
const require = createRequire(import.meta.url);
const axios = require('axios');

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
    
        for(let parkingSpot of parkingLotStatus.parkingSpots) {
            if(parkingSpot.id == ticket.spotId) {
                parkingSpot.vehicleId = ticket.vehicle.vehicleId;
                parkingSpot.version = parkingSpot.version + 1;
            }
        }
    
        return parkingLotStatus;
    }
    
    updateParkingLotStatusWhenDriverLeaves(parkingLotStatus, ticket) {
        // Vom updata parkingLotStatus (Scoatem ticket-ul din lista de tickets si scoatem vehicleId din parkingSPot + updatam versiunea)
        parkingLotStatus.tickets = arrayRemoveTicket(parkingLotStatus.tickets, ticket);
    
        for(let parkingSpot of parkingLotStatus.parkingSpots) {
            if(parkingSpot.id == ticket.spotId) {
                parkingSpot.vehicleId = null;
                parkingSpot.version = parkingSpot.version + 1;
            }
        }
    
        return parkingLotStatus;
    }

    

}


