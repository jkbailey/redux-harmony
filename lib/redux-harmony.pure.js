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

  var loadingFunc = function loadingFunc(props) {
    return {
      type: constants.LOADING,
      props: props,
      status: { loading: true, error: false }
    };
  };
  var successFunc = function successFunc(data, props) {
    return {
      type: constants.SUCCESS,
      props: props,
      data: data,
      status: { loading: false, error: false }
    };
  };
  var errorFunc = function errorFunc(error, props) {
    return {
      type: constants.ERROR,
      props: props,
      error: error,
      status: { loading: false, error: true }
    };
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
      dispatch(loadingFunc(_extends({}, args)));

      return promise.apply(undefined, args.concat([store])).then(
        function(data) {
          dispatch(successFunc(data, _extends({}, args)));
          return data;
        },
        function(error) {
          dispatch(errorFunc(error, _extends({}, args)));
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
