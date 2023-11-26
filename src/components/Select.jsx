import React, { useEffect, useState } from "react";

export default function Select({ label, id, onSetFormData, formData, value }) {
  const [options, setOptions] = useState("");

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await fetch(`https://api.frankfurter.app/currencies`);

        if (!response.ok)
          throw new Error("Something went wrong with fetching data");

        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOptions();
  }, []);

  const onChange = (e) => {
    if (e.target.id === "from") {
      onSetFormData({ ...formData, from: e.target.value });
    } else {
      onSetFormData({ ...formData, to: e.target.value });
    }
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between">
        <label className="font-semibold capitalize" htmlFor={id}>
          {label}
        </label>
      </div>
      <select
        className="w-full p-5 font-medium border rounded-md border-slate-300 placeholder:opacity-60"
        name={id}
        id={id}
        value={value}
        onChange={(e) => onChange(e)}
      >
        {Object.keys(options).map((key) => (
          <Option key={key} label={key} value={key} />
        ))}
      </select>
    </div>
  );
}

const Option = ({ value, label }) => {
  return <option value={value}>{label}</option>;
};
