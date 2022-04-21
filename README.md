## redux

#### adding redux to react app

```console
npm install redux react-redux
```

create store.js to import 2 methods from redux then create an empty object that will pass as an arg to _combineReducers_ method that will pass as an arg to _createStore_ method that will assign to _configureStore_

```javascript
import { createStore, combineReducers } from "redux";
const reducers = {};
const rootReducer = combineReducers(reducers);
export const configureStore = () => createStore(rootReducer);
```

then open index.js and import _configureStore_ and _<Provider>_ then wrap _<App />_ with it with the configureStore props as an dependency injection

```javascript
import { Provider } from "react-redux";
import { configureStore } from "./store";
<Provider store={configureStore()}>
  <App />
</Provider>;
```

#### creating redux action

create redux/actions.js to assign 2 action types and arrow functions as action creators with payloads

```javascript
export const CREATE_TODO = "CREATE_TODO";
export const createTodo = (text) => ({
  type: CREATE_TODO,
  payload: { text },
});

export const REMOVE_TODO = "REMOVE_TODO";
export const removeTodo = (text) => ({
  type: REMOVE_TODO,
  payload: { text },
});
```

#### creating reducer

create redux/reduces.js, the reducer will get actions and state then will process them base on the action's type. for now we assign empty array to state..

```javascript
import { CREATE_TODO, REMOVE_TODO } from "./actions";

export const todos = (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_TODO: {
      const { text } = payload;
      const newTodo = {
        text,
        isCompleted: false,
      };
      return state.concat(newTodo);
    }
    case REMOVE_TODO: {
      const { text } = payload;
      return state.filter((todo) => todo.text !== text);
    }
    default:
      return state;
  }
};
```

then open store.js and import redux from reducer

```javascript
import { todos } from "./redux/reducers";
const reducers = { todos };
```

#### connecting components to store

we will connect components to the store with connect higher order function

> connect()(NewTodoForm)

open NewTodoForm, import connect function and actions to pass connect function as an argument
create 2 arrow function,one returns state. one returns action as a dispatch,and assign them to  
_mapStateToProps_ and _mapDispatchToProps_ to pass them as an arg to connect higher order function.Lastly add the logic checking if the todo is dublicated.

```javascript
import { connect } from "react-redux";
import { createTodo } from "./actions";

<button
  onClick={() => {
    const isDuplicateText = todos.some((todo) => todo.text === inputValue);
    if (isDuplicateText) return;
    onCreatePressed(inputValue);
    setInputValue("");
  }}
>

const mapStateToProps = (state) => ({ todos: state.todos });

const mapDispatchToProps = (dispatch) => ({
  onCreatePressed: (text) => dispatch(createTodo(text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewTodoForm);
```

#### persisting redux store

```console
npm install redux-persist
```

Redux-persist use local storage to persist data

```javascript
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const configureStore = () => createStore(persistedReducer);
```

then open index.js

```javascript
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/lib/integration/react";

const store = configureStore();
const persistor = persistStore(store);
<Provider store={store}>
  <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
    <App />
  </PersistGate>
</Provider>;
```

#### redux dev tool

in store.js place **_window.**REDUX_DEVTOOLS_EXTENSION** && window.**REDUX_DEVTOOLS_EXTENSION**()_** in createStore to dispatch action and test, we can also tract the states.

```javascript
export const configureStore = () =>
  createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
```
