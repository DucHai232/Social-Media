import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { uploadImage } from "../../actions/uploadAction";
import { updateUser } from "../../actions/userAction";

function ProfileModal({ modalOpened, setModalOpened, data }) {
  const { password, ...other } = data;
  const [formData, setFormData] = useState(other);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const dispatch = useDispatch();
  const param = useParams();
  const { user } = useSelector((state) => state.authReducer.authData);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      e.target.name === "profileImage"
        ? setProfileImage(img)
        : setCoverImage(img);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let userData = formData;
    if (profileImage) {
      const data = new FormData();
      const fileName = Date.now() + profileImage.name;
      data.append("name", fileName);
      data.append("file", profileImage);
      userData.profilePicture = fileName;
      try {
        dispatch(uploadImage(data));
      } catch (error) {
        console.log(error);
      }
    }
    if (coverImage) {
      const data = new FormData();
      const fileName = Date.now() + coverImage.name;
      data.append("name", fileName);
      data.append("file", coverImage);
      userData.coverPicture = fileName;
      try {
        dispatch(uploadImage(data));
      } catch (error) {
        console.log(error);
      }
    }
    dispatch(updateUser(param.id, userData));
    setModalOpened(false);
  };
  return (
    <>
      <Modal
        opened={modalOpened}
        size="55%"
        onClose={() => setModalOpened(false)}
        title="Authentication"
      >
        <form className="infoForm">
          <h3>Your info</h3>
          <div>
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              className="infoInput"
              onChange={handleChange}
              value={formData.firstname}
            />

            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              className="infoInput"
              onChange={handleChange}
              value={formData.lastname}
            />
          </div>
          <div>
            <input
              type="text"
              name="worksAt"
              placeholder="Work at"
              className="infoInput"
              onChange={handleChange}
              value={formData.worksAt}
            />
          </div>
          <div>
            <input
              type="text"
              name="livesin"
              placeholder="Live in"
              className="infoInput"
              onChange={handleChange}
              value={formData.livesin}
            />

            <input
              type="text"
              name="country"
              placeholder="Country"
              className="infoInput"
              onChange={handleChange}
              value={formData.country}
            />
          </div>

          <div>
            <input
              type="text"
              className="infoInput"
              name="relationship"
              placeholder="RelationShip Status"
              onChange={handleChange}
              value={formData.relationship}
            />
          </div>
          <div>
            Profile Image
            <input type="file" name="profileImage" onChange={onImageChange} />
            Cover Image
            <input type="file" name="coverImage" onChange={onImageChange} />
          </div>
          <button className="button infoButton" onClick={handleSubmit}>
            Update
          </button>
        </form>
      </Modal>
    </>
  );
}

export default ProfileModal;
