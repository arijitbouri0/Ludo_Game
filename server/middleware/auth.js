import jwt from 'jsonwebtoken'
import { ErrorHandler } from "../utils/utility.js";
import { User } from '../model/user.model.js';

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies["game-app"];
        if (!token) {
            return next(new ErrorHandler("Please login to access this route", 401))
        }

        const decodeData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodeData._id;
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }

    next();
}

const socketAuthenticater = async (err, socket, next) => {
    try {
        if (err) {
            next(err);
        }

        const authToken = socket.request.cookies["game-app"]

        if (!authToken) return next(new ErrorHandler("Please login to access this route", 401))
        const decodeData = jwt.verify(authToken, process.env.JWT_SECRET);

        const user = await User.findById(decodeData._id);

        if (!user) return next(new ErrorHandler("Please login to access this route", 401))

        socket.user = user

        return next();
    } catch (error) {
        console.group(error)
        return next(new ErrorHandler("Please login to access this route", 401))
    }
}


export { authenticate,socketAuthenticater}