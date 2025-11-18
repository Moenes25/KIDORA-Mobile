import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        unique:true

    },
    name:String,
    profession:String,
    DOB: String,
    titleline: String,
    about:String,
    img:{
        type:String,
        default:""
    }
   
},
 { timestamps: true });

    
const Profile = mongoose.model('Profile', profileSchema);

export default Profile;

