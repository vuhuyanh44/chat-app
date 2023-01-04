const User = require('../model/User');

class UserController {
    async addUser(req, res) {
        const testData = {
            username: "myname_v2",
            name: "Quang",
            password: "12345",
            friends: ["Quna", "Yepp"]
        }
        const newUser = new User(testData);
        try {
            let savedUser = await newUser.save();
            res.json(savedUser);
        } catch (err) {
            console.log(err);
        }
    }

    async getUserInfomation(req, res) {
        const id = req.params.id; // id
        try {
            const userInfomation = await User.findById(id); //tim trong data base
            res.json(userInfomation); // tra ve info
        } catch (err) {
            console.log(err);
        }
    }
    async updateUserInfomation(req, res) {
        const id = req.params.id;
        try {
            const filter = { _id: id };
            const update = req.body;
            const userInfomation = await User.findByIdAndUpdate(id, update);
            res.json(userInfomation);
        } catch (err) {
            console.log(err);
        }
    }

    async getFriends(req, res) {
        const id = req.params.id;


        try {
            const userInfomation = await User.findById(id);
            console.log(userInfomation)
            const friends = await Promise.all(
                userInfomation.friends.map(friendId => {
                    return User.findById(friendId);
                })
            )
            const friendsList = [];
            friends.map((friend) => {
                let temp = {
                    id: friend._id,
                    name: friend.name,
                    username: friend.username
                };
                friendsList.push(temp)
            });
            res.json(friendsList);
        } catch (err) {
            console.log(err);
        }
    }

    async addFriend(req, res) {
        const userId = req.params.id;

    }

    async delelteFriend(req, res) {

    }
    async getUserByUsername(req, res) {
        const username = req.params.username;
        try {
            const userInfomation = await User.findOne({ username: username }); //tim trong data base
            res.json(userInfomation); // tra ve info
        } catch (err) {
            console.log(err);
        }
    }

    async getFriendsSuggestion(req, res) {
        const id = req.params.id; // id
        try {
            const userInfomation = await User.findById(id); //tim trong data base
            const friendsSuggestion = await User.find({ _id: { $nin: userInfomation.friends }, _id: { $ne: id } });
            res.json(friendsSuggestion); // tra ve info
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new UserController;