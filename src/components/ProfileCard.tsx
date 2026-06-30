import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { formatCount } from "@/utils/formatters";
import { useListStore } from "@/store/useListStore";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const isSelected = useListStore((s) => s.isSelected);
  const addProfile = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);

  const selected = isSelected(profile.user_id);

  const handleClick = () => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleListToggle = () => {
    if (selected) {
      removeProfile(profile.user_id);
    } else {
      addProfile(profile);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 border border-gray-300 mb-2 cursor-pointer hover:bg-gray-50 w-[700px]"
      data-search={searchQuery}
    >
      <img src={profile.picture} className="w-12 h-12 rounded-full" />
      <div className="text-left flex-1">
        <div className="font-bold">
          @{profile.username}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm text-gray-600">{profile.fullname}</div>
        <div className="text-sm">{formatCount(profile.followers, { precision: 1, suffix: " followers" })}</div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleListToggle();
        }}
        className={`px-3 py-1 text-sm rounded ${
          selected
            ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {selected ? "Remove" : "Add to List"}
      </button>
    </div>
  );
}
