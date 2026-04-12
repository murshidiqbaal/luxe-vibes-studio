import fs from 'fs';
import path from 'path';

const filesToMigrate = [
  "src/components/AboutSection.tsx",
  "src/components/CTASection.tsx",
  "src/components/Footer.tsx",
  "src/components/GallerySection.tsx",
  "src/components/HeroSection.tsx",
  "src/components/PortfolioSection.tsx",
  "src/components/ServicesSection.tsx",
  "src/components/TeamSection.tsx",
  "src/components/TestimonialsSection.tsx",
  "src/components/WeddingSection.tsx",
  "src/components/admin/DatabaseSeeder.tsx",
  "src/components/admin/sections/GalleryManager.tsx",
  "src/components/admin/sections/HeroManager.tsx",
  "src/components/admin/sections/PortfolioManager.tsx",
  "src/components/admin/sections/ServicesManager.tsx",
  "src/components/admin/sections/SiteImagesManager.tsx",
  "src/components/admin/sections/TeamManager.tsx",
  "src/components/admin/sections/TestimonialsManager.tsx",
  "src/hooks/useAuth.tsx",
  "src/pages/admin/AdminDashboard.tsx",
  "src/pages/admin/AdminLogin.tsx"
];

filesToMigrate.forEach(file => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace import
  content = content.replace(/@\/lib\/appwrite/g, '@/lib/supabase');

  // Replace databases.getDocument(...)
  content = content.replace(/await databases\.getDocument\(\s*appwriteConfig\.databaseId,\s*appwriteConfig\.collectionContentId,\s*'([^']+)'\s*\)/g, "await getContentDocument('$1')");
  // Replace variables mapped
  content = content.replace(/await databases\.updateDocument\([^,]+,\s*[^,]+,\s*'([^']+)',\s*([^)]+)\)/g, "await updateContentDocument('$1', $2)");
  content = content.replace(/await databases\.createDocument\([^,]+,\s*[^,]+,\s*'([^']+)',\s*([^)]+)\)/g, "await createContentDocument('$1', $2)");

  // Handle variable args
  content = content.replace(/await databases\.getDocument\([^,]+,\s*[^,]+,\s*(item\.id|slot\.id)\s*\)/g, "await getContentDocument($1)");
  content = content.replace(/await databases\.updateDocument\([^,]+,\s*[^,]+,\s*(item\.id|slot\.id),\s*([^)]+)\)/g, "await updateContentDocument($1, $2)");
  content = content.replace(/await databases\.createDocument\([^,]+,\s*[^,]+,\s*(item\.id|slot\.id),\s*([^)]+)\)/g, "await createContentDocument($1, $2)");

  // Some other hardcoded collection names used without appwriteConfig
  content = content.replace(/await databases\.listDocuments\([^,]+,\s*"gallery_collection"[^)]*\)/g, "await getGalleryItems()");
  content = content.replace(/await databases\.createDocument\([^,]+,\s*"gallery_collection"[^)]*\)/g, ""); // Manual fix needed probably
  content = content.replace(/await databases\.deleteDocument\([^,]+,\s*"gallery_collection"[^)]*\)/g, ""); // Manual fix needed

  // Replace ID.unique() -> ID.unique() is still in supabase polyfill

  // Replace storage logic for upload
  content = content.replace(/const uploadedFile = await storage\.createFile\([^,]+,\s*ID\.unique\(\),\s*([^)]+)\);\s*const imageUrl = `\$\{appwriteConfig\.endpoint\}\/storage\/buckets\/\$\{appwriteConfig\.(storageId|mediaBucketId)\}\/files\/\$\{uploadedFile\.\$id\}\/view\?project=\$\{appwriteConfig\.projectId\}`;/g, 
  "const imageUrl = await uploadMedia($1);");
  
  // Clean up unused imports
  content = content.replace(/databases,?\s*/g, '');
  content = content.replace(/appwriteConfig,?\s*/g, '');
  content = content.replace(/storage,?\s*/g, '');
  
  // Need to ensure getContentDocument, updateContentDocument, createContentDocument, uploadMedia are imported
  if (content.includes('getContentDocument') && !content.includes('getContentDocument')) {
      // Very naive logic to add them to import list, manual fixes likely needed
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log("Migration script executed.");
