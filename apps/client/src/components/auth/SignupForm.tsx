import { useState } from "react";
import { createUser } from "../../apis/users";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await createUser(form);
      console.log("Form Data:", res);

      if (res.responseStatus === 201) {
        navigate("/login");
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm border-gray-200 "
            placeholder="Your full name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm border-gray-200 "
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm border-gray-200 "
            placeholder="Enter a strong password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-600 text-white py-1.5 rounded-xl hover:bg-gray-700 transition-all"
        >
          Create Account
        </button>

        <div className="mt-4 text-center">
          <span className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-blue-600 hover:underline font-medium"
            >
              Log in
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
