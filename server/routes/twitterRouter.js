const router = require('express').Router();
const twitterController = require('../controllers/twitterController');

router.route('/getTweetsForHashtag').post(twitterController.getTweetsForHashtag)

module.exports = router;