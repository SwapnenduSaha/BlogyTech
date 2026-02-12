//@desc Register new user
//@route POST /api/V1/users/register
//@access public
module.exports.register = async (req, res) => {
    res.json({msg:"User registration controller executed"});
};
