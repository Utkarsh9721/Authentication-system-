import mongoose from 'mongoose';

const Connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("Issue in DB connection:", error);
        process.exit(1);
    }
};

export default Connection;