import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";
import { MyListPage } from "@/pages/MyListPage";
import { Toast } from "@/components/Toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:username" element={<ProfileDetailPage />} />
        <Route path="/list" element={<MyListPage />} />
      </Routes>
      <Toast />
    </BrowserRouter>
  );
}

export default App;
