const asyncFun = require('../middlewares/async.function');
const User = require('../repositories/userRepository');
const { success, fail, error } = require('../utils/response');

class UserController {
    static getAllUsers = asyncFun(async (req, res) => {
        const users = await User.findAll();
        return success(res, "Users fetched successfully", users);
    });

    static getUserById = asyncFun(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (!user) return fail(res, "User not found");
        return success(res, "User found", user);
    });

    static updateUser = asyncFun(async (req, res) => {
        if (req.body.email) {
            const isExist = await User.findByEmail(req.body.email);
            if (isExist) return fail(res, "Email cannot be used", [], 400);
        }

        const updatedUser = await User.updateById(req.params.id, req.body);
        return success(res, "User updated successfully", updatedUser);
    });

    static deleteUser = asyncFun(async (req, res) => {
        const user = await User.deleteById(req.params.id);
        if (!user) return fail(res, "User not found", [], 404);
        return success(res, "User deleted successfully", null, 204);
    });
}

module.exports = UserController;
