"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAction = exports.createAsyncAction = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createAsyncAction = function createAsyncAction(namespace, promise) {
  var constants = {
    LOADING: "".concat(namespace.toUpperCase(), "_LOADING"),
    SUCCESS: "".concat(namespace.toUpperCase(), "_SUCCESS"),
    ERROR: "".concat(namespace.toUpperCase(), "_ERROR")
  };

  var loadingFunc = function loadingFunc(args) {
    return {
      type: constants.LOADING,
      args: args,
      status: {
        loading: true,
        error: false
      }
    };
  };

  var successFunc = function successFunc(data, args) {
    return {
      type: constants.SUCCESS,
      args: args,
      data: data,
      status: {
        loading: false,
        error: false,
        lastSuccess: Date.now()
      }
    };
  };

  var errorFunc = function errorFunc(error, args) {
    return {
      type: constants.ERROR,
      args: args,
      error: error,
      status: {
        loading: false,
        error: true,
        lastError: Date.now()
      }
    };
  };

  var asyncFunc = function asyncFunc() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return function (dispatch, store) {
      dispatch(loadingFunc(args));
      return promise.apply(void 0, args.concat([store])).then(function (data) {
        dispatch(successFunc(data, args));
        return data;
      }, function (error) {
        dispatch(errorFunc(error, args));
        throw error;
      });
    };
  };

  return _objectSpread({}, constants, {
    go: asyncFunc
  });
};

exports.createAsyncAction = createAsyncAction;

var createAction = function createAction(type) {
  var constants = {
    TYPE: type.toUpperCase()
  };

  var func = function func(data) {
    return {
      type: constants.TYPE,
      data: data
    };
  };

  return _objectSpread({}, constants, {
    go: func
  });
};

exports.createAction = createAction;
