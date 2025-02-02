import { useState } from "react";
import { createContext } from "react";

export const UserProgressContext = createContext({
    progress: '',
    addCart: () => { },
    hideCart: () => { },
    addCheckout: () => { },
    hideCheckout: () => { },
});

export default function UserProgressContextProvider({ children }) {
    const [userProgress, setUserProgress] = useState('');

    function addCart() {
        setUserProgress('cart');
    }

    function hideCart() {
        setUserProgress('');
    }

    function addCheckout() {
        setUserProgress('checkout');
    }

    function hideCheckout() {
        setUserProgress('');
    }

    const userProgressContext = {
        progress: userProgress,
        addCart,
        hideCart,
        addCheckout,
        hideCheckout,
    };

    return <UserProgressContext.Provider value={userProgressContext}>{children}</UserProgressContext.Provider>
}