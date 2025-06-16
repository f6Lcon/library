"use client"

import { useState, useEffect } from "react"
import { branchService } from "../services/branchService"

const BranchSelector = ({ selectedBranch, onBranchChange, disabled = false }) => {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      const response = await branchService.getAllBranches()
      setBranches(response.branches)
    } catch (error) {
      console.error("Failed to fetch branches:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <select disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
        <option>Loading branches...</option>
      </select>
    )
  }

  return (
    <select
      value={selectedBranch}
      onChange={(e) => onBranchChange(e.target.value)}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
    >
      <option value="">Select Branch</option>
      {branches.map((branch) => (
        <option key={branch._id} value={branch._id}>
          {branch.name} - {branch.code}
        </option>
      ))}
    </select>
  )
}

export default BranchSelector
