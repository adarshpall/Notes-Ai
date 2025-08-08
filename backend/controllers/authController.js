// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); 

// const register = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ error: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({ email, password: hashedPassword });

   
//     const token = jwt.sign(
//       { id: user._id.toString(), email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.status(201).json({ token, userId: user._id });
//   } catch (err) {
//     console.error(" Registration error:", err.message);
//     res.status(500).json({ error: "Registration failed" });
//   }
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(400).json({ error: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id.toString(), email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({ token, userId: user._id });
//   } catch (err) {
//     console.error(" Login error:", err.message);
//     res.status(500).json({ error: "Login failed" });
//   }
// };

// module.exports = { register, login };
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { register, login };
