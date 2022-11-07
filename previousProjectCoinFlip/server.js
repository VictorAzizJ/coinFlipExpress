const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://VictorAzizJ:Bahiyah1@cluster0.ed64pxn.mongodb.net/coinFlip?retryWrites=true&w=majority";
const dbName = "coinFlip";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('coinFlip').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {coinFlip: result})
  })
})

app.post('/coinFlip', (req, res) => {
  flipArray =['heads', 'tails'];
  
  playerChoice = req.body.name.toLowerCase();
  computerChoice = flipArray[Math.floor(Math.random()*flipArray.length)];
  
  if(playerChoice == computerChoice){
    outcome = 'Won'
  }
  else{
    outcome = 'Lost'


  }
  db.collection('coinFlip').insertOne({name: req.body.name, computerChoice , gameResults: outcome}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

/*app.put('/coinFlip', (req, res) => {
  
  db.collection('coinFlip')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    
    $inc: { 
      thumbUp:  req.body.thumbUp ? 1 : 0 , 
      thumbDown: req.body.thumbUp ? 0 : 1


    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})*/

app.delete('/coinFlip', (req, res) => {
  db.collection('coinFlip').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
