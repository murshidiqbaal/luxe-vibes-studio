import { useState } from "react";
import { ID, getContentDocument, updateContentDocument, createContentDocument, getTeamMembers, addTeamMember } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, DatabaseZap } from "lucide-react";

const INITIAL_CONTENT = [
  {
    id: "hero_section",
    data: {
      title: "Crafting Unforgettable\nLuxury Experiences",
      subtitle: "Bespoke weddings & premium events tailored to perfection",
      imageUrl: "", 
      elementId: "hero"
    }
  },
  {
    id: "about_section",
    data: {
      title: "Best Wedding Planners in Ernakulam",
      description: "At Luxe Vibe, we are the emerging leaders in luxury wedding planning in Kothamangalam and Ernakulam. With a fresh perspective and a passion for cinematic perfection across Kerala, we transform your vision into breathtaking celebrations that leave lasting impressions.",
      imageUrl: "",
      elementId: "about"
    }
  },
  {
    id: "wedding_section",
    data: {
      marqueeText: "WE'RE GETTING MARRIED • SAVE THE DATE • LOVE IS IN THE AIR •",
      momentTitle: "Wedding Moments",
      momentSubtitle: "Beautiful memories etched in time.",
    }
  },
  {
    id: "text_content",
    data: {
      footer_text: "Crafting beautiful stories for the most discerning clients across Kerala and beyond.",
      contact_phone: "+91 98765 43210",
      contact_email: "hello@luxevibe.com",
      office_address: "Luxe Vibe Studio, Kothamangalam, Kerala"
    }
  }
];

const INITIAL_TEAM = [
  { name: "Rahul Sharma", role: "Creative Director", bio: "Leading the vision for cinematic weddings across Kerala.", social_links: JSON.stringify([{ platform: "Instagram", url: "#" }]) },
  { name: "Sneha Nair", role: "Lead Planner", bio: "Expert in destination wedding logistics and floral design.", social_links: JSON.stringify([{ platform: "Instagram", url: "#" }]) },
];

export default function DatabaseSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);

  const seedDatabase = async () => {
    setIsSeeding(true);
    const loadingToast = toast.loading("Initializing site data...");
    
    try {
      // Seed Website Content
      for (const item of INITIAL_CONTENT) {
        try {
          await getContentDocument(item.id);
          await updateContentDocument(item.id, item.id === "hero_section" || item.id === "about_section" ? item.data : { data: JSON.stringify(item.data) }
          );
        } catch (error: any) {
          // If not found, create it
          await createContentDocument(item.id, item.id === "hero_section" || item.id === "about_section" ? item.data : { data: JSON.stringify(item.data) }
          );
        }
      }

      // Seed Team (Optional, only if empty)
      const teamDocs = await getTeamMembers();
      if (teamDocs.length === 0) {
        for (const member of INITIAL_TEAM) {
          await addTeamMember({ ...member, image_url: "" });
        }
      }

      toast.success("Site data initialized successfully!", { id: loadingToast });
    } catch (error: any) {
      toast.error(`Seeding failed: ${error.message}`, { id: loadingToast });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button 
      onClick={seedDatabase} 
      disabled={isSeeding}
      variant="outline"
      className="gap-2 border-[#4A6741]/20 text-[#4A6741] hover:bg-[#4A6741]/5 font-bold uppercase tracking-widest text-[10px] h-12 px-6"
    >
      {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <DatabaseZap className="w-4 h-4" />}
      Initialize Site Data
    </Button>
  );
}
