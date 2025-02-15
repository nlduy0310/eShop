let models = require("../models")
models.sequelize.sync().then(() => console.log("models synced"))
