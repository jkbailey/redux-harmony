[![Build Status](https://travis-ci.org/jkbailey/redux-harmony.svg?branch=master)](https://travis-ci.org/jkbailey/redux-harmony)

# redux-harmony
Bring harmony to your redux actions, requires `redux-thunk` middleware

# Installation
```sh
$ yarn add redux-harmony
```
or
```sh
$ npm install -s redux-harmony
```

# Functions
```js
createAsyncAction(namespace, promise)
```
Creates an async redux action with the given promise function
  - arguments
    - **namespace** *(string)* The namespace you want for the action constants
    - **promise** *(function)* The function to call for this action
  - returns
    - *(object)* Returns an object with properties `LOADING` `SUCCESS` `ERROR` and `go`
      - **LOADING** *(string)* The constant dispatched before the promise is called
      - **SUCCESS** *(string)* The constant dispatched upon a resolved promise
      - **ERROR** *(string)* The constant dispatched upon a rejected promise
      - **go** *(function)* The async action creator to call (requires redux-thunk)

```js
createAction(type)
```
Updates an object if it exists (by `id`) in the array.
  - arguments
    - **type** *(string)* The constant to be used for this action
  - returns
    - *(object)* Returns an object with properties `TYPE` and `go`
      - **TYPE** *(string)* The constant for this action
      - **go** *(function)* The action creator to dispatch

# Action Objects
```js
// LOADING
{
  type: '[namespace]_LOADING',
  args: [<Arguments>],
  status: {
    loading: true,
    error: false
  }
}
```
```js
// SUCCESS
{
  type: '[namespace]_SUCCESS',
  args: [<Arguments>],
  data: <Response>
  status: {
    loading: false,
    error: false,
    lastSuccess: <Date>
  }
}
```
```js
// ERROR
{
  type: '[namespace]_ERROR',
  args: [<Arguments>],
  error: <Error>,
  status: {
    loading: false,
    error: true,
    lastError: <Date>
  }
}
```


# Usage
```js
// actions/payment.js

import API from './api'
import { createAsyncAction, createAction } from 'redux-harmony'

export const makePayment = createAsyncAction('PAYMENT', API.makePayment)

export const updatePayment = createAction("PAYMENT_UPDATE")
```

```js
// reducers/payment.js

import { makePayment } from '../actions/payment';

const payment = (state = {}, action) => {
	switch (action.type) {
    case makePayment.LOADING:
    case makePayment.ERROR:
      return {
        ...state,
        ...action.status
      }
    case makePayment.SUCCESS:
    	return {
    		...state,
        ...action.data,
        ...action.status
    	}
    default:
      return state
	}
}

export default payment
```

```js
// components/payment.js

import React from 'react';
import { View } from 'react-native';
import Button from './Button';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { makePayment } from '../actions/payment';

class MakePayment extends React.Component {

  makePayment = () => this.props.makePayment(this.props.payment)

  render = () => (
    <View>
      <Button
        onPress={this.makePayment}
        text="Pay Now"
      />
    </View>
  )

}

// Connect to store
const mapStoreToProps = store => ({
  payment: store.payment
})

const mapDispatchToProps = dispatch => bindActionCreators({
  makePayment: makePayment.go
}, dispatch)

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(MakePayment)

```
