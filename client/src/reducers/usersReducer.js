const initialState={
users:[],
isLoggedIn:false
}
 
export const usersReducer=(state=initialState,action)=>{
    switch(action.type){
        case 'LOGIN':
            return {...state,isLoggedIn:true}
        case 'LOGOUT':
            return {...state,isLoggedIn:false,users:[]}
        case "SET_USERS":
            return {...state,users:action.payload}
            //after deleteing users
        case "FILTER_USERS":
            return {...state,users:[...state.users.filter(e=>e._id!=action.payload)]}
        case "ROLE_CHANGE":
            return {
                ...state,
                users:[...state.users.map(e=>{
                    if(e._id===action.payload._id)
                    return action.payload
                else return {...e}
                })]
            }
        default:
            return {...state}
    }
}