const express = require('express');
const cors = require('cors');
const connectdataBase = require('./config/database');
const userController = require('./controllers/userController');
const taskController = require('./controllers/taskController');


const app = express();
connectdataBase();

app.use(cors());
app.use(express.json());


//import routes
app.use('/api/users', userController);
app.use('/api/tasks', taskController);



const Port = 4004;
app.listen(Port, () =>{
    console.log(`server is working on ${Port}`);
})
