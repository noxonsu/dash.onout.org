import { createContext, useReducer } from "react";
import { saveLocal } from "../../helpers/storage";
import { Product } from "../../constants";

type Action = { type: string; payload: any };
type Dispatch = (action: Action) => void;
type UserState = {
  signed: boolean;
  subscribed: boolean;
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
  subscribed: "subscribed",
  addProduct: "addProduct",
  removeProduct: "addProduct",
  paid: "paid",
};

const userReducer = (state: UserState, action: Action) => {
  switch (action.type) {
    case UserActions.changeView:
      return { ...state, view: action.payload };

    case UserActions.signed:
      return { ...state, signed: action.payload };

    case UserActions.subscribed:
      return { ...state, subscribed: action.payload };

    case UserActions.addProduct:
      return { ...state, products: [...state.products, action.payload] };

    case UserActions.removeProduct:
      return {
        ...state,
        products: state.products.filter((item) => item.id !== action.payload),
      };

    case UserActions.paid:
      const { key, value } = action.payload;
      saveLocal({ key, value });
      return state;

    default:
      return state;
  }
};

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(userReducer, {
    view: "products",
    signed: false,
    subscribed: false,
    products: [],
  });

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
