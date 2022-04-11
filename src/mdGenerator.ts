import { getBuildspaceProjectsInfo, getBuildspaceReposWithUrl, getBuildspaceReposOf } from "./services" 

// Create List of Projects for show in table content from projects array
export const generateProjectsTableContentMD = async () => {
  let projectsTableContentMD = "";
  const projects = await getBuildspaceProjectsInfo()
  
  projects.map(({ name }) => {
    projectsTableContentMD += `\t- [${name}](#${name.replaceAll("_", "").toLowerCase()})\n`;
  });
  return projectsTableContentMD;
}

// Show list of projects of each category
export const generateProjectsListMD = async () => {
  let projectsListMD = "";

  const projects = await getBuildspaceProjectsInfo()

  for (const { name } of projects) {
    projectsListMD += `### ${name}\n\n`;
    const projectName = name.replaceAll("_", " ").replaceAll("JS", "")
    const repos = await getBuildspaceReposOf(projectName);

    for (const { name, html_url } of repos) {
      projectsListMD += `- [${name}](${html_url})\n`;
    }
  }
  return projectsListMD;
}

// Show top projects that have more stars
export const generateLeaderboardMD = async () => {
  let leaderboardMD = "";
  const projectData = await getBuildspaceReposWithUrl()

  leaderboardMD += `| Stars | repo | demo | owner |\n`;
  leaderboardMD += `|-----:|----:|----:|----:|\n`;
  projectData.map(({ stargazers_count, name, html_url, homepage, owner }) => {
    const avatar_url = owner.avatar_url.replace('v=4', 'size=20');
    leaderboardMD += `| ${stargazers_count} :star: | [${name}](${html_url}) | [${homepage}](${homepage}) | <img src="${avatar_url}" width="20"> [${owner.login}](https://github.com/${owner.login}) |\n`;
  })

  return leaderboardMD;
}

  