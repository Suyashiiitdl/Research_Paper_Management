var express = require("express")
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

const app=express()
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))


app.set('view engine','ejs')

const mongoURI = 'mongodb://localhost:27017/irdBtp'
const conn =mongoose.createConnection(mongoURI)
mongoose.connect(mongoURI)
var db = mongoose.connection
db.on('error',()=> console.log("Error in connecting to Database"))
db.once('open',()=>console.log("Connected to Database"))

// let gfs;

// conn.once('open',() =>{
//     //Init stream
//     gfs = Grid(conn.db,mongoose.mongo)
//     gfs.collection('uploads')
// })

// // Create storage engine
// const storage = new GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           const filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'uploads'
//           };
//           resolve(fileInfo);
//         });
//       });
//     }
//   });

// const upload = multer({ storage });

// Set up storage for uploaded files
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, (file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

app.post("/sign_upp", (req,res)=>{
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
        res.send('File uploaded successfully.');
})

app.post("/sign_upp1",upload.single('file'), (req,res)=>{
    // const file =req.file
    // if(file){
    //     // return res.status(400).send('No file uploaded.');
    
    //     // Save file information or perform other operations
    //     console.log('File uploaded:', file.filename);
        
    //     // const destinationPath = path.join(__dirname, 'uploads', file.originalname);
    //     // fs.rename(file.path, destinationPath) 
    //     const pythonProcess = spawn('python', ['uploads/main.py', file.originalname]);
    //     pythonProcess.stdout.on('data', (data) => {
    //         console.log(`stdout: ${data}`);
    //     });
    //     pythonProcess.stderr.on('data', (data) => {
    //         console.error(`stderr: ${data}`);
    //     });
    //     res.send('File uploaded successfully.');
    // }



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

    // Combine Author names, types, and statuses into an array of objects
    var AuthorsData = AuthorNames.map((name, index) => {
        return {
            name: name,
            type: AuthorTypes[index],
            status: AuthorStatuses[index]
        };
    });

    var data={
        "Title":Title,
        "Authors":AuthorsData,
        "Journal":Journal,
        "Volume":Volume,
        "Pages":Pages,
        "BookTitle":BookTitle,
        "Organization":Organization,
        "Publisher":Publishers,
        "Number":Number,
        "Year":Year
    }
    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record inserted successfully")
    })

    // res.json({file: req.file})
})


app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin":'*'
    })
    res.render('index')
    return res.redirect('index.html')
}).listen(3000);

console.log("Listening on port")