import { createContext, useReducer } from "react";

export const CartContext = createContext({
    items: [],
    addItem: (item) => { },
    removeItem: (id) => { },
    clearCart: () => { },
});

function cartReducer(state, action) {
    if (action.type === 'ADD_ITEM') {
        const exstingCartItemIndex = state.items.findIndex((item) =>
            item.id === action.item.id);

        const updatedItems = [...state.items];

        if (exstingCartItemIndex > -1) {
            const exstingCartItem = state.items[exstingCartItemIndex];
            const updatedItem = {
                ...exstingCartItem,
                quantity: exstingCartItem.quantity + 1
            };
            updatedItems[exstingCartItemIndex] = updatedItem;
        } else {
            updatedItems.push({ ...action.item, quantity: 1 });
        }

        return { ...state, items: updatedItems }
    }

    if (action.type === 'REMOVE_ITEM') {
        const exstingCartItemIndex = state.items.findIndex((item) =>
            item.id === action.id);

        const exstingCartItem = state.items[exstingCartItemIndex];
        const updatedItems = [...state.items];
        
        if (exstingCartItem.quantity === 1) {
            updatedItems.splice(exstingCartItemIndex, 1);
        } else {
            const updatedItem = {
                ...exstingCartItem,
                quantity: exstingCartItem.quantity - 1
            };
            updatedItems[exstingCartItemIndex] = updatedItem;
        }
        return { ...state, items: updatedItems }
    }

    if (action.type === 'CLEAR_CART') {
        return { ...state, items: [] }
    }

    return state;
}

export default function CartContextProvider({ children }) {
    const [cartState, cartDispatch] = useReducer(cartReducer, { items: [] });
    
    function addItem(item) {
        cartDispatch({ type: 'ADD_ITEM', item });
    }

    function removeItem(id) {
        cartDispatch({ type: 'REMOVE_ITEM', id });
    }

    function clearCart() {
        cartDispatch({ type: 'CLEAR_CART'});
    }
    
    const cartContext = {
        items: cartState.items,
        addItem,
        removeItem,
        clearCart
    };
console.log(cartContext);
    return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
}
