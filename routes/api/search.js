import express from 'express';
import Search from '../../controllers/search';
import validation from '../../helpers/search';

const router = express.Router();

// @method POST
// @desc search item
// @access public

router.post('/', validation, Search.searchItem);

export default router;
