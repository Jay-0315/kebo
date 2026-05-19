import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ExpensesPage from "./components/ExpensesPage";
import CommunityPage from "./components/CommunityPage";
import GroupsPage from "./components/GroupsPage";
import GroupDetailPage from "./components/GroupDetailPage";
import MyPage from "./components/MyPage";
import KabemonPage from "./components/KabemonPage";
import StoryCreatePage from "./components/StoryCreatePage";
import StoryViewPage from "./components/StoryViewPage";
import SettingsPage from "./components/SettingsPage";
import { isAuthenticated } from "./lib/auth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="groups/:id" element={<GroupDetailPage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="kabemon" element={<KabemonPage />} />
          <Route path="story/create" element={<StoryCreatePage />} />
          <Route path="story/view" element={<StoryViewPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* Legacy redirect */}
          <Route path="mypage/character" element={<Navigate to="/kabemon" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
