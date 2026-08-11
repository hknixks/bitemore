import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import baseUrl from "../../BaseUrl";
import chicken from '../.././assets/chicken.jpg'
import { useEffect } from "react";

const ITEMS_PER_PAGE = 5;

const AdminUpload = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [message, setMessage] = useState();

  const handleImageChange = (event) => {
    setSelectedImages(Array.from(event.target.files));
  };

  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      description: '',
      images: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      price: Yup.number().required("Price is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("price", values.price);
        formData.append("description", values.description);
        selectedImages.forEach((image) => {
          formData.append("profileImage", image);
        });

        const response = await axios.post(`${baseUrl}/adminUpload`, formData);
        if (response.data.status) {
          getFood();
          setMessage(response.data.message);
          setTimeout(() => {
            setMessage(null);
          }, 6000);
          console.log("Upload successful:", response.data.data);
        }
        resetForm();
        setSelectedImages([]);
      } catch (error) {
        console.error("Error uploading food:", error.message);
      } finally {
        setSubmitting(false);
        setIsLoading(false);
      }
    },
  });

  const [info, setInfo] = useState([]);

  useEffect(() => {
    getFood();
  }, []);

  const getFood = () => {
    axios.get(baseUrl + "/api")
      .then(res => {
        if (res.data.status) {
          setInfo(res.data.data);
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  const handleDelete = (_id) => {
    // console.log(_id);

    axios.delete(`${baseUrl}/removeFood/${_id}`)
      .then(res => {
        if (res.data.status) {
          getFood();
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  };


  const [searchMember, setSearchMember] = useState('');
  const handleMember = (e) => {
    setSearchMember(e.target.value);
  };
  const filteredFood = info.filter((member) =>
    member.name.toLowerCase().includes(searchMember.toLowerCase())
  )


  const [currentPage, setCurrentPage] = useState(1);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredFood.slice(startIndex, endIndex);
  };





  return (
    <div>
      <div className="container mx-auto text-center rounded-xl my-6" id="images" >

        <h2 className="text-white text-5xl font-bold mt-[2em] ">Upload Food</h2>
      </div>

          <header>
            <h1 className="text-4xl font-bold uppercase mt-5 text-red-600 text-center">Upload Food</h1>
          </header>
     
      <div className="container mx-auto md:flex my-[2em]">
       
        <div className="w-full px-5">
          <form onSubmit={formik.handleSubmit}>
            <p className="text-1xl font-bold">{message}</p>

            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">Name:</label>
              <input type="text" name="name" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} className="border border-gray-300 rounded px-3 py-2 w-full" />

              <small className="font-medium text-red-500">
                {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}
              </small>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Price:</label>
              <input type="number" name="price" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.price} className="border border-gray-300 rounded px-3 py-2 w-full" />

              <small className="font-medium text-red-500">
                {formik.touched.price && formik.errors.price && <div>{formik.errors.price}</div>}
              </small>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Description:</label>
              <textarea name="description" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.description} className="border border-gray-300 rounded px-3 py-2 w-full"></textarea>

              <small className="font-medium text-red-500">
                {formik.touched.description && formik.errors.description && <div>{formik.errors.description}</div>}
              </small>
            </div>

            <div className="mb-4">
              <label htmlFor="images" className="block text-gray-700">Images:</label>
              <input type="file" id="image" accept="image/*" multiple onChange={(event) => { handleImageChange(event); formik.setFieldValue("images", event.currentTarget.files); }} className="border border-gray-300 rounded px-3 py-2 w-full" />

              <div className="mt-2 flex flex-wrap gap-2">
                {selectedImages.map((image, index) => (
                  <img key={index} src={URL.createObjectURL(image)} alt={`Selected Image ${index + 1}`} className="max-w-[100px] max-h-[100px] object-cover rounded" />
                ))}
              </div>
            </div>


            <button type="submit" disabled={isLoading} name="submit" className="bg-red-600 text-white px-3 py-3 w-full rounded-sm font-bold text-xl">
              <b>
                {isLoading ? "Loading..." : "Submit"}
              </b>
            </button>

          </form>


        </div>
        <div className="w-full px-5 bg-[#F8F9FA] rounded-lg">



          <div className="relative h-[70vh] overflow-x-auto   sm:rounded-lg ">

            <div className="pb-4 px-5 pt-5 ">
              <div class="relative mt-1">
                <input type="text" name="search" value={searchMember} onChange={handleMember} className="p-3 text-sm rounded-lg w-full border-2 border-dark " placeholder="Search for Food" />
              </div>
            </div>
            <div className=" w-full text-sm   rounded-lg">

              <table className=" px-10">
                <thead className="text-xs uppercase  ">
                  <tr className="border-b border-black">
                    <th className="px-6 py-3">  S/N</th>
                    <th className="px-6 py-3">  Food Name</th>
                    <th className="px-6 py-3">  Price</th>
                    <th className="px-6 py-3">  Description</th>
                    <th className="px-6 py-3">  Image</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedData().map((post, index) => (
                    <tr key={index} className=" border-b border-black  hover:bg-gray-50 dark:hover:bg-gray-200">
                      <th className="">
                        {index + 1}
                      </th>
                      <td>   {post.name} </td>
                      <td>   {post.price} </td>
                      <td className="line-clamp-1 ft-sm">   {post.description} </td>
                      <td className="h-[50%] w-[50%]">   <img src={post.profileImage} alt="image" className="md:h-28 h-24 w-32 md:py-1 py-2 md:w-32" /> </td>
                      <td>
                        <i className="fa fa-trash pr-4  text-red-600" onClick={() => handleDelete(post._id)}></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full mt-3">
            <nav>
              <ul className="pagination">
                {[...Array(Math.ceil(filteredFood.length / ITEMS_PER_PAGE)).keys()].map((num) => (
                  <li key={num + 1} className={`shadow p-2 w-auto bg-white font-bold page-item ${currentPage === num + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(num + 1)}>
                      {num + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

        </div>

      </div>



    </div>
  );
}

export default AdminUpload;
