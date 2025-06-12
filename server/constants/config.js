import { configDotenv } from "dotenv";
configDotenv()

const corsOptions = {
    origin: [
        process.env.CLIENT_URL,
    ],
    credentials: true,
}

export { corsOptions }