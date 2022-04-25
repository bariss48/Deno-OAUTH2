import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const GITHUB_CLIENT_ID = "4bb5c83be76353f352f2";
const gitHubRedirectURL = "http://localhost:8000/oauth2/callback";
const path = "/";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    (async function () {
      const usr = await axios
        .get(`http://localhost:8000/oauth2/callback`, {
          withCredentials: true,
        })
        .then((res) => res.data);
      setUser(usr);
    })();
  }, []);

  return (
    <div className="App">
      {!user ? (
        <a
        href={`http://localhost:8000/login/github`}
        >
          LOGIN WITH GITHUB
        </a>
      ) : (               
        <h1>
          <ul>
            Github
            <li>
            <h1>-- username: {user.login} --</h1>
            </li>
            <li>
            <h1>-- User_id: {user.id} --</h1>
            </li> 
            <li>
            <h1>-- Email: {user.email} --</h1>
            </li>
            <li>
            <a href={user.avatar_url}>
            Profile Picture
          </a>           
           </li>
           <li>
            <h1>-- repository count: {user.public_repos} --</h1>
            </li>
            <li>
            <h1>-- followers count: {user.followers} --</h1>
            </li>
          </ul>         
        </h1>
      )}
    </div>
  );
}

export default App;