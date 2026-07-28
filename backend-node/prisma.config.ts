import { defineConfig } from '@prisma/config'

export default defineConfig({
  migrate: {
    schemaPath: 'prisma/schema.prisma',
    url: process.env.DATABASE_URL,
  }
})
