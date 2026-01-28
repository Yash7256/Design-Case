import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BUCKET_NAME = 'design-files'
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const THUMBNAIL_SIZE = 400

interface UploadResult {
  fileUrl: string
  thumbnailUrl: string
  filename: string
  fileSize: number
  width?: number
  height?: number
  format?: string
}

/**
 * StorageService handles file uploads, optimization, and thumbnail generation
 */
export class StorageService {
  /**
   * Upload design file with automatic thumbnail generation
   */
  async uploadDesignFile(
    file: Buffer,
    filename: string,
    userId: string,
    projectId: string
  ): Promise<UploadResult> {
    try {
      // Validate file size
      if (file.length > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`)
      }

      // Get file extension and validate
      const ext = path.extname(filename).toLowerCase()
      const mimeType = this.getMimeType(ext)

      if (!mimeType) {
        throw new Error(`Unsupported file type: ${ext}`)
      }

      // Generate unique filename
      const uniqueFilename = `${uuidv4()}${ext}`
      const filePath = `${userId}/${projectId}/${uniqueFilename}`

      // Process image if applicable
      let processedFile = file
      let metadata: sharp.Metadata | undefined
      const isImage = ['.png', '.jpg', '.jpeg', '.webp'].includes(ext)

      if (isImage) {
        try {
          const image = sharp(file)
          metadata = await image.metadata()

          // Optimize image based on format
          let optimized: Buffer

          if (ext === '.png') {
            optimized = await image
              .png({ quality: 90, compressionLevel: 9 })
              .toBuffer()
          } else if (['.jpg', '.jpeg'].includes(ext)) {
            optimized = await image
              .jpeg({ quality: 90, progressive: true })
              .toBuffer()
          } else {
            optimized = await image.webp({ quality: 90 }).toBuffer()
          }

          // Use optimized version if it's smaller
          if (optimized.length < file.length) {
            processedFile = optimized
          }

          console.log(
            `Image optimized: ${file.length} -> ${processedFile.length} bytes`
          )
        } catch (error) {
          console.error('Image optimization warning:', error)
          // Continue with original file if optimization fails
        }
      }

      // Upload main file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, processedFile, {
          contentType: mimeType,
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`)
      }

      if (!uploadData) {
        throw new Error('Upload returned no data')
      }

      // Generate thumbnail for images
      let thumbnailUrl = ''
      if (isImage && metadata) {
        try {
          const thumbnail = await sharp(processedFile)
            .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
              fit: 'cover',
              position: 'center',
            })
            .jpeg({ quality: 80 })
            .toBuffer()

          const thumbPath = `${userId}/${projectId}/thumbnails/${uuidv4()}.jpg`

          const { data: thumbUploadData, error: thumbError } =
            await supabase.storage
              .from(BUCKET_NAME)
              .upload(thumbPath, thumbnail, {
                contentType: 'image/jpeg',
                cacheControl: '3600',
              })

          if (!thumbError && thumbUploadData) {
            const { data: thumbUrlData } = supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(thumbPath)
            thumbnailUrl = thumbUrlData.publicUrl
            console.log('Thumbnail generated successfully')
          }
        } catch (error) {
          console.warn('Thumbnail generation failed (non-critical):', error)
          // Continue even if thumbnail fails
        }
      }

      // Get public URL for the main file
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath)

      return {
        fileUrl: urlData.publicUrl,
        thumbnailUrl,
        filename: uniqueFilename,
        fileSize: processedFile.length,
        width: metadata?.width,
        height: metadata?.height,
        format: metadata?.format,
      }
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  /**
   * Delete file and its thumbnail from storage
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath])

      if (error) {
        throw new Error(`Delete failed: ${error.message}`)
      }

      console.log(`File deleted: ${filePath}`)
    } catch (error) {
      console.error('Delete error:', error)
      throw error
    }
  }

  /**
   * Delete multiple files
   */
  async deleteFiles(filePaths: string[]): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(filePaths)

      if (error) {
        throw new Error(`Batch delete failed: ${error.message}`)
      }

      console.log(`${filePaths.length} files deleted`)
    } catch (error) {
      console.error('Batch delete error:', error)
      throw error
    }
  }

  /**
   * Get signed URL for private file access
   */
  async getSignedUrl(
    filePath: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(filePath, expiresIn)

      if (error) {
        throw new Error(`Signed URL creation failed: ${error.message}`)
      }

      if (!data) {
        throw new Error('No signed URL data returned')
      }

      return data.signedUrl
    } catch (error) {
      console.error('Signed URL error:', error)
      throw error
    }
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeType(ext: string): string | null {
    const mimeTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
    }
    return mimeTypes[ext.toLowerCase()] || null
  }

  /**
   * Get allowed file extensions
   */
  getAllowedExtensions(): string[] {
    return ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.pdf']
  }

  /**
   * Get allowed MIME types
   */
  getAllowedMimeTypes(): string[] {
    return [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
    ]
  }
}

export const storageService = new StorageService()
