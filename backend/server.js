const dotenv = require('dotenv')
const mongoose = require('mongoose')
const express = require('express')
const apiAuth = require('./middleware/apiAuthentication')
const cors = require('cors')

const path = require('path');
dotenv.config()

const usersRouter = require('./routes/user.routes')
const groupRouter = require('./routes/group.routes')
const expenseRouter = require('./routes/expense.routes')
const aiRouter = require('./routes/ai.routes')

const app = express()

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hisab-wise-sumits-projects-3738d068.vercel.app"
  ]
}));
app.use(express.json())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/api/users', usersRouter)
app.use('/api/group', apiAuth.validateToken, groupRouter)
app.use('/api/expense', apiAuth.validateToken, expenseRouter)

app.use('/api/ai', apiAuth.validateToken, aiRouter);


const PORT = process.env.PORT || 3000
app.listen(PORT, (err) => {
    console.log(`Server running on PORT ${PORT}`)
})
