/**
 * Export GraphQL Schema to SDL file
 *
 * This script exports the GraphQL type definitions to a .graphql file
 * that can be used by SpectaQL for static documentation generation.
 *
 * Usage: npx tsx scripts/export-schema.ts
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this script
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// Import the schema - we need to extract the raw SDL string
// The typeDefs is a template literal string with `#graphql` prefix
async function exportSchema() {
  try {
    // Dynamic import of the typeDefs
    const { typeDefs } = await import('../server/src/schema/typeDefs.js');

    // The typeDefs string starts with `#graphql\n`, remove it for clean SDL
    const sdl = typeDefs.replace(/^#graphql\n?/, '').trim();

    // Ensure output directory exists
    const outputDir = join(rootDir, 'docs', 'schema');
    mkdirSync(outputDir, { recursive: true });

    // Write the schema file
    const outputPath = join(outputDir, 'schema.graphql');
    writeFileSync(outputPath, sdl, 'utf-8');

    console.log(`Schema exported to: ${outputPath}`);
    console.log(`Schema size: ${sdl.length} characters`);
  } catch (error) {
    console.error('Failed to export schema:', error);
    process.exit(1);
  }
}

exportSchema();
