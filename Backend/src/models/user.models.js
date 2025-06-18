import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function(v) {
                    return /^\+[1-9]\d{1,14}$/.test(v);
                },
                message: 'Please enter a valid phone number with country code (e.g., +919876543210)'
            }
        },
        emergencyContacts: [{
            name: {
            type: String,
            required: true,
            trim: true
            },
            phoneNumber: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (v) {
                return /^\+[1-9]\d{1,14}$/.test(v);
                },
                message: 'Please enter a valid emergency contact phone number with country code'
            }
        }}],

        refreshToken: {
            type: String
        }
    },{timestamps: true}
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)    
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)