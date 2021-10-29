class CRUDController {
    constructor(model) {
        this.model = model;
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    getAll = async (req, res) => {
        try {
            const items = await this.model.findAll({
                include: req.query.include? JSON.parse(req.query.include) : null,
                where: req.query.filter? JSON.parse(req.query.filter) : null,
                order: req.query.order? JSON.parse(req.query.order) : null
            });
            return res.status(200).json(items);
        } catch (error) {
            return res.status(500).send(error.message);
        }
    };
    getById = async (req, res) => {
        try {
            const {
                id
            } = req.params;
            const item = await this.model.findOne({
                where: {
                    id: id
                },
            });
            if (item) {
                return res.status(200).json(item);
            }
            return res.status(404).send("ID does not exists");
        } catch (error) {
            return res.status(500).send(error.message);
        }
    };
    create = async (req, res) => {
        try {
            const item = await this.model.create(req.body);
            return res.status(201).json(item);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    };
    update = async (req, res) => {
        try {
            const {
                id
            } = req.params;
            const [updated] = await this.model.update(req.body, {
                where: {
                    id: id
                }
            });
            if (updated) {
                const updateditem = await this.model.findOne({
                    where: {
                        id: id
                    }
                });
                return res.status(200).json(updateditem);
            }
            throw new Error('Item not found');
        } catch (error) {
            return res.status(500).send(error.message);
        }
    };
    
    delete = async (req, res) => {
        try {
            const {
                id
            } = req.params;
            const deleted = await this.model.destroy({
                where: {
                    id: id
                }
            });
            if (deleted) {
                return res.status(204).send("Item deleted");
            }
            throw new Error("Item not found");
        } catch (error) {
            return res.status(500).send(error.message);
        }
    };

}

module.exports  = CRUDController;

