const User = require('../model/User');


const signup_post = async(req, res) => {
    const username = req.body.username;
    console.log(req.body);
    // User.findOne({ username: username })
    //     .then((oneuser) => {
    //         if (oneuser !== null) {
    //             res.json({ status: 'this username has already taken' })
    //         } else {
    //             console.log(req.body);
    //             const newUser = new User(req.body);
    //             newUser.save()
    //                 .then(() => res.json({ status: 'success sign up' }))
    //                 .catch((err) => console.log(err))
    //         }
    //     })
    //     .catch(err => console.log(err));

    try {
        const user = await User.findOne({ username: username });
        if (user !== null) {
            res.json({ status: 'this username has already taken' })
        } else {
            console.log(req.body);
            const newUser = new User(req.body);
            newUser.save()
                .then(() => res.json({ status: 'success sign up' }))
                .catch((err) => console.log(err))
        }
    } catch (err) {
        console.log(err);
    }

}

const login_post = async(req, res) => {
    const username = req.body.username;

    // User.findOne({ username: username })
    //     .then((oneuser) => {
    //         if (oneuser !== null) {
    //             if (oneuser.password !== req.body.password) {
    //                 res.json({ status: 'wrong password' })
    //             } else {
    //                 res.json({ username: req.body.username })
    //             }
    //         } else {
    //             res.json({ status: 'dont have this account' })
    //         }
    //     })
    //     .catch(err => console.log(err));

    try {
        const user = await User.findOne({ username: username });
        if (user !== null) {
            if (user.password !== req.body.password) {
                res.json({ status: 'wrong password' })
            } else {
                res.json(user);
            }
        } else {
            res.json({ status: 'dont have this account' })
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    signup_post,
    login_post
}