const db = require("../models");
const Role = db.role;


exports.allRoles = (req, res) => {
    Role.find({}, function (err, data) {
        if (err) {
            return res.send(500, 'Something Went wrong with Retrieving data');
        } else {
            res.json(data);
        }
    });
};