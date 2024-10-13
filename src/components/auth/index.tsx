import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "../../assets/logo.svg";
import axios from "axios";
import utils from "../utils";
import { useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { useSnackbar } from "notistack";

interface LoginProps {
  email: string;
  password: string;
  clientorganizationid: string;
  name: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [clientorgs, setClientOrgs] = useState<LoginProps[]>([]);

  const fetchData = async () => {
    try {
      const url = `${utils.baseUrl}/api/clientorganizations/list`;
      const response = await axios.post(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      const clientorgs = response.data.data;
      setClientOrgs(clientorgs)
    } catch (error) {
      enqueueSnackbar("User Loading Failed. Please try again.", { variant: "error" });
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
      clientorganizationid: 0
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const url = `${utils.baseUrl}/api/auth/login`;
        const response = await axios.post(url, {
          email: values.email,
          password: values.password,
          rememberMe: values.rememberMe,
          clientorganizationid: values.clientorganizationid
        }, {
          headers: { 'Content-Type': 'application/json' },
        });
        const token = response.data.token;
        enqueueSnackbar("Login successful!", { variant: "success" });
        if (values.rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }
        localStorage.setItem('clientuserid', response?.data?.clientuserid);
        localStorage.setItem('clientuser', JSON.stringify(response?.data));
        navigate('/dashboard');
      } catch (error) {
        enqueueSnackbar("Login failed. Please try again.", { variant: "error" });
      }
    }
  });

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-gray-900 m-4">
      <div className="md:flex md:w-1/2 justify-center items-center">
        <img src={logo} alt="Logo" className="h-32 sm:h-44 md:h-44" />
      </div>
      <div className="w-full max-w-6xl mt-10 flex justify-center">
        <div className="w-full md:w-1/2 max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-none">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sign in to your account
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
            {/* Client Organization Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Organization
              </label>
              <select
                name="clientorganizationid"
                className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formik.values.clientorganizationid}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select an organization</option>
                {clientorgs.map(org => (
                  <option key={org.clientorganizationid} value={org.clientorganizationid}>
                    {org.name}
                  </option>
                ))}
              </select>
              {formik.touched.clientorganizationid && formik.errors.clientorganizationid && (
                <div className="text-red-500 text-sm">{formik.errors.clientorganizationid}</div>
              )}
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
                href="/login"
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Forgot Password?
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
            <button
              type="button"
              className="w-full flex justify-center items-center py-2 mb-4 bg-white border rounded-md shadow-md text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition duration-300"
            >
              <FaFacebook className="text-blue-600 mr-2" />
              Sign in with Facebook
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
