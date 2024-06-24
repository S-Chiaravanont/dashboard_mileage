import { createContext } from 'react';
// import { userType, userErrorType, userInvalidType } from './appContextType';
import { userType } from './appContextType';

type AppContextType = {
    user: userType | null;
    setUser: (newState: userType | null) => void;
}

const AppContext = createContext<AppContextType>({
    user: null,
    setUser: () => {}
});

export default AppContext
