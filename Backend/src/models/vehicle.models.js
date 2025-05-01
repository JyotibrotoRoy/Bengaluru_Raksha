import mongoose, {Schema} from "mongoose";

const ratingSchema = new Schema(
    {
        stars: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        review: {
            type: String,
            trim: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
)

const driverSchema = new Schema(
    {
        vehicleNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        ratings: [ratingSchema],
        averageRating: {
            type: Number,
            default: 0
        },
        totalRatings: {
            type: Number,
            default: 0
        }
    }, {timestamps: true}
)

export const Driver = mongoose.model("Driver", driverSchema);