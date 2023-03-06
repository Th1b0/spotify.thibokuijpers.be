const { getNewaccess_token } = require("../helper/refreshAccesToken");

async function authenticate(req, res, next) {
  let access_token = req.cookies.access_token;
  const refresh_token = req.cookies.refresh_token;
  if (!refresh_token) res.redirect("/auth/unauthorized");
  if (!access_token) {
    try {
      const access_token = await getNewaccess_token(refresh_token);
      res.cookie("access_token", access_token, {
        httpOnly: true,
        maxAge: 3600 * 1000,
      });
      req.access_token = access_token;
      return next();
    } catch (error) {
      console.log(error);
      res.redirect("/auth/unauthorized");
    }
  } else {
    req.access_token = access_token;
    return next();
  }
}
module.exports = { authenticate };
