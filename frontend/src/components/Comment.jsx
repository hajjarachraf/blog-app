import axios from "axios";
import { BiEdit, BiLike, BiDislike } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { URL } from "../url";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const Comment = ({ c, post }) => {
  const { user } = useContext(UserContext);
  const [liked, setLiked] = useState(c.likes.includes(user?._id));
  const [likeCount, setLikeCount] = useState(c.likes.length);

  const deleteComment = async (id) => {
    try {
      await axios.delete(URL + "/api/comments/" + id, { withCredentials: true });
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      // Check if the user has already liked the comment
      if (liked) {
        // If the user has liked, send a request to remove the like
        await axios.post(
          `${URL}/api/comments/${c._id}/unlike`,
          null,
          { withCredentials: true }
        );
        // Update like status and count
        setLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        // If the user hasn't liked, send a request to add the like
        await axios.post(
          `${URL}/api/comments/${c._id}/like`,
          null,
          { withCredentials: true }
        );
        // Update like status and count
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="px-2 py-2 bg-gray-200 rounded-lg my-2">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-600">@{c.author}</h3>
        <div className="flex justify-center items-center space-x-4">
          <p>{new Date(c.updatedAt).toString().slice(0, 15)}</p>
          <p>{new Date(c.updatedAt).toString().slice(16, 24)}</p>
          {user?._id === c?.userId ? (
            <div className="flex items-center justify-center space-x-2">
              <p className="cursor-pointer" onClick={() => deleteComment(c._id)}>
                <MdDelete />
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <p className="px-4 mt-2">{c.comment}</p>
      <div className="flex items-center justify-center space-x-2">
        <p className={`cursor-pointer ${liked ? "text-blue-500" : ""}`} onClick={handleLike}>
          {liked ? <BiLike /> : <BiDislike />}
        </p>
        <p>{likeCount}</p>
      </div>
    </div>
  );
};

export default Comment;
