const express = require('express');
const bodyParser = require('body-parser');

const controller = require('./controllers/main')
const app = express();
const sequelize = require('./util/database');

var cors = require('cors');
app.use(cors());
app.use(bodyParser.json({extended:false}));

app.get('/expense/',controller.getExpenses);
app.post('/expense/add',controller.addExpense);
app.post('/delete/:id',controller.deleteExpense);
app.post('/edit/:id',controller.postEditExpense);
// app.post('/',controller.postEditAppointment);

sequelize
    .sync()

    .then(result=>{
        app.listen(3000)
    })
    .catch(err=>{
        console.log(err)
    });
