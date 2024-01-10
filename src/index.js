
const express = require("express");
const app = express();
const fs = require("fs");
const path = require('path');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const dbb = "mongodb+srv://gagan:GagandeepSingh12@gagan.siif22a.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbb
).then(()=>{
    console.log('mongoose connected');
}).catch((e)=>{
    console.log('failed');
})

const logInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const LogInCollection=new mongoose.model('LogInCollection',logInSchema)



const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})



// app.get('/home', (req, res) => {
//     res.render('home')
// })

app.post('/signup', async (req, res) => {
    
    // const data = new LogInCollection({
    //     name: req.body.name,
    //     password: req.body.password
    // })
    // await data.save()

    const data = {
        name: req.body.name,
        password: req.body.password
    }

    // console.log(data);

    const checking = await LogInCollection.findOne({ name: req.body.name })
    await LogInCollection.insertMany([data])
    // console.log(checking);

//    try{
//         console.log("tried");
//         // console.log(checking.name, " bla bla");
//         // if (checking.name === req.body.name && checking.password===req.body.password) {
//         //     console.log("inside if");
//         //     res.send("user details already exists")
//         //     // return;
//         // }
//         // else{
//             // console.log("inside else");
//             // await LogInCollection.insertMany({name: "hellow" , password: "gadsfg"})
//             await LogInCollection.insertOne(data)
//         // }
//     }
//     catch{
//         res.send("wroadsfasng inputs")
//     }

    res.status(201).render("home", {
        naming: req.body.name
    })
})


app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch (e) {

        res.send("wrong details")
        

    }


})

// const mongoose=require("mongoose")

// mongoose.connect("mongodb+srv://gagan:GagandeepSingh12@gagan.siif22a.mongodb.net/?retryWrites=true&w=majority",{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(()=>{
//     console.log('mongoose connected index wala');
// })
// .catch((e)=>{
//     console.log('failed');
// })
var db = mongoose.connection;
app.post('/contact', async (req, res) => {

    
    let name = req.body.contname;
    let email = req.body.contemail;
    let subject = req.body.contno;
    let desc = req.body.contmess;

    let data = {
        name: name,
        email: email,
        subject: subject,
        desc: desc
    }
    

    db.collection('contact_info').insertOne(data, (err, collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.send("Form Submitted Successfully");
    return res.sendFile('home.hbs', {root: '../'});

});


app.listen(port, () => {
    console.log('port connected');
})