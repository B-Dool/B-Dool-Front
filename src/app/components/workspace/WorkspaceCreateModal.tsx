import { ProfileInsertModel } from "@/app/models/profile.model";
import { WorkspaceInsertModel } from "@/app/models/workspace.model";
import { useCreateWorkspace } from "@/app/queries/workspace.query";
import { useCreateProfile } from "@/app/queries/profile.query";
import { useCreateChannel } from "@/app/queries/channel.query";
import { useMemberStore } from "@/app/stores/member.store";
import { useEffect, useState } from "react";
import WorkspaceCreateForm from "./WorkspaceCreateForm";
import ProfileCreateForm from "../member/ProfileCreateForm";

interface WorkspaceCreateModalProps {
  onComplete: () => void;
}

export default function WorkspaceCreateModal({ onComplete }: WorkspaceCreateModalProps) {
  const [workspaceData, setWorkspaceData] = useState<WorkspaceInsertModel | null>(null)
  const [profileData, setProfileData] = useState<ProfileInsertModel | null>(null)
  const [step, setStep] = useState<number>(1)

  const createProfileMutation = useCreateProfile() // API Query
  const createWorkspaceMutation = useCreateWorkspace() // API Query
  const createChannelMutation = useCreateChannel() // API Query
  const currentMember = useMemberStore(state => state.currentMember); // Zustand Store
  
  const handleWorkspaceSubmit = async (data: WorkspaceInsertModel) => {
    setWorkspaceData(data)
    setStep(2)
  }

  const handleProfileSubmit = async (data: ProfileInsertModel) => {
    setProfileData(data)
    try {
      if (!currentMember || !workspaceData) {
        throw new Error("필요한 데이터가 없습니다.");
      }
      // 워크스페이스 생성
      const createdWorkspace = await createWorkspaceMutation.mutateAsync({
        ...workspaceData,
        ownerId: currentMember.id
      })
      // 프로필 생성
      const createdProfile = await createProfileMutation.mutateAsync({
        memberId: currentMember.id,
        data: {
          ...data,
          workspaceId: createdWorkspace.id
        }
      })
      // default 채널 자동 생성
      await createChannelMutation.mutateAsync({
        workspacesId: createdWorkspace.id,
        name: "전체 채널",
        isPrivate: false,
        description: "전체 채널입니다.",
        profileId: createdProfile.id,
        // nickname: createdProfile.nickname,
        channelType: "DEFAULT"
      })
      // DM 채널 자동 생성
      await createChannelMutation.mutateAsync({
        workspacesId: createdWorkspace.id,
        name: createdProfile.nickname,
        isPrivate: false,
        description: "다이렉트 메시지",
        profileId: createdProfile.id,
        // nickname: createdProfile.nickname,
        channelType: "DM"
      })
      onComplete();
    } catch (error) {
      console.error("워크스페이스 생성 실패: ", error)
    }
  }

  const handlePrevious = () => {
    setStep(1)
  }

  const resetForm = () => {
    setStep(1)
    setWorkspaceData(null)
    setProfileData(null)
  }

  useEffect(() => {
    return () => {
      resetForm()
    }
  }, [])

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 text-center">
        {step === 1 ? (
          <p>1/2<br/>워크스페이스 생성</p>
        ) : (
          <p>2/2<br/>프로필 생성</p>
        )}
      </h2>
      {step === 1 ? (
        <WorkspaceCreateForm onSubmit={handleWorkspaceSubmit} />
      ) : (
        <ProfileCreateForm onSubmit={handleProfileSubmit} onPrevious={handlePrevious} />
      )}
    </div>
  );
}