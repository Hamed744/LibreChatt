const { logger } = require('@librechat/data-schemas');
const { findOrCreateAnonymousUser } = require('~/server/services/AnonymousUserService');
const { setAuthTokens } = require('~/server/services/AuthService');

/**
 * Handles anonymous user login and automatic user creation
 * @param {Express.Request} req - Express request object
 * @param {Express.Response} res - Express response object
 */
const anonymousLoginController = async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    logger.info(`[anonymousLoginController] Anonymous login attempt from IP: ${ip}`);

    // Find or create anonymous user
    const result = await findOrCreateAnonymousUser(userAgent, ip);
    const { user, isNew } = result;

    if (!user) {
      logger.error('[anonymousLoginController] Failed to create or find anonymous user');
      return res.status(500).json({ 
        message: 'Failed to create anonymous user' 
      });
    }

    // Set authentication tokens
    const token = await setAuthTokens(user._id, res);

    logger.info(`[anonymousLoginController] Anonymous user ${isNew ? 'created' : 'logged in'}: ${user._id}`);

    // Return user data and token
    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        anonymousId: user.anonymousId,
        provider: user.provider,
      },
      token,
      isNew,
      message: isNew ? 'Anonymous user created successfully' : 'Anonymous user logged in successfully'
    });

  } catch (error) {
    logger.error('[anonymousLoginController] Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error during anonymous login' 
    });
  }
};

module.exports = {
  anonymousLoginController,
};