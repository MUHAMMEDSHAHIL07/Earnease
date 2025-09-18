import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Globe } from "lucide-react";

const SingleViewEmployer = () => {
  const { id } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/admin/getEmployer/${id}`, { withCredentials: true })
      .then((res) => setData(res.data))
      .catch(console.error);
  }, [id]);

  if (!data) return <div className="p-6 text-gray-600">Loading…</div>

  const { verification, employer } = data
  const dateJoined = new Date(employer.createdAt).toLocaleDateString()
  const Badge = ({ ok, yesText, noText }) => (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium
        ${ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
      `}
    >
      {ok ? <CheckCircle size={14} /> : <XCircle size={14} />}
      {ok ? yesText : noText}
    </span>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
      <div
        className="mx-auto w-full max-w-5xl rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-slate-200
                   backdrop-blur transition hover:shadow-2xl"
      >
        <header className="flex flex-col items-center gap-4 text-center">
          <img
            src={employer.avatarUrl}
            alt={employer.companyname}
            className="h-24 w-24 rounded-full shadow-md ring-2 ring-offset-2 ring-indigo-400/70"
          />
          <h1 className="text-3xl font-extrabold text-slate-800">{employer.companyname}</h1>

          <div className="flex flex-wrap justify-center gap-2">
            {employer.isBlocked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                <XCircle size={14} /> Blocked
              </span>
            )}
          </div>
        </header>
        <hr className="my-8 border-t border-dashed border-slate-300" />

        <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <Info label="Email" value={employer.email} />
            <Info label="Joined On" value={dateJoined} />
            <Info label="Company Type" value={verification.companyType} />
            <Info label="Industry" value={verification.industry} />
            <Info label="Address" value={verification.address} />
            <Info label="Founded Year" value={verification.foundedYear} />
            <Info label="Contact Person" value={verification.contactPerson} />
            <Info label="Contact Email" value={verification.contactEmail} />
            <Info
              label="Website"
              value={
                verification.websiteUrl ? (
                  <a
                    href={verification.websiteUrl.startsWith("http") ? verification.websiteUrl : `https://${verification.websiteUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 underline hover:text-indigo-800"
                  >
                    <Globe size={14} /> {verification.websiteUrl.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  "—"
                )
              }
            />
            <Info label="About Company" value={verification.aboutCompany} />
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-semibold text-slate-600">Uploaded License</p>
            {verification.licenseUrl ? (
              <a
                href={verification.licenseUrl}
                target="_blank"
                rel="noreferrer"
                className="group"
              >
                <img
                  src={verification.licenseUrl}
                  alt="License"
                  className="w-full max-w-xs rounded-lg border border-slate-200 shadow-md
                             transition group-hover:scale-105 group-hover:shadow-lg"
                />
                <span className="mt-1 block text-center text-xs text-slate-500">
                  Click to view full image
                </span>
              </a>
            ) : (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 shadow-sm">
                No license uploaded.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-sm text-slate-800">{value || "—"}</p>
  </div>
);

export default SingleViewEmployer;