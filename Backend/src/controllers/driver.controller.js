import { Driver } from "../models/vehicle.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

const rateDriver = asyncHandler(async(req, res) => {
    const { vehicleNumber, stars, review} = req.body

    if(!vehicleNumber || !stars) {
        throw new ApiError(400, "Vehicle number or rating is missing")
    }

    let driver = await Driver.findOne({vehicleNumber})

    if(!driver) {
        driver = new Driver({vehicleNumber, ratings: []})
    }

    driver.ratings.push({stars, review})

    driver.totalRatings = driver.ratings.length;
    const totalStars = driver.ratings.reduce((sum, r) => sum + r.stars, 0)
    driver.averageRating = (totalStars/driver.totalRatings).toFixed(1)

    await driver.save();

    return res
    .status(201)
    .json(new ApiResponse(
        201,
        driver,
        "Rating submitted"
    ))
})

const getDriverDetails = asyncHandler(async (req, res) => {
    const {vehicleNumber} = req.params

    const driver = await Driver.findOne({ vehicleNumber })

    if(!driver) {
        throw new ApiError(404, "No record found")
    }

    console.log("Driver Ratings", driver.ratings);


    const latestReview = driver.ratings.length > 0 ? driver.ratings[driver.ratings.length-1] : null

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {
            vehicleNumber: driver.vehicleNumber,
            averageRating: driver.averageRating,
            totalRatings: driver.totalRatings,
            latestReview
        },
        "Driver details fetched succesfully"
        )
    )
})

export {
    rateDriver,
    getDriverDetails
}