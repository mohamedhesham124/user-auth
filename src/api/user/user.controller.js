const asyncFun = require('../../middlewares/async.handler');
const UserService = require('./user.service');
const { success } = require('../../utils/ApiResponse');

// Create a single instance of the service for the controller to use
const userService = new UserService();

class UserController {
    /**
     * Gets all users by calling the user service.
     */
    getAllUsers = asyncFun(async (req, res) => {
        const users = await userService.getAllUsers();
        return success(res, "Users fetched successfully", users);
    });

    /**
     * Gets a single user by ID.
     */
    getUserById = asyncFun(async (req, res) => {
        const user = await userService.getUserById(req.params.id);
        return success(res, "User found", user);
    });

    /**
     * Updates a user.
     */
    updateUser = asyncFun(async (req, res) => {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        return success(res, "User updated successfully", updatedUser);
    });

    /**
     * Deletes a user.
     */
    deleteUser = asyncFun(async (req, res) => {
        await userService.deleteUser(req.params.id);
        // A 204 No Content response is standard for a successful deletion
        return success(res, "User deleted successfully", null, 204);
    });
}

module.exports = new UserController();