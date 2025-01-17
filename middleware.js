const admin = require("./firebase.config");
class Middleware {
  async decodeToken(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodeValue = await admin.auth().verifyIdToken(token);
      if (decodeValue) {
        req.user = decodeValue;
        console.log(JSON.stringify(req.user, null, 2));
        return next();
      }
      return res.json({ message: "Un authorize" });
    } catch (e) {
      return res.json({ message: "Internal Error" });
    }
  }
}

module.exports = new Middleware();
