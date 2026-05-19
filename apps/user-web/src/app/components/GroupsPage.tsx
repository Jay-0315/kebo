import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, X, Users, Crown, Bell, Search, TrendingUp, ChevronRight } from "lucide-react";

interface GroupMember {
  id: number;
  name: string;
  isHost: boolean;
}

interface Group {
  id: number;
  name: string;
  code: string;
  members: GroupMember[];
  isHost: boolean;
}

interface JoinRequest {
  id: number;
  groupId: number;
  groupName: string;
  userName: string;
  date: string;
}

interface AvailableGroup {
  id: number;
  name: string;
  memberCount: number;
  hostName: string;
}

export default function GroupsPage() {
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinMethod, setJoinMethod] = useState<"code" | "request">("code");
  const [newGroupName, setNewGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      name: "가족",
      code: "FAM2024",
      members: [
        { id: 1, name: "나", isHost: true },
        { id: 2, name: "엄마", isHost: false },
        { id: 3, name: "아빠", isHost: false },
      ],
      isHost: true,
    },
    {
      id: 2,
      name: "친구들",
      code: "FRD2024",
      members: [
        { id: 1, name: "철수", isHost: true },
        { id: 2, name: "나", isHost: false },
        { id: 3, name: "영희", isHost: false },
      ],
      isHost: false,
    },
  ]);

  const [availableGroups] = useState<AvailableGroup[]>([
    { id: 3, name: "운동 모임", memberCount: 5, hostName: "김운동" },
    { id: 4, name: "독서 클럽", memberCount: 8, hostName: "이책" },
    { id: 5, name: "요리 연구회", memberCount: 12, hostName: "박요리" },
  ]);

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    { id: 1, groupId: 1, groupName: "가족", userName: "동생", date: "2026-05-14" },
  ]);

  const generateGroupCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const newGroup: Group = {
      id: Date.now(),
      name: newGroupName,
      code: generateGroupCode(),
      members: [{ id: 1, name: "나", isHost: true }],
      isHost: true,
    };
    setGroups([...groups, newGroup]);
    setNewGroupName("");
    setShowCreateForm(false);
    alert(`그룹이 생성되었습니다! 코드: ${newGroup.code}`);
  };

  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    const mockGroup: Group = {
      id: Date.now(),
      name: "새 그룹",
      code: joinCode,
      members: [
        { id: 1, name: "호스트", isHost: true },
        { id: 2, name: "나", isHost: false },
      ],
      isHost: false,
    };
    setGroups([...groups, mockGroup]);
    setJoinCode("");
    setShowJoinForm(false);
    alert("그룹에 참가했습니다!");
  };

  const handleRequestJoin = (group: AvailableGroup) => {
    alert(`${group.name}에 가입 요청을 보냈습니다. 호스트의 승인을 기다려주세요.`);
    setShowJoinForm(false);
  };

  const handleApproveRequest = (request: JoinRequest) => {
    setGroups(groups.map((g) =>
      g.id === request.groupId
        ? { ...g, members: [...g.members, { id: Date.now(), name: request.userName, isHost: false }] }
        : g
    ));
    setJoinRequests(joinRequests.filter((r) => r.id !== request.id));
    alert(`${request.userName}님의 가입을 승인했습니다!`);
  };

  const handleRejectRequest = (request: JoinRequest) => {
    setJoinRequests(joinRequests.filter((r) => r.id !== request.id));
    alert("가입 요청을 거절했습니다.");
  };

  const filteredGroups = availableGroups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MAX_VISIBLE_AVATARS = 4;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="shrink-0">그룹 지출 관리</h2>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="알림"
            className="relative bg-accent text-accent-foreground rounded-xl w-10 h-10 flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <Bell className="w-5 h-5" />
            {joinRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold leading-none min-w-[18px] min-h-[18px]">
                {joinRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowJoinForm(true)}
            title="그룹 참가"
            className="bg-secondary text-secondary-foreground rounded-xl w-10 h-10 flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            title="그룹 생성"
            className="bg-primary/80 text-primary-foreground rounded-xl w-10 h-10 flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="bg-card rounded-xl p-5 shadow-lg border border-border">
          <h3 className="mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary/80" />
            가입 요청
          </h3>
          {joinRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">새로운 요청이 없습니다</p>
          ) : (
            <div className="space-y-3">
              {joinRequests.map((request) => (
                <div key={request.id} className="bg-muted rounded-lg p-4">
                  <div className="mb-3">
                    <p className="font-medium">{request.userName}님이 가입을 요청했습니다</p>
                    <p className="text-sm text-muted-foreground">
                      그룹: {request.groupName} · {request.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveRequest(request)}
                      className="flex-1 bg-primary/80 text-primary-foreground rounded-lg py-2 text-sm font-medium hover:shadow-md transition-all"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request)}
                      className="flex-1 bg-destructive/10 text-destructive rounded-lg py-2 text-sm font-medium hover:bg-destructive/20 transition-all"
                    >
                      거절
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Group Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((group) => {
          const visibleMembers = group.members.slice(0, MAX_VISIBLE_AVATARS);
          const extraCount = group.members.length - MAX_VISIBLE_AVATARS;

          return (
            <button
              key={group.id}
              onClick={() => navigate(`/groups/${group.id}`, { state: { group } })}
              className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="group-hover:text-primary transition-colors">{group.name}</h3>
                    {group.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>멤버 {group.members.length}명</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              <div className="flex items-center gap-1.5">
                {visibleMembers.map((member) => (
                  <div
                    key={member.id}
                    className="relative w-9 h-9 rounded-full bg-primary/80 flex items-center justify-center text-white text-sm font-medium ring-2 ring-card"
                    title={member.name}
                  >
                    {member.name[0]}
                    {member.isHost && (
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Crown className="w-2 h-2 text-white" />
                      </span>
                    )}
                  </div>
                ))}
                {extraCount > 0 && (
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium ring-2 ring-card">
                    +{extraCount}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Create Group Modal */}
      {showCreateForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateForm(false)}
        >
          <div
            className="bg-card rounded-xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3>그룹 생성</h3>
              <button onClick={() => setShowCreateForm(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm">그룹 이름</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="예: 가족, 친구들, 동료"
                  className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div className="bg-muted rounded-lg p-4 flex gap-3">
                <TrendingUp className="w-5 h-5 text-primary/80 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  그룹을 생성하면 고유한 그룹 코드가 발급됩니다. 이 코드를 공유하여 다른 사람을 초대할 수 있습니다.
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-primary/80 text-primary-foreground rounded-lg py-3 font-medium shadow-md hover:shadow-lg transition-all"
              >
                생성하기
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowJoinForm(false)}
        >
          <div
            className="bg-card rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3>그룹 참가</h3>
              <button onClick={() => setShowJoinForm(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setJoinMethod("code")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  joinMethod === "code" ? "bg-primary/80 text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-accent/30"
                }`}
              >
                코드로 참가
              </button>
              <button
                onClick={() => setJoinMethod("request")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  joinMethod === "request" ? "bg-primary/80 text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-accent/30"
                }`}
              >
                신청하기
              </button>
            </div>

            {joinMethod === "code" && (
              <form onSubmit={handleJoinWithCode} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">그룹 코드</label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="8자리 코드 입력"
                    maxLength={8}
                    className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring font-mono text-lg text-center"
                    required
                  />
                </div>
                <div className="bg-muted rounded-lg p-4 flex gap-3">
                  <TrendingUp className="w-5 h-5 text-primary/80 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    코드를 입력하면 바로 그룹에 참가됩니다. 호스트로부터 코드를 전달받으세요.
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary/80 text-primary-foreground rounded-lg py-3 font-medium shadow-md hover:shadow-lg transition-all"
                >
                  바로 참가하기
                </button>
              </form>
            )}

            {joinMethod === "request" && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">그룹 검색</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="그룹 이름 검색"
                      className="w-full pl-10 pr-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4 flex gap-3">
                  <TrendingUp className="w-5 h-5 text-primary/80 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    그룹을 선택하면 호스트에게 가입 신청이 전송됩니다.
                  </p>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {filteredGroups.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">검색 결과가 없습니다</p>
                  ) : (
                    filteredGroups.map((group) => (
                      <div key={group.id} className="bg-muted rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium mb-1">{group.name}</h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {group.memberCount}명
                              </span>
                              <span className="flex items-center gap-1">
                                <Crown className="w-4 h-4" />
                                {group.hostName}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRequestJoin(group)}
                            className="bg-primary/80 text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                          >
                            신청
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
