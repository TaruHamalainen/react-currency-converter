export default function InputError({ message }) {
  return (
    <div className="flex items-center gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md">
      {message}
    </div>
  );
}
