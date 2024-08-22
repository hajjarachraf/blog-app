import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { BiLike, BiDislike } from "react-icons/bi";
import { FaShare } from "react-icons/fa"; // Import the share icon
import axios from "axios";
import { URL, IF } from "../url";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";

const PostDetails = () => {
  const postId = useParams().id;
  const [post, setPost] = useState({});
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [reported, setReported] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/" + postId);
      setPost(res.data);
      setLiked(res.data.likes.includes(user?._id));
      setLikeCount(res.data.likes.length);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLikePost = async () => {
    try {
      if (liked) {
        await axios.post(`${URL}/api/posts/${postId}/unlike`, null, {
          withCredentials: true,
        });
        setLiked(false);
        setLikeCount((prevCount) => prevCount - 1);
      } else {
        await axios.post(`${URL}/api/posts/${postId}/like`, null, {
          withCredentials: true,
        });
        setLiked(true);
        setLikeCount((prevCount) => prevCount + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(URL + "/api/posts/" + postId, {
        withCredentials: true,
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPostComments = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/comments/post/" + postId);
      setComments(res.data);
      setLoader(false);
    } catch (err) {
      setLoader(true);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPostComments();
  }, [postId]);

  const postComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        URL + "/api/comments/create",
        {
          comment: comment,
          author: user.username,
          postId: postId,
          userId: user._id,
        },
        { withCredentials: true }
      );
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReportClick = () => {
    navigate(`/report/${postId}`);
  };

  const handleSharePost = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.desc,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(window.location.href).then(
        () => console.log("Link copied to clipboard"),
        (err) => console.error("Error copying link to clipboard:", err)
      );
    }
  };

  return (
    <div>
      <Navbar />
      {loader ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <div className="px-8 md:px-[200px] mt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black md:text-3xl">
              {post.title}
            </h1>
            {user?._id === post?.userId && (
              <div className="flex items-center justify-center space-x-2">
                <p
                  className="cursor-pointer"
                  onClick={() => navigate("/edit/" + postId)}
                >
                  <BiEdit />
                </p>
                <p className="cursor-pointer" onClick={handleDeletePost}>
                  <MdDelete />
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 md:mt-4">
            <p>@{post.username}</p>
            <div className="flex space-x-2">
              <p>{new Date(post.updatedAt).toString().slice(0, 15)}</p>
              <p>{new Date(post.updatedAt).toString().slice(16, 24)}</p>
            </div>
          </div>
          <img src={IF + post.photo} className="w-full  mx-auto mt-8" alt="" />
          {/* Report button */}
          <p
            className="cursor-pointer"
            onClick={handleReportClick}
            style={{
              backgroundColor: "#ff4d4d", // Red color
              color: "#fff", // White text
              padding: "10px 15px",
              borderRadius: "50px",
              fontSize: "14px",
              display: "inline-block",
            }}
          >
            Report
          </p>
                    {/* Share button */}
          
            <p
              className="cursor-pointer"
              onClick={handleSharePost}
              style={{
                backgroundColor: "#68d391", // Green color
                color: "#fff", // White text
                padding: "10px 15px",
                borderRadius: "50px",
                fontSize: "14px",
                display: "inline-block",
              }}
            >
              <FaShare /> Share
            </p>
         
          {/* Like/Unlike buttons */}
          <div className="flex items-center mt-4 space-x-2">
            <p
              className={`cursor-pointer ${liked ? "text-blue-500" : ""}`}
              onClick={handleLikePost}
            >
              {liked ? <BiLike /> : <BiDislike />}
            </p>
            <p>{likeCount}</p>
          </div>
          <p className="mx-auto mt-8">{post.desc}</p>
          <div className="flex items-center mt-8 space-x-4 font-semibold">
            <p>Categories:</p>
            <div className="flex justify-center items-center space-x-2">
              {post.categories?.map((c, i) => (
                <div key={i} className="bg-gray-300 rounded-lg px-3 py-1">
                  {c}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <h3 className="mt-6 mb-4 font-semibold">Comments:</h3>
            {comments?.map((c) => (
              <Comment key={c._id} c={c} post={post} />
            ))}
          </div>
          {/* Write a comment */}
          <div className="w-full flex flex-col mt-4 md:flex-row">
            <input
              onChange={(e) => setComment(e.target.value)}
              type="text"
              placeholder="Write a comment"
              className="md:w-[80%] outline-none py-2 px-4 mt-4 md:mt-0"
            />
            <button
              onClick={postComment}
              className="bg-black text-sm text-white px-2 py-2 md:w-[20%] mt-4 md:mt-0"
            >
              Add Comment
            </button>
          </div>

        </div>
      )}
      <Footer />
    </div>
  );
};

export default PostDetails;
