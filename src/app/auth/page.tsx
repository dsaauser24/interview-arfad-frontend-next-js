"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";

const loginSchema = Yup.object({
  email: Yup.string().required(),
  password: Yup.string().required(),
});

export default function LoginPage() {
  const session = useSession();
  console.log(session);
  const router = useRouter();
  const [message, setMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      console.log(values);
      const response = await signIn("credentials", {
        username: values.email,
        password: values.password,
        redirect: false,
      });

      if (response?.error) {
        setMessage(response.error);
      } else {
        setMessage("");
        router.push("/");
      }
    },
  });
  return (
    <div className="flex justify-center mt-20">
      <form
        onSubmit={formik.handleSubmit}
        className="w-2/5 p-10 rounded-xl border-4 border-black shadow-solid-md flex flex-col gap-1"
      >
        <h1 className="font-extrabold text-2xl text-center mb-3">Login</h1>
        <p className="text-center">{message}</p>
        <label htmlFor="email">username</label>
        <input
          type="text"
          className="mb-3 text-black"
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email ? (
          <p className="mb-3 text-red-400">{formik.errors.email}</p>
        ) : null}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="text-black"
          {...formik.getFieldProps("password")}
        />
        {formik.touched.password && formik.errors.password ? (
          <p className="mb-3 text-red-400">{formik.errors.password}</p>
        ) : null}
        <div className="mb-3"></div>
        <p className="text-center mb-5">
          {"Don't have account?"}{" "}
          <Link href={"/auth/register"} className="font-semibold">
            Register Here
          </Link>
        </p>
        <button type="submit" className="border-2 border-white">
          Submit
        </button>
      </form>
    </div>
  );
}
