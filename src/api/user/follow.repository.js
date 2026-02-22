const Follow = require('./follow.model');
const User = require('./user.model');

class FollowRepository {
  /**
   * Add a follower relationship
   */
  async follow(followerId, followeeId) {
    if (followerId === followeeId) {
      throw { statusCode: 400, message: "You cannot follow yourself" };
    }

    // Check if already following
    const existing = await Follow.findOne({
      where: { follower_id: followerId, followee_id: followeeId }
    });

    if (existing) {
      throw { statusCode: 409, message: "Already following this user" };
    }

    return await Follow.create({
      follower_id: followerId,
      followee_id: followeeId
    });
  }

  /**
   * Remove a follower relationship
   */
  async unfollow(followerId, followeeId) {
    const follow = await Follow.findOne({
      where: { follower_id: followerId, followee_id: followeeId }
    });

    if (!follow) {
      throw { statusCode: 404, message: "Not following this user" };
    }

    return await Follow.destroy({
      where: { follower_id: followerId, followee_id: followeeId }
    });
  }

  /**
   * Get all followers of a user
   */
  async getFollowers(userId, limit = 20, offset = 0) {
    return await Follow.findAndCountAll({
      where: { followee_id: userId },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: { exclude: ['password'] }
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Get all users that a user is following
   */
  async getFollowing(userId, limit = 20, offset = 0) {
    return await Follow.findAndCountAll({
      where: { follower_id: userId },
      include: [
        {
          model: User,
          as: 'followee',
          attributes: { exclude: ['password'] }
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Check if user1 is following user2
   */
  async isFollowing(followerId, followeeId) {
    const follow = await Follow.findOne({
      where: { follower_id: followerId, followee_id: followeeId }
    });

    return !!follow;
  }

  /**
   * Get followers count
   */
  async getFollowersCount(userId) {
    return await Follow.count({
      where: { followee_id: userId }
    });
  }

  /**
   * Get following count
   */
  async getFollowingCount(userId) {
    return await Follow.count({
      where: { follower_id: userId }
    });
  }
}

module.exports = new FollowRepository();
