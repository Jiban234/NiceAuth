import mongoose from "mongoose";
const connectDB = async ()=>{
    mongoose.connection.on('connection', ()=>
        console.log('Database Connected...')
    );
    await mongoose.connect(`${process.env.MONGODB_URL}/NiceAuth`);
}

export default connectDB;