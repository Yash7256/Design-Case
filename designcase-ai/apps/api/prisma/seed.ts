import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default templates
  const templates = await Promise.all([
    prisma.template.upsert({
      where: { slug: 'minimal' },
      update: {},
      create: {
        name: 'Minimal',
        slug: 'minimal',
        description: 'Clean and minimal case study template',
        category: 'minimal',
        thumbnail: 'https://via.placeholder.com/400x300?text=Minimal',
        config: {
          layout: 'vertical',
          colorScheme: 'light',
        },
        features: ['Responsive', 'Fast', 'Clean'],
        isPremium: false,
        isPublic: true,
        sortOrder: 1,
      },
    }),
    prisma.template.upsert({
      where: { slug: 'immersive' },
      update: {},
      create: {
        name: 'Immersive',
        slug: 'immersive',
        description: 'Immersive 3D case study template',
        category: 'immersive',
        thumbnail: 'https://via.placeholder.com/400x300?text=Immersive',
        demoUrl: 'https://demo.example.com/immersive',
        config: {
          layout: '3d',
          colorScheme: 'dark',
        },
        features: ['3D Effects', 'Animations', 'Interactive'],
        isPremium: false,
        isPublic: true,
        sortOrder: 2,
      },
    }),
    prisma.template.upsert({
      where: { slug: 'portfolio' },
      update: {},
      create: {
        name: 'Portfolio',
        slug: 'portfolio',
        description: 'Portfolio-style case study template',
        category: 'portfolio',
        thumbnail: 'https://via.placeholder.com/400x300?text=Portfolio',
        config: {
          layout: 'grid',
          colorScheme: 'auto',
        },
        features: ['Showcase', 'Grid Layout', 'Light/Dark Mode'],
        isPremium: false,
        isPublic: true,
        sortOrder: 3,
      },
    }),
  ]);

  console.log(`✓ Created ${templates.length} templates`);
  console.log('✓ Seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
