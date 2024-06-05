import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [isLoginClicked, setIsLoginClicked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState('');

  const handleLoginClick = async () => {
    try {
      const url = `https://gastrosis-backend.vercel.app/api/auth`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          username, 
          password 
        })
      });

      const data = await response.json();

      if (data.success) {

        navigate('/dashboard'); // Redirect to dashboard after showing success message
        // Adjust the delay as needed
      } else {
        setErrors(data.error)
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/backgroundpic.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative text-center">
        <div className={`bg-white bg-opacity-80 p-20 rounded-[45px] drop-shadow-2xl border border-1 border-blue-200 transform transition-transform duration-500 ${isLoginClicked ? "translate-y-[-10%]" : "translate-y-0"}`}>
          <img src="/logo.svg" className="mb-20 mx-auto w-[35rem]" alt="logo" />
          {!isLoginClicked ? (
            <div>
              <input type="text" placeholder="Kullanıcı Adı" value={username} onChange={(e) => setUsername(e.target.value)} className="mb-4 px-4 py-[1rem] border rounded-lg w-full" />
              <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4 px-4 py-[1rem] border rounded-lg w-full" />
              <button onClick={handleLoginClick} className="mt-5 px-[5rem] py-[1rem] text-xl text-white bg-[#135D66] rounded-2xl hover:bg-[#003C43] transition">
                Login
              </button>
            </div>
          ) : (
            <div className="transform transition-transform duration-500">
              <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 bg-black/40" />
              <div className="mb-4 px-4 py-[1rem] w-[30rem] mx-auto">
                <input type="email" placeholder="ID" className="mb-4 px-4 py-[1rem] border rounded-lg w-full" />
                <input type="password" placeholder="Password" className="mb-4 px-4 py-[1rem] border rounded-lg w-full" />
                <button className="mt-5 px-[5rem] py-[1rem] text-xl text-white bg-[#135D66] rounded-2xl hover:bg-[#003C43] transition">
                  Login
                </button>
              </div>
            </div>
          )}
          {showSuccess && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-8 rounded-[10px]">
              <p className="text-3xl font-semibold text-green-500">Başarılı Giriş!</p>
            </div>
          )}
        </div>
      </div>

      {errors && (
      <div id="toast-top-right" class="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-red-500 border border-red-500 border-2 font-bold bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow top-5 right-5" role="alert">
        <div class="text-sm font-normal">{errors}</div>
      </div>
      )}
    </div>
  );
}

export default LoginPage;
