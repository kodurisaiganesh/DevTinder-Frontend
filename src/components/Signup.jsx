import React, { useState } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addUser } from '../utils/userSlice';
import { BASE_URL } from '../utils/constants';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
        `${BASE_URL}signup`,
        {
          firstName,
          lastName,
          email: email.trim(),
          password,
          phone: phone.trim(),
        },
        { withCredentials: true }
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
    <main className="signup-page">
      <div className="signup-intro">
        <p className="connections-eyebrow">WELCOME TO DEVTINDER</p>
        <h1>Build your developer circle.</h1>
        <p>Create a profile that helps the right people find you.</p>
      </div>

      <div className="card signup-card card-border w-full max-w-md bg-base-100">
        <div className="card-body">
          <div className="signup-card-heading">
            <div>
              <p className="profile-panel-label">GET STARTED</p>
              <h2 className="card-title">Create your account</h2>
            </div>
            <span className="profile-form-marker" aria-hidden="true">*</span>
          </div>

          <form className="signup-form" onSubmit={handleSignup}>
            <fieldset className="fieldset signup-field">
              <legend className="fieldset-legend">First name</legend>
              <input
                type="text"
                className="input"
                placeholder="Your first name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                minLength={4}
                required
              />
            </fieldset>

            <fieldset className="fieldset signup-field">
              <legend className="fieldset-legend">Last name</legend>
              <input
                type="text"
                className="input"
                placeholder="Your last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
                minLength={4}
                required
              />
            </fieldset>

            <fieldset className="fieldset signup-field">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </fieldset>

            <fieldset className="fieldset signup-field">
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
                autoComplete="tel"
                required
              />
            </fieldset>

            <fieldset className="fieldset signup-field">
              <legend className="fieldset-legend">Password</legend>
              <input
                type="password"
                className="input"
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </fieldset>

            {error && <p className="signup-error" role="alert">{error}</p>}

            <div className="signup-actions card-actions justify-center">
              <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Sign up"}
              </button>
            </div>
            <Link to="/login" className="signup-login-link">
              Already have an account? Log in
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Signup
