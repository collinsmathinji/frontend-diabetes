import { createContext, useReducer, useEffect } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      // Perform the LOGIN action to set the user data
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);

  console.log('AuthContext state:', state);

  return (
    <AuthContextProvider value={{ ...state, dispatch }}>
      {children}
    </AuthContextProvider>
  );
};
