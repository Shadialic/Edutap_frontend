import React, { useEffect, useState } from 'react';
import { fetchChapter, manageChapter } from '../../../api/VendorApi';
import { Loader } from '../../Constans/Loader/Loader';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lessonform from '../Add_form/Lessonform';
import menu from '../../../assets/icons/menu.png';

function Derr({ courseId }) {
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // New state to track active dropdown

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await fetchChapter();
        const filterData = res.data.data;
        const courseChapters = filterData.filter(
          (item) => item.course_id === courseId
        );
        setChapters(courseChapters);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      }
    };
    fetch();
  }, [courseId, isModalOpen]);

  const handleAddChapter = () => {
    setIsModalOpen(true);
  };
  const handleDelete = async (id) => {
    try {
      await manageChapter(id);
      setDialogOpen(false);
      const res = await fetchChapter();
      const filterData = res.data.data;
      const data = filterData.filter((item) => item.course_id === courseId);
      setChapters(data);
      toast.success("Chapter deleted successfully.");
    } catch (error) {
      console.error("Failed to delete chapter:", error);
      toast.error("Failed to delete chapter.");
    }
  };
  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null); 
    } else {
      setActiveDropdown(index); 
    }
  };

  const handleEditChapter = (chapter) => {
    console.log('Edit chapter:', chapter);
    // Implement your edit logic here
  };

 

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="h-full p-6 flex">
            <div className="w-1/3 shadow-md shadow-gray-300 p-4">
            <div className="flex items-center justify-between mb-4">
  <h1 className="text-xl font-semibold font-prompt">Lessons</h1>

  <button
    onClick={handleAddChapter}
    className="w-24 h-12 bg-[#2840b4] text-white rounded-lg"
  >
    Add Chapter
  </button>
</div>
              <div className="overflow-y-auto h-96">
                {chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className={`flex justify-between p-3 mt-2 rounded-md cursor-pointer ${
                      selectedChapter === chapter
                        ? 'bg-gray-300'
                        : 'bg-gray-200'
                    }`}
                    onClick={() => {
                      setSelectedChapter(chapter);
                      setActiveDropdown(null); // Close the dropdown when selecting a chapter
                    }}
                  >
                    <span className="text-md font-prompt">
                      #{index + 1} {chapter.chapterTitle}
                    </span>
                    <div className="relative ">
                      <img
                        src={menu}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent click
                          toggleDropdown(index);
                        }}
                        className="w-8 h-8 cursor-pointer "
                        alt=""
                      />
                      {activeDropdown === index && (
                        <div className="absolute top-10 right-0 bg-white shadow-lg p-2 rounded-md z-10">
                          <button
                            className="block w-full text-left hover:bg-gray-200 p-2"
                            onClick={() => handleEditChapter(chapter)}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left hover:bg-gray-200 p-2"
                            onClick={() => handleDelete(chapter._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-2/3 p-4">
              {selectedChapter ? (
                <video
                  controls
                  className="w-full"
                  src={selectedChapter.chapterVideo}
                />
              ) : (
                <div className="text-center text-gray-500">
                  Select a chapter to view its video
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {isModalOpen && (
        <Lessonform setIsModalOpen={setIsModalOpen} courseId={courseId} />
      )}

      <ToastContainer />
    </>
  );
}

export default Derr;
