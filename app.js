var express = require('express')
var app = express()

var MongoClient = require('mongodb').MongoClient;

//var url = 'mongodb://localhost:27017';
var url =  "mongodb+srv://monsterwsa:4wrdqqaa@cluster0.u5uje.mongodb.net/test";

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

var hbs = require('hbs')
app.set('view engine','hbs')


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))

//xóa sp
app.get('/delete', async (req,res)=>{
    let id =req.query.pid;
    let condition = {"_id":id};

    let client = await MongoClient.connect(url);
    let dbo = client.db("productDB2");
    let results = await dbo.collection("productDetails").deleteOne(condition);
    res.redirect("/")
})

//hiển thị trang home
app.get('/', async (req,res)=>{
    let client = await MongoClient.connect(url);
    let dbo = client.db("productDB2");
    let results = await dbo.collection("productDetails").find({}).toArray({});
    res.render('home', {model: results})
})

app.get('/new',(req,res)=>{
    res.render('newProduct')
})

//add sp
app.post('/insert', async( req,res)=>{
    let client = await MongoClient.connect(url);
    let dbo = client.db("productDB2");
    let IDInput = req.body._id;
    let nameInput = req.body.productName;
    let priceInput =req.body.price;
    let quantityInput = req.body.quantity;
    let colorInput = req.body.color;
    let newProduct={_id:IDInput, productName:nameInput, price:priceInput, quantity: quantityInput, color: colorInput};
    if(quantityInput < 0 || quantityInput >10 ){

        res.render('error')
        
    }
    else{
        await dbo.collection("productDetails").insertOne(newProduct);
        let results = await dbo.collection("productDetails").find({}).toArray({});
        res.render('home', {model: results})
    }
})

//Search
app.post('/search',async (req,res)=>{
    let searchText = req.body.txtSearch;
    let client= await MongoClient.connect(url);
    let dbo = client.db("productDB2");
    let results = await dbo.collection("productDetails").
    find({productName: new RegExp(searchText,'i')}).toArray();
        
    res.render('home',{model:results})
})
var PORT = process.env.PORT || 5000
app.listen(PORT);
console.log("Server is running at " + PORT)