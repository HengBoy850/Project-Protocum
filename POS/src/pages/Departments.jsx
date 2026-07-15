import React, { useEffect, useState } from 'react';
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-2xl font-bold">Departments</p>
          <p className="text-sm text-gray-500">Shared across POS and the staff registration form</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          + Add Department
        </button>
      </div>

      {showForm && (
        <form onSubmit={addDepartment} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Department name"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 max-w-xs"
            autoFocus
          />
          <button type="submit" className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg">Save</button>
        </form>
      )}

      <div className="grid grid-cols-3 gap-4">
        {departments.map((d) => (
          <div key={d.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{d.name}</p>
              <p className="text-xs text-gray-500">{d.staff_count} staff</p>
            </div>
            <button onClick={() => removeDepartment(d.id)} className="text-red-600 text-xs font-medium">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
