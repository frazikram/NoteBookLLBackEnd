// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  // Create a notebook
  const notebook = await prisma.notebook.create({
    data: {
      userId: user.id,
      title: 'NotebookLM Lite Backend',
      description: 'Notes about the backend project',
    },
  });

  // Create some notes
  await prisma.note.createMany({
    data: [
      {
        notebookId: notebook.id,
        title: 'Project Overview',
        content:
          'NotebookLM Lite is an experimental note-first app with AI-assisted Q&A.',
      },
      {
        notebookId: notebook.id,
        title: 'Tech Stack',
        content:
          'Backend: NestJS, Prisma, Postgres. LLM and RAG pipelines mocked for local development.',
      },
      {
        notebookId: notebook.id,
        title: 'RAG Concept',
        content:
          'RAG retrieves relevant notes based on keyword matching for now; later embeddings and vector stores will be used.',
      },
    ],
  });

  console.log('\n🌱 Seed complete!');
  console.log('User ID:', user.id);
  console.log('Notebook ID:', notebook.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
