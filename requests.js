import { createRequire } from 'module'
const require = createRequire(import.meta.url);
const axios = require('axios');

export class ParkingLotHttpRequests {

    async generateParkingTicketRequest(requestBody) {
        let response = await axios.post('http://localhost:8080/generateParkingTicket', requestBody);
        if(response.status == 200) {
            let ticket = response.data;
            return ticket;
        }
    }
    
    async leaveParkingLotRequest(requestBody) {
        let response = await axios.post('http://localhost:8080/leaveParkingLot', requestBody);
        if(response.status == 200) {
            let ticket = response.data;
            return ticket;
        } 
    }

    async getParkingSpotsRequest() {
        let response = await axios.get('http://localhost:8080/getParkingSpots');
        let parkingSpots = response.data;
        return parkingSpots;

    }

    async getTicketsRequest() {
        let response = await axios.get('http://localhost:8080/getTickets');
        let tickets = response.data;
        return tickets;
    }

}
