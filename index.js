const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares //
app.use(cors());
app.use(express.json());

// mongoDB connection //
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3myda.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("bikez");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    // GET API to get all the products
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // POST API to post orders
    app.post("/orders", async (req, res) => {
      const doc = req.body;
      const result = await ordersCollection.insertOne(doc);
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to BIKEZ websites server side !!!");
});
app.listen(port, () => {
  console.log(`listening to http://localhost:${port}`);
});
