import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ message, setMessage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formState, setFormState] = useState("login");
  const [submitting, setSubmitting] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post("http://localhost:8080/user/login", { username, password });
      document.cookie = `token=${response.data.token}; path=/;`;
      setUser(response.data.name);
      setMessage({
        type: "success",
        message: response.data.message,
      });
      navigate("/");
    } catch (error) {
      setMessage({
        type: "error",
        message: `Login failed: ${error.response?.data?.error}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post("http://localhost:8080/user/signup", {
        name: e.target.name.value,
        username: e.target.username.value,
        password: e.target.password.value,
      });
      setMessage({
        type: "success",
        message: response.data.message,
      });
      setFormState("login");
    } catch (error) {
      setMessage({
        type: "error",
        message: `Signup failed: ${error.response?.data?.error}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-outer w-[30%] mx-auto mt-20 border-1 border-gray-800 p-8 rounded-xl">
      <div className="mx-auto text-center mb-10">
        <div className="btn-group">
          <button className={`btn ${formState === "login" ? "btn-dark" : "btn-outline-dark"}`} id="signInBtn" onClick={() => setFormState("login")}>
            Sign In
          </button>
          <button className={`btn ${formState === "signup" ? "btn-dark" : "btn-outline-dark"}`} id="signUpBtn" onClick={() => setFormState("signup")}>
            Sign Up
          </button>
        </div>
      </div>
      {formState === "login" ? (
        <div id="login">
          <form id="loginForm" onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input type="text" id="username" name="username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input type="password" id="password" name="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mx-auto">
              {submitting ? (
                <div className="spinner-border text-dark" role="status"></div>
              ) : (
                <button type="submit" className="btn btn-dark" id="signinSubmit">
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div id="signup">
          <form id="signupForm" onSubmit={handleSignup}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input type="text" id="name" name="name" className="form-control" />
            </div>
            <div className="mb-3">
              <label htmlFor="signupusername" className="form-label">
                Username
              </label>
              <input type="text" id="signupusername" name="username" className="form-control" />
            </div>
            <div className="mb-3">
              <label htmlFor="signuppassword" className="form-label">
                Password
              </label>
              <input type="password" id="signuppassword" name="password" className="form-control" />
            </div>
            <div className="center-align-button">
              {submitting ? (
                <div className="spinner-border text-dark" role="status"></div>
              ) : (
                <button type="submit" className="btn btn-dark" id="signupSubmit">
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
