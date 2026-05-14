module.exports = function(req, res, next){

    const role = req.headers.role;

    if(!role){
        return res.status(401).json({
            message: "Role header missing"
        });
    }

    if(role.toLowerCase() !== "admin"){
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();

};