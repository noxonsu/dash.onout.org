import { createContext, useReducer } from "react";
import { Product } from "../../constants";

type Action = { type: string; payload: any };
type Dispatch = (action: Action) => void;
type UserState = {
  signed: boolean;
  view: string;
  products: Product[];
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
  addProduct: "addProduct",
  removeProduct: "addProduct",
};

const userReducer = (state: UserState, action: Action) => {
  switch (action.type) {
    case UserActions.changeView:
      return { ...state, view: action.payload };
    case UserActions.signed:
      return { ...state, signed: action.payload };
    case UserActions.addProduct:
      return { ...state, products: [...state.products, action.payload] };
    case UserActions.removeProduct:
      return {
        ...state,
        products: state.products.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
};

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, {
    view: "products",
    signed: false,
    products: [],
  });

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
