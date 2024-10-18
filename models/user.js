const mongoose = require('mongoose'); // Correct import
const { createHmac, randomBytes } = require('node:crypto');

const Schema = mongoose.Schema; // Get Schema from mongoose

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
       
    },
    password: {
        type: String,
        required: true,
        // Removed unique constraint from password
    },
    profileImageUrl: {
        type: String,
        default: "/images/avatar.png",
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
}, { timestamps: true });

userSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next(); 
    }

    const salt = randomBytes(16).toString('hex'); 
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    this.salt = salt; 
    this.password = hashedPassword; 
    next(); 
});

userSchema.static('matchPassword', async function(email,password){
    const user = await this.findOne({email:email});
    if(!user) throw new Error('User Not Found!');

    const salt = user.salt;
    const hashedPassword = user.password;

    const  userProvidedHash = createHmac('sha256', salt)
    .update(password)
    .digest('hex');

    if(hashedPassword !==  userProvidedHash) {
        throw new Error('Invalid Password!');
    }

    return user;

})

const User = mongoose.model('user', userSchema);

module.exports = User;