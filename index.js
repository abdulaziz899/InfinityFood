//npm install nodemon mongodb express body-parser cors
const express = require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;


const app = express();
app.use(cors());
app.use(bodyParser.json());

const port =process.env.PORT || 5001;



app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.w8vla.mongodb.net:27017,cluster0-shard-00-01.w8vla.mongodb.net:27017,cluster0-shard-00-02.w8vla.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-kn5rpb-shard-0&authSource=admin&retryWrites=true&w=majority`;
MongoClient.connect(uri,{ useNewUrlParser: true,useUnifiedTopology: true } ,function(err, client) {
  
  const collection = client.db("TasteFoodEverything").collection("Foods");
  const cartCollection = client.db("TasteFoodEverything").collection("cart");
  const reviewCollection = client.db("TasteFoodEverything").collection("review");
  const orderCollection = client.db("TasteFoodEverything").collection("order");
  const adminCollection = client.db("TasteFoodEverything").collection("admin");
  console.log("data base connected");

  //data load in mongodb
  app.post('/allFoodSection', (req, res)=> {
    const food=req.body;
    collection.insertOne(food)
    .then(result=>{
      console.log(result);
      res.send(result.insertedCount>0)
    })
  })
   //make admin load in mongodb
  app.post('/allAdmin', (req, res)=> {
    const admin=req.body;
    adminCollection.insertOne(admin)
    .then(result=>{
      console.log(result);
      res.send(result.insertedCount>0)
    })
  })

  //post cart
   app.post('/allFoodCart', (req, res)=> {
    const cart=req.body;
    console.log(cart);
    cartCollection.insertOne(cart)
    .then(result=>{
      console.log(result);
      res.send(result.insertedCount>0)
    })
  })
  //show cart ui 
  app.get('/allFoodCartUi', (req, res)=> {
    const cart=req.query.email;
    console.log(cart);
    cartCollection.find({email:req.query.email})
    .toArray((err,result)=>{
      console.log(result);
      res.send(result)
    })

  })//show cart ui header 
  app.get('/allFoodCartHeader', (req, res)=> {
    const cart=req.query.email;
    console.log(cart);
    cartCollection.find({email:req.query.email})
    .toArray((err,documents)=>{
      console.log(documents);
      res.send(documents)
    })
  })
  // all success ful order
   app.post('/allSuccessOrders', (req, res)=> {
    const successOrder=req.body;
    console.log(successOrder);
    orderCollection.insertOne(successOrder)
    .then(result=>{
      console.log(result);
      res.send(result.insertedCount>0)
    })
  })


  //data show in ui
  app.get('/showFoodClientSite',(req,res)=>{
    collection.find({})
    .toArray((err,documents)=>{
      console.log(documents);
      res.send(documents)
    })
  })
  //manage food show in ui
  app.get('/manageFood',(req,res)=>{
    collection.find({})
    .toArray((err,documents)=>{
      console.log(documents);
      res.send(documents)
    })
  })

  // delete food

  app.delete('/delete/:id',(req,res)=>{
    collection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
     console.log(result);
     res.send(result.deletedCount>0)
    })
  })
   // delete deleteSuccessCart

  app.delete('/deleteSuccessCart/:id',(req,res)=>{
    cartCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
     console.log(result);
     res.send(result.deletedCount>0)
    })
  })

  //success order data show in ui
  app.get('/showCartFoodClientSite',(req,res)=>{
    orderCollection.find({})
    .toArray((err,documents)=>{
      console.log(documents);
      res.send(documents)
    })
  })
  
  //review add db
  app.post('/addReview',(req,res)=>{
    const review=req.body;
    reviewCollection.insertOne(review)
    .then(result=>{
    res.send(result.insertedCount>0);
    })
})

  
    //review show ui
    app.get('/allReview',(req,res)=>{
      reviewCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    });

  //change status 
  app.patch('/update/:id',(req,res)=>{
    console.log(req.params.id);
    orderCollection.updateOne({_id:ObjectId(req.params.id)},{
      $set:{status:req.body.status}
    })
    .then(result=>{
      console.log(result);
      res.send(result.modifiedCount>0)
    })
  })

  //count handle
  app.patch('/updateCount/:id',(req,res)=>{
    console.log(req.params.id);
    cartCollection.updateOne({_id:ObjectId(req.params.id)},{
      $set:{count:req.body.count}
    })
    .then(result=>{
      console.log(result);
      res.send(result.modifiedCount>0)
    })
  })

//

app.get('/orderDetailShow',(req,res)=>{
  const email=req.query.email;
  adminCollection.find({email:email})
    .toArray((err,admin)=>{
      if (admin.length===0) {
        orderCollection.find({email:email})
        .toArray((err,documents)=>{
            res.send(documents);
        })
      }
      else if(admin.length>0){
        orderCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents);
        })
      }
    })
    
})
app.get('/adminOrderDetailShow',(req,res)=>{
  const email=req.query.email;
  adminCollection.find({email:email})
    .toArray((err,admin)=>{
      if (admin.length>0) {
        orderCollection.find({email:email})
        .toArray((err,documents)=>{
            res.send(documents);
        })
      }
    })
    
})


//
  app.get('/showFoodClientSiteBreakFast',(req,res)=>{
    collection.find({category:"breakfast"})
    .toArray((err,documents)=>{
      console.log(documents);
      res.send(documents)
    })
  })

  app.get('/showFoodClientSiteLunch',(req,res)=>{
    collection.find({category:"lunch"})
    .toArray((err,documents)=>{
      console.log(documents);
      res.send(documents)
    })
  })

  app.get('/showFoodClientSiteDinner',(req,res)=>{
    collection.find({category:"lunch"})
    .toArray((err,documents)=>{
      console.log(documents);
      res.send(documents)
    })
  })


  app.get('/productDetail/:id',(req,res)=>{
    collection.find({_id:ObjectId(req.params.id)})
    .toArray((err,documents)=>{
      console.log(documents);
      res.send(documents[0])
    })
  })

  app.get('/isAdmin',(req,res)=>{
    const email=req.query.email;
    console.log(email)
    adminCollection.find({email:email})
    .toArray((err,admin)=>{
      console.log(admin);
      res.send(admin.length>0)
    })
  })


});




app.listen(port);