import axios from 'axios';
import React, { startTransition, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { removeUser } from '../utils/userSlice';
import { BASE_URL } from '../utils/constants';
import useTheme from '../utils/useTheme';
const THEME_LABELS = { light: "Light", dark: "Dark", system: "System" };
const Navbar = () => {
const dispatch=useDispatch();
const navigate=useNavigate();
const [searchParams] = useSearchParams();
const user=useSelector((store)=>store.user)
const [theme, setTheme] = useTheme();
const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
const [suggestions, setSuggestions] = useState([]);

useEffect(() => {
  const nextSearch = searchParams.get("search") || "";
  startTransition(() => setSearchInput((current) => (current === nextSearch ? current : nextSearch)));
}, [searchParams]);

useEffect(() => {
  const query = searchInput.trim();

  if (!query) {
    startTransition(() => setSuggestions([]));
    return undefined;
  }

  const timeoutId = setTimeout(async () => {
    try {
      const res = await axios.get(`${BASE_URL}user/search`, {
        params: { search: query, limit: 5 },
        withCredentials: true
      });
      startTransition(() => setSuggestions(res.data));
    } catch (error) {
      console.error("Suggestions failed" + error.message);
      setSuggestions([]);
    }
  }, 250);

  return () => clearTimeout(timeoutId);
}, [searchInput]);

const searchForUser = (query) => {
  setSuggestions([]);
  navigate(`/?search=${encodeURIComponent(query)}`);
};

const handleLogout=async()=>{
  try{
  await axios.post(`${BASE_URL}logout`,
   {},
   { withCredentials: true }
  )
  dispatch(removeUser());
  navigate("/login")
}
catch
{
  console.error("Logout Failed");
}
}
//console.log(user);
  return (
    <header className="sticky top-0 z-20">
      <div className="navbar flex-nowrap min-h-16 bg-base-200 px-4 shadow-sm sm:px-6">
  <div className="flex-none">
    <Link  to={"/"} className="btn btn-ghost px-2 text-xl" href="/">DevTinder</Link>
  </div>
  {user && (
    <form
      className="navbar-search relative mx-2 flex min-w-0 flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        searchForUser(searchInput.trim());
      }}
    >
      <input
        className="input input-bordered w-full pr-20"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Search people"
        aria-label="Search people by name or skill"
        aria-autocomplete="list"
        aria-controls="person-search-suggestions"
      />
      <button className="navbar-search-submit btn btn-primary absolute right-1 top-1" type="submit">
        Search
      </button>
      {suggestions.length > 0 && (
        <ul
          id="person-search-suggestions"
          className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
          role="listbox"
        >
          {suggestions.map((suggestion) => {
            const name = `${suggestion.firstName} ${suggestion.lastName || ""}`.trim();
            return (
              <li key={suggestion._id} role="option">
                <button
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-base-200"
                  type="button"
                    onClick={() => {
                      setSuggestions([]);
                      navigate(`/connection/${suggestion._id}`);
                    }}
                >
                  <img className="h-9 w-9 rounded-full object-cover" src={suggestion.photoUrl} alt="" />
                  <span>
                    <span className="block font-medium">{name}</span>
                    {suggestion.Skills?.length > 0 && (
                      <span className="block text-xs text-gray-500">
                        {suggestion.Skills.slice(0, 2).join(" · ")}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </form>
  )}
  {user && (
    <nav className="navbar-links" aria-label="Main navigation">
      <Link to="/requests">Requests</Link>
      <Link to="/connections">Connections</Link>
      <Link to="/messages">Messages</Link>
      <button type="button" onClick={handleLogout}>Logout</button>
    </nav>
  )}
  <div className="dropdown dropdown-end">
    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm" aria-label="Change theme">
      {THEME_LABELS[theme]}
    </div>
    <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-32 p-2 shadow">
      {Object.entries(THEME_LABELS).map(([value, label]) => (
        <li key={value}>
          <button
            type="button"
            className={theme === value ? "active" : ""}
            onClick={() => setTheme(value)}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  </div>
  {user && <div className="flex items-center gap-2">
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost h-auto min-h-10 gap-2 px-2 sm:px-3">
           <span className="navbar-user-name hidden text-sm font-medium sm:inline">Welcome, {user.firstName}</span>

        <div className="w-9 rounded-full sm:w-10">
         
          <img
            alt={`${user.firstName}'s profile`}
            className="aspect-square object-cover"
            src={user.photoUrl}
          />
        </div>
      </div>
      <ul
        tabIndex={-1}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <Link to={"/profile"} className="justify-between">
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        <li>
          <Link to="/connections">Connections</Link>
        </li>
        <li>
          <Link to="/requests">Requests</Link>
        </li>
        <li>
          <Link to="/messages">Messages</Link>
        </li>
        <li onClick={handleLogout}><a>Logout</a></li>
      </ul>
    </div>
  </div>}
</div>
    </header>
  )
}

export default Navbar
