const router = require('express').Router();

// object to pull in all of the methods for users from the user controller
const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,

}= require('../../controllers/userController');

// api/users route
router.route('/')
.get(getUsers)
.post(createUser);

// api/users/:userId routes
router.route('/:userId')
.get(getSingleUser)
.put(updateUser)
.delete(deleteUser);

// /api/users/:userId/friends/:friendId routes
router.route('/:userId/friends/:friendId')
.post(addFriend)
.delete(deleteFriend);

module.exports = router;