import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
      <h1 className="text-3xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">Page not found.</p>
      <Link
        to="/"
        className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
