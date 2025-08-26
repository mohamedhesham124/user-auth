// repositories/userRepository.js
const User = require("../models/user.model");

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findAll() {
    return await User.find({}, { password: 0 });
  }

  async findByRole(role) {
    return await User.find({ role }, { password: 0 });
  }

  async findById(id) {
    return await User.findOne({ id }, { password: 0 });
  }

  async updateById(id, updateData) {
    return await User.updateOne({ id }, updateData);
  }

  async deleteById(id) {
    return await User.deleteOne({ id });
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async verifyEmail(id) {
    return await User.updateOne({ id }, { isVerified: true });
  }
}

module.exports = new UserRepository();
