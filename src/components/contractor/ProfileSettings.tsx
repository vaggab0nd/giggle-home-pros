import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, Building2, MapPin, Phone } from "lucide-react";

interface ContractorData {
  id: string;
  business_name: string;
  postcode: string;
  phone: string;
  expertise: string[];
}

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<ContractorData | null>(null);

  const [businessName, setBusinessName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: row } = await supabase
        .from("contractors" as any)
        .select("id, business_name, postcode, phone, expertise")
        .eq("user_id", user.id)
        .single();

      if (row) {
        const r = row as any;
        setData(r);
        setBusinessName(r.business_name);
        setPostcode(r.postcode);
        setPhone(r.phone);
      }
      setLoading(false);
    })();
  }, [user]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    const { error } = await supabase
      .from("contractors" as any)
      .update({ business_name: businessName, postcode, phone } as any)
      .eq("id", data.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Settings saved" });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading...</div>;
  }

  if (!data) {
    return (
      <Card className="border-border">
        <CardContent className="p-8 text-center text-muted-foreground">
          No contractor profile found.{" "}
          <a href="/contractor/signup" className="text-primary hover:underline">Sign up first</a>.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" /> Business Information
          </CardTitle>
          <CardDescription>Update your core business details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bname">Business Name</Label>
            <Input id="bname" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pcode" className="flex items-center gap-1"><MapPin className="w-3 h-3" /> ZIP / Postcode</Label>
              <Input id="pcode" value={postcode} onChange={(e) => setPostcode(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="ph" className="flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</Label>
              <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Expertise tags */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Expertise</CardTitle>
          <CardDescription>Your selected trade categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.expertise.map((e) => (
              <Badge key={e} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {e}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
