const mongoose = require("mongoose");
const {productSchema} = require("./product");

const userSchema = mongoose.Schema({
    name:{
        require: true,
        type: String,
        trim: true,
    },
    email : {
        require: true,
        type: String,
        trim: true,
       /* validate : {
            validator : (value) => {
                const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
            },
            message : 'Please enter a valid email address',
        }*/
    },
    password : {
        require : true,
        type : String,
        validate : {
            validator : (value) => {
                if(value.length < 6){
                    return 'Password must have at least 6 characters';
                }
            },
        }

    },
     role: { type: String, enum: ["parent", "educator", "admin"], default: "parent" },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },
    address : {
        type : String,
        default : '',
    },
    type : {
        type: String,
        default : 'user',
    },
    cart : [{

        product : productSchema,
        quantity : {
            type: Number,
            required : true,
        }


    }],
    saveForLater : [{

        product : productSchema,
    }],

    keepShoppingFor : [{
        product : productSchema,
    }],
    wishList : [{
        product : productSchema,
    }] ,
    firstname: {
         type: String,
         required: [true, "Please provide firstname"],
         minlength: 2,
         maxlength: 20,
      },
      lastname: {
         type: String,
         required: [true, "Please provide lastname"],
         minlength: 2,
         maxlength: 20,
      },
      profilePicture: {
         type: String,
         default: "",
      },
      location: {
         type: String,
         maxlength: 20,
      },
      about: {
         type: String,
         maxlength: 20,
         default: "",
      },
   },
   { timestamps: true }

);

const User = mongoose.model("User", userSchema);

module.exports = User;



