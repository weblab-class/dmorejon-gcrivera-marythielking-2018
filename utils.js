const utils = (() => {

  let _utils = {};

  const asyncMiddleware = fn =>
  (req, res) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

  /*
    Send an error code with success:false and error message
    as provided in the arguments to the response argument provided.
    The caller of this function should return after calling
  */
  _utils.sendErrorResponse = (res, errorCode, error) => {
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