export default function StudentCard({ student }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow hover:shadow-2xl transition">
      <div className="flex flex-col items-center">
        {student.image_url ? (
          <img
            src={student.image_url}
            alt={student.full_name}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-slate-300"></div>
        )}

        <h2 className="text-xl font-bold mt-4 dark:text-white">
          {student.full_name}
        </h2>

        <p className="text-slate-500">{student.email}</p>

        <p className="text-slate-500">{student.phone}</p>

        <span className="mt-3 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
          {student.course}
        </span>
      </div>
    </div>
  );
}