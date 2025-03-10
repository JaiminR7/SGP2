import { useContext, useState } from "react"; // Ensure useState is imported
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";

export default function AccountPage() {
  const [redirect, setRedirect] = useState(false);
  const { ready, user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  let { subpage } = useParams();

  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    try {
      await axios.post("/logout");
      setRedirect("/");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Error during logout");
    }
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (!ready) {
    return "Loading...";
  }
  if (ready && !user && !!redirect) {
    return <Navigate to={"/login"} />;
  }

  function linkClasses(type = null) {
    let classes = "py-2 px-6";
    if (type === subpage) {
      classes += " bg-red-500 text-white rounded-full";
    }
    return classes;
  }

  return (
    <div>
      <nav className="w-full flex justify-center mt-8 gap-4 mb-8">
        <Link className={linkClasses("profile")} to={"/account"}>
          My profile
        </Link>
        <Link className={linkClasses("booking")} to={"/account/booking"}>
          My Booking
        </Link>
        <Link className={linkClasses("places")} to={"/account/places"}>
          My accommodations
        </Link>
      </nav>
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name}({user.email})
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 mt-2 rounded-full block mx-auto"
          >
            Logout
          </button>
        </div>
      )}

{subpage === 'places' && (
  <PlacesPage />
)}
    </div>
  );
}
