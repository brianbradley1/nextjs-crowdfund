// second set of parenthesis means function will be invoked directly after this is called
const routes = require("next-routes")();

routes
  .add("/campaigns/new", "/campaigns/new")
  .add("/campaigns/:address", "/campaigns/show")
  .add("/campaigns/:address/requests", "/requests/index")
  .add("/campaigns/:address/requests/new", "/requests/new");

module.exports = routes;
