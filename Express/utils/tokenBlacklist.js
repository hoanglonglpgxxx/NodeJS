const redis = require('redis');

const client = redis.createClient();

// Add a token to the blacklist
function blacklistToken(token) {
    // Set the token in Redis and have it expire when the token would have naturally expired
    client.set(token, 'blacklisted', 'EX', process.env.JWT_EXPIRES_IN);
}

// Check if a token is in the blacklist
function isTokenBlacklisted(token) {
    return new Promise((resolve, reject) => {
        client.get(token, (err, reply) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply === 'blacklisted');
            }
        });
    });
}

module.exports = {
    blacklistToken,
    isTokenBlacklisted,
};