import { CallAnswerDTO, CallOfferDTO, DisconnectedDTO, IceCandidateDTO } from '#/dto'
import { emitCallAnswer, emitCallOffer, socket } from '~/services/socket'
import { Peer, PeerFactory } from './peer'

interface Call {
  peers  : {[key:string]:Peer}
  stream : MediaStream|null
  init               : () => Promise<void>
  initAudioStream    : () => Promise<void>
  initPeerConnection : () => void
  initiated          : () => boolean
  onIceCandidate     : (dto:IceCandidateDTO) => Promise<void>
  createOffer        : () => Promise<void>
  onCallOffer        : (dto:CallOfferDTO) => Promise<void>
  onCallAnswer       : (dto:CallAnswerDTO) => Promise<void>
  close              : (dto:DisconnectedDTO) => void
  closeAll           : () => void
}

export function CallFactory () : Call {
  const call:Call = {
    peers: {},
    stream: null
  } as Call
  call.init = init.bind(call)
  call.initAudioStream = initAudioStream.bind(call)
  call.initPeerConnection = initPeerConnection.bind(call)
  call.initiated = initiated.bind(call)
  call.onIceCandidate = onIceCandidate.bind(call)
  call.createOffer = createOffer.bind(call)
  call.onCallOffer = onCallOffer.bind(call)
  call.onCallAnswer = onCallAnswer.bind(call)
  call.close = close.bind(call)
  call.closeAll = closeAll.bind(call)
  return call
}

async function init (this:Call) {
  await this.initAudioStream()
  this.initPeerConnection()
}

async function initAudioStream (this:Call) {
  try {
    this.stream = await navigator.mediaDevices.getUserMedia({audio:true})
  }
  catch {
    this.stream = null
  }
}

function initPeerConnection (this:Call) {
  if (!this.stream || !socket.id) return
  this.peers[socket.id] = PeerFactory({id:socket.id})
  this.peers[socket.id].addTrack(this.stream)
}

function initiated (this:Call) {
  if (this.stream && socket.id) {
    return true
  }
  return false
}

async function onIceCandidate (this:Call, dto:IceCandidateDTO) {
  if (dto.socketId === socket.id) return
  const peer = this.peers[dto.socketId]
  if (!peer) return
  await peer.addIceCandidate(dto.candidate)
}

async function createOffer (this:Call) {
  if (!socket.id) return
  const peer = this.peers[socket.id]
  if (!peer) return
  const offer = await peer.createOffer()
  await peer.setLocalDescription(offer)
  emitCallOffer({offer, socketId:peer.id})
}

async function onCallOffer (this:Call, dto:CallOfferDTO) {
  if (dto.socketId === socket.id) return
  if (!this.stream || !socket.id) return
  const peerExists = this.peers[dto.socketId]
  peerExists && peerExists.close()
  this.peers[dto.socketId] = PeerFactory({id:dto.socketId})
  const peer = this.peers[dto.socketId]
  await peer.setRemoteDescription(dto.offer)
  peer.addTrack(this.stream)
  const answer = await peer.createAnswer()
  await peer.setLocalDescription(answer)
  emitCallAnswer({answer, socketId:peer.id})
}

async function onCallAnswer (this:Call, dto:CallAnswerDTO) {
  const peer = this.peers[dto.socketId]
  if (!peer) return
  await peer.setRemoteDescription(dto.answer)
}

function close (this:Call, dto:DisconnectedDTO) {
  if (!this.peers[dto.socketId]) return
  this.peers[dto.socketId].close()
  delete this.peers[dto.socketId]
}

function closeAll (this:Call) {
  for (const id in this.peers) {
    this.peers[id].close()
  }
  this.peers = {}
  this.stream = null
}