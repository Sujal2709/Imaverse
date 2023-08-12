import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {preview} from "../assets"
import {getRandomPrompt} from "../utilis"
import { FormField, Loader } from '../components';

const CreatePost = () =>
{
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
      if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch("http://localhost:8080/api/v1/openAI", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({prompt: form.prompt}),
       });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide proper prompt');
    }
   };

  
  // const handleSubmit = async(e) => {
  // e.preventDefault() ;// to prevent reload of page before Submiting
  
  // if(form.prompt && form.photo){
  // setLoading(true);
  // try{
  //   setGeneratingImg(true);
  //   const response = await fetch("http://localhost:8080/api/v1/post",
  //   {
  //     method: 'POST',
  //     headers:{'Content-Type': 'application/json'},
  //     body: JSON.stringify({ ...form }),
  //   });
  //    await response.json();
  //       alert('Success');
  //       navigate('/');
  // }
  // catch(err){
  //   alert(err)
  // }
  // finally{
  //   setLoading(false);//to stop loading animation on submit button click
  // }
  // }
  // else{
  // alert("Please Generate Proper Image")
  // }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault(); //donot reload our applicatikn

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });

        await response.json();
        alert('Success');
        navigate('/');
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  };


  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  // error function with event e first and only parameter
 const handleChange = (e) =>setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <section className="max-w-7xl mx-auto">
      <div>
      <h1 className="text-[#222328] text-[32px] text-center font-bold">Create Your Imagination</h1>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="ex. Sujal Nimbalkar"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="Create a futuristic car concept with innovative features and a sleek, aerodynamic design"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          </div>
             <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#ffbe58]  focus:border-[#ffbe58]  w-64 p-3 h-64 flex justify-center items-center">
            { form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
           <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className=" text-black bg-[#ffbe58] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Rendering...' : 'Render Craft'}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">** Once you have created the image you want, you can share it with others in the community **</p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#ffbe58] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
        
          </form>
    </section>
  );
            };


export default CreatePost