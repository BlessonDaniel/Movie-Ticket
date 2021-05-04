const mongoose = require('mongoose');
const User = require('./models/user');
const Screen = require('./models/screen');

mongoose.connect('mongodb://localhost:27017/MovieTicketDb', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("DB CONNECTED SUCCESSFULLY")
})
.catch(err => {
    console.log("DB CONNECTED FAILED!!!")
    console.log(err)
})

const makeAdmin = async () => {
    const admin = new User({ username: 'admin', password: 'admin' })
    const res = await admin.save();
    console.log(res)
}

const makeScreens = async () => {
    await Screen.insertMany([
        { name : 'Screen A'},
        { name : 'Screen B'},
        { name : 'Screen C'},
        { name : 'Screen D'}
    ])
    console.log('Screens added successfully');
}

makeAdmin();
makeScreens();