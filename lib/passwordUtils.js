const crypto = require('crypto');

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    };
}

function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
 }

module.exports.validPassword = validPassword,
    module.exports.genPassword = genPassword;

    // validPassword and genPassword functions courtesy of Zach Golwitzer   https://www.youtube.com/watch?v=J1qXK66k1y4