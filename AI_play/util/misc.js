exports.getRandomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.getRandomString = function(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}