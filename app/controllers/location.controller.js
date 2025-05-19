const db = require("../models");

const Location = db.location;
const User = db.user;

exports.allLocations = async (req, res) => {
    // console.log(req.body, 'req.body');
    try {
        // Join users with their orders
        const result = await Location.aggregate([
            {
                $match: {
                    deleteStatus: false  // Additional condition: city must be 'Hyderabad'
                }
            },
            {
                $sort: { _id: parseInt(-1) } // Dynamically sort by the specified field and order
            },
            {
                $lookup: {
                    from: 'users',           // Name of the orders collection
                    localField: 'supervisor',        // Field in the users collection
                    foreignField: '_id',   // Field in the orders collection
                    as: 'userInfo',
                },
            },
            {
                $lookup: {
                    from: 'users',           // Name of the orders collection
                    localField: 'employees',        // Field in the users collection
                    foreignField: '_id',   // Field in the orders collection
                    as: 'employeesList',
                },
            }
        ]);

        // console.log('Joined Results:', result);
        res.json(result);

        // const data = await Location.find(); // Fetch all documents
        // // console.log('Results:', data);
        // res.json(data);
    } catch (error) {
        // console.log(error);
        return res.status(500).send({ message: error });
        // return res.send(500, 'Something Went wrong with Retrieving data');
    }

    /* try {
        Location.find({}, function (err, data) {
            if (err) {
                return res.send(500, 'Something Went wrong with Retrieving data');
            } else {

                // const result = Location.aggregate([
                //     {
                //         $lookup: {
                //             from: 'users',           // Name of the orders collection
                //             localField: '_id',        // Field in the users collection
                //             foreignField: 'supervisor',   // Field in the orders collection
                //             as: 'userInfo',         // Alias for the joined results
                //         },
                //     },
                // ])

                console.log(data);
                res.json(data);
            }
        });
    } catch (error) {
        return res.send(500, 'Something Went wrong with Retrieving data');
    } */
};

exports.addLocation = (req, res) => {
    console.log(req.body.employees);
    console.log(typeof req.body.employees);

    const location = new Location({
        location: req.body.location,
        supervisor: req.body.supervisor,
        phone: req.body.phone,
        address: req.body.address,
        siteName: req.body.siteName,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        employees: req.body.employees,
        createdOn: new Date(),
        updatedOn: new Date()
    });

    location.save((err, location) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send({ message: "Location was registered successfully!", status: true });
    });
};


exports.updateLocation = async (req, res) => {
    console.log(req.body);
    const locId = req.params.id;
    console.log(locId);

    const location = {
        location: req.body.location,
        supervisor: req.body.supervisor,
        phone: req.body.phone,
        address: req.body.address,
        siteName: req.body.siteName,
        employees: req.body.employees,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        updatedOn: new Date()
    };

    // console.log(user, 'user to update');
    try {
        // Check if the email exists in another record
        // const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        // if (existingUser) {
        //   return res.status(400).json({ message: 'Email already exists in another record.' });
        // }

        // Update the user record
        const updatedLocation = await Location.findByIdAndUpdate(
            locId,
            { $set: location },
            { new: true }
        );

        // console.log(updatedLocation, 'updated user');
        if (!updatedLocation) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'Location updated successfully.', data: updatedLocation });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
}



exports.deleteLocation = (req, res) => {
    try {
        console.log(req.params);
        Location.findByIdAndUpdate(
            { _id: req.params.id }, // query
            {
                $set: {
                    "deleteStatus": true,
                    "updatedOn": new Date()
                }
            }, // replacement
            function (err, object) {
                if (err) {
                    return res.status(404).send({ message: "Location Not found." });
                } else {
                    return res.status(200).send({ message: "Location deleted successfully", data: true });
                }
            });

        // return res.json({ msg: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Sorry, something went wrong" });
    }
};