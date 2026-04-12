import { useState, useEffect } from "react";
import { getTeamMembers, addTeamMember, deleteTeamMember, uploadMedia } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeamManager() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    bio: "",
    imageFile: null as File | null
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const data = await getTeamMembers();
      setMembers(data);
    } catch (error) {
      console.log("No team collection found");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.role) {
        toast.error("Please provide Name and Role");
        return;
    }
    
    setUploading(true);
    try {
      let imageUrl = "";
      if (newMember.imageFile) {
        imageUrl = await uploadMedia(newMember.imageFile);
      }

      await addTeamMember({ 
            name: newMember.name,
            role: newMember.role,
            bio: newMember.bio,
            image_url: imageUrl,
            social_links: '[]'
      });

      toast.success("Team member added!");
      setIsAdding(false);
      setNewMember({ name: "", role: "", bio: "", imageFile: null });
      fetchTeam();
    } catch (error: any) {
      toast.error(error.message || "Failed to add member");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm("Remove this team member?")) return;
    try {
      await deleteTeamMember(docId);
      toast.success("Member removed");
      fetchTeam();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Loading Team...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <section className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Our Team</h1>
          <p className="text-slate-500">Manage the creative professionals.</p>
        </section>
        
        <Button 
            onClick={() => setIsAdding(true)} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-bold uppercase tracking-widest text-[10px] h-12"
        >
            <Plus className="w-4 h-4" />
            Add Member
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <Card className="glass border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Add Team Member</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
                    <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                            <Input 
                                placeholder="E.g. Rahul Sharma" 
                                value={newMember.name}
                                onChange={e => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Role</label>
                            <Input 
                                placeholder="E.g. Creative Director" 
                                value={newMember.role}
                                onChange={e => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Bio</label>
                        <Textarea 
                            placeholder="Briefly describe their expertise..." 
                            className="h-[105px]"
                            value={newMember.bio}
                            onChange={e => setNewMember(prev => ({ ...prev, bio: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Profile Photo</label>
                    <div className="flex items-center gap-4">
                        <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => setNewMember(prev => ({ ...prev, imageFile: e.target.files?.[0] || null }))}
                        />
                        <Button 
                            onClick={handleAddMember} 
                            disabled={uploading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]"
                        >
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Member"}
                        </Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {members.map((member) => (
            <motion.div
              key={member.$id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-white border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center glass"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 mb-4 ring-4 ring-slate-50 group-hover:ring-primary/20 transition-all">
                {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Users className="w-8 h-8" />
                    </div>
                )}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h4>
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">{member.role}</p>
              <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed mb-6">{member.bio}</p>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-2 mt-auto"
                onClick={() => handleDelete(member.$id)}
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
        {members.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl bg-slate-50 text-slate-400 glass">
            <Users className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium">No team members added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
