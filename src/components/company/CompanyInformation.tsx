
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CompanyProfile } from "./types";

interface CompanyInformationProps {
  profile: CompanyProfile;
  isAdmin: boolean;
  isEditing: boolean;
  editedProfile: CompanyProfile | null;
  setEditedProfile: (profile: CompanyProfile | null) => void;
  onSave: (profile: CompanyProfile) => void;
  onCancel: () => void;
}

export const CompanyInformation = ({
  profile,
  isAdmin,
  isEditing,
  editedProfile,
  setEditedProfile,
  onSave,
  onCancel,
}: CompanyInformationProps) => (
  <Card className="border border-[#474a4f]/10 shadow-sm hover:shadow-md transition-shadow duration-200">
    <CardHeader className="border-b border-[#474a4f]/10">
      <CardTitle className="text-[1.5em] font-semibold text-[#474a4f]">
        Company Information
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-6 space-y-6">
      {isAdmin && isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editedProfile) {
              onSave(editedProfile);
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#474a4f]">Company Name</label>
            <Input
              value={editedProfile?.name ?? ""}
              onChange={(e) =>
                setEditedProfile(
                  editedProfile ? { ...editedProfile, name: e.target.value } : null
                )
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#474a4f]">Industry</label>
            <select
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              value={editedProfile?.industry ?? ""}
              onChange={(e) =>
                setEditedProfile(
                  editedProfile
                    ? { ...editedProfile, industry: e.target.value as CompanyProfile["industry"] }
                    : null
                )
              }
              required
            >
              <option value="">Select an industry</option>
              {[
                "Technology",
                "Finance",
                "Healthcare",
                "Retail",
                "Manufacturing",
                "Professional Services",
                "Education",
                "Government",
                "Other",
              ].map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#474a4f]">Company Size</label>
            <Input
              type="number"
              value={editedProfile?.company_size ?? ""}
              onChange={(e) =>
                setEditedProfile(
                  editedProfile
                    ? { ...editedProfile, company_size: parseInt(e.target.value) }
                    : null
                )
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#474a4f]">Number of Sites</label>
            <Input
              type="number"
              value={editedProfile?.number_of_sites ?? ""}
              onChange={(e) =>
                setEditedProfile(
                  editedProfile
                    ? { ...editedProfile, number_of_sites: parseInt(e.target.value) }
                    : null
                )
              }
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="bg-[#fccc55] text-[#474a4f] hover:bg-[#fbbb45] font-semibold"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-[#474a4f]/20 text-[#474a4f] hover:bg-[#474a4f]/5"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-[#9e9e9e] mb-1">
              Company Name
            </p>
            <p className="text-lg text-[#474a4f]">{profile?.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#9e9e9e] mb-1">
              Industry
            </p>
            <p className="text-lg text-[#474a4f]">{profile?.industry}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#9e9e9e] mb-1">
              Company Size
            </p>
            <p className="text-lg text-[#474a4f]">
              {profile?.company_size.toLocaleString()} employees
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#9e9e9e] mb-1">
              Number of Sites
            </p>
            <p className="text-lg text-[#474a4f]">
              {profile?.number_of_sites.toLocaleString()} locations
            </p>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);
