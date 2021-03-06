"use strict";

var util = require("util");
var constants = require("./constants");

function ActivityStateExceptionError(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
}

util.inherits(ActivityStateExceptionError, Error);

function Cancelled() {
    ActivityStateExceptionError.call(this, "Activity execution has been cancelled.");
}

util.inherits(Cancelled, ActivityStateExceptionError);

function Idle(message) {
    ActivityStateExceptionError.call(this, message || "Activity is idle.");
}

util.inherits(Idle, ActivityStateExceptionError);

function ActivityMarkupError(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
}

util.inherits(ActivityMarkupError, Error);

function ActivityRuntimeError(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
}

util.inherits(ActivityRuntimeError, Error);

function BookmarkNotFoundError(message) {
    ActivityRuntimeError.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
}

util.inherits(BookmarkNotFoundError, ActivityRuntimeError);

function AggregateError(errors) {
    var message = "";
    if (errors.length) {
        message = " First: " + errors[0].message;
    }
    ActivityRuntimeError.call(this, "Many errors occurred." + message);
    this.errors = errors;
}

util.inherits(AggregateError, ActivityRuntimeError);

function ValidationError(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
}

util.inherits(ValidationError, Error);

function TimeoutError(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
}

util.inherits(TimeoutError, Error);

function WorkflowError(message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
}

util.inherits(WorkflowError, Error);

function MethodNotFoundError(message) {
    WorkflowError.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
}

util.inherits(MethodNotFoundError, WorkflowError);

function MethodIsNotAccessibleError(message) {
    WorkflowError.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
}

util.inherits(MethodIsNotAccessibleError, WorkflowError);

function WorkflowNotFoundError(message) {
    WorkflowError.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
}

util.inherits(WorkflowNotFoundError, WorkflowError);

module.exports.ActivityStateExceptionError = ActivityStateExceptionError;
module.exports.ActivityExceptionError = ActivityStateExceptionError;
module.exports.Cancelled = Cancelled;
module.exports.Idle = Idle;
module.exports.AggregateError = AggregateError;
module.exports.ActivityMarkupError = ActivityMarkupError;
module.exports.ActivityRuntimeError = ActivityRuntimeError;
module.exports.ValidationError = ValidationError;
module.exports.TimeoutError = TimeoutError;
module.exports.WorkflowError = WorkflowError;
module.exports.MethodNotFoundError = MethodNotFoundError;
module.exports.MethodIsNotAccessibleError = MethodIsNotAccessibleError;
module.exports.WorkflowNotFoundError = WorkflowNotFoundError;
module.exports.BookmarkNotFoundError = BookmarkNotFoundError;
//# sourceMappingURL=errors.js.map
