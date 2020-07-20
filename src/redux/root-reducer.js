import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import shopReducer from './shop/shop.reducer';
import userReducer from './user/user.reducer';
import cartReducer from './cart/cart.reducer';
import snackBarReducer from './snackbar/snackbar.reducer';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'cart']
}

const rootReducer = combineReducers({
    shop: shopReducer,
    user: userReducer,
    cart: cartReducer,
    snackbar: snackBarReducer
})

export default persistReducer(persistConfig,rootReducer);