/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { axiosInstance } from "@/lib/axiosInstance";

const loginSchema = Yup.object({
  name: Yup.string().required(),
});

export default function CreateChecklistPage() {
  const session = useSession();
  console.log(session);
  const router = useRouter();
  const [message, setMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.post("http://94.74.86.174:8080/api/checklist", {
          name: values.name,
        });
        router.push("/");
      } catch (error: any) {
        setMessage(error.message);
      }
    },
  });
  return (
    <div className="flex justify-center mt-20">
      <form
        onSubmit={formik.handleSubmit}
        className="w-2/5 p-10 rounded-xl border-4 border-black shadow-solid-md flex flex-col gap-1"
      >
        <h1 className="font-extrabold text-2xl text-center mb-3">
          Tambah Checklist
        </h1>
        <p className="text-center">{message}</p>
        <label htmlFor="email">Nama</label>
        <input
          type="text"
          className="mb-3 text-black"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name ? (
          <p className="mb-3 text-red-400">{formik.errors.name}</p>
        ) : null}

        <button type="submit" className="border-2 border-white">
          Tambah
        </button>
      </form>
    </div>
  );
}
