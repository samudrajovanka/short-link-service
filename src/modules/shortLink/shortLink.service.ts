import { desc, eq } from "drizzle-orm"
import { useDb } from "@/config/db"
import { shortLinksTable } from "./shortLink.schema"
import { getPaginationMetaResponse, Pagination } from "@/utils/helpers/pagination"
import { z } from "zod"
import { createShortLinkValidator } from "./shortLink.validator"
import { DatabaseError } from "@neondatabase/serverless"
import ConflictError from "@/exceptions/ConflictError"
import PgErrorConstant from "@/constants/pgError"
import ErrorConstant from "@/constants/error"
import NotFoundError from "@/exceptions/NotFoundError"
import InvariantError from "@/exceptions/InvariantError"
import { checkDifferenceTime } from "@/utils/helpers/date"

type GetAllParams = {
  pagination: Pagination
}

export default class ShortLinkService {
  private db = useDb()

  async getAll(params: GetAllParams) {
    const { pagination } = params
    
    const [shortLinks, totalAllShortLinks] = await Promise.all([
      this.db
        .select()
        .from(shortLinksTable)
        .orderBy(desc(shortLinksTable.created_at))
        .limit(pagination.limit)
        .offset(pagination.offset),
      this.getTotalShortLinks()
    ])

    return {
      shortLinks,
      meta: {
        pagination: getPaginationMetaResponse(pagination, totalAllShortLinks)
      }
    }
  }

  async create(payload: z.infer<typeof createShortLinkValidator>) {
    try {
      const [shortLink] = await this.db
        .insert(shortLinksTable)
        .values(payload)
        .returning({ id: shortLinksTable.id })
  
      return shortLink;
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.code === PgErrorConstant.code.UNIQUE_VIOLATION) {
          throw new ConflictError(ErrorConstant.template.conflict("slug"))
        }
      }

      throw error
    }
  }

  async getBySlug(slug: string) {
    const link = await this.db.query.shortLinksTable.findFirst({
      where: eq(shortLinksTable.slug, slug)
    })
    
    if (!link) {
      throw new NotFoundError(ErrorConstant.template.notFound("Short link"))
    }

    return link
  }

  async accessBySlug(slug: string) {
    const link = await this.db.query.shortLinksTable.findFirst({
      where: eq(shortLinksTable.slug, slug),
      columns: {
        id: true,
        originalUrl: true,
        totalAccess: true,
      }
    })
    
    if (!link) {
      throw new NotFoundError(ErrorConstant.template.notFound("Short link"))
    }

    await this.db
      .update(shortLinksTable)
      .set({
        totalAccess: link.totalAccess + 1
      })
      .where(eq(shortLinksTable.id, link.id))

    return {
      id: link.id,
      originalUrl: link.originalUrl,
    }
  }

  async getTotalShortLinks() {
    return await this.db
      .$count(shortLinksTable)
  }

  async deleteBySlug(slug: string) {
    const [link] = await this.db
      .delete(shortLinksTable)
      .where(eq(shortLinksTable.slug, slug))
      .returning({ id: shortLinksTable.id })
    
    if (!link) {
      throw new NotFoundError(ErrorConstant.template.notFound("Short link"))
    }

    return link.id
  }

  async updateBySlug(slug: string, payload: z.infer<typeof createShortLinkValidator>) {
    try {
      return await this.db.transaction(async (tx) => {
        const [link] = await this.db
          .update(shortLinksTable)
          .set(payload)
          .where(eq(shortLinksTable.slug, slug))
          .returning({ id: shortLinksTable.id, createdAt: shortLinksTable.created_at })
  
        if (!link) {
          throw new NotFoundError(ErrorConstant.template.notFound("Short link"))
        }
        
        if (payload.slug) {
          const TEN_MINUTES = 10 * 60 * 1000
          const isUpperThreshold = checkDifferenceTime(new Date(link.createdAt), new Date(), TEN_MINUTES)
    
          if (isUpperThreshold) {
            throw new InvariantError("You can only update the slug within 10 minutes of creation")
          }
        }
  
        return link.id
      })
    } catch (error) {
      if (error instanceof DatabaseError) {
        if (error.code === PgErrorConstant.code.UNIQUE_VIOLATION) {
          throw new ConflictError(ErrorConstant.template.conflict("slug"))
        }
      }

      throw error
    }
  }
}