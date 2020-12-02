const db = require("../models");
const Op = db.Sequelize.Op;
const User = db.user;
const Role = db.role;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.update = (req, response) => {
  const id = req.params.id;
  if (req.userId != id) {
    response.send({
      message: 'Unautorizhed with your account!'
    });
  } else {
    User.update(req.body, {
      where: { id: id }
    }).then(num => {
      console.log(num)
      if (num == 1) {
        response.send({
          message: "Account was updated successfully."
        });
      } else {
        response.send({
          message: `Cannot update Account with id = ${id}. Maybe Account was not found or req.body is empty!`
        });
      }
    }).catch(err => {
      response.status(500).send({
        message: "Error updating Account with id= " + id
      });
    });
  }
};

exports.findAllRole = (req, response) => {
  User.findAll({ include: [{ model: Role, required: true, where: { 'id': req.params.id } }] })
    .then(user => {
      if (user)
        response.send(user)
    }).catch(err => {
      response.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    })
};

exports.findContain = (req, res) => {
  const username = req.query.username;
  const condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
  User.findAll({ attributes: ['username', 'email'], where: condition })
    .then(user => {
      if (!user) {
        res.send({ message: "No one show!" })
      } else if (condition == null) {
        res.send({ message: "Fill the username that you want to search!" })
      }
      res.send(user);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    });
};

exports.destroy = (req, res) => {
  const id = req.params.id;
  User.destroy({ where: { id: id } }).then(num => {
    if (num == 1) {
      res.send({ message: "Account successfully deleted!" });
    } else {
      res.send({ message: "Cannot delete this account with id = " + id + " .Maybe account was not found" });
    }
  }).catch(err => {
    res.status(500).send({ message: "Couldnt delete account with id = " + id });
  })
}