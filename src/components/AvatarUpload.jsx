import { useState, useRef } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import Avatar from './Avatar'
import { uploadMyAvatar } from '../services/api'
import { useToast } from '../context/ToastContext'

/**
 * AvatarUpload — avatar preview + Cloudinary upload used on both the
 * customer and seller profile pages. Calls `onUploaded(avatarUrl)` after a
 * successful upload so the parent can persist it in auth state immediately.
 */
export default function AvatarUpload({ name = '', avatar = '', size = 72, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const showToast = useToast()

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const updated = await uploadMyAvatar(file)
      onUploaded?.(updated.avatar)
      showToast('Profile photo updated')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload photo', { type: 'error', duration: 4000 })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar name={name} avatar={avatar} size={size} />
      <div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-outline inline-flex items-center gap-1.5"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
          {avatar ? 'Change photo' : 'Upload photo'}
        </button>
        <p className="text-xs text-text-muted mt-1.5">JPG, PNG, WEBP — up to 5MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </div>
  )
}
