var userController  = require('../controllers/usercontroller');
var passport	    = require('passport');
 module.exports = (router, userAuth, checkRole) => {
    router.post('/register', userController.registerUser);
    router.post('/login', userController.loginUser);
    router.get('/resetpassword', userController.resetPassword);
    router.post('/validateotp', userController.validateOTP);
    router.post('/changepassword', userController.changepassword);
    router.get('/userprofile/:id', userAuth, checkRole(["admin","user"]), userController.getuserprofilebyid);
    // router.get('/special', userAuth, checkRole(["admin", "user"]), (req, res) => {
    //     return res.json({ msg: `Hey ${req.user.email}! I open at the close.` });
    // });

    //users
    router.get('/users', userAuth, checkRole(["admin"]), userController.getAll);
    router.get('/users/:id', userAuth, checkRole(["admin"]), userController.getById);
    router.post('/users', userAuth, checkRole(["admin"]), userController.create);
    router.put('/users/:id', userAuth, checkRole(["admin","user"]), userController.update);
    router.delete('/users/:id', userAuth, checkRole(["admin"]), userController.delete);

    router.get('/login/google', passport.authenticate('google', { scope: ['profile','email'] }));

    router.get('/logout', (req, res, next) => { req.logout(); });

    router.get("/return", passport.authenticate("google"), (req, res, next) => {
      return res.status(200).json({
        token: userController.createToken(req.user),
      });
    });
}