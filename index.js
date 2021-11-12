const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId; 

const app = express();

const port = process.env.PORT || 5000;
// middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qqycq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const uri = mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mnesf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// XJR3jHB3FIUN6vK2
// watchDB


async function run() {
    try {
      await client.connect();
      const database = client.db("Timzee");
    const products = database.collection("products");
    const userInfo = database.collection("userInfo");
    const orders = database.collection("orders");
    const reviews = database.collection("reviews");


    app.post('/addUser', async (req,res)=>{
      const result = await userInfo.insertOne(req.body);
      res.send(result);
    })

    app.put('/googleUser', async(req,res)=>{
      const filter = { email: req.body.email };

      const options = { upsert: true };

      const updateDoc = {
        $set: {
          email: req.body.email,
          displayName: req.body.displayName
        },
      };

      const result = await userInfo.updateOne(filter, updateDoc, options);
      // console.log(result);
    })

    app.get('/allProducts', async (req,res)=>{
      const result = await products.find({}).toArray();
      res.send(result);
    })

    app.get('/purchase/:id', async (req,res)=>{
      const productId = {
        _id: ObjectId(req.params.id)
      } 

      const result= await products.findOne(productId);
      res.send(result);

    })

    app.post('/confirmOrder', async(req,res)=>{
      const result = await orders.insertOne(req.body);
      res.send(result);
    })

    app.post('/addReview', async(req,res)=>{
      const result = await reviews.insertOne(req.body);
      res.send(result);
    })

    app.get('/myOrder/:email', async (req,res)=>{
      const userEmail = {email: req.params.email};
      const result = await orders.find(userEmail).toArray();
      res.send(result);

    })

    app.delete('/deleteProduct/:id', async (req,res)=>{
      // console.log(req.params.id);
      const product  = {
        _id: ObjectId(req.params.id)
      }

      const result = await orders.deleteOne(product);
      res.send(result);
    })

    app.post('/addNewItem', async(req,res)=>{
      // console.log(req.body);
      const result = await products.insertOne(req.body);
      res.send(result);
    })

    app.get('/manageAllOrders', async (req,res)=>{
      const result = await orders.find({}).toArray();
      res.send(result);
    })

    app.delete('/deleteProducts/:id', async(req,res)=>{
      const item = {_id: ObjectId(req.params.id)}
      const result = await products.deleteOne(item);
      res.send(result);
      // console.log(req.params.id);
    })

    app.put('/addRole', async (req,res)=>{
      // console.log(req.body);
      const filter = { email: req.body.email };
      // console.log(filter);
      const updateDoc = {
        $set: {
          role:'admin'
        },
      };

      const result = await userInfo.updateOne(filter, updateDoc);
      res.send(result);
  
    })

    app.put('/updateOrderStatus', async(req, res)=>{
      // console.log(req.body._id);
      const filter = {_id: ObjectId(req.body._id)};
      const updateDoc = {
        $set: {
          status: 'Shipped'
        },
      };
      const result = await orders.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.get('/findReview', async (req,res)=>{
      const result = await reviews.find({}).toArray();
      // console.log(result);
      res.send(result);
    })

    app.get('/checkAdmin/:email', async(req,res)=>{

      // console.log(req.params.email);
      const user ={
        email: req.params.email
      }
      const result = await userInfo.findOne(user);
      isAdmin = false;

      if(result.role == 'admin'){
        isAdmin = true;
      }
      res.send({
        admin: isAdmin
      })
    })
    
    
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);






app.get('/', (req,res)=>{

    res.send('Server ready to run');

})

app.listen(port,(req,run)=>{
    console.log('listening to port', port);
})