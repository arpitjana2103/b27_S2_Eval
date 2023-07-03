const authz = function(permittedRole){
    return function(req, res, next){
        if(permittedRole.includes(req.body.role)){
            next();
        }else{
            res.status(400).json({
                status: 'fail',
                error: 'Not Authorized'
            })
        }
    }
}

module.exports = {authz};