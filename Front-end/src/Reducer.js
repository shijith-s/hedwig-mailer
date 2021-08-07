export const initialState = {
  userID: null,
  name: null,
  token: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_USER":
      return { name: action.name, userID: action.userID, token: action.token };

    case "REMOVE_USER":
      return { name: null, userId: null, token: null };

    default:
      return state;
  }
};

export default reducer;
