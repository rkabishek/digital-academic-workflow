import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Award,
  Calendar,
  Building,
  UserCheck,
  Printer,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import api from '../services/api';

const VerifyCertificate = () => {
  const { certNumber: routeCertNumber } = useParams();
  const navigate = useNavigate();
  const [certInput, setCertInput] = useState(routeCertNumber || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const performVerification = async (code) => {
    if (!code || !code.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setSearched(true);
    try {
      const trimmed = code.trim().toUpperCase();
      const res = await api.get(`/certificates/verify/${encodeURIComponent(trimmed)}`);
      if (res.data?.success) {
        setResult(res.data.data.certificate);
      } else {
        setResult(null);
        setErrorMsg(res.data?.message || 'Certificate not found.');
      }
    } catch (err) {
      setResult(null);
      setErrorMsg(
        err.response?.data?.message ||
          'Certificate could not be verified. Please check the certificate number and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeCertNumber) {
      setCertInput(routeCertNumber);
      performVerification(routeCertNumber);
    }
  }, [routeCertNumber]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (certInput.trim()) {
      navigate(`/verify/${encodeURIComponent(certInput.trim().toUpperCase())}`);
      performVerification(certInput.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <PublicNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Official Credential Verification
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Verify the authenticity of digital certificates issued by AcadFlow. Enter the certificate number or scan the QR code.
          </p>
        </div>

        {/* Search input box */}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto mb-10 flex gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value.toUpperCase())}
              placeholder="e.g. CERT-202609-A1B2C3"
              className="w-full px-3 py-2 bg-transparent text-sm font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !certInput.trim()}
            className="btn btn-primary px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm disabled:opacity-50 shrink-0"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        {/* Verification Result Card */}
        {searched && (
          <div className="animate-slide-up">
            {result ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/40 p-6 sm:p-10 shadow-lg relative overflow-hidden">
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        Authentic Credential Verified
                      </h2>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        This digital record is registered in the institutional repository.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="btn btn-secondary text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" />
                      Print Record
                    </button>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                        Certificate Title
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                        {result.title}
                      </h3>
                      {result.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                          {result.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                          Recipient Student
                        </span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                          {result.issuedTo?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          Roll: {result.issuedTo?.rollNumber || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {result.issuedTo?.department || ''}
                        </p>
                      </div>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                          Issuing Authority
                        </span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                          {result.issuedBy?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {result.issuedBy?.designation || 'Faculty Member'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Issue Date</span>
                        <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                          {new Date(result.issuedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Type of Award</span>
                        <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5 capitalize">
                          {result.type}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code and Credential Id */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-center">
                    {result.qrCode ? (
                      <img
                        src={result.qrCode}
                        alt="Verification QR Code"
                        className="w-40 h-40 rounded-xl bg-white p-2 shadow-sm border border-slate-200"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                        No QR Image
                      </div>
                    )}
                    <span className="mt-4 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      Credential ID
                    </span>
                    <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200 mt-1 select-all">
                      {result.certificateNumber}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/50 p-8 sm:p-12 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-200 dark:border-rose-800">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Certificate Verification Failed
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {errorMsg || 'No record matching this certificate number was found in the database.'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default VerifyCertificate;
