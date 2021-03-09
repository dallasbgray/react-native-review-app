const app = require('../../util/configureApi');
const User = require('../../models/User');
const connectDB = require('../../util/db');

app.post('*', (req, res) => {
    connectDB()
        .then(() => {
            return User.create(req.body);
        })
        .then(userItem => {
            res.status(200).json({
                result: userItem,
            });
        })
        .catch(error => {
            res.status(error.statusCode || 500).json({
                error: error.message,
            });
        });
});

module.exports = app;