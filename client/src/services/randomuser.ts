export default async function randomuser () : Promise<string> {
  const response = await fetch('https://randomuser.me/api/?inc=name&results=1')
  const parsed = await response.json()
  return parsed.results[0].name.first
}