import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardText,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
} from "reactstrap";
import {
  startCreateComment,
  startGetComments,
  startDeleteComment,
  startEditComment,
} from "../actions/commentActions";

export const BlogShow = () => {
  const dispatch = useDispatch();
  const [editComment, setEditcomment] = useState({ id: "", status: false });
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
  const [modal, setModal] = useState(false);
  const [cId, setCId] = useState("");
  const toggle = () => setModal(!modal);

  useEffect(() => {
    dispatch(startGetComments(id));
  }, []);

  let token;
  if (localStorage.getItem("token")) {
    token = jwtDecode(localStorage.getItem("token"));
  }
  const comments = useSelector((state) => state.comments.data);
  const blog = useSelector((state) => {
    return (
      state.blogs.data.find((e) => e._id === id) 
    );
  });

  const handleSubmit = () => {
if(newComment){
  if (editComment.status) {
    dispatch(startEditComment(id, editComment.id, newComment));
    setEditcomment({ id: "", status: false });
  } else {
    dispatch(startCreateComment({ body: newComment, blogId: id }));
  }
  setNewComment("");
}
  };

  const handleEditComment = (comment) => {
    setEditcomment({ id: comment._id, status: true });
    setNewComment(comment.body);
  };

  const handleCancel = () => {
    setEditcomment({ id: "", status: false });
    setNewComment("");
  };

  const handleDeleteComment = (cId) => {
    setCId(cId._id);
    toggle();
  };
  return (
    <>
      <h2 className="lh">Blog </h2>
      <Card
        className="my-2"
        color="light"
        style={{
          width: "35rem",
        }}
      >
        <CardHeader>
          <h3 className="green">{blog?.title}</h3>
        </CardHeader>
        <CardBody>
          <CardText>{blog?.content}</CardText>

          <CardTitle>
            by - <Badge color="dark">{blog?.author?.username}</Badge>
          </CardTitle>
          <CardText>
            {(blog?.status === "rejected" && "Rejected") ||
              (blog?.status === "pending" && "Pending")}
          </CardText>
        </CardBody>

        {token?.role === "admin" && (
          <CardFooter>
            <Link to={`/blogs/edit/${id}`}>Edit Blog </Link>
          </CardFooter>
        )}
        {(token?.role === "author" && token?.id === blog?.author) ||
          (token?.id === blog?.author?._id && (
            <CardFooter>
              <Link to={`/blogs/edit/${id}`}>Edit Blog </Link>
            </CardFooter>
          ))}
      </Card>

      <h3>Comments</h3>
      <div>
        {comments.length>0?comments.map((e) => (
          <div key={e._id}>
            <ListGroup>
              <ListGroupItem style={{ width: `27rem` }}>
                <span style={{ fontSize: "20px" }}> {e.body}</span> by
                <Badge
                  color="dark"
                  style={{
                    marginLeft: "5px",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                >
                  {e.userId.username}
                </Badge>
                {(token?.role === "user" || token?.role === "author") &&
                  token?.id === e.userId._id &&
                  editComment.id !== e._id && (
                    <span>
                      <button onClick={() => handleEditComment(e)}>Edit</button>
                      <button onClick={() => handleDeleteComment(e)}>
                        Delete
                      </button>
                    </span>
                  )}
                {token?.role === "moderator" && editComment.id !== e._id && (
                  <span>
                    {/* <button onClick={() => handleEditComment(e)}>Edit</button> */}
                    <button onClick={() => handleDeleteComment(e)}>
                      Delete
                    </button>
                  </span>
                )}
                {editComment.status && editComment.id === e._id && (
                  <button onClick={handleCancel}>Cancel</button>
                )}
              </ListGroupItem>
            </ListGroup>
          </div>
        )):<div>No Comments yet</div>}
      </div>
      {token ? (
        ((token.role === "user" || token.role === "author") && (
          <div className="commentBox">
            <textarea
              placeholder="Your Comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button onClick={handleSubmit}>
              {editComment.status ? "Update" : "Add Comment"}
            </button>
          </div>
        ))
      ) : (
        <div>
          <Link to={"/login"}>
            <button>Log In to comment</button>
          </Link>
        </div>
      )}
      <Modal className="colorModal" isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          <span>Delete Comment</span>
        </ModalHeader>
        <ModalBody>
          <span>Are you sure you want to delete this comment ?</span>
        </ModalBody>
        <ModalFooter>
          <Button
            color={"danger"}
            onClick={() => {
              dispatch(startDeleteComment(id, cId));
              setCId("");
              toggle();
            }}
          >
            <span>Delete </span>
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setCId("");
              toggle();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
