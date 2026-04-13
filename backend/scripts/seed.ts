/* ============================================================
   AgriAgent – Database Seeding Script
   Populates Firestore with sample data from seed_data.json
   ============================================================ */

import fs from 'fs';
import path from 'path';
import { getFirestore } from '../firebaseFunctions/config/firebase';

const SEED_DATA_PATH = path.resolve(__dirname, '../../database/seed_data.json');

async function seed() {
  console.log('🌱 Starting database seeding...');

  if (!fs.existsSync(SEED_DATA_PATH)) {
    console.error('❌ Error: seed_data.json not found at', SEED_DATA_PATH);
    process.exit(1);
  }

  const rawData = fs.readFileSync(SEED_DATA_PATH, 'utf-8');
  const seedData = JSON.parse(rawData);
  const db = getFirestore();

  const collections = [
    { key: 'users',           collection: 'users' },
    { key: 'farms',           collection: 'farms' },
    { key: 'alerts',          collection: 'alerts' },
    { key: 'marketSnapshots', collection: 'marketSnapshots' },
    { key: 'droneData',       collection: 'drones' },
  ];

  for (const item of collections) {
    const dataArray = seedData[item.key] || [];
    console.log(`📦 Seeding collection: ${item.collection} (${dataArray.length} items)...`);

    const batch = db.batch();
    
    dataArray.forEach((doc: any) => {
      // Use 'id' or 'uid' as document ID if present, otherwise auto-generate
      const docId = doc.id || doc.uid || null;
      const docRef = docId ? db.collection(item.collection).doc(docId) : db.collection(item.collection).doc();
      
      // Clean up the object to remove id/uid from the data itself if preferred, 
      // but keeping it is usually fine for Firestore.
      batch.set(docRef, doc);
    });

    await batch.commit();
    console.log(`✅ Finished seeding ${item.collection}`);
  }

  console.log('\n✨ Database seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
