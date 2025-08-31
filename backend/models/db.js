import mongoose from "mongoose";

let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki", "Sadie"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const UserSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }, 
    bio:{
        type:String,
        default: "Hi There! This is my notes section"
    },
  profile_img: {
    type: String,
    default: () => {
      const collection = profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)];
      const seed = profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)];
      return `https://api.dicebear.com/6.x/${collection}/svg?seed=${seed}`;
    }
  }
})

const User = mongoose.model("User",UserSchema)
export default User;