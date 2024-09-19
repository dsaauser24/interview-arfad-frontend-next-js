"use client";
import axios from "axios";
import { useFormik } from "formik";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const registerSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  name: Yup.string().max(20).required(),
});

const RegisterPage: NextPage = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
      email: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      const response = await axios.post(
        "http://94.74.86.174:8080/api/register",
        {
          email: values.email,
          password: values.password,
          username: values.name,
        }
      );
      if (response.data.error) {
        setMessage("Something went wrong, please try again");
      } else {
        router.push("/auth");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex justify-center mt-10 ">
      <div className="w-2/5 bg-black p-10 rounded-xl border-4 border-black shadow-solid-md flex flex-col gap-1">
        <h1 className="font-extrabold text-2xl text-center mb-3">Register</h1>
        <p className="text-center">{message}</p>
        <label htmlFor="email">E-mail</label>
        <input
          className="text-black"
          type="email"
          id="email"
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email ? (
          <p className="mb-3">{formik.errors.email}</p>
        ) : null}
        <label htmlFor="password">Password</label>
        <input
          className="text-black"
          type="password"
          id="password"
          {...formik.getFieldProps("password")}
        />
        {formik.touched.password && formik.errors.password ? (
          <p className="mb-3">{formik.errors.password}</p>
        ) : null}
        <div className="mb-3"></div>
        <label htmlFor="name">Full Name</label>
        <input
          className="text-black"
          id="name"
          type="text"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name ? (
          <p className="mb-3">{formik.errors.name}</p>
        ) : null}
        <div className="mb-3"></div>
        <p className="text-center mb-5">
          {"Already have account?"}{" "}
          <Link href={"/auth"} className="font-semibold">
            Login Here
          </Link>
        </p>
        <button type="submit" onClick={async () => {}}>
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterPage;
