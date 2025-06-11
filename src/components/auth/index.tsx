import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import logo from "../../assets/logo.svg";
import axios from "axios";
import utils from "../../utils";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const url = `${utils.baseUrl}/api/clientorganizations/list`;
      const response = await axios.post(url, {
        headers: { "Content-Type": "application/json" },
      });
      const clientorgs = response.data.data;
      localStorage.setItem("clientorganizations", JSON.stringify(clientorgs));
    } catch (error) {
      enqueueSnackbar("User Loading Failed. Please try again.", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
      clientorganizationid: 0,
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
        const response = await axios.post(
          url,
          {
            email: values.email,
            password: values.password,
            rememberMe: values.rememberMe,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const token = response.data.token;
        enqueueSnackbar("Login successful!", { variant: "success" });
        if (values.rememberMe) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }
        localStorage.setItem("clientuserid", response?.data?.clientuserid);
        localStorage.setItem("clientuser", JSON.stringify(response?.data));
        localStorage.setItem(
          "clientorganizationid",
          `${response?.data?.clientorganizationid}`
        );
        localStorage.setItem(
          "clientorganizationids",
          `${response?.data?.clientorganizationids}`
        );
        navigate("/dashboard");
      } catch (error) {
        enqueueSnackbar("Login failed. Please try again.", {
          variant: "error",
        });
      }
    },
  });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 sm:p-8 lg:max-w-lg">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="h-24 sm:h-28 lg:h-32" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:text-3xl">
          Sign in to your account
        </h2>
        <div className="w-full space-y-6">
          <button
            onClick={() => utils.googleSignIn({ navigate, dispatch })}
            className="w-full flex items-center justify-center py-3 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 text-gray-700 dark:text-gray-200 text-sm font-medium"
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>
          <button
            className="w-full flex items-center justify-center py-3 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 text-gray-700 dark:text-gray-200 text-sm font-medium"
          >
            <FaFacebook className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Sign in with Facebook
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="mt-1 w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
                aria-invalid={
                  formik.touched.email && formik.errors.email ? "true" : "false"
                }
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="mt-1 w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your password"
                  aria-invalid={
                    formik.touched.password && formik.errors.password
                      ? "true"
                      : "false"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 border-gray-300 dark:border-gray-600 rounded"
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 text-sm font-medium"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;