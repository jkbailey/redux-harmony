export const createAsyncAction = (namespace, promise) => {
  const constants = {
    LOADING: `${namespace.toUpperCase()}_LOADING`,
    SUCCESS: `${namespace.toUpperCase()}_SUCCESS`,
    ERROR: `${namespace.toUpperCase()}_ERROR`
  }

  const loadingFunc = () => ({ type: constants.LOADING })
  const successFunc = data => ({ type: constants.SUCCESS, data })
  const errorFunc = error => ({ type: constants.ERROR, error })

  const asyncFunc = (...args) => (dispatch, store) => {
    dispatch(loadingFunc());

    return promise(...args, store).then(
      data => {
        dispatch(successFunc(data));
        return data;
      },
      error => {
        dispatch(errorFunc(error));
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
