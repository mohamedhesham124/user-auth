const bcrypt = require('bcrypt');

const saltRounds = 10; 
async function hashPassword(password) {
    try{
        const hashedPassword = await bcrypt.hash( password, saltRounds);
        return hashedPassword;
    }
    catch(err){
        return Error("Problem in hashing password"); 
    }
}

async function comparePassword(password , hash) {
    try{
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    }
    catch(err){
        return Error("Problem in comparing password");
    }
}


module.exports = { hashPassword, comparePassword };