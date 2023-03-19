const Sequelize = require("sequelize");
const db = require("../expressconfig/database");
const bcrypt = require("bcrypt");
const Role = require("../models/role");

const User = db.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "PENDING",
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mobileno: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    roleid: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    photo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    provider: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    otp: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    otpexpiry: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    middlename: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    birthdate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    civilstatus: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    region_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    province_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    municipality_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    barangay_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    street: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: async function (user) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async function (user) {
        if (user._previousDataValues.password === user.password) return;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.belongsTo(Role, {
  foreignKey: "roleid",
  sourceKey: "id",
});

module.exports = User;
