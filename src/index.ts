import { readFile, writeFile } from "../lib/io";
import { PLACEHOLDERS } from "./constants";
import { generateProjectsTableContentMD, generateProjectsListMD, generateLeaderboardMD } from "./mdGenerator";

const main = async () => {
  const template = await readFile("./src/README.md.tpl")
  const projectsList = await generateProjectsListMD()
  const leaderboardMD = await generateLeaderboardMD()
  const projectsTableContentMD = await generateProjectsTableContentMD()

  // replace all placeholders with info
  const newMarkdown = template
    .replace(PLACEHOLDERS.PROJECTS_TABLE_CONTENT, projectsTableContentMD)
    .replace(PLACEHOLDERS.PROJECTS_LIST, projectsList)
    .replace(PLACEHOLDERS.PROJECTS_TOP, leaderboardMD)

  await writeFile("README.md", newMarkdown)
}

main()