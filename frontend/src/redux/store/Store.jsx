// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from '../slice/UserSlice';

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
// });

// export default store;


import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default is localStorage
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slice/UserSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };
