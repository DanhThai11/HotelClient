import React, { useState } from "react";
import { registerUser } from "../utils/ApiFunctions";
import { Link, useNavigate } from "react-router-dom";

const Registration = () => {
  const [registration, setRegistration] = useState({
    username: "",
    fullName: "",
    password: "",
    email: "",
    phoneNumber: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setRegistration({ ...registration, [e.target.name]: e.target.value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      await registerUser(registration);
      navigate("/verify-email", { state: { email: registration.email } });
    } catch (error) {
      setErrorMessage(`Registration error: ${error.message}`);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <section className="container col-6 mt-5 mb-5">
      {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}

      <h2>Register</h2>
      <form onSubmit={handleRegistration}>
        <div className="mb-3 row">
          <label htmlFor="fullName" className="col-sm-2 col-form-label">
            Full Name
          </label>
          <div className="col-sm-10">
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="form-control"
              value={registration.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="username" className="col-sm-2 col-form-label">
            Username
          </label>
          <div className="col-sm-10">
            <input
              id="username"
              name="username"
              type="text"
              className="form-control"
              value={registration.username}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="password" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              value={registration.password}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="email" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={registration.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="phoneNumber" className="col-sm-2 col-form-label">
            Phone Number
          </label>
          <div className="col-sm-10">
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              className="form-control"
              value={registration.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <button type="submit" className="btn btn-hotel me-2">
            Register
          </button>
          <span>
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none">
              Login
            </Link>
          </span>
        </div>
      </form>
    </section>
  );
};

export default Registration;
