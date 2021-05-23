const jwt = require('jsonwebtoken');
const User = require('../db').define('../models/user');

module.exports = function (req, res, next) {
    if (req.method == 'OPTIONS') {
        next();   // allowing options as a method for request
    } else {
        const sessionToken = req.headers.authorization;
        console.log(sessionToken);
        if (!sessionToken) return res.status(403).send({ auth: false, message: "No token provided." });
        else {
            jwt.verify(sessionToken, 'lets_play_sum_games_man',(err, decoded) => {
                console.log(`decoded`, decoded, err);
                if (decoded) {
                    console.log(decoded);
                    User.findOne({ where: { id: decoded.id } }).then(user => {
                        req.user = user;
                        console.log(`user: ${user}`)
                        next()
                    },
                        function () {
                            res.status(401).send({ error: "not authorized" });
                        })

                } else {
                    res.status(400).send({ error: "not authorized" })
                }
            });
        }
    }
}