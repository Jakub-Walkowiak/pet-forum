export const OK = {
    code: 200,
    message: 'Request success'
}

export const CREATED = {
    code: 201,
    message: 'Resource created successfully'
}

export const BAD_REQUEST = {
    code: 400,
    message: 'Invalid request body'
}

export const LOGIN_FAILED = {
    code: 401,
    message: 'Incorrent password'
}

export const NOT_FOUND = {
    code: 404,
    message: 'Endpoint not found',
}

export const ACCOUNT_NOT_FOUND = {
    code: 404,
    message: 'Account does not exist',
}

export const CONFLICT = {
    code: 409,
    message: 'Resource already exists'
}

export const INTERNAL_SERVER_ERROR = {
    code: 502,
    message: 'Server encountered error while processing request',
}