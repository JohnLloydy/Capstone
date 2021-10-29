var roleController  = require('../controllers/rolecontroller');
module.exports = (router, userAuth, checkRole) => {
    router.get('/roles', userAuth, checkRole(["admin"]), roleController.getAll);
    router.get('/roles/:id', userAuth, checkRole(["admin"]), roleController.getById);
    router.post('/roles', userAuth, checkRole(["admin"]), roleController.create);
    router.put('/roles/:id', userAuth, checkRole(["admin"]), roleController.update);
    router.delete('/roles/:id', userAuth, checkRole(["admin"]), roleController.delete);
};
