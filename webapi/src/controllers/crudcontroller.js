const sequelize = require("sequelize");
const queryParser = require("./queryparser")(sequelize);
const Sequelize = require("sequelize");
class CRUDController {
    constructor(model) {
      this.model = model;
      this.getoptionlist = this.getoptionlist.bind(this);
      this.getAll = this.getAll.bind(this);
      this.getById = this.getById.bind(this);
      this.create = this.create.bind(this);
      this.update = this.update.bind(this);
      this.delete = this.delete.bind(this);
    }
  
    getoptionlist = async (req, res) => {
      try {
        const { filter, order, column } = req.query;
        this.model
          .findAll({
            where: filter ? JSON.parse(filter) : null,
            order: order ? JSON.parse(order) : null,
            attributes: [
              // specify an array where the first element is the SQL function and the second is the alias
              [
                Sequelize.fn("DISTINCT", Sequelize.col(column)),
                column,
              ],
  
              // specify any additional columns, e.g. country_code
              // 'country_code'
            ],
          })
          .then((data) => {
  
            return res.status(200).json(data);
  
          });
      } catch (error) {
        return res.status(500).send(error.message);
      }
    };
  
    getAll = async (req, res) => {
      try {
        const { include, filter, order, page } = req.query;
        let pagination = null;
        if (page) {
          pagination = this.getPagination(
            JSON.parse(page).offset,
            JSON.parse(page).limit
          );
        }
        let parsedfilter = filter;
        if (filter) {
          parsedfilter = JSON.parse(filter);
          if (parsedfilter.query) {
            parsedfilter = await queryParser.parse(parsedfilter.query);
          }
        }
        this.model
          .findAndCountAll({
            include: include ? JSON.parse(include) : null,
            where: filter ? parsedfilter : null,
            order: order ? JSON.parse(order) : null,
            limit: pagination ? pagination.limit : null,
            offset: pagination ? pagination.offset : null,
          })
          .then((data) => {
            const response = this.getPagingData(
              data,
              pagination ? pagination.offset : null,
              pagination ? pagination.limit : null,
              pagination ? JSON.parse(page).offset : 0
            );
            return res.status(200).json(response);
          }).catch(function (error) {
            return res.status(500).send(error.message);
          });
      } catch (error) {
        return res.status(500).send(error.message);
      }
    };
    getPagination = (page, size) => {
      const limit = size ? +size : 3;
      const offset = page ? page * limit : 0;
  
      return { limit, offset };
    };
  
    getPagingData = (data, page, limit, offset) => {
      const { count, rows } = data;
      const currentpage = page ? +page : 0;
      const totalpages = Math.ceil(count / limit);
      const retval = {
        rows,
        page: {
          count: count,
          totalpages: totalpages,
          currentpage: currentpage,
          limit: limit,
          offset: offset,
        },
      };
      return retval;
    };
    getById = async (req, res) => {
      try {
        const { id } = req.params;
        const item = await this.model.findOne({
          where: {
            id: id,
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
          error: error.message,
        });
      }
    };
    update = async (req, res) => {
      try {
        const { id } = req.params;
        const [updated] = await this.model.update(req.body, {
          where: {
            id: id,
          },
        });
        if (updated) {
          const updateditem = await this.model.findOne({
            where: {
              id: id,
            },
          });
          return res.status(200).json(updateditem);
        }
        throw new Error("Item not found");
      } catch (error) {
        return res.status(500).send(error.message);
      }
    };
  
    delete = async (req, res) => {
      try {
        const { id } = req.params;
        const deleted = await this.model.destroy({
          where: {
            id: id,
          },
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

