const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // Cek email sudah terdaftar
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({ message: "Email sudah terdaftar" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashed,
      role: role || "student",
    });

    await user.save();

    res.status(201).json({
      message: "Registrasi berhasil",
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Cari user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email belum terdaftar" });

    // Cek password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Password salah" });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
