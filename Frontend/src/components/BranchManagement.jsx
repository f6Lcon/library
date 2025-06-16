"use client"

import { useState, useEffect } from "react"
import { branchService } from "../services/branchService"
import { userService } from "../services/userService"

const BranchManagement = () => {
  const [branches, setBranches] = useState([])
  const [librarians, setLibrarians] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingBranch, setEditingBranch] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    phone: "",
    email: "",
    manager: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [branchesRes, librariansRes] = await Promise.all([
        branchService.getAllBranches(),
        userService.getAllUsers({ role: "librarian" }),
      ])
      setBranches(branchesRes.branches)
      setLibrarians(librariansRes.users)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingBranch) {
        await branchService.updateBranch(editingBranch._id, formData)
      } else {
        await branchService.createBranch(formData)
      }
      setShowForm(false)
      setEditingBranch(null)
      setFormData({ name: "", code: "", address: "", phone: "", email: "", manager: "" })
      fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (branch) => {
    setEditingBranch(branch)
    setFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      manager: branch.manager?._id || "",
    })
    setShowForm(true)
  }

  const handleDelete = async (branchId) => {
    if (window.confirm("Are you sure you want to deactivate this branch?")) {
      try {
        await branchService.deleteBranch(branchId)
        fetchData()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Branch Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add New Branch
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <div key={branch._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                <p className="text-sm text-green-600 font-medium">{branch.code}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(branch)} className="text-green-600 hover:text-green-800">
                  Edit
                </button>
                <button onClick={() => handleDelete(branch._id)} className="text-red-600 hover:text-red-800">
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>📍 {branch.address}</p>
              <p>📞 {branch.phone}</p>
              <p>✉️ {branch.email}</p>
              {branch.manager && (
                <p>
                  👤 Manager: {branch.manager.firstName} {branch.manager.lastName}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Branch Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editingBranch ? "Edit Branch" : "Add New Branch"}</h3>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingBranch(null)
                  setFormData({ name: "", code: "", address: "", phone: "", email: "", manager: "" })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., NYC01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Manager</label>
                <select
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Manager</option>
                  {librarians.map((librarian) => (
                    <option key={librarian._id} value={librarian._id}>
                      {librarian.firstName} {librarian.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingBranch(null)
                    setFormData({ name: "", code: "", address: "", phone: "", email: "", manager: "" })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  {editingBranch ? "Update Branch" : "Create Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BranchManagement
