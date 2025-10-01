// src/api/user/user.repository.js
const User = require("./user.model");

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findAll() {
    // Exclude password from all general queries
    return await User.findAll({ attributes: { exclude: ['password'] } });
  }

  async findById(id) {
    return await User.findOne({ where: { id }, attributes: { exclude: ['password'] } });
  }

  async updateById(id, updateData) {
    // Ensure password cannot be updated through this general method for security
    if (updateData.password) {
        delete updateData.password;
    }
    await User.update(updateData, { where: { id } });
  }

  async deleteById(id) {
    return await User.destroy({ where: { id } });
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email }, attributes: { exclude: ['password'] } });
  }
  
  /**
   * Special method for the auth service to get a user's hashed password.
   */
  async findByEmailWithPassword(email) {
    return await User.findOne({ where: { email } });
  }

  async verifyEmail(id) {
    return await User.update({ isVerified: true }, { where: { id } });
  }

  /**
   * Special method to update only the password.
   */
  async updatePassword(id, hashedPassword) {
    return await User.update({ password: hashedPassword }, { where: { id } });
  }
}

// Export a single instance
module.exports = new UserRepository();