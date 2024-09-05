export function addLobbyToUrl (lobbyId:string) {
  const url = new URL(window.location.toString())
  url.searchParams.set('lobby', lobbyId)
  window.history.pushState({}, '', url)
}