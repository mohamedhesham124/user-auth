// repositories/userRepository.js
const User = require("../models/user.model");
const bcrypt = require('../utils/bcrypt');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findAll() {
    return await User.findAll({ attributes: { exclude: ['password'] } });
  }

  async findByRole(isAdmin) {
    return await User.findAll({ where: { isAdmin }, attributes: { exclude: ['password'] } });
  }

  async findById(id) {
    return await User.findOne({ where: { id }, attributes: { exclude: ['password'] } });
  }

  async updateById(id, updateData) {
    return await User.update(updateData, { where: { id } });
  }

  async deleteById(id) {
    return await User.destroy({ where: { id } });
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async verifyEmail(id) {
    return await User.update({ isVerified: true }, { where: { id } });
  }

  async comparePassword(user, candidatePassword) {
    return await bcrypt.comparePassword(candidatePassword, user.password);
  }
}

module.exports = new UserRepository();
