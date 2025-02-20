import { useState } from 'react'
import ImageUploader from '../components/ImageUploader'

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  })

  return (
    <div className="pt-16 max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full p-2 border rounded-lg h-32"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <ImageUploader 
            onUpload={file => setFormData({...formData, image: file})}
          />
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="font-medium mb-4">Preview</h3>
          {formData.image && (
            <img 
              src={URL.createObjectURL(formData.image)} 
              className="w-full h-48 object-cover mb-4 rounded-lg"
              alt="Preview" 
            />
          )}
          <h4 className="font-medium">{formData.title || 'Your title here'}</h4>
          <p className="text-sm text-gray-600">
            {formData.description || 'Description preview...'}
          </p>
        </div>
      </div>
    </div>
  )
}