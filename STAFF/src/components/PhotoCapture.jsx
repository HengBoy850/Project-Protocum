

// import React, { useRef, useState } from 'react';
// import { Camera, Upload, RotateCcw } from 'lucide-react';

// export default function PhotoCapture({ onPhotoReady }) {
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [cameraOpen, setCameraOpen] = useState(false);
//   const [error, setError] = useState('');
//   const [debugInfo, setDebugInfo] = useState('');
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const streamRef = useRef(null);

//   async function openCamera() {
//     setError('');
//     setDebugInfo('');
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: 'user' },
//       });
//       streamRef.current = stream;

//       const track = stream.getVideoTracks()[0];
//       setDebugInfo(`Camera: ${track?.label || 'unknown'} · state: ${track?.readyState}`);

//       videoRef.current.srcObject = stream;
//       try {
//         await videoRef.current.play();
//       } catch (playErr) {
//         console.error('Video play() failed:', playErr);
//         setError('Camera connected but preview would not start. See console for detail.');
//       }
//       setCameraOpen(true);
//     } catch (err) {
//       console.error('getUserMedia failed:', err);
//       setError(`Could not access camera (${err.name}). Try "Upload" instead.`);
//     }
//   }

//   function closeCamera() {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//     setCameraOpen(false);
//     setDebugInfo('');
//   }

//   function capture() {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     if (!video.videoWidth) {
//       setError('Camera feed has no dimensions yet — wait a second and try Capture again.');
//       return;
//     }

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     canvas.getContext('2d').drawImage(video, 0, 0);

//     canvas.toBlob((blob) => {
//       const file = new File([blob], `proof-${Date.now()}.jpg`, { type: 'image/jpeg' });
//       setPreviewUrl(URL.createObjectURL(blob));
//       onPhotoReady(file);
//       closeCamera();
//     }, 'image/jpeg', 0.9);
//   }

//   function handleFileChange(e) {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
//       setError('Please choose a JPG, PNG, or WEBP image');
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       setError('Image must be under 5MB');
//       return;
//     }
//     setError('');
//     setPreviewUrl(URL.createObjectURL(file));
//     onPhotoReady(file);
//   }

//   function retake() {
//     setPreviewUrl(null);
//     onPhotoReady(null);
//   }

//   return (
//     <div>
//       {error && <p className="text-sm text-[#E24C3F] mb-2">{error}</p>}
//       {debugInfo && <p className="text-xs text-[#6B6558] mb-2">{debugInfo}</p>}

//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         muted
//         className={`w-full aspect-square object-cover rounded-2xl bg-[#14403F] mb-3 ${cameraOpen ? '' : 'hidden'}`}
//       />
//       <canvas ref={canvasRef} className="hidden" />

//       {cameraOpen ? (
//         <div className="flex gap-2">
//           <button type="button" onClick={closeCamera} className="flex-1 border border-black/10 text-[#1C1C1A] rounded-xl py-2.5 text-sm font-medium hover:bg-black/5 transition-colors">
//             Cancel
//           </button>
//           <button type="button" onClick={capture} className="flex-1 bg-[#FF6452] hover:bg-[#F04B38] text-[#FDF8F0] rounded-xl py-2.5 text-sm font-semibold transition-colors shadow-md shadow-[#FF6452]/25">
//             Capture
//           </button>
//         </div>
//       ) : previewUrl ? (
//         <div>
//           <img src={previewUrl} alt="Your proof photo" className="w-full aspect-square object-cover rounded-2xl mb-3 shadow-md" />
//           <button
//             type="button"
//             onClick={retake}
//             className="w-full flex items-center justify-center gap-2 border border-black/10 text-[#1C1C1A] rounded-xl py-2.5 text-sm font-medium hover:bg-black/5 transition-colors"
//           >
//             <RotateCcw size={15} /> Retake
//           </button>
//         </div>
//       ) : (
//         <div>
//           <div className="aspect-square rounded-2xl border-2 border-dashed border-black/10 flex flex-col items-center justify-center gap-2 mb-3 bg-[#F5EFE3]">
//             <Camera size={28} className="text-[#6B6558]" />
//             <p className="text-xs text-[#6B6558]">No photo yet</p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               type="button"
//               onClick={openCamera}
//               className="flex-1 flex items-center justify-center gap-2 border border-black/10 text-[#1C1C1A] rounded-xl py-2.5 text-sm font-medium hover:bg-black/5 transition-colors"
//             >
//               <Camera size={15} /> Take photo
//             </button>
//             <button
//               type="button"
//               onClick={() => fileInputRef.current.click()}
//               className="flex-1 flex items-center justify-center gap-2 border border-black/10 text-[#1C1C1A] rounded-xl py-2.5 text-sm font-medium hover:bg-black/5 transition-colors"
//             >
//               <Upload size={15} /> Upload
//             </button>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/jpeg,image/png,image/webp"
//               capture="user"
//               onChange={handleFileChange}
//               className="hidden"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useRef, useState } from 'react';
import { Camera, Upload, RotateCcw } from 'lucide-react';

export default function PhotoCapture({ onPhotoReady }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  async function openCamera() {
    setError('');
    setDebugInfo('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      streamRef.current = stream;

      const track = stream.getVideoTracks()[0];
      setDebugInfo(`Camera: ${track?.label || 'unknown'} · state: ${track?.readyState}`);

      videoRef.current.srcObject = stream;
      try {
        await videoRef.current.play();
      } catch (playErr) {
        console.error('Video play() failed:', playErr);
        setError('Camera connected but preview would not start. See console for detail.');
      }
      setCameraOpen(true);
    } catch (err) {
      console.error('getUserMedia failed:', err);
      setError(`Could not access camera (${err.name}). Try "Upload" instead.`);
    }
  }

  function closeCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
    setDebugInfo('');
  }

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video.videoWidth) {
      setError('Camera feed has no dimensions yet — wait a second and try Capture again.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `proof-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setPreviewUrl(URL.createObjectURL(blob));
      onPhotoReady(file);
      closeCamera();
    }, 'image/jpeg', 0.9);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please choose a JPG, PNG, or WEBP image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }
    setError('');
    setPreviewUrl(URL.createObjectURL(file));
    onPhotoReady(file);
  }

  function retake() {
    setPreviewUrl(null);
    onPhotoReady(null);
  }

  return (
    <div>
      {error && <p className="mb-2 text-sm font-medium text-[#FF5A4A]">{error}</p>}
      {debugInfo && <p className="mb-2 text-xs text-[#858BA3]">{debugInfo}</p>}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`mb-3 aspect-square w-full rounded-2xl bg-[#20243F] object-cover ${cameraOpen ? '' : 'hidden'}`}
      />
      <canvas ref={canvasRef} className="hidden" />

      {cameraOpen ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={closeCamera}
            className="flex-1 rounded-2xl border border-[#E5E7F2] py-2.5 text-sm font-bold text-[#747A93] transition hover:bg-[#F6F7FC]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={capture}
            className="flex-1 rounded-2xl bg-[#7158F6] py-2.5 text-sm font-bold text-white shadow-lg shadow-[#7158F6]/25 transition hover:bg-[#6047E8]"
          >
            Capture
          </button>
        </div>
      ) : previewUrl ? (
        <div>
          <img src={previewUrl} alt="Your proof photo" className="mb-3 aspect-square w-full rounded-2xl object-cover shadow-md shadow-[#47546D]/15" />
          <button
            type="button"
            onClick={retake}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E5E7F2] py-2.5 text-sm font-bold text-[#747A93] transition hover:bg-[#F6F7FC]"
          >
            <RotateCcw size={15} /> Retake
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#E5E7F2] bg-[#FAFBFF]">
            <Camera size={28} className="text-[#858BA3]" />
            <p className="text-xs font-medium text-[#858BA3]">No photo yet</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={openCamera}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#E5E7F2] py-2.5 text-sm font-bold text-[#747A93] transition hover:bg-[#F6F7FC]"
            >
              <Camera size={15} /> Take photo
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#E5E7F2] py-2.5 text-sm font-bold text-[#747A93] transition hover:bg-[#F6F7FC]"
            >
              <Upload size={15} /> Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="user"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
