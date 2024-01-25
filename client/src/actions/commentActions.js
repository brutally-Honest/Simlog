import axios from "../config/axios";
export const startCreateComment = (comment) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post(
        `/api/blogs/${comment.blogId}/comments`,
        { body: comment.body },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      dispatch(setComment(data));
    } catch (e) {
      console.log(e.response.data.errors);
    }
  };
};

const setComment = (comment) => {
  return { type: "ADD_COMMENT", payload: comment };
};

export const startGetComments = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/comments/${id}`);
      console.log(data);
      dispatch(setComments(data));
    } catch (e) {
      console.log(e.response);
    }
  };
};

const setComments = (comments) => {
  return { type: "SET_COMMENTS", payload: comments };
};

export const startDeleteComment = (bId, cId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.delete(`/api/blogs/${bId}/comments/${cId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      dispatch(deleteComment(data._id));
    } catch (e) {
      console.log(e.response);
    }
  };
};

const deleteComment = (comment) => {
  return { type: "DELETE_BLOG", payload: comment };
};

export const startEditComment=(bId,cId,body)=>{
    return async(dispatch)=>{
        try{
            const {data}=await axios.put(`/api/blogs/${bId}/comments/${cId}`,{body},{
                headers: { Authorization: localStorage.getItem("token") },
              })
              dispatch(editComment(data))
        }catch(e){
            console.log(e.response);
        }
    }
}

const editComment=(comment)=>{
    return {type:"EDIT_COMMENT",payload:comment}
}