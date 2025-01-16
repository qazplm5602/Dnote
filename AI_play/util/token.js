const jwt = require("jsonwebtoken");

exports.createAccessToken = function(email) {
    return jwt.sign(
        {
            "sub": email,
            "role": "ROLE_USER",
            "refresh": false,
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
    );
}