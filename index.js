const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = process.env.MONGODB_URL; 


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    
    // Connect to the specific database and collection
    const db = client.db('RoomRent'); // Assuming RoomRent is your database name
    const bookingCollection = db.collection('booking'); 
    const fromBooking =client.db('FromBD').collection('bookingFrom');
    const seclectRoom =client.db('Selectrooms').collection('rooms');
    
    
//-------------- ********* auth related api   ******---------------

    

app.post('/logout', async (req, res) => {
  const user = req.body;
  console.log('logging out', user);
  res.clearCookie('token', { maxAge: 0 }).send({ success: true })
})


    //------------- GET method to fetch all bookings--------------
    app.get('/booking', async (req, res) => {
      const result = await bookingCollection.find().toArray();
      res.send(result);
    });
    //-------------all rooms--------------
    app.get('/rooms', async (req, res) => {
      const result = await seclectRoom.find().toArray();
      res.send(result);
    });
    // -------------from booking--------
    app.post('/bookingFrom',async(req,res)=>{
      const newfrom=req.body;
      console.log(newfrom)
      const result=await fromBooking.insertOne(newfrom);
      res.send(result)

    })

    app.get('/bookingFrom',async(req,res)=>{
      const result=await fromBooking.find().toArray()
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('rooms is sitting on');
});

app.listen(port, () => {
  console.log(`Room sharing sitting on port ${port}`);
});
