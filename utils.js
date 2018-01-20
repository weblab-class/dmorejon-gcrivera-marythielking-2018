const utils = (() => {

  let _utils = {};

  _utils.requireAuthentication = (req, res, next) => {
    if (!req.user) {
      _utils.sendErrorResponse(res, 403, 'Must be logged in to use this feature.');
    } else {
      next();
    }
  };

  /*
    Send an error code with success:false and error message
    as provided in the arguments to the response argument provided.
    The caller of this function should return after calling
  */
  _utils.sendErrorResponse = (res, errorCode, error) => {
    if (errorCode === undefined) {errorCode = 400}
    res.status(errorCode).json({
      success: false,
      err: error
    }).end();
  };

  /*
    Send a 200 OK with success:true in the request body to the
    response argument provided.
    The caller of this function should return after calling
  */
  _utils.sendSuccessResponse = (res, content) => {
    res.status(200).json({
      success: true,
      content: content
    }).end();
  };

  Object.freeze(_utils);
  return _utils;

})();

module.exports = utils;