import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers =
    (typeof window !== 'undefined' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

const sagaMiddleware = createSagaMiddleware({
    onError: (error, { sagaStack }) => {
        console.error('Wystąpił błąd w saga:', error);
        console.error('Stos wywołań saga:', sagaStack);
    }
});

const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('Dispatching action:', action);
    }
    const result = next(action);
    if (process.env.NODE_ENV === 'development') {
        console.log('Next state:', store.getState());
    }
    return result;
};

const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(
            sagaMiddleware,
            loggerMiddleware
        )
    )
);

sagaMiddleware.run(rootSaga);

export default store;