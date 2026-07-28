// import React, { useEffect, useState } from 'react';
// import api from '../api/client';

// export default function Departments() {
//   const [departments, setDepartments] = useState([]);
//   const [newName, setNewName] = useState('');
//   const [showForm, setShowForm] = useState(false);

//   async function load() {
//     const { data } = await api.get('/departments');
//     setDepartments(data);
//   }

//   useEffect(() => { load(); }, []);

//   async function addDepartment(e) {
//     e.preventDefault();
//     if (!newName.trim()) return;
//     await api.post('/departments', { name: newName.trim() });
//     setNewName('');
//     setShowForm(false);
//     load();
//   }

//   async function removeDepartment(id) {
//     if (!confirm('Delete this department? Staff in it will be unassigned, not deleted.')) return;
//     await api.delete(`/departments/${id}`);
//     load();
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <p className="text-2xl font-bold">Departments</p>
//           <p className="text-sm text-gray-500">Shared across POS and the staff registration form</p>
//         </div>
//         <button
//           onClick={() => setShowForm((v) => !v)}
//           className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg"
//         >
//           + Add Department
//         </button>
//       </div>

//       {showForm && (
//         <form onSubmit={addDepartment} className="flex gap-2 mb-6">
//           <input
//             type="text"
//             value={newName}
//             onChange={(e) => setNewName(e.target.value)}
//             placeholder="Department name"
//             className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 max-w-xs"
//             autoFocus
//           />
//           <button type="submit" className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg">Save</button>
//         </form>
//       )}

//       <div className="grid grid-cols-3 gap-4">
//         {departments.map((d) => (
//           <div key={d.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
//             <div>
//               <p className="font-medium">{d.name}</p>
//               <p className="text-xs text-gray-500">{d.staff_count} staff</p>
//             </div>
//             <button onClick={() => removeDepartment(d.id)} className="text-red-600 text-xs font-medium">
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { Plus, Users, Trash2 } from 'lucide-react';
import api from '../api/client';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [newName, setNewName] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const { data } = await api.get('/departments');
    setDepartments(data);
  }

  useEffect(() => { load(); }, []);

  async function addDepartment(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    await api.post('/departments', { name: newName.trim() });
    setNewName('');
    setShowForm(false);
    load();
  }

  async function removeDepartment(id) {
    if (!confirm('Delete this department? Staff in it will be unassigned, not deleted.')) return;
    await api.delete(`/departments/${id}`);
    load();
  }

  return (
    <div className="bg-[#FAFAF7] min-h-full font-sans text-[#1C1E22]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-2xl font-bold tracking-tight">Departments</p>
          <p className="text-sm text-[#8A8D93] mt-0.5">Shared across POS and the staff registration form</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 bg-[#1C1E22] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#33363C] transition-colors"
        >
          <Plus size={14} /> Add Department
        </button>
      </div>

      {showForm && (
        <form onSubmit={addDepartment} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Department name"
            className="border border-[#E7E5E0] bg-white rounded-lg px-3 py-2 text-sm flex-1 max-w-xs placeholder:text-[#B5B2A8] focus:outline-none focus:ring-2 focus:ring-[#1C1E22]/10 focus:border-[#1C1E22]/30"
            autoFocus
          />
          <button
            type="submit"
            className="bg-[#1C1E22] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#33363C] transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => { setShowForm(false); setNewName(''); }}
            className="text-sm font-medium px-4 py-2 rounded-lg text-[#6B6F76] hover:bg-[#F0EEE8] transition-colors"
          >
            Cancel
          </button>
        </form>
      )}

      <div className="grid grid-cols-3 gap-4">
        {departments.map((d) => (
          <div
            key={d.id}
            className="group border border-[#E7E5E0] rounded-2xl p-4 bg-white flex items-center justify-between hover:border-[#D8D5CC] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#E9F0F2] flex items-center justify-center shrink-0">
                <Users size={15} className="text-[#3A5A6B]" />
              </div>
              <div>
                <p className="font-medium text-sm">{d.name}</p>
                <p className="text-xs font-mono text-[#8A8D93]">{d.staff_count} staff</p>
              </div>
            </div>
            <button
              onClick={() => removeDepartment(d.id)}
              className="text-[#B5B2A8] hover:text-[#B8451A] p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all"
              title="Delete department"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {departments.length === 0 && (
          <div className="col-span-3 border border-dashed border-[#E0DDD3] rounded-2xl bg-white px-4 py-14 text-center">
            <p className="text-sm text-[#8A8D93]">No departments yet.</p>
            <p className="text-xs text-[#C7C4BA] mt-1 font-mono">Add one to start assigning staff</p>
          </div>
        )}
      </div>
    </div>
  );
}
