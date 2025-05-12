require("dotenv").config();

const express = require("express");
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { ExpressPeerServer } = require('peer')

const database = require("./utils/database");
const socket = require('./socket')

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use('/api', require("./routes"))
database();

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
io.on('connection', s => {socket(s)})
ExpressPeerServer(server, { path: '/' })

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);

});
