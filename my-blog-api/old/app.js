require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDoc = YAML.load('./swagger.yaml')

const User = require("./model/User")
// const { seedUser } = require("./seed")

const app = express()
app.use(morgan("dev"))
app.use(express.json())

const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }'
  };
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc, swaggerOptions))

app.use((req, _res, next) => {
    req.user = {
        id: 999,
        name: "Majedur Rahman"
    }
    next()
})

app.get("/health", (_req, res) => {
    res.status(200).json({
        health: "OK"
    })
})

let connectionURL = process.env.DB_CONNECTION_URL
connectionURL = connectionURL.replace("<username>", process.env.DB_USERNAME)
connectionURL = connectionURL.replace("<password>", process.env.DB_PASSWORD)
connectionURL = `${connectionURL}/${process.env.DB_NAME}?${process.env.DB_URL_QUERY}`

mongoose.connect(connectionURL, {
    connectTimeoutMS: 1000,
}).then(() => {
    console.log("Database Connected");
    app.listen(4000, async () => {
        console.log("Server is listening on port 4000");
        const users = await User.find()
        console.log(users);
        // seedUser()
    })
}).catch((e) => {
    console.log("Database connection faild!");
    console.log(e.message);
})

