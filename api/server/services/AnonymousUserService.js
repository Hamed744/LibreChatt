const { v4: uuidv4 } = require('uuid');
const { SystemRoles } = require('librechat-data-provider');
const { logger } = require('@librechat/data-schemas');
const { createUser, findUser } = require('~/models');
const { getBalanceConfig } = require('~/server/services/Config');

/**
 * Creates an anonymous user with a unique identifier
 * @param {string} userAgent - Browser user agent for identification
 * @param {string} ip - User's IP address
 * @returns {Promise<Object>} Created user object
 */
const createAnonymousUser = async (userAgent, ip) => {
  try {
    // Generate a unique identifier based on user agent and IP
    const uniqueId = uuidv4();
    const timestamp = Date.now();
    
    // Create a unique username and email for the anonymous user
    const username = `anonymous_${uniqueId.substring(0, 8)}`;
    const email = `${username}@anonymous.local`;
    const name = `Anonymous User ${uniqueId.substring(0, 6)}`;
    
    // Generate a random password for the anonymous user
    const password = uuidv4();
    
    const userData = {
      provider: 'anonymous',
      email,
      username,
      name,
      avatar: null,
      role: SystemRoles.USER,
      password,
      emailVerified: true, // Anonymous users don't need email verification
      anonymousId: uniqueId,
      userAgent,
      ip,
      createdAt: new Date(timestamp),
    };

    const balanceConfig = await getBalanceConfig();
    const disableTTL = true; // Anonymous users don't need TTL

    const newUser = await createUser(userData, balanceConfig, disableTTL, true);
    
    logger.info(`[createAnonymousUser] Created anonymous user: ${newUser._id} with ID: ${uniqueId}`);
    
    return {
      user: newUser,
      anonymousId: uniqueId,
      status: 200,
      message: 'Anonymous user created successfully'
    };
  } catch (err) {
    logger.error('[createAnonymousUser] Error creating anonymous user:', err);
    throw err;
  }
};

/**
 * Finds or creates an anonymous user based on browser fingerprint
 * @param {string} userAgent - Browser user agent
 * @param {string} ip - User's IP address
 * @returns {Promise<Object>} User object
 */
const findOrCreateAnonymousUser = async (userAgent, ip) => {
  try {
    // Try to find existing anonymous user by IP and user agent
    const existingUser = await findUser({ 
      provider: 'anonymous',
      ip,
      userAgent 
    });

    if (existingUser) {
      logger.info(`[findOrCreateAnonymousUser] Found existing anonymous user: ${existingUser._id}`);
      return {
        user: existingUser,
        isNew: false,
        status: 200,
        message: 'Existing anonymous user found'
      };
    }

    // Create new anonymous user if none exists
    const result = await createAnonymousUser(userAgent, ip);
    return {
      ...result,
      isNew: true
    };
  } catch (err) {
    logger.error('[findOrCreateAnonymousUser] Error:', err);
    throw err;
  }
};

module.exports = {
  createAnonymousUser,
  findOrCreateAnonymousUser,
};