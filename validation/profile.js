const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
    let error = {};
    //isEmpty only takes string
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';


    if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
        error.handle = 'handle needs to be between 2 and 40 characters';
    }

    if (Validator.isEmpty(data.handle)) {
        error.handle = 'Profile handle is required';
    }

    if (Validator.isEmpty(data.status)) {
        error.status = 'Status field is required';
    }

    if (Validator.isEmpty(data.skills)) {
        error.skills = 'Skills field is required';
    }

    if (!isEmpty(data.website)) {
        if (!Validator.isURL(data.website)) {
            error.website = 'Not a valid URL';
        }
    }

    if (!isEmpty(data.youtube)) {
        if (!Validator.isURL(data.youtube)) {
            error.website = 'Not a valid Youtube URL';
        }
    }

    if (!isEmpty(data.facebook)) {
        if (!Validator.isURL(data.facebook)) {
            error.website = 'Not a valid Facebook URL';
        }
    }

    if (!isEmpty(data.twitter)) {
        if (!Validator.isURL(data.twitter)) {
            error.website = 'Not a valid Twitter URL';
        }
    }

    if (!isEmpty(data.linkedin)) {
        if (!Validator.isURL(data.linkedin)) {
            error.website = 'Not a valid Linkedin URL';
        }
    }


    return {
        error,
        isValid: isEmpty(error)
    };
};









