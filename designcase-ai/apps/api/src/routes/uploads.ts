import express, { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { z } from 'zod'
import { storageService } from '../services/storage-service'
import { prisma } from '../utils/prisma'

const router = express.Router()

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/svg+xml',
      'image/webp',
      'application/pdf',
    ]

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`))
    }
  },
})

// Validation schemas
const uploadParamsSchema = z.object({
  projectId: z.string().uuid(),
})

// Auth middleware (expects userId in req.user)
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as string

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: missing user ID' })
  }

  ;(req as any).user = { id: userId }
  next()
}

/**
 * POST /api/uploads/projects/:projectId/upload
 * Upload a design file with automatic processing
 */
router.post(
  '/projects/:projectId/upload',
  authMiddleware,
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      // Validate params
      const { projectId } = uploadParamsSchema.parse(req.params)
      const userId = (req as any).user.id

      // Check file exists
      if (!req.file) {
        return res.status(400).json({
          error: 'No file provided',
          code: 'NO_FILE',
        })
      }

      console.log(
        `Upload request: ${req.file.originalname} (${req.file.size} bytes)`
      )

      // Verify project exists and belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId,
        },
      })

      if (!project) {
        return res.status(404).json({
          error: 'Project not found or unauthorized',
          code: 'PROJECT_NOT_FOUND',
        })
      }

      // Upload file to Supabase Storage
      const uploadResult = await storageService.uploadDesignFile(
        req.file.buffer,
        req.file.originalname,
        userId,
        projectId
      )

      console.log(`File uploaded successfully: ${uploadResult.filename}`)

      // Save file metadata to database
      const designFile = await prisma.designFile.create({
        data: {
          projectId,
          filename: uploadResult.filename,
          originalName: req.file.originalname,
          fileType: uploadResult.format || req.file.mimetype,
          fileUrl: uploadResult.fileUrl,
          thumbnailUrl: uploadResult.thumbnailUrl,
          fileSize: uploadResult.fileSize,
          width: uploadResult.width,
          height: uploadResult.height,
          status: 'UPLOADED',
        },
      })

      // Update project with file info
      await prisma.project.update({
        where: { id: projectId },
        data: {
          status: 'PROCESSING',
          thumbnail: uploadResult.thumbnailUrl || undefined,
          fileSize: uploadResult.fileSize,
        },
      })

      res.json({
        success: true,
        file: {
          id: designFile.id,
          filename: designFile.filename,
          originalName: designFile.originalName,
          fileSize: designFile.fileSize,
          width: designFile.width,
          height: designFile.height,
          status: designFile.status,
          createdAt: designFile.createdAt,
        },
        urls: {
          original: uploadResult.fileUrl,
          thumbnail: uploadResult.thumbnailUrl,
        },
        metadata: {
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
        },
      })
    } catch (error: any) {
      console.error('Upload error:', error)

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid request parameters',
          details: error.errors,
          code: 'VALIDATION_ERROR',
        })
      }

      if (error.message.includes('File size exceeds')) {
        return res.status(413).json({
          error: error.message,
          code: 'FILE_TOO_LARGE',
        })
      }

      if (error.message.includes('Unsupported file type')) {
        return res.status(415).json({
          error: error.message,
          code: 'UNSUPPORTED_FILE_TYPE',
        })
      }

      res.status(500).json({
        error: error.message || 'Upload failed',
        code: 'UPLOAD_ERROR',
      })
    }
  }
)

/**
 * DELETE /api/uploads/:designFileId
 * Delete a design file
 */
router.delete('/:designFileId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { designFileId } = req.params
    const userId = (req as any).user.id

    // Find file
    const designFile = await prisma.designFile.findFirst({
      where: {
        id: designFileId,
      },
      include: {
        project: true,
      },
    })

    if (!designFile) {
      return res.status(404).json({
        error: 'File not found',
        code: 'FILE_NOT_FOUND',
      })
    }

    // Verify ownership
    if (designFile.project.userId !== userId) {
      return res.status(403).json({
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
      })
    }

    // Delete from storage
    try {
      await storageService.deleteFile(designFile.fileUrl)
    } catch (error) {
      console.warn('Storage delete failed:', error)
      // Continue anyway
    }

    // Delete from database
    await prisma.designFile.delete({
      where: { id: designFileId },
    })

    console.log(`File deleted: ${designFileId}`)

    res.json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete error:', error)
    res.status(500).json({
      error: error.message || 'Delete failed',
      code: 'DELETE_ERROR',
    })
  }
})

/**
 * GET /api/uploads/projects/:projectId
 * List all files for a project
 */
router.get('/projects/:projectId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { projectId } = uploadParamsSchema.parse(req.params)
    const userId = (req as any).user.id

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    })

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND',
      })
    }

    // Get files
    const files = await prisma.designFile.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json({
      success: true,
      files,
      count: files.length,
    })
  } catch (error: any) {
    console.error('List files error:', error)
    res.status(500).json({
      error: error.message || 'Failed to list files',
      code: 'LIST_ERROR',
    })
  }
})

export default router
