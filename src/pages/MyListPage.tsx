import { Layout } from "@/components/Layout";
import { useListStore } from "@/store/useListStore";
import { useToastStore } from "@/store/useToastStore";
import { ProfileCard } from "@/components/ProfileCard";

export function MyListPage() {
  const selectedProfiles = useListStore((s) => s.selectedProfiles);
  const removeProfile = useListStore((s) => s.removeProfile);
  const clearList = useListStore((s) => s.clearList);
  const addToast = useToastStore((s) => s.addToast);

  const handleRemove = (userId: string, username: string) => {
    removeProfile(userId);
    addToast("success", `Removed @${username} from your list`);
  };

  const handleClear = () => {
    clearList();
    addToast("success", "Cleared your list");
  };

  return (
    <Layout title="My Selected Profiles">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600 text-sm">
            {selectedProfiles.length} profile{selectedProfiles.length !== 1 ? "s" : ""} in your list
          </p>
          {selectedProfiles.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
            >
              Clear All
            </button>
          )}
        </div>

        {selectedProfiles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-2">Your list is empty.</p>
            <p className="text-sm">
              Browse profiles and click "Add to List" to build your selection.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {selectedProfiles.map((profile) => (
              <div key={profile.user_id} className="relative">
                <ProfileCard
                  profile={profile}
                  platform="instagram"
                  searchQuery=""
                />
                <div className="absolute -top-2 -right-2">
                  <button
                    type="button"
                    onClick={() => handleRemove(profile.user_id, profile.username)}
                    className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full text-xs hover:bg-red-600 shadow"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
