import { User } from '../models/user.model.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError'
import {uploadOnCloudinary} from '../utils/cloudinary'
import {ApiResponse} from '../utils/ApiResponse'

const registerUser=asyncHandler(async(req,res)=>{
    const {userName,email,fullName,password}=req.body;

    if([fullName,email,userName,password].some((field)=>field.trim()==="")){
        throw new ApiError(400,'All fields are mandatory')
    }

    // call to the db to check if user already exists.
    const existingUser=User.findOne({
        $or: [{userName},{email}]
    })

    if(existingUser){
        throw new ApiError(409,"User with username or email already exists")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar is required")
    }
    
    const user = await User.create({
            fullName,
            avatar:avatar.url,
            coverImage:coverImage?.url || "",
            email,
            password,
            userName:userName.toLowerCase()
        }
    )

    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,'Error occured while creating user')
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser,"User registered successfully")
    )
})

export {registerUser}