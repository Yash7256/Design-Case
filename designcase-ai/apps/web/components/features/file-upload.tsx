'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import axios from 'axios'

interface UploadedFile {
  id: string
  filename: string
  originalName: string
  fileSize: number
  width?: number
  height?: number
  status: string
  urls: {
    original: string
    thumbnail: string
  }
}

interface FileUploadProps {
  projectId: string
  onUploadComplete: (file: UploadedFile) => void
  onError?: (error: string) => void
}

/**
 * FileUpload Component
 * Provides drag-and-drop file upload with progress tracking
 */
export function FileUpload({
  projectId,
  onUploadComplete,
  onError,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0])
        setError(null)
        setUploadedFile(null)
      }
    },
    []
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'image/svg+xml': ['.svg'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: uploading,
  })

  const handleUpload = async () => {
    if (!selectedFile || !projectId) return

    setUploading(true)
    setError(null)
    setProgress(0)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await axios.post(
        `/api/uploads/projects/${projectId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-user-id': localStorage.getItem('userId') || '',
          },
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || 1
            const percentCompleted = Math.round((progressEvent.loaded * 100) / total)
            setProgress(percentCompleted)
          },
        }
      )

      const uploadedFileData = {
        id: response.data.file.id,
        filename: response.data.file.filename,
        originalName: response.data.file.originalName,
        fileSize: response.data.file.fileSize,
        width: response.data.metadata?.width,
        height: response.data.metadata?.height,
        status: response.data.file.status,
        urls: response.data.urls,
      }

      setUploadedFile(uploadedFileData)
      onUploadComplete(uploadedFileData)
      setSelectedFile(null)

      // Reset after 3 seconds
      setTimeout(() => {
        setUploadedFile(null)
        setProgress(0)
      }, 3000)
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        'Upload failed. Please try again.'

      setError(errorMessage)
      onError?.(errorMessage)

      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setError(null)
    setProgress(0)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4 w-full">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading || uploadedFile ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-900">
          {isDragActive
            ? 'Drop your design file here'
            : 'Drag & drop a design file here, or click to select'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supported: PNG, JPG, SVG, PDF (max 50MB)
        </p>
      </div>

      {/* Selected File */}
      {selectedFile && !uploadedFile && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <File className="h-8 w-8 text-indigo-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFile}
            disabled={uploading}
            className="flex-shrink-0 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} max={100} />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Uploading...</p>
            <p className="text-sm font-medium text-gray-900">{progress}%</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploadedFile && (
        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-green-900">
              File uploaded successfully!
            </p>
            <p className="text-xs text-green-700 mt-1">
              {uploadedFile.originalName}
            </p>
            {uploadedFile.width && uploadedFile.height && (
              <p className="text-xs text-green-700">
                {uploadedFile.width}×{uploadedFile.height}px
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-900">{error}</p>
            <p className="text-xs text-red-700 mt-1">
              Please try again or contact support if the problem persists.
            </p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !uploading && !uploadedFile && (
        <Button onClick={handleUpload} className="w-full" size="lg">
          <Upload className="h-4 w-4 mr-2" />
          Upload and Analyze
        </Button>
      )}
    </div>
  )
}
