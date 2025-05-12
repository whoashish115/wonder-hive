const authRouter = require("./authRouter")
const userRouter = require("./userRouter")
const notifyRouter = require("./notifyRouter")
const conversationRouter = require("./conversationRouter")
const postGlimpseRouter = require("./postGlimpseRouter")
const highlightRouter = require("./highlightRouter")
const messageRouter = require("./messageRouter")
const commentRouter = require("./commentRouter")
const storyRouter = require("./storyRouter")
const testRouter = require("./testRouter")

const routes = [
  testRouter,
  authRouter,
  userRouter,
  notifyRouter,
  highlightRouter,
  conversationRouter,
  postGlimpseRouter,
  messageRouter,
  commentRouter,
  storyRouter
]

module.exports = routes