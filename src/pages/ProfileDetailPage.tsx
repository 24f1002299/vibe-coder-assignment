import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { formatCount, formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/useListStore";
import { useToastStore } from "@/store/useToastStore";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);

  const addProfile = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);
  const isSelected = useListStore((s) => s.isSelected);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    if (!username) return;

    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <p>Invalid profile</p>
        <Link to="/">Back</Link>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-gray-400">Loading...</p>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-red-600 mb-4">
          Could not load profile details for {username}
        </p>
        <Link to="/" className="text-blue-600 underline">
          Back to search
        </Link>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const selected = isSelected(user.user_id);

  const handleListToggle = () => {
    if (selected) {
      removeProfile(user.user_id);
      addToast("success", `Removed @${user.username} from your list`);
    } else {
      addProfile(user);
      addToast("success", `Added @${user.username} to your list`);
    }
  };

  return (
    <Layout title={user.fullname}>
      <Link to="/" className="text-sm text-blue-600 mb-4 inline-block">
        ← Back to search
      </Link>

      <div className="flex gap-6 items-start text-left max-w-2xl mx-auto">
        <img
          src={user.picture}
          className="w-24 h-24 rounded-full border"
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold">
            @{user.username}
            <VerifiedBadge verified={user.is_verified} />
          </h2>
          <p className="text-gray-600">{user.fullname}</p>
          <p className="text-xs text-gray-400 mt-1">Platform: {platform}</p>

          {user.description && (
            <p className="mt-3 text-sm text-gray-700">{user.description}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="border p-2 rounded">
                <div className="text-gray-500">Followers</div>
                <div className="font-semibold">
                  {formatCount(user.followers, { precision: 2 })}
                </div>
              </div>
              <div className="border p-2 rounded">
                <div className="text-gray-500">Engagement Rate</div>
                <div className="font-semibold">
                  {formatEngagementRate(user.engagement_rate)}
                </div>
              </div>
            {user.posts_count !== undefined && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Posts</div>
                <div className="font-semibold">{user.posts_count}</div>
              </div>
            )}
            {user.avg_likes !== undefined && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Avg Likes</div>
                <div className="font-semibold">
                  {formatCount(user.avg_likes, { precision: 2 })}
                </div>
              </div>
            )}
            {user.avg_comments !== undefined && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Avg Comments</div>
                <div className="font-semibold">{user.avg_comments}</div>
              </div>
            )}
            {user.avg_views !== undefined && user.avg_views > 0 && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Avg Views</div>
                <div className="font-semibold">
                  {formatCount(user.avg_views, { precision: 2 })}
                </div>
              </div>
            )}
            {user.engagements !== undefined && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Engagements</div>
                <div className="font-semibold">
                  {user.engagements.toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {user.url && (
            <a
              href={user.url}
              target="_blank"
              className="inline-block mt-4 text-blue-600 text-sm"
            >
              View on platform →
            </a>
          )}

          <button
            type="button"
            onClick={handleListToggle}
            className={`block mt-4 px-4 py-2 rounded ${
              selected
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {selected ? "Remove from List" : "Add to List"}
          </button>
        </div>
      </div>
      <Toast />
    </Layout>
  );
}
