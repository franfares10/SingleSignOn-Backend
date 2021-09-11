const { response } = require("express");

const login = async (req, res = response) => {
  try {
    res.json({
      ok: true,
      method: "login"
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      method: "login",
      msg: "An unexpected error has occurred.",
    });
  }
};

module.exports={login}
