/**
 * Handler sync await promises
 * @param {callback} callback - handle async function
 * @return {async} function with req, res, and next params
 */
function asyncHandler(callback) {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (err) {
      const errStatus = err.statusCode || 500;
      const errMsg = errStatus === 500 ? 'Something failed: Try again!' : err.message;
      res.status(errStatus).send({
        status: errStatus,
        errors: {
          body: [errMsg]
        }
      });
    }
  };
}

export default asyncHandler;
