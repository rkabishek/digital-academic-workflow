import { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle,
  ExternalLink,
  Printer,
  QrCode,
  ShieldCheck,
  Calendar,
  Building,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/certificates/my');
      if (res.data?.success) {
        setCertificates(res.data.data.certificates || []);
      }
    } catch {
      toast.error('Failed to load certificates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <DashboardLayout title="My Digital Certificates">
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Verified Academic Credentials &amp; Certifications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tamper-proof digital certificates issued with cryptographic QR code verification.
          </p>
        </div>

        {/* List of Certificates */}
        {loading ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400">
            Loading credentials...
          </div>
        ) : certificates.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400">
            No certificates have been issued yet. Certificates issued by faculty or admin will automatically show up here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert._id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-0.5">
                      Type: {cert.type} &bull; Issued {new Date(cert.issuedDate).toLocaleDateString()}
                    </p>
                    {cert.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Credential ID
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                        {cert.certificateNumber}
                      </span>
                    </div>
                    {cert.qrCode && (
                      <img
                        src={cert.qrCode}
                        alt="QR"
                        className="w-10 h-10 rounded bg-white p-0.5 border border-slate-200"
                      />
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={`/verify/${cert.certificateNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Public Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedCert(cert)}
                    className="btn btn-primary text-xs px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View &amp; Print</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Viewer Modal */}
      <Modal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        title="Official Certificate Viewer"
        maxWidth="max-w-2xl"
      >
        {selectedCert && (
          <div className="space-y-6">
            {/* The printable framed certificate */}
            <div className="p-8 sm:p-12 rounded-3xl bg-amber-50/30 dark:bg-slate-900 border-4 border-double border-amber-600/30 dark:border-amber-500/40 text-center relative overflow-hidden shadow-sm">
              <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-300 mx-auto mb-4">
                <Award className="w-7 h-7" />
              </div>

              <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold block">
                Certificate of Recognition
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-2 font-serif">
                {selectedCert.title}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                This certifies that the recipient has satisfactorily demonstrated proficiency and fulfilled all academic requirements.
              </p>

              {selectedCert.description && (
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-3 italic max-w-lg mx-auto">
                  "{selectedCert.description}"
                </p>
              )}

              {/* QR and Signatures */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-left text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Issuing Authority
                  </span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedCert.issuedBy?.name || 'Department Faculty'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Date: {new Date(selectedCert.issuedDate).toLocaleDateString()}
                  </p>
                </div>

                {selectedCert.qrCode && (
                  <div className="flex flex-col items-center">
                    <img
                      src={selectedCert.qrCode}
                      alt="Verification QR"
                      className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-200 shadow-xs"
                    />
                    <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase">
                      Scan to Verify
                    </span>
                  </div>
                )}

                <div className="text-right text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Credential Serial
                  </span>
                  <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedCert.certificateNumber}
                  </p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                    Tamper Proof
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="btn btn-secondary text-xs px-4 py-2 rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default StudentCertificates;
