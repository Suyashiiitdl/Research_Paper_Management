require('dotenv').config()

const express = require('express')
const expressLayout = require('express-ejs-layouts')
const connectDB = require('./server/config/db')
// const {flash}= require('express-flash-message')
flash = require('express-flash')
const session= require('express-session')
const { ObjectId } = require('mongodb');
const app = express()
const port = 3000 || process.env.PORT
const Customer = require('./server/models/Customer')
const Usname = require('./server/config/userdb')
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const path = require('path')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')
const fs = require('fs')
const { spawn } = require('child_process');

app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.urlencoded({extended: true}))
app.use(express.json())


// Static files
app.use(express.static('public'))


//Express Session
app.use(
    session({
        secret:'secret',
        resave: false,
        saveUninitialized:true,
        cookie: {
            maxAge: 1000*60*60*24*7,// 1 week
        }
    })
)

//Flash Messages
app.use(flash({sessionKeyName: 'flashMessage'}))



// Templating Engine
app.use(expressLayout)
app.set('view engine','ejs')

const mongoURI = 'mongodb://localhost:27017/irdBtp'
const conn =mongoose.createConnection(mongoURI)
mongoose.connect(mongoURI)
var db = mongoose.connection
db.on('error',()=> console.log("Error in connecting to Database"))
db.once('open',()=>console.log("Connected to Database"))



//Routes
app.use('/', require('./server/routes/customer'))
app.set("layout","./layouts/main")

// Handle 404
app.get('*', (req, res) =>{
    res.status(404).render('404')
})


// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, (file.originalname));
    }
});


const upload = multer({ storage: storage });
app.post("/sign_upp",upload.single('file'), async(req,res)=>{
    const file =req.file
    if(!file){
        return res.status(400).send('No file uploaded.');
    }
    
    // Save file information or perform other operations
    console.log('File uploaded:', file.filename);
    
    // const destinationPath = path.join(__dirname, 'uploads', file.originalname);
    // fs.rename(file.path, destinationPath) 
    const pythonProcess = spawn('python', ['uploads/main.py', file.originalname]);
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    // prompt("File has been uploaded. Please sign in again")
    res.redirect("/");
})
app.post("/sign_upp1",upload.single('file'), async(req,res)=>{
    
    
    var Title = req.body.Title
    var Authors = req.body.Authors
    var Journal = req.body.Journal
    var Volume = req.body.Volume
    var Pages = req.body.Pages
    var BookTitle = req.body.BookTitle
    var Organization = req.body.Organization
    var Publishers = req.body.Publishers
    var Number = req.body.Number
    var Year = req.body.Year

    var AuthorNames = req.body.Authors;
    var AuthorTypes = req.body.authorType;
    var AuthorStatuses = req.body.authorStatus;
    var AuthorOther = req.body.aOther;
    var usernamee = req.body.usernamee;
    var userID=""

    // Combine Author names, types, and statuses into an array of objects
        // Combine Author names, types, and statuses into an array of objects
        var AuthorsData = [];
        for (var i = 0; i < AuthorNames.length; i++) {
            AuthorsData.push({
                name: AuthorNames[i],
                type: AuthorTypes[i],
                status: AuthorStatuses[i],
                aOther: AuthorOther[i] || ''
            });
        }
        
        
        // Combine Author names, types, and statuses into a single array with comma-separated values
        var AuthorsDataString = [];
        for (var i = 0; i < AuthorsData.length; i++) {
            AuthorsDataString.push(AuthorsData[i].name + ", " + AuthorsData[i].type + ", " + AuthorsData[i].status + ", " +AuthorsData[i].aOther);
        }

        // Find the user by username to get their ID
        const user =  await Usname.findOne({ name: usernamee });
        if (user) {
            userID=user._id
        }
        

    
    
    var data={
        "Title":Title,
        "Authors":AuthorsDataString,
        "Journal":Journal,
        "Volume":Volume,
        "Pages":Pages,
        "BookTitle":BookTitle,
        "Organization":Organization,
        "Publisher":Publishers,
        "Number":Number,
        "Year":Year,
        "userID": userID}
    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record inserted successfully")
        res.redirect("/Dashboard"); // Redirect to home page or other page

    })

    // res.json({file: req.file})
})


app.post("/you", upload.single('file'), (req, res) => {
    const customerId = req.body.customerId;
    console.log(customerId)

    var Title = req.body.Title;
    var Authors = req.body.Authors;
    var Journal = req.body.Journal;
    var Volume = req.body.Volume;
    var Pages = req.body.Pages;
    var BookTitle = req.body.BookTitle;
    var Organization = req.body.Organization;
    var Publishers = req.body.Publishers;
    var Number = req.body.Number;
    var Year = req.body.Year;

    var AuthorNames = req.body.Authors;
    var AuthorTypes = req.body.authorType;
    var AuthorStatuses = req.body.authorStatus;
    var AuthorOther = req.body.aOther;


    // Combine Author names, types, and statuses into an array of objects
        // Combine Author names, types, and statuses into an array of objects
        var AuthorsData = [];
        for (var i = 0; i < AuthorNames.length; i++) {
            AuthorsData.push({
                name: AuthorNames[i],
                type: AuthorTypes[i],
                status: AuthorStatuses[i],
                aOther: AuthorOther[i]
                
            });
        }
        
        // Combine Author names, types, and statuses into a single array with comma-separated values
        var AuthorsDataString = [];
        for (var i = 0; i < AuthorsData.length; i++) {
            AuthorsDataString.push(AuthorsData[i].name + ", " + AuthorsData[i].type + ", " + AuthorsData[i].status  + ", " +AuthorsData[i].aOther);
        }
    var data = {
        "Title": Title,
        "Authors": AuthorsDataString,
        "Journal": Journal,
        "Volume": Volume,
        "Pages": Pages,
        "BookTitle": BookTitle,
        "Organization": Organization,
        "Publisher": Publishers,
        "Number": Number,
        "Year": Year
    };

    // Update the existing record in the 'users' collection
    db.collection('users').updateOne({ _id: new ObjectId(customerId) }, { $set: data }, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
        }
        console.log("Record updated successfully");
        res.redirect("/Dashboard"); // Redirect to home page or other page
    });
});






app.listen(port, () =>{
    console.log(`App listening on port ${port}`)
})