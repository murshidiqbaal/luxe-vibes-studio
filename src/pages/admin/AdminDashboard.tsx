import { useState, useEffect } from "react";
import { appwriteConfig, databases, storage, ID } from "@/lib/appwrite";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, LogOut, Database } from "lucide-react";

import fallbackImg1 from '@/assets/portfolio-1.jpg';
import fallbackImg2 from '@/assets/portfolio-2.jpg';
import fallbackImg3 from '@/assets/portfolio-3.jpg';
import fallbackImg4 from '@/assets/portfolio-4.jpg';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [heroData, setHeroData] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    imageFile: null as File | null,
    imageUrl: ""
  });

  const [servicesData, setServicesData] = useState([
    { id: "s1", title: "", desc: "", imageUrl: "", imageFile: null as File | null },
    { id: "s2", title: "", desc: "", imageUrl: "", imageFile: null as File | null },
    { id: "s3", title: "", desc: "", imageUrl: "", imageFile: null as File | null },
    { id: "s4", title: "", desc: "", imageUrl: "", imageFile: null as File | null },
  ]);

  // Load initial data
  useEffect(() => {
    fetchHeroData();
    fetchServicesData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const dbId = appwriteConfig.databaseId;
      const colId = appwriteConfig.collectionContentId;
      
      // We assume a document with ID "hero_section" exists
      const doc = await databases.getDocument(dbId, colId, "hero_section");
      setHeroData({
        ...heroData,
        title: doc.title || "",
        subtitle: doc.subtitle || "",
        buttonText: doc.buttonText || "",
        imageUrl: doc.imageUrl || "",
      });
    } catch (error: any) {
      console.log("No hero document found or Appwrite not setup", error);
    }
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let finalImageUrl = heroData.imageUrl;

      if (heroData.imageFile) {
        // Upload image to storage
        const uploadedFile = await storage.createFile(
          appwriteConfig.storageId,
          ID.unique(),
          heroData.imageFile
        );
        // Get view URL
        finalImageUrl = `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.storageId}/files/${uploadedFile.$id}/view?project=${appwriteConfig.projectId}`;
      }

      const dbId = appwriteConfig.databaseId;
      const colId = appwriteConfig.collectionContentId;

      const dataToSave = {
        elementId: "hero_section",
        title: heroData.title,
        subtitle: heroData.subtitle,
        buttonText: heroData.buttonText,
        imageUrl: finalImageUrl,
      };

      try {
        // Try updating first
        await databases.updateDocument(dbId, colId, "hero_section", dataToSave);
      } catch (err) {
        // If it doesn't exist, create it
        await databases.createDocument(dbId, colId, "hero_section", dataToSave);
      }

      toast.success("Hero section updated successfully!");
      fetchHeroData(); // refresh preview url
    } catch (error: any) {
      toast.error(error.message || "Failed to save Hero section");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServicesData = async () => {
    try {
      const dbId = appwriteConfig.databaseId;
      const colId = appwriteConfig.collectionContentId;
      const doc = await databases.getDocument(dbId, colId, "services_section");
      
      if (doc.servicesData) {
        const parsed = JSON.parse(doc.servicesData);
        setServicesData(prev => prev.map((item, i) => ({
          ...item,
          title: parsed[i]?.title || "",
          desc: parsed[i]?.desc || "",
          imageUrl: parsed[i]?.imageUrl || ""
        })));
      }
    } catch (error: any) {
      console.log("No services document found", error);
    }
  };

  const handleServicesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dbId = appwriteConfig.databaseId;
      const colId = appwriteConfig.collectionContentId;
      
      const processedServices = await Promise.all(
        servicesData.map(async (service) => {
          let finalImageUrl = service.imageUrl;
          if (service.imageFile) {
            const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), service.imageFile);
            finalImageUrl = `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.storageId}/files/${uploadedFile.$id}/view?project=${appwriteConfig.projectId}`;
          }
          return { id: service.id, title: service.title, desc: service.desc, imageUrl: finalImageUrl };
        })
      );

      const stringifiedData = JSON.stringify(processedServices);
      const dataToSave = {
        elementId: "services_section",
        servicesData: stringifiedData
      };

      try {
        await databases.updateDocument(dbId, colId, "services_section", dataToSave);
      } catch (err) {
        await databases.createDocument(dbId, colId, "services_section", dataToSave);
      }
      
      toast.success("Services section updated!");
      fetchServicesData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save services");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm("This will overwrite your existing services with default placeholder images. Continue?")) return;
    setIsLoading(true);

    try {
      const defaultServicesTemplate = [
        { id: "s1", title: 'Luxury Weddings', desc: 'Exquisite wedding celebrations in Kothamangalam and Ernakulam, crafted with unparalleled attention to detail and elegance.', imgSrc: fallbackImg1 },
        { id: "s2", title: 'Destination Weddings', desc: 'Breathtaking destination wedding ceremonies across Kerala and India\'s most stunning exclusive locations.', imgSrc: fallbackImg2 },
        { id: "s3", title: 'Corporate Events', desc: 'Sophisticated corporate events and business gatherings in Ernakulam that leave lasting professional impressions.', imgSrc: fallbackImg3 },
        { id: "s4", title: 'Private Celebrations', desc: 'Intimate private celebrations and anniversary events designed to create unforgettable personal memories in Kerala.', imgSrc: fallbackImg4 },
      ];

      const dbId = appwriteConfig.databaseId;
      const colId = appwriteConfig.collectionContentId;

      const processedServices = await Promise.all(
        defaultServicesTemplate.map(async (service, i) => {
          // Fetch the local image and convert to File
          const response = await fetch(service.imgSrc);
          const blob = await response.blob();
          const file = new File([blob], `default_service_${i}.jpg`, { type: blob.type });

          // Upload to Appwrite
          const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file);
          const finalImageUrl = `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.storageId}/files/${uploadedFile.$id}/view?project=${appwriteConfig.projectId}`;

          return { id: service.id, title: service.title, desc: service.desc, imageUrl: finalImageUrl };
        })
      );

      const stringifiedData = JSON.stringify(processedServices);
      const dataToSave = {
        elementId: "services_section",
        servicesData: stringifiedData
      };

      try {
        await databases.updateDocument(dbId, colId, "services_section", dataToSave);
      } catch (err) {
        await databases.createDocument(dbId, colId, "services_section", dataToSave);
      }

      toast.success("Default services seeded successfully!");
      fetchServicesData();
    } catch (error: any) {
      toast.error("Failed to seed defaults");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Website Content Admin</h1>
        <Button variant="outline" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="services">Services Section</TabsTrigger>
          <TabsTrigger value="about">About Section</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Update the main heading, subtitle, and background image.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleHeroSubmit} className="space-y-4 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Main Title</label>
                  <Textarea
                    placeholder="Luxury Wedding Planners..."
                    value={heroData.title}
                    onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subtitle</label>
                  <Textarea
                    placeholder="Bespoke weddings & premium events..."
                    value={heroData.subtitle}
                    onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Background Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setHeroData({ ...heroData, imageFile: e.target.files[0] });
                      }
                    }}
                  />
                  {heroData.imageUrl && !heroData.imageFile && (
                    <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                      <span>Current Image:</span>
                      <img src={heroData.imageUrl} alt="Hero bg" className="h-16 w-32 object-cover rounded" />
                    </div>
                  )}
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Services Section</CardTitle>
                <CardDescription>Update the individual service cards and background images.</CardDescription>
              </div>
              <Button variant="secondary" size="sm" onClick={handleSeedDefaults} disabled={isLoading}>
                <Database className="w-4 h-4 mr-2" />
                Seed Default Images
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleServicesSubmit} className="space-y-8 max-w-4xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {servicesData.map((service, index) => (
                    <div key={service.id} className="p-6 border border-border rounded-md bg-secondary/10 space-y-4">
                      <h3 className="font-heading text-xl">Service Card {index + 1}</h3>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          placeholder="Luxury Weddings..."
                          value={service.title}
                          onChange={(e) => {
                            const newServices = [...servicesData];
                            newServices[index].title = e.target.value;
                            setServicesData(newServices);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          className="h-24"
                          value={service.desc}
                          onChange={(e) => {
                            const newServices = [...servicesData];
                            newServices[index].desc = e.target.value;
                            setServicesData(newServices);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Card Image</label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const newServices = [...servicesData];
                              newServices[index].imageFile = e.target.files[0];
                              setServicesData(newServices);
                            }
                          }}
                        />
                        {service.imageUrl && !service.imageFile && (
                          <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                            <span>Current:</span>
                            <img src={service.imageUrl} alt="Service preview" className="h-12 w-20 object-cover rounded" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Services Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>Coming soon...</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Admin panel for About section will go here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
