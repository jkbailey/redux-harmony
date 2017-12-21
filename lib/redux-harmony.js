export const createAsyncAction = (namespace, promise) => {
  const constants = {
    LOADING: `${namespace.toUpperCase()}_LOADING`,
    SUCCESS: `${namespace.toUpperCase()}_SUCCESS`,
    ERROR: `${namespace.toUpperCase()}_ERROR`
  }

  const loadingFunc = (args) => ({ type: constants.LOADING, args, status: {loading: true, error: false} })
  const successFunc = (data, args) => ({ type: constants.SUCCESS, args, data, status: {loading: false, error: false} })
  const errorFunc = (error, args) => ({ type: constants.ERROR, args, error, status: {loading: false, error: true} })

  const asyncFunc = (...args) => (dispatch, store) => {
    dispatch(loadingFunc(args));

    return promise(...args, store).then(
      data => {
        dispatch(successFunc(data, args));
        return data;
      },
      error => {
        dispatch(errorFunc(error, args));
        throw error;
      }
    )
  }

  return {
    ...constants,
    go: asyncFunc
  }
}

export const createAction = (type) => {
  const constants = {
    TYPE: type.toUpperCase()
  }

  const func = data => ({ type: constants.TYPE, data })

  return {
    ...constants,
    go: func
  }
}
