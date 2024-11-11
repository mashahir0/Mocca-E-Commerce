import React, { useState } from 'react'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'

export default function CategoryManagement() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Shirt', visibility: true, offers: 30, status: true },
    { id: 2, name: 'T-shirt', visibility: true, offers: 30, status: true },
    { id: 3, name: 'hoodie', visibility: true, offers: 40, status: true }
  ])

  const [newCategory, setNewCategory] = useState({
    category: '',
    offer: ''
  })

  const toggleField = (id, field) => {
    setCategories(categories.map(category => 
      category.id === id 
        ? { ...category, [field]: !category[field] }
        : category
    ))
  }

  const handleDelete = (id) => {
    setCategories(categories.filter(category => category.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newCategory.category && newCategory.offer) {
      setCategories([
        ...categories,
        {
          id: categories.length + 1,
          name: newCategory.category,
          visibility: true,
          offers: parseInt(newCategory.offer),
          status: true
        }
      ])
      setNewCategory({ category: '', offer: '' })
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Category Management Table */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="font-medium">category management</h2>
          <button className="text-gray-600 hover:text-gray-900">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Visibility</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">offers %</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Update</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b last:border-b-0">
                  <td className="px-6 py-4">{category.name}</td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={category.visibility}
                        onChange={() => toggleField(category.id, 'visibility')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">{category.offers}</td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={category.status}
                        onChange={() => toggleField(category.id, 'status')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-600 hover:text-blue-600 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Category Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-6 text-center">Add New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Category"
            value={newCategory.category}
            onChange={(e) => setNewCategory({ ...newCategory, category: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            required
          />
          <input
            type="number"
            placeholder="offer"
            value={newCategory.offer}
            onChange={(e) => setNewCategory({ ...newCategory, offer: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-black/90 transition-colors"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  )
}