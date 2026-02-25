import Dexie, { type EntityTable } from 'dexie';
import { client, datapackageChecksums } from './archipelago';
import type { DataPackage, GamePackage } from 'archipelago.js';

const databaseName = 'tophers-archipelago-web-client-db';

// The structure of the "package" table entity
interface DatabasePackage {
  checksum: string;
  game: string;
  package: GamePackage;
}

export const db = new Dexie(databaseName) as Dexie & {
  packages: EntityTable<DatabasePackage, 'checksum'>
};

// Database configuration
db.version(1).stores({
  packages: 'checksum, game'
});

/** This will automatically manage the cache for archipelago game packages, if necessary (this must only be called after login) */
export async function updatePackageCache() {
  const gamesToFetch: string[] = [];

  // Loop over all the games we have checksums for
  for (const [game, checksum] of Object.entries(datapackageChecksums.value)) {
    // Check if this game is already in the cache
    const existingPackage = await db.packages.where({ checksum }).first();

    // If the game isn't in the cache, add it to the list
    if (!existingPackage) gamesToFetch.push(game);
  }

  // Download missing packages
  const packages = await client.package.fetchPackage(gamesToFetch);

  // Commit them to the cache
  for (const [game, pkg] of Object.entries(packages.games)) {
    await db.packages.put({
      game,
      package: pkg,
      checksum: pkg.checksum
    });
  }

  // Get all packages from the cache
  const cachedPackages = await db.packages.toArray();

  // Convert to a proper data package
  const dataPackage: DataPackage = { games: {} };
  for (const data of cachedPackages) {
    dataPackage.games[data.game] = data.package;
  }
  
  // Import into the client
  client.package.importPackage(dataPackage);
}

export async function resetCache() {
  db.packages.clear();
}