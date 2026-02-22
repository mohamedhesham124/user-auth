const UserRepository = require('./user.repository');
const FollowRepository = require('./follow.repository');
const NotificationService = require('../notification/notification.service');

class UserService {
    constructor() {
        // Use the exported instance of the repository directly
        this.userRepository = UserRepository;
        this.followRepository = FollowRepository;
        this.notificationService = new NotificationService();
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

    /**
     * Follow a user
     * @param {string} followerId - The ID of the user who is following
     * @param {string} followeeId - The ID of the user to follow
     */
    async followUser(followerId, followeeId) {
        // Validate both users exist
        const follower = await this.userRepository.findById(followerId);
        const followee = await this.userRepository.findById(followeeId);

        if (!follower || !followee) {
            throw { statusCode: 404, message: "User not found" };
        }

        const follow = await this.followRepository.follow(followerId, followeeId);

        // Create notification for the followee
        await this.notificationService.createNotification(
            followeeId,
            'new_follower',
            {
                follower_id: followerId,
                follower_name: follower.name,
                follower_email: follower.email,
                profile_url: `/users/${followerId}`
            },
            { email: 'pending', push: 'pending', in_app: 'delivered' }
        );

        return follow;
    }

    /**
     * Unfollow a user
     * @param {string} followerId - The ID of the user who is unfollowing
     * @param {string} followeeId - The ID of the user to unfollow
     */
    async unfollowUser(followerId, followeeId) {
        return await this.followRepository.unfollow(followerId, followeeId);
    }

    /**
     * Get followers of a user
     * @param {string} userId - The ID of the user
     * @param {number} page - Page number for pagination
     * @param {number} limit - Number of items per page
     */
    async getFollowers(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const result = await this.followRepository.getFollowers(userId, limit, offset);

        return {
            followers: result.rows.map(f => f.follower),
            pagination: {
                total: result.count,
                page,
                limit,
                pages: Math.ceil(result.count / limit)
            }
        };
    }

    /**
     * Get users that a user is following
     * @param {string} userId - The ID of the user
     * @param {number} page - Page number for pagination
     * @param {number} limit - Number of items per page
     */
    async getFollowing(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const result = await this.followRepository.getFollowing(userId, limit, offset);

        return {
            following: result.rows.map(f => f.followee),
            pagination: {
                total: result.count,
                page,
                limit,
                pages: Math.ceil(result.count / limit)
            }
        };
    }

    /**
     * Check if a user is following another user
     * @param {string} followerId - The ID of the potential follower
     * @param {string} followeeId - The ID of the potential followee
     */
    async isFollowing(followerId, followeeId) {
        return await this.followRepository.isFollowing(followerId, followeeId);
    }

    /**
     * Get follower count for a user
     * @param {string} userId - The ID of the user
     */
    async getFollowersCount(userId) {
        return await this.followRepository.getFollowersCount(userId);
    }

    /**
     * Get following count for a user
     * @param {string} userId - The ID of the user
     */
    async getFollowingCount(userId) {
        return await this.followRepository.getFollowingCount(userId);
    }
    }
}

module.exports = UserService;