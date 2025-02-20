import { useSelector } from "react-redux";
import "./App.css";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profile";
import Home from "./pages/home/Home";
import { Route, Routes, Navigate } from "react-router-dom";
import PersonProfile from "./components/PersonProfile/PersonProfile";
import Chat from "./pages/Chat/Chat";
function App() {
  const user = useSelector((state) => state.authReducer.authData);
  return (
    <div className="App">
      <div className="blur" style={{ top: "-18%", right: "0" }}></div>
      <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>

      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to={"home"} /> : <Navigate to={"auth"} />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to={"../auth"} />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to={"../home"} /> : <Auth />}
        />
        <Route
          path="/profile/:id"
          element={user ? <Profile /> : <Navigate to={"../auth"} />}
        />
        <Route path="/person/:id" element={<PersonProfile />} />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to={"../auth"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
