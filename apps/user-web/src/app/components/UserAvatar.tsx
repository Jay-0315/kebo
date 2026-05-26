import { useAppData } from "../context/AppDataContext";

interface UserAvatarProps {
  authorId: string;
  authorName: string;
  size?: "xs" | "sm" | "md" | "lg";
}

export default function UserAvatar({ authorId, authorName, size = "md" }: UserAvatarProps) {
  const { profile, profilePhoto } = useAppData();

  const sizeClass = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-14 h-14 text-xl",
  }[size];

  if (authorId === profile.id && profilePhoto) {
    return (
      <img
        src={profilePhoto}
        alt={authorName}
        className={`${sizeClass} rounded-full object-cover shrink-0`}
      />
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-primary/60 to-accent/70 flex items-center justify-center text-white font-bold shrink-0`}>
      {authorName[0]}
    </div>
  );
}
