import React, { useEffect } from "react";
import "./Posts.css";
import { PostsData } from "../../Data/PostsData";
import { useDispatch, useSelector } from "react-redux";
import Post from "../Post/Post";
import { getTimelinePosts } from "../../actions/postAction";
import { useParams } from "react-router-dom";
export default function Posts() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  let { posts, loading } = useSelector((state) => state.postReducer);
  const params = useParams();
  useEffect(() => {
    dispatch(getTimelinePosts(user._id));
  }, []);
  if (!posts) return "no posts";
  if (params.id)
    posts = posts.filter((post) => post.newPost.userId === params.id);
  return (
    <div className="Posts">
      {loading
        ? "Fetching posts ..."
        : posts.map((post, id) => {
            return <Post post={post} id={id} />;
          })}
    </div>
  );
}
