/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { axiosInstance } from "@/lib/axiosInstance";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  // const router = useRouter();
  const { data: session } = useSession();

  const [checklist, setChecklist] = useState([]);

  async function deleteChecklist(id: number) {
    try {
      const response = await axiosInstance.delete(
        "http://94.74.86.174:8080/api/checklist/" + id
      );
      console.log(response);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function getChecklist() {
      try {
        const response = await axiosInstance.get(
          "http://94.74.86.174:8080/api/checklist"
        );
        console.log(response);
        setChecklist(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getChecklist();
  }, [session]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button
        className="absolute top-0 right-0 p-5"
        onClick={async () => {
          await signOut();
        }}
      >
        SignOut
      </button>
      <h1>Semua Checklist</h1>
      <div className="flex flex-wrap gap-2">
        {checklist.map((value: any) => {
          return (
            <div key={value.id} className="w-36 bg-white text-black p-3">
              <Link
                href={"/checklist/detail/" + value.id + "/" + value.name}
                className="p-4 text-blue-400 w-full"
              >
                {value.name}
              </Link>
              <button
                onClick={async () => {
                  await deleteChecklist(value.id);
                }}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          );
        })}
        <Link
          href={"/checklist/create"}
          className="w-36 bg-white p-3 text-black text-lg font-semibold flex justify-center items-center"
        >
          Tambah +
        </Link>
      </div>
    </div>
  );
}
