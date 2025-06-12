import jwt from 'jsonwebtoken';

const cookieOption = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
}

const sendtoken = (res, user, code, message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res
        .status(code)
        .cookie("game-app", token, cookieOption)
        .json({
            success: true,
            token,
            message,
            user
        })
}

export {cookieOption,sendtoken}