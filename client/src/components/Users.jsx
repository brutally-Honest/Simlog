import { useDispatch, useSelector } from "react-redux";
import { startChangeRole, startDeleteUsers } from "../actions/userActions";
import { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
} from "reactstrap";
import _ from "lodash";

export const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const [role, setRole] = useState("");
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [user, setUser] = useState({});
  const roles = ["user", "author", "moderator"];
  
  const handleAction = () => {
    if (user.type === "delete") {
      dispatch(startDeleteUsers(user.data._id));
      setUser({});
    } else if (user.type === "changeRole") {
      if (role !== user.data.role) {
        dispatch(startChangeRole(user.data._id, role));
        setUser({});
        setRole("");
      }
    }
  };
  return (
    <div>
      <h2>Users</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            ?.filter((e) => e.role !== "admin")
            .map((e) => (
              <tr key={e._id}>
                <td>{e.username}</td>
                <td>
                  <Badge>{e.role.toUpperCase()}</Badge>
                </td>
                <td>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <select
                        className="selectRole"
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option style={{ color: "red" }} value={"placeholder"}>
                          Roles
                        </option>
                        {roles
                          .filter((ele) => ele !== e.role)
                          .map((e, i) => (
                            <option key={i} value={e}>
                              {e}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          if (role) {
                            setUser({ type: "changeRole", data: e });
                            toggle();
                          }
                        }}
                      >
                        Change Role
                      </button>
                      <button
                        onClick={() => {
                          setUser({ type: "delete", data: e });
                          console.log(user);
                          toggle();
                        }}
                      >
                        Delete User
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {!_.isEmpty(user.type) && (
        <Modal className="colorModal" isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            {user.type === "delete" && <span>Delete</span>}
            {user.type === "changeRole" && <span>Change Role</span>}
          </ModalHeader>
          <ModalBody>
            {user.type === "delete" && (
              <span>
                Are you sure you want to delete{" "}
                <strong>{user.data.username}</strong> ?
              </span>
            )}
            {user.type === "changeRole" && (
              <span>
                Are you sure you want to change{" "}
                <strong>{user.data.username}</strong>'s role from{" "}
                <strong>{user.data.role}</strong> to <strong>{role}</strong> ?
              </span>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color={user.type === "delete" ? "danger" : "primary"}
              onClick={handleAction}
            >
              {user.type === "delete" && <span>Delete</span>}
              {user.type === "changeRole" && <span>Change Role</span>}
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                setUser("");
                setModal(false);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};
