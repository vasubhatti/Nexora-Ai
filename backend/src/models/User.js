import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    creditBalance: {
        type: Number,
        default: 100
    },
    creditsUsed:{
        type:Number,
        default :0
    },
    creditsResetDate:{
        type:Date,
        default: () => new Date(new Date().setMonth(new Date().getMonth() + 1))
    },
     subscription: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    refreshToken: {
      type: String,
      select: false,
    }
}, {timestamps: true});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;