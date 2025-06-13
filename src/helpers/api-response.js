exports.catchedErrorResponse = (res, msg, data) => {
    const resData = {
        status: 500,
        message: msg,
        error_message: data
    };
    return res.status(500).json(resData);
}

exports.validationErrorWithData = (res, msg, data) => {
    const resData = {
        status: 422,
        message: msg,   
        data: data
    };
    return res.status(422).json(resData);
}

exports.successResponse = (res, msg) => {
    const resData = {
        status: 200,
        message: msg
    };
    return res.status(200).json(resData);
}

exports.successResponseWithData = (res, msg, data) => {
    const resData = {
        status: 200,
        message: msg,
        data: data
    };
    return res.status(200).json(resData);
}

exports.errorResponse = (res, msg) => {
    const resData = {
        status: 400,
        message: msg
    };
    return res.status(400).json(resData);
}

exports.unAuthorizedResponse = (res, msg) => {
    const resData = {
        status: 401,
        message: msg,
    };
    return res.status(401).json(resData);
}