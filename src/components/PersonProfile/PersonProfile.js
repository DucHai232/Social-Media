import React, { useEffect, useState } from "react";
import "./PersonProfile.css";
import { Followers } from "../../Data/FollowersData";
import { UilBriefcase } from "@iconscout/react-unicons";
import { UilMapMarker } from "@iconscout/react-unicons";
import { UilUserCheck } from "@iconscout/react-unicons";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import postpic1 from "../../img/postpic1.jpg";
import Logo from "../../img/logo.png";
import { Link, useParams } from "react-router-dom";
import * as UserApi from "../../api/UserRequest.js";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unFollowUser } from "../../actions/userAction.js";
export default function PersonProfile() {
  const [person, setPerson] = useState({});
  const [dataUser, setDataUser] = useState([]);
  const params = useParams();
  const personId = params.id;
  const [following, setFollowing] = useState(true);
  const { user } = useSelector((state) => state.authReducer.authData);
  const dispatch = useDispatch();
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const { data } = await UserApi.getUser(personId);
        setPerson(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPerson();
  }, [personId]);

  useEffect(() => {
    const fetchFollowing = async () => {
      const checkFollowing = await user.followings.includes(personId);
      setFollowing(checkFollowing);
    };
    fetchFollowing();
  }, [user.followings, person]);

  useEffect(() => {
    const fetchDataUser = async () => {
      if (person && person.followers) {
        const dataFollowing = await Promise.all(
          person.followers.map(async (item) => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const { data } = await UserApi.getUser(item);
            return data;
          })
        );
        setDataUser(dataFollowing);
      }
    };
    fetchDataUser();
  }, [person]);

  const handleClickFollow = () => {
    try {
      following
        ? dispatch(unFollowUser(person._id, user))
        : dispatch(followUser(person._id, user));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Link to={"/home"}>
        <img src={Logo} alt="" />
      </Link>
      <div className="personProfile">
        <div className="background-person">
          {person && (
            <div className="personImage">
              <img
                src={
                  person.coverPicture
                    ? serverPublic + person.coverPicture
                    : serverPublic + "defaultProfile.png"
                }
                alt=""
              />
              <img
                src={
                  person.profilePicture
                    ? serverPublic + person.profilePicture
                    : serverPublic + "defaultProfile.png"
                }
                alt=""
              />
            </div>
          )}

          <div className="personName">
            <span>
              {person.firstname} {person.lastname}
            </span>
            <span>{person.livesin}</span>
          </div>
          <div className="personFollow">
            <button
              className={
                following ? "button unFollow-button" : "button personButton"
              }
              onClick={handleClickFollow}
            >
              {following ? "UnFollow" : "Follow"}
            </button>
            <button className="">Message</button>
          </div>
        </div>
        <div className="detail-person">
          <div className="leftPerson">
            <div className="personLeftProfile">
              <span>Details</span>
              <div className="personInfo">
                <div>
                  <UilBriefcase />
                  <span>{person.worksAt}</span>
                </div>
                <div>
                  <UilUserCheck />
                  <span>{person.relationship}</span>
                </div>
                <div>
                  <UilMapMarker />
                  <span>{person.country}</span>
                </div>
              </div>
            </div>
            <div className="personFollowing">
              <div className="personFollowingNumber">
                <span>Friends</span>
                <span>200 Following</span>
              </div>
              <div className="personFollowingImage">
                {dataUser.map((item) => {
                  return (
                    <div className="userFollowing">
                      <img
                        src={
                          item.profilePicture
                            ? serverPublic + item.profilePicture
                            : serverPublic + "defaultProfile.png"
                        }
                        alt=""
                        className="userFollowingAvatar"
                      />
                      <p className="userFollowingName">{item.firstname}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="rightPerson">
            <div>
              <img src={postpic1} className="rightPersonImg" alt="" />
              <div className="rightPersonIcon">
                <img src={Heart} alt="" />
                <img src={Comment} alt="" />
                <img src={Share} alt="" />
              </div>
              <span className="personLike">10 Likes</span>
              <span>Status How do you feel?</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
