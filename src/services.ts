import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

interface IRepo {
  name: string,
  html_url: string
}

// Search for repositories by keyword buildspace that user is not buildspace and stars more than 0
export const getBuildspaceReposOf = async (keyword: string): Promise<IRepo[]> => {
  const { data } = await octokit.search.repos({
    q: `user:buildspace buildspace ${keyword} -user:buildspace stars:>0`,
    sort: "stars",
    order: "desc"
  });

  return data.items.map(({ name, html_url }) => {
    return {
      name,
      html_url
    };
  });
}

interface IProject {
  stargazers_count: number,
  name: string,
  html_url: string,
  homepage: string,
  owner: {
    login: string,
    avatar_url: string
  }
}

// Search for repositories by keyword buildspace that user is not buildspace, stars more than 0 and has homepage url
// return Promise of array of json objects types
export const getBuildspaceReposWithUrl = async (): Promise<IProject[]> => {
  const { data } = await octokit.search.repos({
    q: "user:buildspace buildspace -user:buildspace stars:>0",
    sort: "stars",
    order: "desc"
  });

  return data.items.filter(({ homepage }) => homepage).map(({ name, html_url, homepage, stargazers_count, owner }) => {
    return {
      stargazers_count,
      name,
      html_url,
      homepage,
      owner: {
        login: owner.login,
        avatar_url: owner.avatar_url
      }
    }
  });
}

// Get Info of repo https://github.com/buildspace/buildspace-projects
export const getBuildspaceProjectsInfo = async (): Promise<any> => {
  const { data } = await octokit.repos.getContent({
    owner: "buildspace",
    repo: "buildspace-projects",
    path: ""
    });
  
  return Array.isArray(data) && data.map(({ name, type }) => {
    if (type === "dir" && !name.startsWith(".")) {
      return { name }
    }
  }).filter(Boolean);
}