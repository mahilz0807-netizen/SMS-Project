export default function Table({ headers = [], children }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-950 text-white">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="p-4 text-center">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
}