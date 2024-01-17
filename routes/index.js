var express = require('express');
var router = express.Router();

/* GET home page. */
// creating required modules

const { format } = require("date-fns");



// creating local data for rooms & bookings
const rooms = [
  {
    roomName: "Auditorium",
    roomId: "01",
    seats: 100,
    amenities: "wifi,projector,AC",
    price: 1500,
  },
  {
    roomName: "Banquet",
    roomId: "02",
    seats: 150,
    amenities: "speaker,projector,AC",
    price: 2000,
  },
  {
    roomName: "Conference ",
    roomId: "03",
    seats: 75,
    amenities: "wifi,projector,AC,tables",
    price: 1250,
  },
];
const bookings = [
  {
    bookingId: 1,
    customerName: "ajith",
    roomId: "01",
    date: format(new Date(), "yyyy-MM-dd"),
    start: "08:00:00",
    end: "09:00:00",
    status: "confirmed",
  },
  {
    bookingId: 2,
    customerName: "vijay",
    roomId: "02",
    date: format(new Date(), "yyyy-MM-dd"),
    start: "08:00:00",
    end: "09:00:00",
    status: "waiting for confirmation",
  },
  {
    bookingId: 3,
    customerName: "madhavan",
    roomId: "03",
    date: format(new Date(), "yyyy-MM-dd"),
    start: "08:00:00",
    end: "09:00:00",
    status: "confirmed",
  },
];

//API Endpoint for App Home
router.get("/", (req, res) => {
  res.send({message:"hall booking"});
});

//API Endpoint for getting all details of Rooms
router.get("/rooms", (req, res) => {
  res.json(rooms);
});

//API Endpoint for adding details in Rooms
router.post("/rooms", (req, res) => {
  const { roomName, seats, amenities, price } = req.body;
  const room = { roomName, roomId: rooms.length + 1, seats, amenities, price };
  rooms.push(room);
  res.status(201).json({ message: "room added sucessfully" });
});

//API Endpoint for getting all details of bookings
router.get("/bookings", (req, res) => {
  res.json(bookings);
});

//API Endpoint for adding details in Bookings
router.post("/bookings", (req, res) => {
  const { customerName, date, start, end, roomId, status } = req.body; 
  
  const bookingFilter = bookings.filter( 
    
    (room) => room.date==date&&room.roomId==roomId 
  );
  if (!bookingFilter) {
    return res.status(404).json({ message: "Room already booked" });
  }
 
  const booking = {
    bookingId: bookings.length + 1,
    customerName,
    date,
    start,
    end,
    roomId,
    status,
  };
  bookings.push(booking);
  res.status(201).json({ message: "booked sucessfully" });
});

//API Endpoint for listing all rooms with booked Data
router.get("/bookedRooms", (req, res) => {
  const BookedRoomDetails = bookings.filter((book) => { 
  return book.status==="confirmed"
    
  }) 
  .map((book)=>{  
    return{ 
     " roomId":`${book.roomId}` ,
     " Date":`${book.date}` ,
      " Custormer":`${book.customerName}` ,
      "Start Time": `${book.start}`,
      "End Time": `${book.end}`,
    }

  }) 

  
  res.send(BookedRoomDetails?BookedRoomDetails:{message:"all rooms are vacent"});
});

//API Endpoint for listing all customers with booked Data
router.get("/customers", (req, res) => {
  const customerData = bookings.map((book) => {
    roomsData = rooms.find((room) => room.roomId == book.roomId);
    return {
      "Customer Name": `${book.customerName}`,
      "Room Name": `${roomsData.roomName}`,
      "Date": `${book.date}`,
      "Start Time": `${book.start}`,
      "End Time": `${book.end}`,
    };
  });
  res.json(customerData);
});

//API Endpoint for listing no of times customer booked Data
router.get("/customers/:name", (req, res) => {
  const customerName = req.params.name;
   allData = bookings.filter((book) => {return  book.customerName === customerName}).map((book)=>{  
    return{ 
     " roomId":`${book.roomId}` ,
     " Date":`${book.date}` ,
      " Custormer":`${book.customerName}` ,
      "Start Time": `${book.start}`,
      "End Time": `${book.end}`,
    }
    
  }) 
  
  res.send(allData.length>0?allData:{message:"no match"});
 
});

// adding listener

module.exports = router;
