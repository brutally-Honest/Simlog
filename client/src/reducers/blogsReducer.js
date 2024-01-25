const initialState = {
  data: [],
};
export const blogsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BLOGS":
      return {...state,data:action.payload}
    case "ADD_BLOG":
      return { ...state, data: [...state.data, action.payload] };
    case "DELETE_BLOG":
      return {
        ...state,
        data: state.data.filter((e) => e._id !== action.payload),
      };
    case "EDIT_BLOG":
      return {
        ...state,
        data: state.data.map((e) => {
          if (e._id === action.payload._id) return { ...action.payload };
          else return { ...e };
        }),
      };
    case "CLEAR_BLOGS":
      return { ...initialState };
    default:
      return { ...state };
  }
};
