import React, { useState } from "react";
import upload from "../../../../public/images/tutor/upload.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addChapter } from "../../../api/VendorApi";
import { Button } from "@material-tailwind/react";
import { BarLoader } from "react-spinners";

function Lessonform({setIsModalOpen,courseId}) {
  const [video, setVideo] = useState();
  const [demoFileName, setDemoFileName] = useState("");
  const [chapterFileName, setChapterFileName] = useState("");
  const [formData, setFormData] = useState({
    chapterTitle: "",
    chapterDescription: "",
    demoVideo: null,
    chapterVideo: null,
  });
  const [loading, setLoading] = useState(false);

  const uploadVideo = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Edu-tap");
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dveis0axa/video/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error(
          `Failed to upload video. Status: ${cloudinaryResponse.status}`
        );
      }
      const cloudinaryData = await cloudinaryResponse.json();
      if (cloudinaryData.error) {
        console.log(cloudinaryData.error);
        return;
      }
      const uploadedVideoUrl = cloudinaryData.secure_url;
      setLoading(false);
      return uploadedVideoUrl;
    } catch (error) {
      setLoading(false);
      console.log("Error during video upload:", error);
    }
  };

  const handleVideoChange = async (event, type) => {
    const file = event.target.files[0];
    const fileName = file.name;

    const url = await uploadVideo(file);
    setVideo(url);
    if (type === "demo") {
      setDemoFileName(fileName);
    } else if (type === "chapter") {
      setChapterFileName(fileName);
    }
    setFormData({ ...formData, [`${type}Video`]: url });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleModalClose = () => {
    setIsModalOpen(false); 
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !formData.chapterTitle ||
      !formData.chapterDescription ||
      !formData.chapterVideo ||
      !courseId
    ) {
      toast("Please fill in all fields");
      return;
    } else {
      try {
        const response = await addChapter(formData, courseId);
        if(response.data.success){
            setFormData({
              chapterTitle: "",
              chapterDescription: "",
              demoVideo: null,
              chapterVideo: null,
            });
            setDemoFileName("");
            setChapterFileName("");
            toast("Chapter added successfully");
        }
      } catch (error) {
        console.error("Error adding chapter:", error);
        toast("Error adding chapter. Please try again later.");
      }
    }
  };
  return (
    <div>
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-30 flex items-center justify-center">
        <div className="p-8 max-w-2xl mx-auto rounded-lg">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative rounded-lg shadow bg-blue-gray-50">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t gap-1 dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upload Your Lesson Here
                </h3>
                <button
                  type="button"
                  className="end-2.5 text-gray-400 bg-transparent hover:bg-purple-500/30 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                  onClick={handleModalClose}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                  
                </button>
              </div>
              <div className="p-4 md:p-5 text-start">
                <form  action="">
                  <div className="font-promt p-8 ">
                    <label
                      htmlFor="chapterTitle"
                      className="text-[14px] text-shadow-black"
                    >
                      Chapter Title
                    </label>
                    <div className="flex flex-col justify-center items-center">
                      <input
                        id="chapterTitle"
                        name="chapterTitle"
                        value={formData.chapterTitle}
                        onChange={handleInputChange}
                        className="border-2 border-gray-100 w-full sm:w-[480px] h-[40px] outline-none rounded-md shadow-md p-2"
                        type="text"
                        placeholder="Title"
                      />
                    </div>
                  </div>
                  <div className="font-promt col-span-full">
                    <label
                      htmlFor="chapterDescription"
                      className="text-[14px] text-shadow-black pl-8"
                    >
                      Chapter Description
                    </label>
                    <div className="flex flex-col justify-center items-center">
                      <textarea
                        id="chapterDescription"
                        name="chapterDescription"
                        value={formData.chapterDescription}
                        onChange={handleInputChange}
                        className="border-2 border-gray-100 w-full sm:w-[480px] h-[40px] outline-none rounded-md shadow-md p-2 focus:ring-1 "
                        type="text"
                        placeholder="Chapter description (Max-150)"
                      />
                    </div>
                  </div>
                  <div className="font-promt p-1 pl-8 col-span-full">
                    <label htmlFor="" className="text-[14px] text-shadow-black">
                      Chapter Video
                    </label>
                    <div
                      className="flex flex-col justify-center items-center border-2 border-gray-100 w-[480px] h-[65px] outline-none rounded-md shadow-md p-2"
                      onClick={() => {
                        document.getElementById("chapterFileInput").click();
                      }}
                    >
                      <div className="p-1 flex justify-start items-start">
                        <img
                          className="w-10 h-6" src={upload} alt="Upload"/>
                      </div>
                      {chapterFileName && chapterFileName ? (
                      <div className="">
                        <label className="text-[14px] text-shadow-black">
                          Selected File:{" "}
                        </label>
                        <span className="text-[16px]">{chapterFileName}</span>
                      </div>
                      ): ( 
                      <span className="flex text-[12px] justify-center items-center">
                        MP4, AVI, MOV, MKV or WEBM
                      </span>
                      )} 

                      <input
                        id="chapterFileInput"
                        className="hidden w-[250px] sm:w-[480px] h-[40px] outline-none rounded-md shadow-md p-2"
                        type="file"
                        name="file"
                        accept="video/*"
                        placeholder=""
                        onChange={(event) => handleVideoChange(event, "chapter")}
                      />
                    </div>
                  </div>
                  <div className="w-full flex justify-center  p-4">
                {loading && (
                  <BarLoader color="#a549f4" width={200} height={10} />
                )}
              </div>
                </form>
              </div>
              <div className="flex gap-2 justify-end py-2 px-4">
                <button
                  className="text-white bg-[#2da322] hover:bg-[rgb(61,148,53)] ml-2 px-4 py-1  rounded"
                  onClick={handleSubmit}
                >
                  Add
                </button>
                <button
                  className="text-white bg-violet-800 hover:bg-violet-800/80 px-4 py-1 rounded"
                  onClick={handleModalClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Lessonform;
