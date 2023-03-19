require("dotenv").config();

var CRUDController = require("../controllers/crudcontroller");
const sequelize = require("sequelize");
var User = require("../models/user");
var Role = require("../models/role");

var jwt = require("jsonwebtoken");
const otpGen = require("otp-generator");
const moment = require("moment");
// var config = require('../config/config');
// var db = require('../config/database');
// var bcrypt = require('bcrypt');
const { NodeSSH } = require("node-ssh");
const ssh = new NodeSSH();
var request = require('request');

//google secrets
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } = process.env;
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client({
  clientId: GOOGLE_CLIENT_ID,
});

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  if (payload) {
    return payload;
  }
  return null;
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    global.gConfig.jwtSecret,
    {
      expiresIn: 86400, // 86400 expires in 24 hours
    }
  );
}
class UserController extends CRUDController {
  constructor(model) {
    super(model);
  }

  getuserprofilebyid = async (req, res) => {
    try {
      const { id } = req.params;
      const item = await this.model.findOne({
        where: {
          id: id,
        },
        attributes: [
          "lastname",
          "firstname",
          "middlename",
          "birthdate",
          "gender",
          "civilstatus",
          "region_code",
          "province_code",
          "municipality_code",
          "barangay_code",
          "street",
        ],
      });
      if (item) {
        return res.status(200).json(item);
      }
      return res.status(404).send("ID does not exists");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await this.model.update(req.body, {
        where: {
          id: id,
        },
        individualHooks: true,
      });
      if (updated) {
        const updateditem = await this.model.findOne({
          where: {
            id: id,
          },
          attributes: [
            "lastname",
            "firstname",
            "middlename",
            "birthdate",
            "gender",
            "civilstatus",
            "region_code",
            "province_code",
            "municipality_code",
            "barangay_code",
            "street",
          ],
        });
        return res.status(200).json(updateditem);
      }
      throw new Error("Item not found");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };

  loginUser = async (req, res) => {
    if (req.body.provider === "google") {
      const resx = await verify(req.body.authentication.idToken);
      if (!resx) {
        return res.status(400).json({
          msg: "Failed to login with google.",
        });
      }

      //mysql
      User.findOne({
        include: [
          {
            model: Role,
            require: true,
          },
        ],
        where: {
          email: resx.email,
        },
      })
        .then(async function (user) {
          return res.status(200).json({
            token: createToken(user),
          });
        })
        .catch((err) => {
          return res.status(400).json({
            msg: "The user does not exist",
          });
        });
    } else {
      if (!req.body.email || !req.body.password) {
        return res.status(400).send({
          msg: "You need to send email and password.",
        });
      }

      //mysql
      User.findOne({
        include: [
          {
            model: Role,
            require: true,
          },
        ],
        where: {
          email: req.body.email,
        },
      })
        .then(async function (user) {
          if (!(await user.validPassword(req.body.password))) {
            return res.status(400).json({
              msg: "The email and password don't match.",
            });
          } else {
            return res.status(200).json({
              token: createToken(user),
            });
          }
        })
        .catch((err) => {
          return res.status(400).json({
            msg: "The user does not exist",
          });
        });
    }
  };

  registerUser = async (req, res) => {
    if (req.body.provider === "google") {
      const resx = await verify(req.body.authentication.idToken);

      if (!resx) {
        return res.status(400).json({
          msg: "Failed to login with google.",
        });
      }
      console.log(resx);
      User.findOne({
        include: [
          {
            model: Role,
            require: true,
          },
        ],
        where: {
          email: resx.email,
        },
      }).then((currentUser) => {
        if (currentUser) {
          //if we already have a record with the given profile ID
          return res.status(400).json({
            msg: "User Already Exist.",
          });
        } else {
          //if not, create a new user
          new User({
            name: resx.name,
            mobileno: 0,
            email: resx.email,
            password: req.body.id,
            photo: resx.picture,
            roleid: 2,
            provider: req.body.provider,
          })
            .save()
            .then((newUser) => {
              return res.status(201).json(newUser);
            });
        }
      });
    } else {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({
          msg: "You need to send mobileno and password",
        });
      }

      //mysql
      User.findOne({
        where: {
          email: req.body.email,
        },
      })
        .then((user) => {
          if (user) {
            return res.status(400).json({
              msg: "The user already exists",
            });
          }

          req.body.roleid = 2;
          User.create(req.body)
            .then((newuser) => {
              return res.status(201).json(newuser);
            })
            .catch((err) => {
              return res.status(400).json({
                msg: err,
              });
            });
        })
        .catch((err) => {
          return res.status(400).json({
            msg: err,
          });
        });
    }
  };

  createToken = (user) => {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      global.gConfig.jwtSecret,
      {
        expiresIn: 86400, // 86400 expires in 24 hours
      }
    );
  };

  resetPassword = async (req, res) => {
    try {
      const { email } = req.query;
      let curdate = new Date();

      let otpobj = {
        otp: otpGen.generate(6, { alphabets: false, specialChars: false }),
        otpexpiry: moment(curdate).add(30, "m").toDate(),
      };

      // const user = await this.model.findOne({
      //   where: {
      //     mobileno: mobileno,
      //     otpexpiry: {
      //       [sequelize.Op.gte]: curdate,
      //     },
      //   },
      // });

      // if (user) {
      //   return res.status(200).json("An OTP already exist.");
      // }

      const [updated] = await this.model.update(otpobj, {
        where: {
          email: email,
        },
      });

      if (updated) {
        const message =
          "FROM:staysafe.depedbukidnon.net.ph. Your OTP is " +
          otpobj.otp +
          ". This will expire on " +
          moment(otpobj.otpexpiry).format("YYYY-DD-MM HH:mm:ss");
        const usermobile = "+63" + mobileno.substring(1);

        const data = {
          message: message,
          mobileno: usermobile,
        };

        request.post(
          {
            url: "https://panganud.bukidnon.gov.ph/api/smsgateway/sendsms",
            json: data,
          },
          function (error, response, body) {
            if (!error && response.statusCode == 200) {
              console.log(body);
            }
          }
        );

        return res.status(200).json("OTP request sent.");
      }
      throw new Error("User not found");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };

  validateOTP = async (req, res) => {
    try {
      const { otp } = req.body;
      let curdate = new Date();

      const user = await this.model.findOne({
        where: {
          otp: otp,
          otpexpiry: {
            [sequelize.Op.gte]: curdate,
          },
        },
      });

      if (!user) {
        throw new Error("Code is invalid or expired.");
      }

      return res.status(200).json("OTP is valid.");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };

  changepassword = async (req, res) => {
    try {
      const { otp } = req.body;
      console.log(req.body);
      let curdate = new Date();

      const user = await this.model.findOne({
        where: {
          otp: otp,
          otpexpiry: {
            [sequelize.Op.gte]: curdate,
          },
        },
      });

      if (!user) {
        throw new Error("Code is invalid or expired.");
      }

      req.body.otp = null;
      req.body.otpexpiry = null;

      const [updated] = await this.model.update(req.body, {
        where: {
          otp: otp,
        },
        individualHooks: true,
      });
      if (updated) {
        const updateditem = await this.model.findOne({
          attribute: ["mobileno"],
          where: {
            id: user.id,
          },
        });
        return res.status(200).json(updateditem);
      }
      throw new Error("Item not found");
    } catch (error) {
      return res.status(500).send(error.message);
    }
  };
}

module.exports = new UserController(User);
