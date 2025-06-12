import bcrypt from 'bcrypt';
import { User } from '../model/user.model.js';
import { cookieOption, sendtoken } from '../utils/feature.js';
import { ErrorHandler } from '../utils/utility.js';

const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    })
    const newUser={
        email:user.email,
        username:user.username,
        _id:user._id
    }
    sendtoken(res, newUser, 201, "user created successfully")
};

const login = async (req, res,next) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ErrorHandler("User not found. Please check your email or register first.", 404));
    const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) return next(new ErrorHandler("Invalid Password", 404));
    const newUser={
        email:user.email,
        username:user.username,
        _id:user._id
    }
    sendtoken(res, newUser, 201, `Welcome Back , ${user.username}`);
};

const getMyProfile = async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler("Please Login ", 404))
    }
    const user = await User.findById(req.user).select("-password")
    const newUser={
        email:user.email,
        username:user.username,
        _id:user._id
    }
    res.status(200).json({
        success: true,
        user:newUser,
    })
}
const logout = async (req, res) => {
    res.status(200).cookie("game-app", "", { ...cookieOption, maxAge: 0 })
        .json({
            success: true,
            message: "Logged out succesfully"
        })
}
export { getMyProfile,logout,login,register}

