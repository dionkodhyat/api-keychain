const express = require(`express`)
const authRoute = require(`./routes/routes`)
const dotenv = require(`dotenv`)
const mongoose = require('mongoose')
const cors = require('cors')
dotenv.config()
const app = express()

//Connect to DB
mongoose.connect(`mongodb+srv://dionkodhyat:Password123@cluster0.s2jgg.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser : true}, 
    () => console.log('connected to db')
)




// Middleware
app.use(express.urlencoded())
app.use(express.json())
app.use(cors({origin: '*'}))
app.use(cors({allowedHeaders: 'Authorization'}))
app.use(cors({exposedHeaders : 'Authorization'}))


app.use(`/`, authRoute);
app.use(`/api`, authRoute);
app.use(`/api/login`, authRoute);
app.use(`/api/register`, authRoute)

// Working with secret keys
app.use(`/api/generateKey`, authRoute)
app.use(`/api/verifyKey`, authRoute)
app.use(`/api/refreshKey`, authRoute)
app.use(`/api/updateKey`, authRoute)

app.listen(9001, (req, res) => {
    console.log('listening to port 9000')
})