var CRUDController = require('../controllers/crudcontroller');
const Role = require("../../models/role");
class RolesController extends CRUDController {
  constructor(model) {
    super(model);
  }

  index = async (req, res) => {
    return res.json({
      msg: "Hello World"
    })
  }

}

module.exports = new RolesController(Role);