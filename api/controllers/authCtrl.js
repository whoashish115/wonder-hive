const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const mail = require("../utils/mail");
const validateEmail = require("../utils/validate");
const {
    generateActivationToken,
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/modules");


const { CLIENT_URL } = process.env;

const authCtrl = {

    checkUsername: async (req, res) => {
        try {
            const { username } = req.body;
            let newUsername = username.toLowerCase().replace(/ /g, "");

            const usernameCheck = await Users.findOne({ username: newUsername });
            if (usernameCheck)
                return res.status(400).json({ error: "username unavailable" });

            return res.json({ message: "username available" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },


    signUp: async (req, res) => {
        try {
            const { fullname, username, email, password } = req.body;
            let newUsername = username.toLowerCase().replace(/ /g, "");

            const usernameCheck = await Users.findOne({ username: newUsername });
            if (usernameCheck) return res.status(400).json({ error: "this username already exists" });
            if (!validateEmail(email)) return res.status(400).json({ error: "please add a valid email address" });

            const emailCheck = await Users.findOne({ email });
            if (emailCheck) return res.status(400).json({ error: "this email already exists" });
            if (password.length < 6) return res.status(400).json({ error: "password must have atleast 6 characters" });

            const hashPassword = await bcrypt.hash(password, 12);

            const newUser = { fullname, username: newUsername, email, password: hashPassword };
            const activation_token = generateActivationToken(newUser);

            const url = `${CLIENT_URL}/auth/user/activate/${activation_token}`;
            mail(
                email,
                "Account Activation",
                "Activate Your Account To ",
                `${url}`
                // verificationEmailContent(fullname, url)
            );
            return res.json({ message: "registration successful! please activate your account to start" });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    activateUser: async (req, res) => {
        try {

            const { activation_token } = req.body;

            jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET, async function (err, decoded) {
                if (error) return res.status(400).json({ error: "the link is expired, register again to get a new link" });
                else {
                    const { fullname, username, email, password } = decoded;

                    const emailCheck = await Users.findOne({ email });
                    if (emailCheck) return res.status(400).json({ error: "the email is already registered with another account, register again with a new email" });

                    const usernameCheck = await Users.findOne({ username });
                    if (usernameCheck) return res.status(400).json({ error: "the username is already registered with another account, register again with a new username" });

                    const newUser = new Users({ fullname, username, email, password });
                    await newUser.save();

                    return res.json({ message: "account has been activated" });
                }
            });

        } catch (error) {
            return res.status(500).json({ error: "the link is expired, register again to get a new link" });
        }
    },

    signIn: async (req, res) => {
        try {
            const { emailUsername, password } = req.body;

            const user = await Users.findOne({ $or:[{email:emailUsername}, {username:emailUsername}] }).populate({ path: "followings followers requests", select: "-password", })

            if (!user) return res.status(400).json({ error: "the account with this email/username does not exists" });

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) return res.status(400).json({ error: "email/username or password is incorrect" });

            const access_token = generateAccessToken({ id: user._id });
            const refresh_token = generateRefreshToken({ id: user._id });

            res.cookie(`account_${user._id}`, refresh_token, {
                httpOnly: true,
                path: "/api/auth/refresh_token",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return res.json({
                message: "sign in successful",
                access_token,
                user: {
                    ...user._doc,
                    password: "",
                },
            });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    refreshToken: async (req, res) => {
        try {
            const refresh_token = req.cookies[`account_${req.params.id}`];
            if (!refresh_token) return res.status(400).json({ error: "something went wrong while logging in, please sign in again" });

            return jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET,
                async (error, result) => {
                    if (error) return res.status(400).json({ error: "please sign in now" });

                    const user = await Users.findById(result.id).select('-password').populate({ path: "followings followers requests", select: "-password", })
                    if (!user) return res.status(400).json({ error: "please sign in now" });

                    const access_token = generateAccessToken({ id: result.id });
                    return res.json({ access_token, user });
                }
            );

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    signOut: async (req, res) => {
        try {
            res.clearCookie(`account_${req.query.id}`, { path: "/api/refresh_token" });
            return res.json({ message: "signed out!" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },


    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;

            const user = await Users.findOne({  $or: [ { email }, { username: email } ] });
            if (!user) return res.status(400).json({ error: "The account with this email does not exists" });

            const access_token = generateAccessToken({ id: user._id });
            const url = `${CLIENT_URL}/auth/resetpassword/${access_token}`;
            mail(
                user.email,
                "Password Reset",
                "Reset Your Password to sign in",
                url
            );

            return res.json({ message: "Please check your email to reset you account password" });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { password } = req.body;
            if (!password)
                return res.status(500).json({ error: "Please add new password for reset" });

            const passwordHash = await bcrypt.hash(password, 12);

            await Users.findOneAndUpdate(
                { _id: req.user.id },
                {
                    password: passwordHash,
                }
            );

            return res.json({ message: "Password successfully reseted" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },


    googleSignIn: async (req, res) => {
        try {
            const { tokenId } = req.body;

            const verify = await client.verifyIdToken({
                idToken: tokenId,
                audience: process.env.MAILING_SERVICE_CLIENT_ID,
            });

            const { email_verified, email, name, picture } = verify.payload;

            const password = email + process.env.GOOGLE_SECRET;

            const passwordHash = await bcrypt.hash(password, 12);

            if (!email_verified)
                return res.status(400).json({ error: "email verification failed." });

            const user = await Users.findOne({ email })
                .select("-password")

            if (user) {
                const access_token = generateAccessToken({ id: user._id });
                const refresh_token = generateRefreshToken({ id: user._id });

                res.cookie("refreshtoken", refresh_token, {
                    httpOnly: true,
                    path: "/api/refresh_token",
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milisecond
                });

                res.json({
                    message: "sign in successful!",
                    access_token,
                    user: {
                        ...user._doc,
                        password: "",
                    },
                });

            } else {

                var new_username = rug.generate();
                const newUser = new Users({
                    username: new_username,
                    fullname: name,
                    email,
                    password: passwordHash,
                    profileImage: picture,
                });
                await newUser.save();

                const populatedUser = await Users.findOne({ _id: newUser._id })

                const access_token = generateAccessToken({ id: populatedUser._id });
                const refresh_token = generateRefreshToken({ id: populatedUser._id });

                res.cookie("refreshtoken", refresh_token, {
                    httpOnly: true,
                    path: "/api/refresh_token",
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milisecond
                });

                res.json({
                    message: "sign in successful!",
                    access_token,
                    user: {
                        ...populatedUser._doc,
                        password: "",
                    },
                });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    facebookSignIn: async (req, res) => {
        try {
            res.json({ message: "sign in successful" })
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};


module.exports = authCtrl;
