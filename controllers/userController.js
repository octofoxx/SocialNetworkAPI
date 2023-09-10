const { User, Thought } = require('../models');

const UserController = {
    // gets all users
    async getUsers(req, res) {
        try {
            const users = await User.find({})
                .select('-__v');
            res.json(users);
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);
        }
    },
    // get a single user with thoughts and friends
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userid })
                .populate({ path: 'thoughts', select: '-__v' })
                .populate({ path: 'friends', select: '-__v' });

            if (!user) {
                return res.status(404).json({ message: 'That user does not exist' });
            }

            res.json(user);
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);

        }
    },
    // create a user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body)
            res.json(user);
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);
        }
    },
    // update a user by id
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userid },
                { $set: req.body },
                { runValidators: true, new: true }
            )

            if (!user) {
                return res.status(404).json({ message: 'That user does not exist' });
            }
            res.json(user);
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);
        }
    },
    // delete a user by id
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndRemove({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'That user does not exist' })
            }
            // $in operator looks for that specified field in a array in associated documents
            await Thought.deleteMany({ _id: { $in: user.thoughts } }) 
            res.json({ message: 'User successfully deleted' });
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);
        }
    },
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            )
            if (!user) {
                return res.status(404).json({ message: 'That user does not exist' })
            }
            res.json(user);
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);
        }
    },
    // remove friend
    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            )
            if (!user) {
                return res.status(404).json({ message: 'That user does not exist' })
            }
            res.json(user);
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);
        }
    }
}
module.exports = UserController;