import React from 'react';
import merge from 'lodash/merge';

export const GlobalStateContext = React.createContext({});
GlobalStateContext.displayName = 'GlobalStateContext';

export const useGlobalState = () => {
  const context = React.useContext(GlobalStateContext);

  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }

  return context;
};

export const GlobalStateProvider = ({
  children,
  initialState = {},
}: {
  children: any;
  initialState: any;
}) => {
  const [globalState, setGlobalState] = React.useState(initialState);

  const customSetGlobalState = (data: any) =>
    setGlobalState({ ...merge(globalState, data) });

  React.useEffect(() => {
    customSetGlobalState(initialState);
  }, [
    initialState.expoPushToken,
    initialState.token,
    initialState.countNotifications,
    initialState.internal,
    initialState.loggedIn,
  ]);

  return (
    <GlobalStateContext.Provider
      value={{
        setGlobalState: customSetGlobalState,
        globalState,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
