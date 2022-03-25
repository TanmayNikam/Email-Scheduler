const express = require("express");
const router = express.Router();
const { sendMail,getTemplate, setTemplate } = require("./../controllers/mails");

router.post("/mail", sendMail);

router.post("/mailTemplate", setTemplate)
router.get("/mailTemplate",getTemplate)

module.exports = router;