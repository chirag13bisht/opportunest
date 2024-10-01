// src/Components/reducer/useReducer.js

export const initialState = {
    isAuthenticated: false,
    user: null,
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'USER':
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                user: action.payload.user,
            };
        default:
            return state;
    }
};
