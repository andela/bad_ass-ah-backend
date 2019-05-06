import express from 'express';
import Search from '../../controllers/search';
import validation from '../../helpers/search';

const router = express.Router();
const search = new Search();

// @method POST
// @desc search item
// @access public

router.post('/', validation, search.searchItem);

export default router;
