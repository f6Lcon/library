"use client"

import { useState, useEffect } from "react"
import { Modal, Form, Input, Select } from "antd"
import { toast } from "react-toastify"
import userService from "../services/userService"
import issueService from "../services/issueService"
import { useAuth } from "../contexts/AuthContext"

const { Option } = Select

const IssueBookModal = ({ visible, onCancel, book, onBookIssued }) => {
  const [form] = Form.useForm()
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (visible) {
      form.resetFields()
      setUsers([])
    }
  }, [visible, form])

  const searchUsers = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setUsers([])
      return
    }

    try {
      setLoadingUsers(true)
      const response = await userService.getAllUsers({
        search: searchTerm,
        role: "student,community",
        limit: 20,
        activeOnly: true,
      })

      // Filter users from the same branch as the librarian (if librarian)
      let filteredUsers = response.users || []
      if (user.role === "librarian") {
        filteredUsers = filteredUsers.filter((u) => u.branch._id === user.branch._id)
      }

      setUsers(filteredUsers)
    } catch (error) {
      console.error("Error searching users:", error)
      toast.error("Failed to search users")
      setUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        setConfirmLoading(true)
        const issueData = {
          book: book._id,
          user: values.user,
          dueDate: values.dueDate.format("YYYY-MM-DD"),
        }

        issueService
          .createIssue(issueData)
          .then(() => {
            toast.success("Book issued successfully")
            onBookIssued()
            onCancel()
            form.resetFields()
          })
          .catch((error) => {
            console.error("Error issuing book:", error)
            toast.error("Failed to issue book")
          })
          .finally(() => {
            setConfirmLoading(false)
          })
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }

  return (
    <Modal title="Issue Book" visible={visible} onCancel={onCancel} confirmLoading={confirmLoading} onOk={handleOk}>
      <Form form={form} layout="vertical">
        <Form.Item name="user" label="User" rules={[{ required: true, message: "Please select a user" }]}>
          <Select
            showSearch
            placeholder="Search for a user"
            filterOption={false}
            onSearch={searchUsers}
            loading={loadingUsers}
          >
            {users.map((user) => (
              <Option key={user._id} value={user._id}>
                {user.firstName} {user.lastName} ({user.email})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: "Please select a due date" }]}>
          <Input type="date" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default IssueBookModal
