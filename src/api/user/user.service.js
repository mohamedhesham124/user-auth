const UserRepository = require('./user.repository');

class UserService {
    constructor() {
        // Use the exported instance of the repository directly
        this.userRepository = UserRepository;
    }

    /**
     * Retrieves all users.
     * @returns {Array<object>} A list of all user objects.
     */
    async getAllUsers() {
        return await this.userRepository.findAll();
    }

    /**
     * Retrieves a single user by their ID.
     * @param {string} id - The ID of the user to retrieve.
     * @returns {object} The user object.
     */
    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            // Throw a specific error if the user is not found
            throw { statusCode: 404, message: "User not found" };
        }
        return user;
    }

    /**
     * Updates a user's information.
     * @param {string} id - The ID of the user to update.
     * @param {object} updateData - The data to update.
     * @returns {object} The updated user object.
     */
    async updateUser(id, updateData) {
        // Business logic: Check if the email is already in use by another user
        if (updateData.email) {
            const existingUser = await this.userRepository.findByEmail(updateData.email);
            if (existingUser && existingUser.id !== id) {
                 throw { statusCode: 409, message: "Email is already in use by another account" };
            }
        }
        
        await this.userRepository.updateById(id, updateData);
        // Return the updated user data to confirm the change
        return await this.userRepository.findById(id);
    }

    /**
     * Deletes a user.
     * @param {string} id - The ID of the user to delete.
     */
    async deleteUser(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw { statusCode: 404, message: "User not found" };
        }
        await this.userRepository.deleteById(id);
    }
}

module.exports = UserService;