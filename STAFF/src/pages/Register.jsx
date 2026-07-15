

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { ClipboardCheck, AlertCircle } from 'lucide-react';
// import api from '../api/client';
// import PhotoCapture from '../components/PhotoCapture';
// import { useDepartments } from '../hooks/useDepartments';

// export default function Register() {
//   const [step, setStep] = useState(1);
//   const [form, setForm] = useState({
//     fullName: '', email: '', phone: '', departmentId: '', position: '',
//     password: '', confirmPassword: '',
//   });
//   const [photo, setPhoto] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const departments = useDepartments();
//   const navigate = useNavigate();

//   function update(field, value) {
//     setForm((f) => ({ ...f, [field]: value }));
//   }

//   function validateStep1() {
//     if (!form.fullName || !form.email || !form.phone || !form.departmentId || !form.position) {
//       setError('Fill in every field before continuing');
//       return false;
//     }
//     return true;
//   }

//   function goNext() {
//     setError('');
//     if (step === 1 && !validateStep1()) return;
//     if (step === 2 && !photo) {
//       setError('Take or upload a photo before continuing');
//       return;
//     }
//     setStep((s) => s + 1);
//   }

//   async function handleSubmit() {
//     setError('');
//     if (form.password.length < 8) {
//       setError('Password must be at least 8 characters');
//       return;
//     }
//     if (form.password !== form.confirmPassword) {
//       setError("Passwords don't match");
//       return;
//     }

//     setLoading(true);
//     try {
//       const body = new FormData();
//       body.append('fullName', form.fullName);
//       body.append('email', form.email);
//       body.append('phone', form.phone);
//       body.append('departmentId', form.departmentId);
//       body.append('position', form.position);
//       body.append('password', form.password);
//       body.append('photo', photo);

//       await api.post('/staff/register', body, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       navigate('/pending');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#14403F] flex items-start justify-center py-8 px-4">
//       <div className="w-full max-w-sm bg-[#FDF8F0] rounded-3xl p-6 shadow-2xl shadow-black/20">
//         <div className="flex items-center gap-2 mb-4">
//           <div className="w-9 h-9 rounded-xl bg-[#FF6452] flex items-center justify-center shadow-md shadow-[#FF6452]/30">
//             <ClipboardCheck size={17} className="text-[#FDF8F0]" />
//           </div>
//           <p className="text-lg font-bold text-[#1C1C1A]">StaffSync</p>
//         </div>

//         <div className="flex gap-1.5 mb-5">
//           {[1, 2, 3].map((n) => (
//             <div key={n} className={`flex-1 h-1.5 rounded-full ${n <= step ? 'bg-[#FF6452]' : 'bg-black/10'}`} />
//           ))}
//         </div>

//         {step === 1 && (
//           <div>
//             <p className="text-xs text-[#FF6452] font-semibold mb-1">Step 1 of 3</p>
//             <p className="font-semibold text-lg text-[#1C1C1A] mb-4">Your details</p>
//             <div className="flex flex-col gap-3">
//               <input
//                 value={form.fullName}
//                 onChange={(e) => update('fullName', e.target.value)}
//                 placeholder="Full name"
//                 className="bg-[#F5EFE3] border border-black/5 rounded-xl px-3 py-2.5 text-sm text-[#1C1C1A] focus:outline-none focus:ring-2 focus:ring-[#FF6452]/50"
//               />
//               <input
//                 type="email"
//                 value={form.email}
//                 onChange={(e) => update('email', e.target.value)}
//                 placeholder="Email"
//                 className="bg-[#F5EFE3] border border-black/5 rounded-xl px-3 py-2.5 text-sm text-[#1C1C1A] focus:outline-none focus:ring-2 focus:ring-[#FF6452]/50"
//               />
//               <input
//                 type="tel"
//                 value={form.phone}
//                 onChange={(e) => update('phone', e.target.value)}
//                 placeholder="Phone"
//                 className="bg-[#F5EFE3] border border-black/5 rounded-xl px-3 py-2.5 text-sm text-[#1C1C1A] focus:outline-none focus:ring-2 focus:ring-[#FF6452]/50"
//               />
//               <select
//                 value={form.departmentId}
//                 onChange={(e) => update('departmentId', e.target.value)}
//                 className="bg-[#F5EFE3] border border-black/5 rounded-xl px-3 py-2.5 text-sm text-[#1C1C1A] focus:outline-none focus:ring-2 focus:ring-[#FF6452]/50"
//               >
//                 <option value="">Select department</option>
//                 {departments.map((d) => (
//                   <option key={d.id} value={d.id}>{d.name}</option>
//                 ))}
//               </select>
//               <input
//                 value={form.position}
//                 onChange={(e) => update('position', e.target.value)}
//                 placeholder="Position (e.g. Cashier)"
//                 className="bg-[#F5EFE3] border border-black/5 rounded-xl px-3 py-2.5 text-sm text-[#1C1C1A] focus:outline-none focus:ring-2 focus:ring-[#FF6452]/50"
//               />
//             </div>
//           </div>
//         )}

//         {step === 2 && (
//           <div>
//             <p className="text-xs text-[#FF6452] font-semibold mb-1">Step 2 of 3</p>
//             <p className="font-semibold text-lg text-[#1C1C1A] mb-1">Proof photo</p>
//             <p className="text-sm text-[#6B6558] mb-3">Your manager checks this against your face before approving.</p>
//             <PhotoCapture onPhotoReady={setPhoto} />
//           </div>
//         )}

//         {step === 3 && (
//           <div>
//             <p className="text-xs text-[#FF6452] font-semibold mb-1">Step 3 of 3</p>
//             <p className="font-semibold text-lg text-[#1C1C1A] mb-4">Set a password</p>
//             <div className="flex flex-col gap-3">
//               <input
//                 type="password"
//                 value={form.password}
//                 onChange={(e) => update('password', e.target.value)}
//                 placeholder="Password (min. 8 characters)"
//                 className="bg-[#F5EFE3] border border-black/5 rounded-xl px-3 py-2.5 text-sm text-[#1C1C1A] focus:outline-none focus:ring-2 focus:ring-[#FF6452]/50"
//               />
//               <input
//                 type="password"
//                 value={form.confirmPassword}
//                 onChange={(e) => update('confirmPassword', e.target.value)}
//                 placeholder="Confirm password"
//                 className="bg-[#F5EFE3] border border-black/5 rounded-xl px-3 py-2.5 text-sm text-[#1C1C1A] focus:outline-none focus:ring-2 focus:ring-[#FF6452]/50"
//               />
//             </div>
//           </div>
//         )}

//         {error && (
//           <p className="flex items-center gap-1.5 text-sm text-[#E24C3F] mt-3">
//             <AlertCircle size={14} className="shrink-0" /> {error}
//           </p>
//         )}

//         <div className="flex gap-2 mt-5">
//           {step > 1 && (
//             <button
//               onClick={() => setStep((s) => s - 1)}
//               className="flex-1 border border-black/10 text-[#1C1C1A] rounded-xl py-2.5 text-sm font-medium hover:bg-black/5 transition-colors"
//             >
//               Back
//             </button>
//           )}
//           <button
//             onClick={step === 3 ? handleSubmit : goNext}
//             disabled={loading}
//             className="flex-[2] bg-[#FF6452] hover:bg-[#F04B38] text-[#FDF8F0] rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50 transition-colors shadow-md shadow-[#FF6452]/25"
//           >
//             {loading ? 'Submitting…' : step === 3 ? 'Request access' : 'Continue'}
//           </button>
//         </div>

//         <p className="text-center text-sm text-[#6B6558] mt-4">
//           Already approved? <Link to="/login" className="text-[#FF6452] font-medium underline">Sign in</Link>
//         </p>
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ClipboardCheck, AlertCircle } from 'lucide-react';
import api from '../api/client';
import PhotoCapture from '../components/PhotoCapture';
import { useDepartments } from '../hooks/useDepartments';

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', departmentId: '', position: '',
    password: '', confirmPassword: '',
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const departments = useDepartments();
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validateStep1() {
    if (!form.fullName || !form.email || !form.phone || !form.departmentId || !form.position) {
      setError('Fill in every field before continuing');
      return false;
    }
    return true;
  }

  function goNext() {
    setError('');
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !photo) {
      setError('Take or upload a photo before continuing');
      return;
    }
    setStep((s) => s + 1);
  }

  async function handleSubmit() {
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();
      body.append('fullName', form.fullName);
      body.append('email', form.email);
      body.append('phone', form.phone);
      body.append('departmentId', form.departmentId);
      body.append('position', form.position);
      body.append('password', form.password);
      body.append('photo', photo);

      await api.post('/staff/register', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/pending');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gradient-to-br from-[#785BFF] via-[#5F74FF] to-[#1D91FF] px-4 py-8">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl shadow-black/20">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7158F6] shadow-md shadow-[#7158F6]/30">
            <ClipboardCheck size={17} className="text-white" />
          </div>
          <p className="text-lg font-black text-[#20243F]">StaffSync</p>
        </div>

        <div className="mb-5 flex gap-1.5">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? 'bg-[#7158F6]' : 'bg-[#E5E7F2]'}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <p className="mb-1 text-xs font-bold text-[#7158F6]">Step 1 of 3</p>
            <p className="mb-4 text-lg font-black text-[#20243F]">Your details</p>
            <div className="flex flex-col gap-3">
              <input
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                placeholder="Full name"
                className="rounded-2xl border border-[#E5E7F2] bg-[#FAFBFF] px-4 py-3 text-sm font-semibold text-[#20243F] outline-none transition placeholder:font-normal placeholder:text-[#B0B5C8] focus:border-[#7158F6] focus:ring-4 focus:ring-[#7158F6]/15"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="Email"
                className="rounded-2xl border border-[#E5E7F2] bg-[#FAFBFF] px-4 py-3 text-sm font-semibold text-[#20243F] outline-none transition placeholder:font-normal placeholder:text-[#B0B5C8] focus:border-[#7158F6] focus:ring-4 focus:ring-[#7158F6]/15"
              />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="Phone"
                className="rounded-2xl border border-[#E5E7F2] bg-[#FAFBFF] px-4 py-3 text-sm font-semibold text-[#20243F] outline-none transition placeholder:font-normal placeholder:text-[#B0B5C8] focus:border-[#7158F6] focus:ring-4 focus:ring-[#7158F6]/15"
              />
              <select
                value={form.departmentId}
                onChange={(e) => update('departmentId', e.target.value)}
                className="rounded-2xl border border-[#E5E7F2] bg-[#FAFBFF] px-4 py-3 text-sm font-semibold text-[#20243F] outline-none transition focus:border-[#7158F6] focus:ring-4 focus:ring-[#7158F6]/15"
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <input
                value={form.position}
                onChange={(e) => update('position', e.target.value)}
                placeholder="Position (e.g. Cashier)"
                className="rounded-2xl border border-[#E5E7F2] bg-[#FAFBFF] px-4 py-3 text-sm font-semibold text-[#20243F] outline-none transition placeholder:font-normal placeholder:text-[#B0B5C8] focus:border-[#7158F6] focus:ring-4 focus:ring-[#7158F6]/15"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-1 text-xs font-bold text-[#7158F6]">Step 2 of 3</p>
            <p className="mb-1 text-lg font-black text-[#20243F]">Proof photo</p>
            <p className="mb-3 text-sm text-[#858BA3]">Your manager checks this against your face before approving.</p>
            <PhotoCapture onPhotoReady={setPhoto} />
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="mb-1 text-xs font-bold text-[#7158F6]">Step 3 of 3</p>
            <p className="mb-4 text-lg font-black text-[#20243F]">Set a password</p>
            <div className="flex flex-col gap-3">
              <input
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Password (min. 8 characters)"
                className="rounded-2xl border border-[#E5E7F2] bg-[#FAFBFF] px-4 py-3 text-sm font-semibold text-[#20243F] outline-none transition placeholder:font-normal placeholder:text-[#B0B5C8] focus:border-[#7158F6] focus:ring-4 focus:ring-[#7158F6]/15"
              />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                placeholder="Confirm password"
                className="rounded-2xl border border-[#E5E7F2] bg-[#FAFBFF] px-4 py-3 text-sm font-semibold text-[#20243F] outline-none transition placeholder:font-normal placeholder:text-[#B0B5C8] focus:border-[#7158F6] focus:ring-4 focus:ring-[#7158F6]/15"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-[#FF5A4A]">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </p>
        )}

        <div className="mt-5 flex gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-2xl border border-[#E5E7F2] py-3 text-sm font-bold text-[#747A93] transition hover:bg-[#F6F7FC]"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={step === 3 ? handleSubmit : goNext}
            disabled={loading}
            className="flex-[2] rounded-2xl bg-[#7158F6] py-3 text-sm font-bold text-white shadow-lg shadow-[#7158F6]/25 transition hover:bg-[#6047E8] disabled:opacity-60"
          >
            {loading ? 'Submitting…' : step === 3 ? 'Request access' : 'Continue'}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-[#858BA3]">
          Already approved?{' '}
          <Link to="/login" className="font-bold text-[#7158F6] underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
