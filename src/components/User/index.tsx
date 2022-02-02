import { createContext, useReducer } from "react";

type Action = { type: string; payload: any };
type Dispatch = (action: Action) => void;
type UserState = {
  signed: boolean;
  view: string;
};

export const UserContext = createContext<
  | {
      state: UserState;
      dispatch: Dispatch;
    }
  | undefined
>(undefined);

export const UserActions = {
  changeView: "changeView",
  signed: "signed",
};

const userReducer = (state: UserState, action: Action) => {
  switch (action.type) {
    case UserActions.changeView:
      return { ...state, view: action.payload };
    case UserActions.signed:
      return { ...state, signed: action.payload };
    default:
      return state;
  }
};

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, {
    view: "",
    signed: false,
  });

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
