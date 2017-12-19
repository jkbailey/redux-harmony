"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var createAsyncAction = (exports.createAsyncAction = function createAsyncAction(
  namespace,
  promise
) {
  var constants = {
    LOADING: namespace.toUpperCase() + "_LOADING",
    SUCCESS: namespace.toUpperCase() + "_SUCCESS",
    ERROR: namespace.toUpperCase() + "_ERROR"
  };

  var loadingFunc = function loadingFunc() {
    return { type: constants.LOADING };
  };
  var successFunc = function successFunc(data) {
    return { type: constants.SUCCESS, data: data };
  };
  var errorFunc = function errorFunc(error) {
    return { type: constants.ERROR, error: error };
  };

  var asyncFunc = function asyncFunc() {
    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    return function(dispatch, store) {
      dispatch(loadingFunc());

      return promise.apply(undefined, args.concat([store])).then(
        function(data) {
          dispatch(successFunc(data));
          return data;
        },
        function(error) {
          dispatch(errorFunc(error));
          throw error;
        }
      );
    };
  };

  return _extends({}, constants, {
    go: asyncFunc
  });
});

var createAction = (exports.createAction = function createAction(type) {
  var constants = {
    TYPE: type.toUpperCase()
  };

  var func = function func(data) {
    return { type: constants.TYPE, data: data };
  };

  return _extends({}, constants, {
    go: func
  });
});
