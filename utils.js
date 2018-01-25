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

  _utils.similarity = (s1, s2) => {
    const longer = s1;
    const shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - _editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  const _editDistance = (s1, s2) => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    let costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }


  Object.freeze(_utils);
  return _utils;

})();

module.exports = utils;