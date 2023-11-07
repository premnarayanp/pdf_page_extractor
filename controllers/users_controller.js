const User = require('../models/user');
const jwt = require('jsonwebtoken');

//register the User
module.exports.create = async function(req, res) {
    const body = req.body;
    console.log(body);

    if (!body.name || !body.email || !body.password || !body.confirmPassword) {
        return res.json({ success: false, msg: "please fill all fields..", data: null });
    }

    if (body.password != body.confirmPassword) {
        return res.json({ success: false, msg: "Confirm Password Not matched!", data: null });
    }

    try {
        const user = await User.findOne({ email: body.email });
        if (!user) {
            const user = await User.create(body);
            user.password = "XXXXX";
            return res.json({ success: true, msg: " You Successfully Registered", data: { user: user } });
        } else {
            return res.json({ success: false, msg: "User Already Exist", data: null });
        }
    } catch (error) {
        console.log('error in creating user while signing up', error);
        return res.json({ success: false, msg: "Internal Server Error", data: null });
    }
}

// sign in for user
module.exports.createJWTSession = async function(req, res) {
    const body = req.body;
    console.log(body);

    try {
        const user = await User.findOne({ email: body.email });
        if (!user || user.password != body.password) {
            return res.json(422, { success: false, msg: "Invalid Username and Password", data: null });
        } else {
            user.password = "XXXXX";
            return res.json(200, {
                success: true,
                msg: "Successfully SignIn,here is token,Please  keep it safe",
                data: {
                    token: jwt.sign(user.toJSON(), process.env.SECRETE_KEY, { expiresIn: 1000 * 60 * 60 }),
                    user: user
                }
            });
        }
    } catch (error) {
        console.log('error in creating user while signing up', error);
        return res.json(500, { success: false, msg: "Internal Server Error", data: null });
    }


}