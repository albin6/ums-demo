export let store: any = null;

export const injectStore = (injectedStore: any) => {
  store = injectedStore;
};

export const dispatchLogout = (userType: 'user' | 'admin') => {
  if (store) {
    if (userType === 'user') {
      store.dispatch({ type: 'auth/logoutUser' });
    } else {
      store.dispatch({ type: 'auth/logoutAdmin' });
    }
  }
};

export const getStoredState = () => {
  if (store) {
    return store.getState();
  }
  return null;
};