const db = require("../models");
const User = db.user;
const Role = db.role;

var bcrypt = require("bcryptjs");

exports.addUser = (req, res) => {
  // console.log(req.body);

  const aadharCard = req.files['aadharCard'] ? req.files['aadharCard'][0] : null;
  const panCard = req.files['panCard'] ? req.files['panCard'][0] : null;

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    reference: req.body.reference,
    aadharCard: aadharCard?.path,
    panCard: panCard?.path,
    phone: req.body.phone,
    email: req.body.email.toLowerCase(),
    password: bcrypt.hashSync(req.body.password, 8),
    // startTime: req.body.startTime,
    // endTime: req.body.endTime,
    // siteLocation: req.body.siteLocation,
    address: req.body.address
  });



  User.find({}).sort({ rowNumber: -1 }).limit(1).then((data) => {
    if (data) {
      // console.log(data, 'data')
      let n = (data[0]?.rowNumber) ? (data[0].rowNumber + 1) : 1984;
      let empId = 'ARKAS' + n;
      user.empId = empId;
      user.rowNumber = n;

      // console.log(user, 'user');

      user.save((err, user) => {
        // console.log(req.body.roles);
        // console.log(typeof req.body.roles, 'type');
        // console.log(typeof JSON.parse(req.body.roles), 'type');
        // console.log(!Array.isArray(req.body.roles), 'type');

        let uRoles = JSON.parse(req.body.roles);

        // console.log(roles.length, 'roles length');
        // console.log(uRoles, 'Assigned ROles');

        if (err) {
          // console.log(err, 'error')
          res.status(500).send({ message: err });
          return;
        }

        if (!Array.isArray(uRoles)) {
          return res.status(400).send({ error: 'Roles should be an array', status: false });
        }

        if (uRoles) {
          Role.find(
            {
              name: { $in: uRoles },
            },
            (err, roles) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              user.roles = roles.map((role) => role._id);
              user.save((err) => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }

                res.send({ message: "User was registered successfully!", status: true });
              });
            }
          );
        } else {
          Role.findOne({ name: "user" }, (err, role) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            user.roles = [role._id];
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              res.send({ message: "User was registered successfully!", status: true });
            });
          });
        }
      })
    }
  })
}


exports.searchSupervisor = async (req, res) => {
  try {
    // console.log(req.query.q);

    const searchQuery = req.query.q;
    const roleId = req.query.role;
    const users = await User.find({
      $or: [
        { firstName: new RegExp(searchQuery, 'i') },   // Search in `name`
        { lastName: new RegExp(searchQuery, 'i') },  // Search in `email`
        { email: new RegExp(searchQuery, 'i') },  // Search in `email`
        // { age: searchQuery }                      // Search in `age` (exact match)
      ],
      roles: { $in: [roleId] },
      deleteStatus: false
    });


    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.searchUser = async (req, res) => {
  try {
    // console.log(req.query.q);

    const searchQuery = req.query.q;
    const roleId = req.query.role;
    const users = await User.find({
      $or: [
        { firstName: new RegExp(searchQuery, 'i') },   // Search in `name`
        { lastName: new RegExp(searchQuery, 'i') },  // Search in `email`
        { email: new RegExp(searchQuery, 'i') },  // Search in `email`
        // { age: searchQuery }                      // Search in `age` (exact match)
      ],
      roles: { $in: [roleId] },
      deleteStatus: false
    });
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
exports.updateUser = async (req, res) => {
  // console.log(req.body);

  const aadharCard = req.files['aadharCard'] ? req.files['aadharCard'][0] : null;
  const panCard = req.files['panCard'] ? req.files['panCard'][0] : null;

  const userId = req.params.id;
  const email = req.body.email.toLowerCase();

  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    reference: req.body.reference,
    aadharCard: aadharCard?.path,
    panCard: panCard?.path,
    phone: req.body.phone,
    roles: JSON.parse(req.body.roles),
    email: req.body.email.toLowerCase(),
    password: bcrypt.hashSync(req.body.password, 8),
    // startTime: req.body.startTime,
    // endTime: req.body.endTime,
    // siteLocation: req.body.siteLocation,
    address: req.body.address
  };

  // console.log(user, 'user to update');
  try {
    // Check if the email exists in another record
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists in another record.' });
    }

    // Update the user record
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: user },
      { new: true }
    );

    // console.log(updatedUser, 'updated user');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User updated successfully.', data: updatedUser });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error.', error });
  }

  /*  User.findByIdAndUpdate({}).sort({ rowNumber: -1 }).limit(1).then((data) => {
     if (data) {
       // console.log(data, 'data')
       let n = (data[0]?.rowNumber) ? (data[0].rowNumber + 1) : 1984;
       let empId = 'ARKAS' + n;
       user.empId = empId;
       user.rowNumber = n;
 
       // console.log(user, 'user');
 
       user.save((err, user) => {
         // console.log(req.body.roles);
         // console.log(typeof req.body.roles, 'type');
         // console.log(typeof JSON.parse(req.body.roles), 'type');
         // console.log(!Array.isArray(req.body.roles), 'type');
 
         let uRoles = JSON.parse(req.body.roles);
 
         // console.log(roles.length, 'roles length');
         // console.log(uRoles, 'Assigned ROles');
 
         if (err) {
           // console.log(err, 'error')
           res.status(500).send({ message: err });
           return;
         }
 
         if (!Array.isArray(uRoles)) {
           return res.status(400).send({ error: 'Roles should be an array' });
         }
 
         if (uRoles) {
           Role.find(
             {
               name: { $in: uRoles },
             },
             (err, roles) => {
               if (err) {
                 res.status(500).send({ message: err });
                 return;
               }
 
               user.roles = roles.map((role) => role._id);
               user.save((err) => {
                 if (err) {
                   res.status(500).send({ message: err });
                   return;
                 }
 
                 res.send({ message: "User was registered successfully!" });
               });
             }
           );
         } else {
           Role.findOne({ name: "user" }, (err, role) => {
             if (err) {
               res.status(500).send({ message: err });
               return;
             }
 
             user.roles = [role._id];
             user.save((err) => {
               if (err) {
                 res.status(500).send({ message: err });
                 return;
               }
 
               res.send({ message: "User was registered successfully!" });
             });
           });
         }
       })
     }
   }) */
}

exports.allUsers = async (req, res) => {
  try {
    const sOrder = (req.query.sortOrder == 'asc') ? 1 : -1;

    const pageNumber = parseInt(req.query.pageIndex) || 0;
    const limit = parseInt(req.query.pageSize) || 10;
    const sortby = parseInt(req.query.sortBy) || '_id';
    const sortOrder = parseInt(sOrder) || '-1'; // Descending order
    const result = {};
    const total = await User.countDocuments().where({ deleteStatus: false }).exec();
    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;
    result.totalCount = total;
    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }
    if (endIndex < (await User.countDocuments().exec())) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }
    result.data = await User.find()
      .sort({ [sortby]: sortOrder })
      .skip(startIndex)
      .limit(limit)
      .where({ deleteStatus: false })
      .exec();
    result.rowsPerPage = limit;
    return res.json({ message: "Users Fetched successfully", data: result });
  } catch (error) {
    return res.status(500).json({ message: "Sorry, something went wrong" });
  }
};

exports.deleteUser = (req, res) => {
  try {
    // console.log(req.params);
    /* var myquery = { _id: req.params.id };
    var newValues = { $set: { deleteStatus: true } };
    User.updateOne(myquery, newValues, function (err, res) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    }); */

    User.findByIdAndUpdate(
      { _id: req.params.id }, // query
      {
        $set: {
          "deleteStatus": true,
          "updatedOn": new Date()
        }
      }, // replacement
      function (err, object) {
        if (err) {
          return res.status(404).send({ message: "User Not found." });
        } else {
          return res.status(200).send({ message: "User deleted successfully", data: true });
        }
      });

    // return res.json({ msg: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Sorry, something went wrong" });
  }
};


exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.supervisorBoard = (req, res) => {
  res.status(200).send("Supervisor Content.");
};
