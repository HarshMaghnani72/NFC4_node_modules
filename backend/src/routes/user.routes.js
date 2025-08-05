const router = express.Router();
const { updateProfile, getProfile, reportUser, togglePrivacy } = require('../controllers/user.controller');

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/report', reportUser);
router.put('/privacy', togglePrivacy);

module.exports = router;