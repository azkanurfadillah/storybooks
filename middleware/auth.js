module.exports = {
  ensureAuth: function (req, res, next) {
    console.log("AUTH isauthenticated middleware", req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },

  ensureGuest: function (req, res, next) {
    console.log("GUEST is authenticated middleware", req.isAuthenticated());
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      return next();
    }
  },
};
