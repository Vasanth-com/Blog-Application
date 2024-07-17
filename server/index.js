const express = require('express');
const cors = require('cors');
const {connect} = require('mongoose');
require('dotenv').config()
const upload = require('express-fileupload')

const postRoutes = require('./routes/postsRoutes.js');
const userRoutes = require('./routes/usersRoutes.js');
const { notFound, errorHandler } = require('./middleware/errormiddleware.js');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(cors({credentials:true,origin:"https://speak-free.netlify.app"}))
// app.use(cors())
app.use(upload())
app.use('/uploads',express.static(__dirname + './uploads'));

app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);


app.use(notFound);
app.use(errorHandler)



connect(process.env.MONGO_URL).then(app.listen(port,(req,res)=>{
    console.log(`Server started on http://localhost:${port}`);
}))
