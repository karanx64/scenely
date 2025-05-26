import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SelectAvatar from "./pages/SelectAvatar";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/select-avatar" element={<SelectAvatar />} />
        <Route path="/user/:userId" element={<UserProfile />} />
      </Route>
    </Routes>
  );
}

export default App;

// import TestFileReader from "./components/TestFileReader";

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-900">
//       <TestFileReader />
//     </div>
//   );
// }

// export default App;
