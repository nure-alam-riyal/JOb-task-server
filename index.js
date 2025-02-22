const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 1506
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(express.json())
app.use(cors())
app.get('/', async (req, res) => {
    res.send('Job task pendding.......')
})


const uri = `mongodb+srv://${process.env.Name}:${process.env.PASS}@nurealamriyal.adrs4.mongodb.net/?retryWrites=true&w=majority&appName=nurealamriyal`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const userCollection = client.db("JobTask").collection("user");
        const taskCollection = client.db("JobTask").collection("Task");
        app.get("/task",async (req,res) => {
            const result= await taskCollection.find().toArray()
            console.log(result)
            res.send(result)

        })
        app.post('/user', async (req, res) => {

            const userdata = req.body
            const query = {
                email: userdata?.email
            }
            console.log(query)
            const isExist = await userCollection.findOne(query)
            // console.log(isExist)
            if (isExist)
            {
                return
            }
            else {
                const result = await userCollection.insertOne(userdata)
                res.send(result)
            }
           
        })
        app.post('/task',async (req,res) => {
            const data=req.body
            const date= new Date()
            const newData={
                date,...data
            }

            const result=await taskCollection.insertOne(newData)
            res.send(result)
        })
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`server run on the port ${port}`)
})