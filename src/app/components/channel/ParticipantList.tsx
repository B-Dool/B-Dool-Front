import { useEffect, useState } from "react";
import ParticipantModal from "./ParticipantModal";
import { ProfileModel } from "@/app/models/profile.model";
import { profileService } from "@/app/services/member/profile.service";

interface ParticipantListProps {
  workspaceId: number;
}

export default function ParticipantList({ workspaceId }: ParticipantListProps) {
  const [profiles, setProfiles] = useState<ProfileModel[]>([])
  const [selectedProfile, setSelectedProfile] = useState<ProfileModel | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 'auto', bottom: 'auto' });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const onlineProfiles = profiles.filter(profiles => profiles.isOnline);
  const offlineProfiles = profiles.filter(profiles => !profiles.isOnline);

  const handleProfileClick = (profile: ProfileModel, event: React.MouseEvent) => {
    const liElement = (event.target as HTMLElement).closest('li');
    if (liElement) {
      const rect = liElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const modalHeight = 220;
      if (rect.bottom + modalHeight > windowHeight) {
        setModalPosition({ 
          top: 'auto',
          bottom: `${windowHeight - rect.bottom}px`
        });
      } else {
        setModalPosition({ 
          top: `${rect.top}px`,
          bottom: 'auto'
        });
      }
    }
    setSelectedProfile(profile);
    document.getElementById('participant-modal')?.showModal();
  };

  useEffect(() => {
    fetchProfiles(workspaceId)
  }, [workspaceId])

  const fetchProfiles = async (workspaceId: number) => {
    try {
      const response = await profileService.getProfilesByWorkspaceId(workspaceId)
      setProfiles(response)
    } catch (error) {
      console.error('error', error);
      setError('프로필 목록을 불러오는데 실패했습니다. 나중에 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  };

  // const handleNicknameChange = (updatedProfile: ProfileModel) => {
  //   setProfiles(prevProfiles => 
  //     prevProfiles.map(profile =>
  //       profile.id === updatedProfile.id
  //         ? { ...profile, nickname: updatedProfile.nickname }
  //         : profile
  //     )
  //   );
  // };

  // const handleOnlineStatusChange = (updatedProfile: ProfileModel) => {
  //   setProfiles(prevProfiles => 
  //     prevProfiles.map(profile =>
  //       profile.id === updatedProfile.id
  //         ? { ...profile, isOnline: updatedProfile.isOnline }
  //         : profile
  //     )
  //   );
  // };

  // SSE Custom Hook
  // const sseUrl = process.env.NEXT_PUBLIC_SERVER_A_SSE_URL as string
  // useSSE(sseUrl, {
  //   'nickname-change': handleNicknameChange,
  //   'online-status-change': handleOnlineStatusChange
  // });

  return (
    <>
      <ul className="menu">
        <li className="menu-title">온라인 - {onlineProfiles.length}</li>
        {onlineProfiles.map((profile) => (
          <li key={profile.id} onClick={(e) => handleProfileClick(profile, e)}>
            <a>
              <div className="avatar online placeholder">
                <div className="w-8 rounded-full bg-neutral text-neutral-content">
                  <span className="text-xs">U</span>
                </div>
              </div>
              <p className="overflow-hidden truncate whitespace-nowrap">{profile.nickname}</p>
            </a>
          </li>
        ))}
      </ul>

      <ul className="menu">
        <li className="menu-title">오프라인 - {offlineProfiles.length}</li>
        {offlineProfiles.map((profile) => (
          <li key={profile.id} onClick={(e) => handleProfileClick(profile, e)}>
            <a>
              <div className="avatar offline placeholder">
                <div className="w-8 rounded-full bg-neutral text-neutral-content">
                  <span className="text-xs">U</span>
                </div>
              </div>
              <p className="overflow-hidden truncate whitespace-nowrap">{profile.nickname}</p>
            </a>
          </li>
        ))}
      </ul>

      {/* modal dialog */}
      <dialog id="participant-modal" className="modal modal-bottom lg:modal-middle">
        <div className="modal-box lg:fixed lg:right-64 lg:p-4" style={{
          top: modalPosition.top,
          bottom: modalPosition.bottom
        }}>
          {selectedProfile && (
            <ParticipantModal profileId={selectedProfile.id}/>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
