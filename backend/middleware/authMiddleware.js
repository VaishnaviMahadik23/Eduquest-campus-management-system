module.exports = function(req, res, next) {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    try {

        // Normally you would verify JWT here
        // const decoded = jwt.verify(token, process.env.JWT_SECRET)

        next();

    } catch (err) {

        return res.status(400).json({
            message: "Invalid token"
        });

    }

};