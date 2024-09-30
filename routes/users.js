const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Biblioteca = require('../model/Biblioteca');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verifyToken } = require('../middleware/verify');



router.get("/",verifyToken, async (req, res) => {
    const users = await User.findAll();
    res.json(users).status(200);
  });

  router.get("/biblioteca", async (req, res) => {
    const biblio = await Biblioteca.findAll();
    res.json(biblio).status(200);
  });

router.post("/register", async (req, res) => {


    const newUser = req.body;
  
    const user = await User.findOne({ where: { email: newUser.email } });
  
    if (!user) {
      await User.create(newUser);
  
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        process.env.SECRET,
        { expiresIn: "1h" }
      );
  
      res
        .status(201)
        .json({ message: "User created successfully", token: token });
    } else {
      return res.status(401).json({ message: "User already exists" });
    }
  });
  
  router.post("/login", async (req, res) => {
  
  
    const loginUser = req.body;
  
    const user = await User.findOne({ where: { email: loginUser.email } });
  
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    else 
    {
      const valid =  await bcrypt.compare(loginUser.password, user.password);
      
  
      if (valid) {
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.SECRET,
          { expiresIn: "1h" }
        );
  
        res.status(200).json({ message: "User logged in", token: token });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }
  });

  module.exports = router;