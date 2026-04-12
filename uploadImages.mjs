
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dcfmjmsmobatabophxun.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZm1qbXNtb2JhdGFib3BoeHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NTYwMjEsImV4cCI6MjA5MTUzMjAyMX0.THNXtEq50eJ4U9iL2ArlKxlxmGcyxD-Fv1PiMahekEU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFile(filePath, originalName) {
  const fileData = fs.readFileSync(filePath);
  const ext = originalName.split('.').pop();
  const newName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
  
  const { data, error } = await supabase.storage.from('media').upload(newName, fileData, {
    contentType: ext === 'png' ? 'image/png' : 'image/jpeg'
  });
  
  if (error) throw error;
  
  const { data: publicData } = supabase.storage.from('media').getPublicUrl(newName);
  console.log(`Uploaded ${originalName} -> ${publicData.publicUrl}`);
  return publicData.publicUrl;
}

async function run() {
  await supabase.auth.signInWithPassword({ email: 'admin@luxevibe.com', password: 'admin123' });
  const assetsDir = path.resolve(__dirname, 'src/assets');
  console.log('Uploading from:', assetsDir);
  
  try {
    // 1. Upload Logo
    const logoUrl = await uploadFile(path.join(assetsDir, 'luxevibelogo.png'), 'luxevibelogo.png');
    // Update or create static_images
    const { data: currentStatics } = await supabase.from('website_content').select('*').eq('id', 'static_images').single();
    let urlsObj = {};
    if (currentStatics && currentStatics.data && currentStatics.data.urls) {
        urlsObj = JSON.parse(currentStatics.data.urls);
    }
    urlsObj.logo = logoUrl;
    
    if (currentStatics) {
        await supabase.from('website_content').update({ data: { urls: JSON.stringify(urlsObj) } }).eq('id', 'static_images');
    } else {
        await supabase.from('website_content').insert([{ id: 'static_images', data: { urls: JSON.stringify(urlsObj) } }]);
    }
    
    // 2. Upload Hero
    const heroUrl = await uploadFile(path.join(assetsDir, 'hero-wedding.jpg'), 'hero-wedding.jpg');
    const { data: currentHero } = await supabase.from('website_content').select('*').eq('id', 'hero_section').single();
    if (currentHero) {
        await supabase.from('website_content').update({ data: { ...currentHero.data, imageUrl: heroUrl } }).eq('id', 'hero_section');
    } else {
        await supabase.from('website_content').insert([{ id: 'hero_section', data: { imageUrl: heroUrl } }]);
    }

    // 3. Upload About
    const aboutUrl = await uploadFile(path.join(assetsDir, 'about.jpg'), 'about.jpg');
    const { data: currentAbout } = await supabase.from('website_content').select('*').eq('id', 'about_section').single();
    if (currentAbout) {
        await supabase.from('website_content').update({ data: { ...currentAbout.data, imageUrl: aboutUrl } }).eq('id', 'about_section');
    } else {
        await supabase.from('website_content').insert([{ id: 'about_section', data: { imageUrl: aboutUrl } }]);
    }

    // 4. Upload Portfolios
    const portfolios = ['portfolio-1.jpg', 'portfolio-2.jpg', 'portfolio-3.jpg', 'portfolio-4.jpg'];
    for (let i = 0; i < portfolios.length; i++) {
        const fileRoute = path.join(assetsDir, portfolios[i]);
        if (fs.existsSync(fileRoute)) {
            const portUrl = await uploadFile(fileRoute, portfolios[i]);
            await supabase.from('portfolio').insert([{
                title: `Premium Event ${i+1}`,
                category: i % 2 === 0 ? 'Weddings' : 'Corporate',
                description: 'A magical premium event orchestrated perfectly down to every absolute detail.',
                image_url: portUrl
            }]);
        }
    }
    
    console.log("All uploads and data seeding completed successfully!");
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
