import { Client, Databases, Query, Account, Storage, ID } from 'appwrite';

export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1',
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || '69d72e170037ae85ba57',
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || 'luxe_vibes_db',
  collectionContentId: import.meta.env.VITE_APPWRITE_COLLECTION_CONTENT_ID || 'website_content',
  storageId: import.meta.env.VITE_APPWRITE_BUCKET_ID || 'assets',
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const storage = new Storage(client);
export { ID };

export const databases = new Databases(client);
export const DATABASE_ID = appwriteConfig.databaseId;
export const PORTFOLIO_COLLECTION = 'portfolio';
export const TESTIMONIALS_COLLECTION = 'testimonials';

export interface PortfolioItem {
  $id: string;
  title: string;
  image_url: string;
  category: string;
  description: string;
  created_at: string;
}

export interface Testimonial {
  $id: string;
  name: string;
  message: string;
  rating: number;
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PORTFOLIO_COLLECTION,
      [Query.orderDesc('created_at'), Query.limit(50)]
    );
    return response.documents as unknown as PortfolioItem[];
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      TESTIMONIALS_COLLECTION,
      [Query.limit(20)]
    );
    return response.documents as unknown as Testimonial[];
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return [];
  }
}

export async function addPortfolioItem(item: Omit<PortfolioItem, '$id'>) {
  return databases.createDocument(DATABASE_ID, PORTFOLIO_COLLECTION, ID.unique(), {
    ...item,
    created_at: new Date().toISOString()
  });
}

export async function deletePortfolioItem(id: string) {
  return databases.deleteDocument(DATABASE_ID, PORTFOLIO_COLLECTION, id);
}

export async function addTestimonial(testimonial: Omit<Testimonial, '$id'>) {
  return databases.createDocument(DATABASE_ID, TESTIMONIALS_COLLECTION, ID.unique(), testimonial);
}

export async function deleteTestimonial(id: string) {
  return databases.deleteDocument(DATABASE_ID, TESTIMONIALS_COLLECTION, id);
}

export async function checkSystemStatus() {
  const status = {
    database: false,
    portfolio: false,
    testimonials: false,
    content: false,
  };

  try {
    // If we can list collections or documents, the database exists
    // Using listDocuments on a known collection (or fallback to general check)
    // We'll set database to true if ANY of the checks succeed.
    
    try {
      await databases.listDocuments(DATABASE_ID, PORTFOLIO_COLLECTION, [Query.limit(1)]);
      status.portfolio = true;
      status.database = true;
    } catch (e: any) {
      if (e.code !== 404) status.database = true; // If error is NOT 'not found', db might exist
    }
    
    try {
      await databases.listDocuments(DATABASE_ID, TESTIMONIALS_COLLECTION, [Query.limit(1)]);
      status.testimonials = true;
      status.database = true;
    } catch (e: any) {
      if (e.code !== 404) status.database = true;
    }

    try {
      await databases.listDocuments(DATABASE_ID, appwriteConfig.collectionContentId, [Query.limit(1)]);
      status.content = true;
      status.database = true;
    } catch (e: any) {
      if (e.code !== 404) status.database = true;
    }
    
  } catch (error) {
    status.database = false;
  }


  return status;
}

