const mongoose =require("mongoose")

const configureDb=async() =>{

    try{
        const url =process.env.URL||"mongodb://127.0.0.1:27017"
        const dbName = process.env.DB_NAME||"Simblog"
        await mongoose.connect(`${url}/${dbName}`)
        console.log("Connected to -",dbName);
    }
    catch(e)
    {
        console.log("Error connecting to db ",e);
    }
}

module.exports=configureDb