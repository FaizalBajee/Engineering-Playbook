


//controllers/customer.controller.js
const Customer = require("../models/customer.model");

exports.getCustomers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      Customer.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Customer.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: customers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error("Customer Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers"
    });
  }
};
