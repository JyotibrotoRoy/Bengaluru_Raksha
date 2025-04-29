import twilio from "twilio";
import { ApiError } from "../../../../backend project/src/utils/apiError.js";
import { ApiResponse } from "../../../../backend project/src/utils/apiResponse.js";
import { asyncHandler } from "../../../../backend project/src/utils/asyncHandler.js";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const validateCoordinates = (latitude, longitude) => {
    return latitude && longitude
}
const sendSoS = asyncHandler(async (req, res) => {
    const {latitude, longitude} = req.body

    if(!validateCoordinates(latitude, longitude)) {
        return res
        .status(400)
        .json(
            new ApiResponse(
                400, " Missing coordinates"
            )
        )
    }

    try {
        const message = await client.messages.create({
            body:`SOS alert!!! Users Location https://maps.google.com/?q=${latitude},${longitude}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.RECEIVER_PHONE_NUMBER
        })
        return res
        .status(200)
        .json(
            new ApiResponse(
                200, "SOS sent succesfully"
            )
        )
    } catch (error) {
        console.log("It is Twilio error", error)
        return res
        .status(500)
        .json(
            new ApiResponse(
                500, "Failed to send SOS", error.message
            )
        )
    }
})

export {
    sendSoS
}