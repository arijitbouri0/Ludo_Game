import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch } from "react-redux";
import { useLoginMutation, useRegisterMutation } from "../../redux/api/api";
import { userExist } from "../../redux/reducers/auth";
import { FaGlobe } from "react-icons/fa";


interface ApiError {
  message: string;
  data?: unknown;
}

const LoginDialog: React.FC = () => {
  const [login, { data: loginData, isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { data: registerData, isLoading: isRegisterLoading }] = useRegisterMutation();
  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const dispatch = useDispatch();

  const toggleMode = () => setIsLogin(!isLogin);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Please wait...", { position: "top-center" });
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password }).unwrap();
      } else {
        await register(formData).unwrap();
      }
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as ApiError).data === "object"
      ) {
        const errorMessage =
          ((err as ApiError).data as { message?: string })?.message ||
          (err as ApiError).message;
        toast.error(errorMessage || "Something went wrong");
      } else {
        toast.error((err as ApiError).message || "An unknown error occurred");
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  useEffect(() => {
    if (loginData?.user) {
      dispatch(userExist(loginData.user));
      toast.success(loginData.message || "Logged in successfully");
      setOpen(false);
    }
  }, [loginData, dispatch]);

  useEffect(() => {
    if (registerData?.user) {
      dispatch(userExist(registerData.user));
      toast.success(registerData.message || "Registered successfully");
      setOpen(false);
    }
  }, [registerData, dispatch]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <div className="bg-white text-blue-800 rounded-xl p-4 shadow-md hover:shadow-lg cursor-pointer text-center font-semibold text-sm md:text-xl transition hover:scale-105 flex flex-row items-center justify-center space-x-6">
                <span role="img" aria-label="online">
                  <FaGlobe size={32} />
                </span>
                <span>Play Online, Login!</span>
              </div>
            </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 space-y-4">
          <Dialog.Title className="text-lg font-semibold text-center">
            {isLogin ? "Login" : "Register"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {!isLogin && (
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="border p-2 rounded"
                value={formData.username}
                onChange={handleChange}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border p-2 rounded"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border p-2 rounded"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              disabled={isLoginLoading || isRegisterLoading}
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="text-sm text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleMode}
              className="text-blue-600 underline ml-1"
              disabled={isLoginLoading || isRegisterLoading}
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>

          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 text-gray-500 hover:text-black">✕</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LoginDialog;
