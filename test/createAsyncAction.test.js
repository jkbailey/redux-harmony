// var expect    = require("chai").expect;
// var harmony = require("../lib/redux-harmony.pure");
//
// const createAction = harmony.createAction;
// const createAsyncAction = harmony.createAsyncAction;
//
// import configureStore from 'redux-mock-store'
// import thunk from 'redux-thunk'
//
// const middlewares = [thunk] // add your middlewares like `redux-thunk`
// const mockStore = configureStore(middlewares)
//
// var promise1 = new Promise(function(resolve, reject) {
//   setTimeout(function() {
//     resolve({name: 'Jerry'});
//   }, 300);
// });
//
// describe("createAsyncAction", function() {
//   it("returns data", function() {
//     const store = mockStore({})
//     const action = createAsyncAction('ACTION', promise1)
//
//     let arr = [
//       {id: 1, name: 'Jerry'},
//       {id: 2, name: 'Jeremy'}
//     ];
//     let newArr = _i.create(arr, {id: 3, name: 'Jason'});
//
//     expect(arr).to.deep.equal([
//       {id: 1, name: 'Jerry'},
//       {id: 2, name: 'Jeremy'}
//     ]);
//   });
// });



import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { createAction, createAsyncAction } from "../lib/redux-harmony.pure";

const SERVER_DATA = {id: 12}
const USER_DATA = {name: "Jerry"}

const mockStore = configureStore([thunk])

const mockFetch = arg => data => new Promise((...args) => {
  setTimeout(function() {
    args[arg]({...SERVER_DATA, ...data});
  }, 5);
});

const mockFetchSuccess = mockFetch(0)
const mockFetchError = mockFetch(1)

const startDate = Date.now()

test('go is a function', () => {
  const action = createAsyncAction('ACTION', mockFetchSuccess)
  expect(typeof action.go).toBe('function');
});

test('LOADING is ACTION_LOADING', () => {
  const action = createAsyncAction('ACTION', mockFetchSuccess)
  expect(action.LOADING).toBe('ACTION_LOADING');
});

test('SUCCESS is ACTION_SUCCESS', () => {
  const action = createAsyncAction('ACTION', mockFetchSuccess)
  expect(action.SUCCESS).toBe('ACTION_SUCCESS');
});

test('ERROR is ACTION_ERROR', () => {
  const action = createAsyncAction('ACTION', mockFetchSuccess)
  expect(action.ERROR).toBe('ACTION_ERROR');
});

test('LOADING gets dispatched', () => {
  const store = mockStore({})
  const action = createAsyncAction('ACTION', mockFetchSuccess)
  const boundAction = action.go(USER_DATA)

  return boundAction(store.dispatch, store.getState).then(d => {
    expect(store.getActions()[0].type).toBe('ACTION_LOADING')
  })
});

test('SUCCESS gets dispatched', () => {
  const store = mockStore({})
  const action = createAsyncAction('ACTION', mockFetchSuccess)
  const boundAction = action.go(USER_DATA)

  return boundAction(store.dispatch, store.getState).then(d => {
    expect(store.getActions()[1].type).toBe('ACTION_SUCCESS')
  })
});

test('ERROR gets dispatched', () => {
  const store = mockStore({})
  const action = createAsyncAction('ACTION', mockFetchError)
  const boundAction = action.go(USER_DATA)

  return boundAction(store.dispatch, store.getState).catch(d => {
    expect(store.getActions()[1].type).toBe('ACTION_ERROR')
  })
});

test('SUCCESS contains data from server', () => {
  const store = mockStore({})
  const action = createAsyncAction('ACTION', mockFetchSuccess)
  const boundAction = action.go(USER_DATA)

  return boundAction(store.dispatch, store.getState).then(d => {
    expect(store.getActions()[1].data).toEqual({...SERVER_DATA, ...USER_DATA})
  })
});

test('LOADING contains a status object', () => {
  const store = mockStore({})
  const action = createAsyncAction('ACTION', mockFetchSuccess)
  const boundAction = action.go(USER_DATA)

  return boundAction(store.dispatch, store.getState).then(d => {
    expect(typeof store.getActions()[0].status).toEqual('object')
  })
});

test('SUCCESS contains a status object', () => {
  const store = mockStore({})
  const action = createAsyncAction('ACTION', mockFetchSuccess)
  const boundAction = action.go(USER_DATA)

  return boundAction(store.dispatch, store.getState).then(d => {
    expect(typeof store.getActions()[1].status).toEqual('object')
  })
});

test('ERROR contains a status object', () => {
  const store = mockStore({})
  const action = createAsyncAction('ACTION', mockFetchError)
  const boundAction = action.go(USER_DATA)

  return boundAction(store.dispatch, store.getState).catch(d => {
    expect(typeof store.getActions()[1].status).toEqual('object')
  })
});

test('LOADING contains correct status object', () => {
  const store = mockStore({})
  const action = createAsyncAction('ACTION', mockFetchSuccess)
  const boundAction = action.go(USER_DATA)

  return boundAction(store.dispatch, store.getState).then(d => {
    expect(store.getActions()[0].status).toEqual({loading: true, error: false})
  })
});

test('SUCCESS contains correct status object', () => {
  const store = mockStore({})
  const action = createAsyncAction('ACTION', mockFetchSuccess)
  const boundAction = action.go(USER_DATA)

  return boundAction(store.dispatch, store.getState).then(d => {
    expect(store.getActions()[1].status).toMatchObject({
      loading: false,
      error: false,
      lastSuccess: expect.any(Number)
    })
  })
});

test('ERROR contains correct status object', () => {
  const store = mockStore({})
  const action = createAsyncAction('ACTION', mockFetchError)
  const boundAction = action.go(USER_DATA)

  return boundAction(store.dispatch, store.getState).catch(d => {
    expect(store.getActions()[1].status).toMatchObject({
      loading: false,
      error: true,
      lastError: expect.any(Number)
    })
  })
});
