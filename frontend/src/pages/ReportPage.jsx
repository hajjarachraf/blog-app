import React, { useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from '../components/Loader';

const ReportPage = ({ onReportSubmit }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reportText, setReportText] = useState("");
  const [loader, setLoader] = useState(false);

  const handleReportSubmit = async () => {
    try {
      const isAuthenticated = true; // Replace with your authentication check

      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      setLoader(true);

      await axios.post(
        `${URL}/api/posts/${id}/report`,
        { message: reportText },
        { withCredentials: true }
      );

      onReportSubmit();

      setLoader(false);

      navigate(`/posts/post/${id}`);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-8 md:px-[200px] min-h-[80vh]">
        <div className="flex justify-center items-center h-[40vh]">
          {loader ? <Loader /> : null}
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Report Post</h1>
          <p className="mb-4">Reporting post with ID: {id}</p>

          <textarea
            placeholder="Enter your report here..."
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            className="border p-2 mb-4 w-full"
          />

          <button
            onClick={handleReportSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Submit Report
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReportPage;
