/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { axiosInstance } from "@/lib/axiosInstance";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailCheckListPage() {
  const { id, name } = useParams();
  const [items, setItems] = useState<any[]>([]);
  const decodedName = decodeURIComponent((name as string) ?? "");
  const [newItem, setNewItem] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  async function addList() {
    try {
      if (!newItem) return;
      const response = await axiosInstance.post(
        `http://94.74.86.174:8080/api/checklist/${id}/item`,
        { itemName: newItem }
      );
      setItems((prev) => [...prev, response.data.data]);
      setNewItem("");
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteList(idItem: number) {
    try {
      await axiosInstance.delete(
        `http://94.74.86.174:8080/api/checklist/${id}/item/${idItem}`
      );
      setItems(items.filter((item) => item.id !== idItem));
    } catch (error) {
      console.log(error);
    }
  }

  async function checkItem(idItem: number, completionStatus: boolean) {
    try {
      await axiosInstance.put(
        `http://94.74.86.174:8080/api/checklist/${id}/item/${idItem}`,
        { itemCompletionStatus: !completionStatus }
      );
      setItems(
        items.map((item) =>
          item.id === idItem
            ? { ...item, itemCompletionStatus: !item.itemCompletionStatus }
            : item
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function editList(idItem: number) {
    try {
      const response = await axiosInstance.put(
        `http://94.74.86.174:8080/api/checklist/${id}/item/rename/${idItem}`,
        { itemName: editText }
      );
      setItems(
        items.map((item) =>
          item.id === idItem ? { ...item, name: response.data.data.name } : item
        )
      );
      setEditId(null);
      setEditText("");
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch checklist items when the component mounts
  useEffect(() => {
    async function getItems() {
      try {
        const response = await axiosInstance.get(
          `http://94.74.86.174:8080/api/checklist/${id}/item`
        );
        setItems(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getItems();
  }, [id]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl">{decodedName}</h1>
      <div className="flex flex-col gap-5">
        {items.map((val: any) => (
          <div
            key={val.id}
            className="flex justify-between items-center text-white"
          >
            <input
              type="checkbox"
              checked={val.itemCompletionStatus}
              onChange={() => checkItem(val.id, val.itemCompletionStatus)}
            />
            {editId === val.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="p-2 text-black"
              />
            ) : (
              <p>{val.name}</p>
            )}
            <div>
              <button
                onClick={() => deleteList(val.id)}
                className="text-red-400"
              >
                Delete
              </button>{" "}
              {editId === val.id ? (
                <button
                  onClick={() => editList(val.id)}
                  className="text-green-300"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditId(val.id);
                    setEditText(val.name);
                  }}
                  className="text-green-300"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            type="text"
            className="p-2 text-black"
            placeholder="tambah item"
            onChange={(e) => setNewItem(e.target.value)}
            value={newItem}
          />{" "}
          <button onClick={addList} className="bg-white text-black p-2">
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}
