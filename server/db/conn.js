const mongoose = require('mongoose');



const DB='mongodb+srv://bishtchirag13:chiragbisht13@cluster0.ah7op.mongodb.net/OpportuNest?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(DB,{
}).then(() =>{
    console.log('connection');
}).catch((error) => console.log('no connection'));

