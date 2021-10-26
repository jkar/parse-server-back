const userRouter = require('express').Router();

userRouter.post('/signup', async (req, res) => {
    try {
        const user = new Parse.User();
        user.set("username", req.body.username);
        user.set("password", req.body.password);
        user.set("email", req.body.email);
        const reultSignup = await user.signUp();
        return res.send(reultSignup);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const user = await Parse.User.logIn(req.body.username , req.body.password);
        console.log('u', Parse.User.current());
        return res.send(user);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

userRouter.post('/logout', async (req, res) => {
    try {
        const user = await Parse.User.logOut();
        return res.send(user);
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

module.exports = userRouter;