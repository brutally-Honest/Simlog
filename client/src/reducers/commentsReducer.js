const initialState = {
    data: [],
  };
  export const commentsReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_COMMENTS":
        return { ...state, data: action.payload };
      case "ADD_COMMENT":
        return { ...state, data: [...state.data, action.payload] };
      case "DELETE_BLOG":
        return {
          ...state,
          data: state.data.filter((e) => e._id !== action.payload),
        };
      case "CLEAR_COMMENTS":
        return { ...initialState };
      case "EDIT_COMMENT":
        return {
          ...state,
          data: state.data.map((e) => {
            if (e._id === action.payload._id) return { ...action.payload };
            else return { ...e };
          }),
        };
      default:
        return { ...state };
    }
  };
  