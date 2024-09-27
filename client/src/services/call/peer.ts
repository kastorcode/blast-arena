import { emitIceCandidate } from '~/services/socket'

interface PeerProps {
  id : string
}

export interface Peer {
  id         : string
  connection : RTCPeerConnection
  parent    ?: HTMLDivElement
  audio     ?: HTMLAudioElement
  addTrack             : (stream:MediaStream) => void
  addIceCandidate      : (candidate:RTCIceCandidate) => Promise<void>
  createOffer          : () => Promise<RTCSessionDescriptionInit>
  setLocalDescription  : (description:RTCLocalSessionDescriptionInit) => Promise<void>
  setRemoteDescription : (description:RTCSessionDescriptionInit) => Promise<void>
  createAnswer         : () => Promise<RTCSessionDescriptionInit>
  close                : () => void
}

export function PeerFactory (props:PeerProps) : Peer {
  const peer:Peer = {
    id: props.id,
    connection: new RTCPeerConnection()
  } as Peer
  peer.addTrack = addTrack.bind(peer)
  peer.addIceCandidate = addIceCandidate.bind(peer)
  peer.createOffer = createOffer.bind(peer)
  peer.setLocalDescription = setLocalDescription.bind(peer)
  peer.setRemoteDescription = setRemoteDescription.bind(peer)
  peer.createAnswer = createAnswer.bind(peer)
  peer.close = close.bind(peer)
  peer.connection.ontrack = ontrack.bind(peer)
  peer.connection.onicecandidate = onicecandidate.bind(peer)
  return peer
}

function ontrack (this:Peer, event:RTCTrackEvent) {
  this.audio = document.createElement('audio')
  this.audio.id = this.id
  this.audio.autoplay = true
  this.audio.srcObject = event.streams[0]
  this.parent = document.getElementById('call') as HTMLDivElement
  this.parent.appendChild(this.audio)
}

function onicecandidate (this:Peer, event:RTCPeerConnectionIceEvent) {
  if (!event.candidate) return
  emitIceCandidate({candidate:event.candidate, socketId:this.id})
}

function addTrack (this:Peer, stream:MediaStream) {
  const track = stream.getAudioTracks()[0]
  if (!track) return
  this.connection.addTrack(track, stream)
}

async function addIceCandidate (this:Peer, candidate:RTCIceCandidate) {
  await this.connection.addIceCandidate(new RTCIceCandidate(candidate))
}

function createOffer (this:Peer) {
  return this.connection.createOffer()
}

function setLocalDescription (this:Peer, description:RTCLocalSessionDescriptionInit) {
  return this.connection.setLocalDescription(description)
}

async function setRemoteDescription (this:Peer, description:RTCSessionDescriptionInit) {
  try {
    await this.connection.setRemoteDescription(new RTCSessionDescription(description))
  }
  catch {}
}

function createAnswer (this:Peer) {
  return this.connection.createAnswer()
}

function close (this:Peer) {
  this.connection.close()
  this.audio && this.audio.remove()
}