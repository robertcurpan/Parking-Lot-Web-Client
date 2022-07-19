import { createRequire } from 'module'
import { resolve } from 'path';
const require = createRequire(import.meta.url);

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { cookie } = require('express/lib/response');
const session = require('express-session');
var favicon = require('serve-favicon')

import { ParkingLotService } from './service.js';
import { createTextFromErrorMessage } from './utils.js';
import { getParkingLotStatusAsString } from './utils.js';


const app = express();
const port = 6789;


// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));
// utilizez cookies
app.use(cookieParser());
// utilizez favicon
app.use(favicon('./public/images/favicon.ico'));
// utilizez sessiosn
const oneDay = 1000 * 60 * 60 * 24; //miliseconds
app.use(session({
	secret: "mysecretkey",
	saveUninitialized: false,
	cookie: {maxAge: oneDay},
	resave: false
}));

app.use(express.static("public"));

var parkingLotService = new ParkingLotService();
var parkingLotStatus = { parkingSpots: [], tickets: [] };
var errorMessage = null;
var doRefreshParkingLotStatus = true;

// -------------------------------------------------------------------------------------------------------------- //


app.get('/', (req, res) => {
	if(doRefreshParkingLotStatus) {
		doRefreshParkingLotStatus = false;

		let parkingSpotsPromise = parkingLotService.getParkingSpots();
		parkingSpotsPromise.then( parkingSpots => {
			let ticketsPromise = parkingLotService.getTickets();
			ticketsPromise.then( tickets => {
				parkingLotStatus.parkingSpots = parkingSpots;
				parkingLotStatus.tickets = tickets;
				res.render('index', { parkingLotStatus: getParkingLotStatusAsString(parkingLotStatus), errorMessage: errorMessage });
			});
		});
	} else {
		res.render('index', { parkingLotStatus: getParkingLotStatusAsString(parkingLotStatus), errorMessage: errorMessage });
	}
	
});


app.post('/generate-parking-ticket', (req, res) => {
	let vipStatus = req.body.vip == "Yes";
	let electric = req.body.electric == "Yes";
	
	let vehicle = {
		type: req.body.vehicle,
		driver: {name: req.body.name, vipStatus: vipStatus},
		color: req.body.color,
		price: req.body.price,
		electric: electric
	};

	let ticketPromise = parkingLotService.generateParkingTicket(vehicle);
	ticketPromise
	.catch( error => { errorMessage = createTextFromErrorMessage(error.response.data.message); } )
	.then( ticket => { 
		if(ticket) {
			parkingLotStatus = parkingLotService.updateParkingLotStatusWhenDriverParks(parkingLotStatus, ticket); 
			errorMessage = null;
			doRefreshParkingLotStatus = true;
		}
		res.redirect("/");
	} );
	
});


app.post('/leave-parking-lot', (req, res) => {
	let parkingSpotId = req.body.parkingSpotId;
	let parkingSpot = {};
	for(let currentParkingSpot of parkingLotStatus.parkingSpots) {
		if(currentParkingSpot.id == parkingSpotId) {
			parkingSpot = currentParkingSpot;
			break;
		}
	}

	let ticketPromise = parkingLotService.leaveParkingLot(parkingSpot);
	ticketPromise
	.catch( error => { errorMessage = createTextFromErrorMessage(error.response.data.message); } )
	.then( ticket => { 
		if(ticket) {
			parkingLotStatus = parkingLotService.updateParkingLotStatusWhenDriverLeaves(parkingLotStatus, ticket); 
			errorMessage = null;
			doRefreshParkingLotStatus = true;
		}
		res.redirect("/");
	} );
		
});


app.get('/get-parking-spots', (req, res) => {
	let parkingSpotsPromise = parkingLotService.getParkingSpots();
	parkingSpotsPromise.then( parkingSpots => { console.log(parkingSpots); } )

	res.redirect("/");
});


app.get('/get-tickets', (req, res) => {
	let ticketsPromise = parkingLotService.getTickets();
	ticketsPromise.then( tickets => { console.log(tickets); } )

	res.redirect("/");
});


app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:` + port.toString()));
