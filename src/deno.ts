import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { OAuth2Client } from "https://deno.land/x/oauth2_client/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

let user_data = {};
// setup server with oak
const app = new Application();
// need oak-cors for connect react-app
app.use(oakCors(
  {   
    origin: "http://localhost:3000",
    credentials: true,
  }
));
//github-user 
export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: null;
  blog: string;
  location: string;
  email: null;
  hireable: null;
  bio: null;
  twitter_username: null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;
}
// OAUTH2 connection
const oauth2Client = new OAuth2Client({
  clientId: "",
  clientSecret: "",
  authorizationEndpointUri: "https://github.com/login/oauth/authorize",
  tokenUri: "https://github.com/login/oauth/access_token",
  redirectUri: "http://localhost:8000/oauth2/callback",
  defaults: {
    scope: "read:user",
  },
});
// router
const router = new Router();
// get /login/github
router.get("/login/github", (ctx) => {
  ctx.response.redirect(
    oauth2Client.code.getAuthorizationUri(),
  );
});

router.get("/oauth2/callback", async (ctx) => {
  const tokens = await oauth2Client.code.getToken(ctx.request.url);
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  })
  ctx.response.redirect('http://localhost:8000/user');
  //const { email } = await userResponse.json();
  const { name } = await userResponse.json();
  console.log(userResponse);
  user_data = `Github-User: ${name}`;
  ctx.response.body = `Hello, ${name}!`;
  console.log(ctx.response.body);  
});
/*
router.get("/user/info", async (ctx) => {
  const tokens = await oauth2Client.code.getToken(ctx.request.url);

  // Use the access token to make an authenticated API request
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  })
  const  json  = await userResponse.json();
  return json;
});
*/

router.get("/user", async (ctx) => {
  ctx.response.body = user_data;
});

app.use(router.allowedMethods(), router.routes());

await app.listen({ port: 8000 });