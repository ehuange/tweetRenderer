const router = require('express').Router();
const twitterRouter = require('../routes/twitterRouter.js');

router.use('/twitter', twitterRouter);

module.exports = router;