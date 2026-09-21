import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${BASE_URL}login`,
        {
          email: email.trim(),
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(response.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "Login failed");
      console.error("Login failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card card-border bg-base-100 w-96">
        <div className="card-body">
          <h2 className="card-title">Login Page</h2>

          <form onSubmit={handleLogin}>
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
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            <Link
              to="/signup"
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold text-[var(--accent-dark)] transition-colors hover:bg-orange-50 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;