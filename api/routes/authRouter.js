const express = require("express");
const authRouter = express.Router();
const authCtrl = require("../controllers/authCtrl");
const auth = require("../middlewares/auth");

authRouter.post("/auth/check_username", authCtrl.checkUsername);

authRouter.post("/auth/sign_up", authCtrl.signUp);
authRouter.post("/auth/activate_user", authCtrl.activateUser);

authRouter.post("/auth/sign_in", authCtrl.signIn);
authRouter.get("/auth/refresh_token/:id", authCtrl.refreshToken);
authRouter.get("/auth/sign_out/:id", authCtrl.signOut);

// authRouter.post("/auth/sign_in/google", authCtrl.googleSignIn);

authRouter.post("/auth/forgot_password", authCtrl.forgotPassword);
authRouter.post("/auth/reset_password", auth, authCtrl.resetPassword);

module.exports = authRouter;
