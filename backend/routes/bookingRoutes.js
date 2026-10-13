
import { Router } from "express";
import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import { requireAuth } from "../middleware/auth.js";

import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paymentUploadDir = path.resolve(
  __dirname,
  "../uploads/payment-screenshots"
);

fs.mkdirSync(paymentUploadDir, { recursive: true });

const paymentStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, paymentUploadDir);
  },

  filename: (_req, file, callback) => {
    const extensionByMime = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
    };

    callback(
      null,
      `${randomUUID()}${extensionByMime[file.mimetype] || ".img"}`
    );
  },
});

const paymentScreenshotUpload = multer({
  storage: paymentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPG, PNG, and WebP screenshots are allowed.")
      );
    }

    callback(null, true);
  },
});

function deleteUploadedFile(filePath) {
  if (filePath) {
    fs.promises.unlink(filePath).catch(() => {});
  }
}

// All booking routes require authentication.
router.use(requireAuth);

// POST /api/bookings/payment-request
// Saves payment proof for manual verification.
// Uploading a screenshot never confirms payment.
router.post(
  "/payment-request",
  (req, res, next) => {
    paymentScreenshotUpload.single("paymentScreenshot")(
      req,
      res,
      (error) => {
        if (!error) return next();

        const statusCode =
          error instanceof multer.MulterError &&
          error.code === "LIMIT_FILE_SIZE"
            ? 400
            : 400;

        return res.status(statusCode).json({
          message:
            error instanceof multer.MulterError &&
            error.code === "LIMIT_FILE_SIZE"
              ? "Screenshot size maximum 5 MB ho sakta hai."
              : error.message ||
                "Screenshot upload nahi ho paya.",
        });
      }
    );
  },
  async (req, res) => {
    let uploadedFilePath = req.file?.path;

    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Payment screenshot upload karein.",
        });
      }

      let bookingData;

      try {
        bookingData = JSON.parse(req.body.bookingData || "{}");
      } catch {
        deleteUploadedFile(uploadedFilePath);

        return res.status(400).json({
          message: "Invalid booking data.",
        });
      }

      const {
        type,
        title,
        destination = "",
        travelDate,
        endDate,
        travellers = 1,
        amount,
        currency = "INR",
        details = {},
      } = bookingData;

      const allowedTypes = [
        "tour",
        "bus",
        "hotel",
        "cab",
        "insurance",
      ];

      if (!allowedTypes.includes(type)) {
        deleteUploadedFile(uploadedFilePath);

        return res.status(400).json({
          message: "Invalid booking type.",
        });
      }

      if (
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 200
      ) {
        deleteUploadedFile(uploadedFilePath);

        return res.status(400).json({
          message: "Valid booking title is required.",
        });
      }

      if (
        typeof destination !== "string" ||
        destination.length > 200
      ) {
        deleteUploadedFile(uploadedFilePath);

        return res.status(400).json({
          message: "Invalid destination.",
        });
      }

      if (
        !Number.isInteger(travellers) ||
        travellers < 1 ||
        travellers > 50
      ) {
        deleteUploadedFile(uploadedFilePath);

        return res.status(400).json({
          message: "Travellers must be between 1 and 50.",
        });
      }

      if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        amount > 10000000 ||
        currency !== "INR"
      ) {
        deleteUploadedFile(uploadedFilePath);

        return res.status(400).json({
          message: "Invalid booking amount or currency.",
        });
      }

      if (
        !details ||
        typeof details !== "object" ||
        Array.isArray(details)
      ) {
        deleteUploadedFile(uploadedFilePath);

        return res.status(400).json({
          message: "Invalid booking details.",
        });
      }

      const parseOptionalDate = (value, fieldName) => {
        if (value === undefined || value === null || value === "") {
          return null;
        }

        if (
          typeof value !== "string" ||
          Number.isNaN(Date.parse(value))
        ) {
          throw new Error(`Invalid ${fieldName}.`);
        }

        const date = new Date(value);

        if (!Number.isFinite(date.getTime())) {
          throw new Error(`Invalid ${fieldName}.`);
        }

        return date;
      };

      let parsedTravelDate;
      let parsedEndDate;

      try {
        parsedTravelDate = parseOptionalDate(
          travelDate,
          "travel date"
        );

        parsedEndDate = parseOptionalDate(
          endDate,
          "end date"
        );
      } catch (error) {
        deleteUploadedFile(uploadedFilePath);

        return res.status(400).json({
          message: error.message,
        });
      }

      if (
        parsedTravelDate &&
        parsedEndDate &&
        parsedEndDate < parsedTravelDate
      ) {
        deleteUploadedFile(uploadedFilePath);

        return res.status(400).json({
          message: "End date cannot be before travel date.",
        });
      }

      const booking = await Booking.create({
        user: new mongoose.Types.ObjectId(req.userId),
        type,
        title: title.trim(),
        destination: destination.trim(),
        travelDate: parsedTravelDate,
        endDate: parsedEndDate,
        travellers,
        details,
        amount,
        currency: "INR",

        // Never confirm payment just because a screenshot was uploaded.
        status: "pending",
        paymentStatus: "pending",
        paymentVerificationStatus: "pending_verification",
        paymentScreenshot: path
          .relative(paymentUploadDir, uploadedFilePath)
          .replace(/\\/g, "/"),
        paymentSubmittedAt: new Date(),
      });

      return res.status(201).json({
        message:
          "Payment screenshot submitted. Booking is pending manual verification.",
        booking: {
          _id: booking._id,
          bookingReference: booking.bookingReference,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          paymentVerificationStatus:
            booking.paymentVerificationStatus,
          amount: booking.amount,
          currency: booking.currency,
          paymentSubmittedAt: booking.paymentSubmittedAt,
        },
      });
    } catch (error) {
      deleteUploadedFile(uploadedFilePath);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Please check the booking details.",
        });
      }

      console.error("Payment request error:", error.message);

      return res.status(500).json({
        message: "Unable to submit payment screenshot.",
      });
    }
  }
);

// POST /api/bookings
router.post("/", async (req, res) => {
  try {
    const {
      type,
      title,
      destination,
      travelDate,
      endDate,
      travellers,
      details,
    } = req.body ?? {};

    const allowedTypes = ["bus", "hotel", "cab", "insurance"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid booking type.",
      });
    }

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 200
    ) {
      return res.status(400).json({
        message: "A valid booking title is required.",
      });
    }

    if (
      destination !== undefined &&
      (typeof destination !== "string" ||
        destination.length > 200)
    ) {
      return res.status(400).json({
        message: "Invalid destination.",
      });
    }

    const travellerCount = travellers ?? 1;

    if (
      !Number.isInteger(travellerCount) ||
      travellerCount < 1 ||
      travellerCount > 50
    ) {
      return res.status(400).json({
        message: "Travellers must be between 1 and 50.",
      });
    }

    function parseDate(value, fieldName) {
      if (value === undefined || value === null || value === "") {
        return null;
      }

      if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
        throw new Error(`Invalid ${fieldName}.`);
      }

      const date = new Date(value);

      if (!Number.isFinite(date.getTime())) {
        throw new Error(`Invalid ${fieldName}.`);
      }

      return date;
    }

    let parsedTravelDate;
    let parsedEndDate;

    try {
      parsedTravelDate = parseDate(travelDate, "travel date");
      parsedEndDate = parseDate(endDate, "end date");
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    if (
      parsedTravelDate &&
      parsedEndDate &&
      parsedEndDate < parsedTravelDate
    ) {
      return res.status(400).json({
        message: "End date cannot be before travel date.",
      });
    }

    if (
      details !== undefined &&
      (details === null ||
        typeof details !== "object" ||
        Array.isArray(details))
    ) {
      return res.status(400).json({
        message: "Booking details must be an object.",
      });
    }

    // Do not accept amount, status, paymentStatus, or user
    // from the request body.
    //
    // This draft endpoint intentionally does not finalize a price.
    // Server-side pricing/quote validation must be implemented
    // before this can become a payable booking.
    const booking = await Booking.create({
      user: new mongoose.Types.ObjectId(req.userId),
      type,
      title: title.trim(),
      destination: destination?.trim() || "",
      travelDate: parsedTravelDate,
      endDate: parsedEndDate,
      travellers: travellerCount,
      details: details ?? {},
      amount: 0,
      currency: "INR",
      status: "pending",
      paymentStatus: "pending",
    });

    return res.status(201).json({
      message: "Booking draft created. Price and availability are not yet confirmed.",
      booking,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Please check the booking details.",
      });
    }

    console.error("Create booking error:", error.message);

    return res.status(500).json({
      message: "Unable to create booking.",
    });
  }
});


// GET /api/bookings
// Current user's bookings only.
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Fetch bookings error:", error.message);

    return res.status(500).json({
      message: "Unable to fetch bookings.",
    });
  }
});


/**
 * POST /api/bookings/demo-confirm
 *
 * DEMO ONLY — does not verify or process real payments.
 */
router.post("/demo-confirm", async (req, res) => {
  try {
    const {
      type,
      title,
      destination = "",
      travelDate,
      endDate,
      travellers = 1,
      details = {},
      amount,
      paymentMethod = "demo",
    } = req.body ?? {};

    const allowedTypes = ["tour", "bus", "hotel", "cab", "insurance"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid booking type." });
    }

    if (typeof title !== "string" || !title.trim() || title.length > 200) {
      return res.status(400).json({ message: "Valid booking title is required." });
    }

    if (
      !Number.isInteger(travellers) ||
      travellers < 1 ||
      travellers > 50
    ) {
      return res.status(400).json({ message: "Invalid traveller count." });
    }

    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) {
      return res.status(400).json({ message: "Invalid booking amount." });
    }

    if (!details || typeof details !== "object" || Array.isArray(details)) {
      return res.status(400).json({ message: "Invalid booking details." });
    }

    const parseOptionalDate = (value, field) => {
      if (!value) return null;
      const date = new Date(value);
      if (typeof value !== "string" || Number.isNaN(date.getTime())) {
        throw new Error(`Invalid ${field}.`);
      }
      return date;
    };

    let parsedTravelDate;
    let parsedEndDate;

    try {
      parsedTravelDate = parseOptionalDate(travelDate, "travel date");
      parsedEndDate = parseOptionalDate(endDate, "end date");
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    if (
      parsedTravelDate &&
      parsedEndDate &&
      parsedEndDate < parsedTravelDate
    ) {
      return res.status(400).json({
        message: "End date cannot be before travel date.",
      });
    }

    const booking = await Booking.create({
      user: new mongoose.Types.ObjectId(req.userId),
      type,
      title: title.trim(),
      destination:
        typeof destination === "string" ? destination.trim().slice(0, 200) : "",
      travelDate: parsedTravelDate,
      endDate: parsedEndDate,
      travellers,
      details: {
        ...details,
        paymentMethod,
        demoPayment: true,
      },
      amount,
      currency: "INR",
      status: "confirmed",
      paymentStatus: "paid",
      paymentReference: `DEMO-${new mongoose.Types.ObjectId().toString()}`,
    });

    return res.status(201).json({
      message: "Demo booking saved successfully.",
      booking,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Please check the booking details.",
      });
    }

    console.error("Demo booking confirmation error:", error.message);
    return res.status(500).json({
      message: "Unable to save booking.",
    });
  }
});


// GET /api/bookings/:id
// Fetch a booking only if it belongs to the current user.
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      user: req.userId,
    }).lean();

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    return res.status(200).json({ booking });
  } catch (error) {
    console.error("Fetch booking details error:", error.message);

    return res.status(500).json({
      message: "Unable to fetch booking details.",
    });
  }
});

// PATCH /api/bookings/:id/cancel
router.patch("/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      user: req.userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if (["cancelled", "completed"].includes(booking.status)) {
      return res.status(400).json({
        message: `This booking cannot be cancelled because its status is ${booking.status}.`,
      });
    }

    // A paid booking requires verified cancellation and refund
    // handling by the relevant booking/payment provider.
    if (booking.paymentStatus === "paid") {
      return res.status(409).json({
        message:
          "This booking requires cancellation and refund verification before it can be cancelled.",
      });
    }

    if (booking.paymentStatus === "refund_pending") {
      return res.status(409).json({
        message: "A refund is already pending for this booking.",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      message: "Booking cancelled successfully.",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error.message);

    return res.status(500).json({
      message: "Unable to cancel booking.",
    });
  }
});

export default router;
