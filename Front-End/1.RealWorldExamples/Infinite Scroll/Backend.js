exports.getCustomers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const skip = (page - 1) * limit;

    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Customer.countDocuments();

    const hasMore = page * limit < total;

    res.status(200).json({
      success: true,
      data: customers,
      hasMore
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
