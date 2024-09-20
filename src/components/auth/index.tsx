import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "../../assets/logo.svg";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Form data:", values);
      // Handle form submission here
    },
  });

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-gray-900 m-4">
      {/* Left side (Logo) */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center">
        <img src={logo} alt="Logo" className="h-44" />
      </div>
      <div className="w-full max-w-6xl mt-10 flex justify-center">
        {/* Right side (Form) */}
        <div className="w-full md:w-1/2 max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="flex justify-center mb-6 md:hidden">
            <img src={logo} alt="Logo" className="h-12" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Sign in to platform
          </h2>
          <form onSubmit={formik.handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your email
              </label>
              <input
                name="email"
                type="email"
                className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your password
              </label>
              <div className="flex">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-gray-600 dark:text-gray-400" />
                  ) : (
                    <AiOutlineEye className="text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Lost Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 mb-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition duration-300"
            >
              Login to your account
            </button>

            {/* Google SSO Button */}
            <button
              type="button"
              className="w-full flex justify-center items-center py-2 mb-4 bg-white border rounded-md shadow-md text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition duration-300"
            >
              <FcGoogle className="mr-2" />
              Sign in with Google
            </button>

            {/* Register Link */}
            {/* <div className="text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Not registered?{" "}
                <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                  Create account
                </a>
              </span>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
