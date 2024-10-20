import { ProfileInsertModel } from "@/app/models/profile.model"
import { DEFAULT_PROFILE_IMAGE } from "@/app/utils/config";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaPlus } from 'react-icons/fa';

interface ProfileCreateFormProps {
  onSubmit: (data: ProfileInsertModel) => void;
  onPrevious: () => void;
}

export default function ProfileCreateForm({ onSubmit, onPrevious }: ProfileCreateFormProps) {
  const [profileName, setProfileName] = useState<string>('')
  const [profileNickname, setProfileNickname] = useState<string>('')
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_PROFILE_IMAGE)
  const fileInput = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setProfileName('')
    setProfileNickname('')
    setProfileImage(DEFAULT_PROFILE_IMAGE)
  }

  useEffect(() => {
    return () => {
      resetForm()
    }
  }, [])

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profileData: ProfileInsertModel = {
      name: profileName,
      nickname: profileNickname,
      profileImgUrl: profileImage,
      workspaceId: 0
    }
    onSubmit(profileData)
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 text-center">
        <div className="avatar group drop-shadow-sm" onClick={() => fileInput.current?.click()}>
          <div className="w-24 h-24 rounded-full">
            <img src={profileImage} alt="workspace_image" className="group-hover:brightness-50"/>
          </div>
          <FaPlus className="w-8 h-8 absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"/>
        </div>
        <input 
          ref={fileInput}
          className="hidden"
          accept="image/png, image/jpg, image/jpeg"
          type="file" 
          onChange={handleImgChange}
        />
      </div>  
      <input
        type="text" 
        className="input input-bordered w-full mb-4" 
        placeholder="프로필 닉네임"
        value={profileNickname}
        onChange={(e) => setProfileNickname(e.target.value)}
        required
      />
      <input
        type="text" 
        className="input input-bordered w-full mb-4" 
        placeholder="이름"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
        required
      />
      <div className="text-center">
        <button type="button" onClick={onPrevious} className="btn mr-2">이전</button>
        <button type="submit" className="btn">생성</button>
      </div>
    </form>
  )
}
