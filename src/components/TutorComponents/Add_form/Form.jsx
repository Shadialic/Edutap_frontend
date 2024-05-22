import React, { useEffect, useState } from "react";
import form_img from "../../../../public/images/tutor/Add files-bro.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CoursrManage, getCategory } from "../../../api/VendorApi";
import { useSelector } from "react-redux";

function Form() {
  const tutor = useSelector((state) => state.tutor.tutorInfo);
  const auther = tutor.email;

  const [payment, setPayment] = useState("free");
  const [level, setLevel] = useState("beginner");
  const [category, setCategory] = useState("");
  const [categoreas, setCategoreas] = useState([]);
  const [profilePic, setProfilePic] = useState("");
  const [demoVideo, setDemoVideo] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
    category: "",
    demo: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategory();
        const data = res.data.newData;
        const categories = data.map((item) => item.categoryName);
        setCategoreas(categories);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setCategory(value);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const uploadVideo = async (file) => {
    console.log("333333333333333333333");
    try {
      // setLoading(true);
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
      console.log("Cloudinary response:", cloudinaryData); // Add this line to log the response

      if (cloudinaryData.error) {
        console.log(cloudinaryData.error);
        return;
      }
      const uploadedVideoUrl = cloudinaryData.secure_url;
      // setLoading(false);
      return uploadedVideoUrl;
    } catch (error) {
      // setLoading(false);
      console.log("Error during video upload:", error);
    }
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Edu-tap");

      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dveis0axa/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error(
          `Failed to upload image. Status: ${cloudinaryResponse.status}`
        );
      }
      const cloudinaryData = await cloudinaryResponse.json();
      console.log("Cloudinary response:", cloudinaryData); // Add this line to log the response
      if (cloudinaryData.error) {
        console.log(cloudinaryData.error);
        return;
      }
      const uploadedImageUrl = cloudinaryData.secure_url;
      return uploadedImageUrl;
    } catch (error) {
      console.log("Error during image upload:", error);
    }
  };
  
  const handleVideoChange = async (event) => {
    console.log("Event:", event);
    const file = event.target.files[0];
    console.log("Selected file:", file);
  
    if (!file) {
      toast.error("No file selected");
      return;
    }
  
    try {
      const url = await uploadVideo(file);
      setDemoVideo(url);
      setFormData((prevFormData) => ({
        ...prevFormData,
        demo: url,
      }));
    } catch (err) {
      console.error("Error uploading video:", err);
      toast.error(err.message || "An error occurred during upload.");
    }
  };
  

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      const url = await uploadImage(file);
      setProfilePic(url);
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: url,
      }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.title === "" ||
      formData.description === "" ||
      !profilePic ||
      !demoVideo
    ) {
      toast.error("Please fill in all required fields and select an image");
    } else {
      const courseData = {
        ...formData,
        category,
        level,
        payment,
        image: profilePic,
        auther,
        demo: demoVideo,
      };
      try {
        const res = await CoursrManage(courseData);
        toast(res.data.alert);
        setFormData({
          title: "",
          description: "",
          price: "",
          image: null,
          category: "",
        });
        setPayment("free");
        setLevel("beginner");
        setProfilePic("");
      } catch (error) {
        console.error("Error in CoursrManage:", error);
        toast.error("Error while saving the course. Please try again.");
      }
    }
  };
  console.log(formData, "pwpwpwpwp");
  console.log(demoVideo, "demoVideo");

  return (
    <div className="sm:flex">
      <div className="w-full sm:w-2/5 md:2/4 justify-end ">
        <img src={form_img} alt="" />
      </div>
      <div className="w-full sm:p-6 lg:w-3/5">
        <form
          className="p-5"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-3xl font-prompt font-semibold leading-7 text-violet-700">
                Course Details
              </h2>
              <p className="mt-1 text-base leading-6 text-gray-600">
                This information will be displayed publicly, so be careful what
                you share.
              </p>

              <div className="w-full sm:mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-black">
                    Title
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        autoComplete="title"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-lightBlue-950 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter Course Title"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-black">
                    Payment
                  </label>
                  <div className="mt-2">
                    <select
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-lightBlue-950 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="free">Free</option>
                      <option value="price">Premium</option>
                    </select>
                  </div>
                </div>

                {payment === "price" && (
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium leading-6 text-black"
                    >
                      Price
                    </label>
                    <div className="mt-2">
                      <input
                        value={formData.price}
                        onChange={handleChange}
                        type="number"
                        name="price"
                        id="price"
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 py-1.5 text-lightBlue-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                )}

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-black">
                    Level
                  </label>
                  <div className="mt-2">
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-lightBlue-950 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-black">
                    Category
                  </label>
                  <div className="mt-2">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-lightBlue-950 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      {categoreas &&
                        categoreas.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-black"
                  >
                    Write about a Course
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      // rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-lightBlue-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset "
                      defaultValue={""}
                    />
                  </div>
                </div>

                <div className="col-span-full w-[100%]">
                  <div className="mt-2 flex justify-center gap-8 rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center w-[50%]">
                      <label
                        htmlFor="cover-photo"
                        className="block text-sm font-medium leading-6 text-black"
                      >
                        Cover photo
                      </label>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="cover-photo-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="cover-photo-upload"
                            name="file"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">Click to upload or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        SVG, PNG, JPG, or GIF (MAX. 800x400px)
                      </p>
                    </div>

                    <div className="text-center w-1/2">
                      {" "}
                      {/* Updated to Tailwind's fraction-based width */}
                      <label
                        htmlFor="demo-video"
                        className="block text-sm font-medium leading-6 text-black"
                      >
                        Demo Video
                      </label>
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="demo-video-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="demo-video-upload"
                            name="file"
                            type="file"
                            accept="video/*"
                            onChange={(event) => handleVideoChange(event)}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">Click to upload or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        Accepts video formats like MP4, MOV, or AVI.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-white bg-red-700 py-2 px-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md w-[30%] bg-[#8530b7] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Form;
