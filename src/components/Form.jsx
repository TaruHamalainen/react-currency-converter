import React from "react";
import Input from "./Input";
import Select from "./Select";
import { useState, useEffect } from "react";
import { SiConvertio } from "react-icons/si";

export default function Form() {
  const [formData, setFormData] = useState({
    from: "USD",
    to: "EUR",
    amount: 1,
  });

  const [total, setTotal] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      if (formData.from === formData.to) {
        setTotal(formData.amount);
        return;
      }
      if (formData.amount <= 0) {
        setTotal(formData.amount);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=${formData.amount}&from=${formData.from}&to=${formData.to}`,
          { signal: controller.signal }
        );

        if (!response.ok)
          throw new Error("Something went wrong with fetching data");

        const data = await response.json();
        if (!data) throw new Error("Something went wrong with fetching data");

        setTotal(data.rates[formData.to].toFixed(2));
      } catch (error) {
        if (!error.name === "AbortError") console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      controller.abort();
    };
  }, [formData]);
  return (
    <form
      className=" max-w-lg mt-5 p-3 mx-auto"
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      <div className=" text-center  flex flex-col gap-5 shadow-md bg-slate-200 rounded-lg p-4">
        <h1 className="text-center text-4xl mt-3 mb-3">Currency Converter</h1>
        <Input
          label={"amount to convert"}
          type={"number"}
          id={"amount"}
          placeholder={"Enter amount to convert"}
          onSetFormData={setFormData}
          formData={formData}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            id={"from"}
            label={"convert from"}
            onSetFormData={setFormData}
            formData={formData}
            value={formData.from}
          />
          <Select
            id={"to"}
            label={"convert to"}
            onSetFormData={setFormData}
            formData={formData}
            value={formData.to}
          />
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            const temp = formData.from;
            setFormData({ ...formData, from: formData.to, to: temp });
          }}
          className="bg-slate-500 p-5 rounded-full w-20 h-20   text-white flex items-center justify-center self-center"
        >
          <SiConvertio className="text-5xl" />
        </button>

        {isLoading && <p>Loading...</p>}
        {!isLoading && (
          <div className="flex flex-col w-full gap-2">
            <div className="flex justify-between ">
              <p className="font-semibold capitalize">total</p>
            </div>
            <p className="w-full p-5 font-medium border rounded-md border-slate-300 bg-white ">
              {total}
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
