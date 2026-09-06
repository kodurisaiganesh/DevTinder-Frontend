import React, { useState } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addUser } from '../utils/userSlice';
const Signup = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[firstName,setFirstName]=useState("");
  const[lastName,setLastName]=useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const handleSignup = async (event) => {
    event.preventDefault();
    setError("");


    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "http://localhost:3000/signup",
        {
          firstName,
          lastName,
          email: email.trim(),
          password,
          phone: phone.trim(),
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(response.data));
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Signup failed");
      console.error("Signup failed:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

 return (
    <div className="flex justify-center px-4 py-8 sm:py-12">
      <div className="card card-border w-full max-w-md bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Create your account</h2>

          <form onSubmit={handleSignup}>
             <fieldset className="fieldset">
              <legend className="fieldset-legend">FirstName</legend>
              <input
                type="text"
                className="input"
                placeholder="Type here"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">LastName</legend>
              <input
                type="text"
                className="input"
                placeholder="Type here"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="email"
                className="input"
                placeholder="Type here"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Phone number</legend>
              <input
                type="tel"
                className="input"
                placeholder="9876543210"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                pattern="[0-9]{10}"
                maxLength={10}
                inputMode="numeric"
                title="Enter a 10-digit phone number"
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                className="input"
                placeholder="Type here"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </fieldset>

            {error && <p className="text-error mt-2">{error}</p>}

            <div className="card-actions justify-center mt-4">
              <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Sign up"}
              </button>
            </div>
            <Link
              to="/login"
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold text-[var(--accent-dark)] transition-colors hover:bg-orange-50 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Already have an account? Log in
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup
