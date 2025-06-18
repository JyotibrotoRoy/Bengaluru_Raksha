import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false})
        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrongg while generating accessToken")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    const {username, email, fullname, password,phoneNumber, emergencyContacts} = req.body

    if (
        [username, email, fullname, password].some((field) => field?.trim() ==="")
    ) {
        throw new ApiError(400, "all fields are required")
    }

    if (!emergencyContacts || !Array.isArray(emergencyContacts) || emergencyContacts.length === 0) {
        throw new ApiError(400, "At least one emergency contact is required")
    }

    for (const contact of emergencyContacts) {
        if (!contact.name || !contact.phoneNumber) {
            throw new ApiError(400, "Emergency contact must have name, phone number")
        }
    }

    console.log(username, email, password, fullname)
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
     })

     if( existingUser ) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email,
        password,
        phoneNumber,
        emergencyContacts: emergencyContacts.map((contact, index) => ({
            ...contact,
            isPrimary: index === 0,
            verified: false
        }))
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(
            200,
        {
        user: createdUser,
        verificationRequired: true,
        message: "User registered successfully. To enable SOS alerts, emergency contact numbers must be verified in Twilio.",
        verificationInstructions: {
            step1: "Ask your emergency contacts to visit: https://console.twilio.com/us1/develop/phone-numbers/verified",
            step2: "Click 'Add a Verified Caller ID' and enter their phone number",
            step3: "Complete verification via the code sent to their number",
            note: "This is a one-time process required due to Twilio trial account limits. Once verified, SOS SMS will be delivered successfully."
        }
        },
        "User registered successfully"));
})

const loginUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body

    if(!(username || email)) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, "Password Incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "Lax"
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req, res) => {

    if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized - no user found");
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: false
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!refreshAccessToken) {
        throw new ApiError(401, "Unathorized request")
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        prompt.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if(!user) {
        throw new ApiError(401, "Invalid refresh token")
    }

    if(incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const {accessToken, newRefreshToken} = await generateAccessandRefreshToken(user._id)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
        new ApiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken},
            "access token refreshed successfully"
        )
    )
    

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}