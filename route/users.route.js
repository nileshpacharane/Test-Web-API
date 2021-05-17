const express = require('express');
const User = require('../modal/users.modal');
const multer = require('../middleware/multer-config');
const fs = require('fs');
const router = express.Router();

var createUser = function (req, res, next) {
  req.body.user = JSON.parse(req.body.user);
  const url = req.protocol + '://' + req.get('host');
  const user = new User({
    firstname: req.body.user.firstname,
    lastname: req.body.user.lastname,
    phonenumber: req.body.user.phonenumber,
    email: req.body.user.email,
    imageUrl: url + '/images/' + req.file.filename
  });

  user.save().then(() => {
    res.status(200).json({
      status: 200,
      message: "User created successfully"
    })
  }).catch(err => {
    res.status(500).json({
      error: err
    })
  })

}

var getUser = function (req, res, next) {
  User.find().then(users => {
    res.status(200).json(users);
  }).catch((err) => {
    res.status(500).json({
      error: err
    });
  })
}

var getUserById = function (req, res, next) {
  User.findOne({
    _id: req.params.id
  }).then(users => {
    res.status(200).json(users);
  }).catch((err) => {
    res.status(500).json({
      error: err
    });
  })
}

var deleteUser = function (req, res, next) {
  User.findOne({
    _id: req.params.id
  }).then(
    (user) => {
      const filename = user.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        User.deleteOne({
          _id: req.params.id
        }).then(
          () => {
            res.status(200).json({
              message: 'User deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      });
    }
  );
}

var updateUser = function (req, res, next) {
  let user = new User({
    _id: req.params.id
  });
  if (req.file) {
    req.body.user = JSON.parse(req.body.user);
    const url = req.protocol + '://' + req.get('host');
    user = {
      _id: req.params.id,
      firstname: req.body.user.firstname,
      lastname: req.body.user.lastname,
      phonenumber: req.body.user.phonenumber,
      email: req.body.user.email,
      imageUrl: url + '/images/' + req.file.filename,
    };
  } else {
    user = {
      _id: req.params.id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      imageUrl: req.body.image,
    };
  }
  User.updateOne({
    _id: req.params.id
  }, user).then(
    () => {
      res.status(201).json({
        message: 'User updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
}

router.get('/getUser', getUser);
router.get('/getUser/:id', getUserById);
router.post('/create', multer, createUser);
router.put('/update/:id', multer, updateUser);
router.delete('/delete/:id', deleteUser);

module.exports = router;
