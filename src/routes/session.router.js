import { Router } from "express";
import userModel from "../dao/mongo/models/user.js";


const router = Router();

router.post('/register', async (req, res) => {
  const result = await userModel.create(req.body);
  res.send({ status: "success", payload: result });
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.user = {
      name: `Admin`,
      role: "admin",
      email: "..."
    }
    return res.sendStatus(200);
  }

  const user = await userModel.findOne({ email, password });
  if (!user) return res.status(400).send({ status: "error", error: "Usuario o contraseña incorrectas" });

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email
  }
  res.sendStatus(200);
})

router.post('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ status: "error", error: "Error al cerrar la sesión" });
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

export default router;