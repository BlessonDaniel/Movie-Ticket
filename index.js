const express = require('express');
const app = express();
const path = require('path')
const User = require('./models/user');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const Screen=require('./models/screen');


mongoose.connect('mongodb://localhost:27017/MovieTicketDb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB CONNECTED SUCCESSFULLY")
    })
    .catch(err => {
        console.log("DB CONNECTED FAILED!!!")
        console.log(err)
    })


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(session({secret: 'asdf1234', saveUninitialized: true, resave: true}));
app.use(flash())

app.use((req,res,next) => {
    res.locals.messages = req.flash('success');
    next();
})

const loginRequired = (req, res, next) => {
    if (!req.session.user_id) {
        req.flash('success', 'Need to Login')
        return res.redirect('/login')
    }
    next();
}

const adminAccessRequired = (req, res, next) => {
    if (!req.session.admin_id) {
        req.flash('success', 'Access Denied')
        return res.redirect('/login')
    }
    next();
}
app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if (user) {
        req.flash('success', 'Username taken!!!')
        res.redirect('/register')
    } else {
        const user = new User({username, password })
        await user.save();
        req.session.user_id = user._id;
        req.flash('success', 'Successfully registered')
        res.redirect('/')
    }
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser.username==='admin'){
        req.session.admin_id = foundUser._id
        req.flash('success', 'Welcome Admin')
        res.redirect('/admin')
    }
    else if (foundUser) {
        req.session.user_id = foundUser._id;
        req.flash('success', 'Welcome User')
        res.redirect('/')
    } else {
        req.flash('success', 'Invalid Credentials')
        res.redirect('/login')
    }
})

app.get('/', loginRequired, (req,res) => {
    res.render('home')
})


app.post('/', loginRequired, async (req,res) => {
    const name = req.body.screen;
    const seats = req.body.seats;
    const screen = await Screen.findOne({name})
    console.log(name);
    screen.available_seats -= seats;
    await screen.save();
    req.flash('success', 'Successfully Booked');
    res.redirect('/login');
})

app.get('/admin', adminAccessRequired, async (req,res) => {
    const screens = await Screen.find();
    res.render('admin', {screens})
})



app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login')
})
app.get('/*',(req,res) =>{
    res.render('error')
})
app.listen(3000, () => {
    console.log("LISTENING ON PORT:3000!")
})
