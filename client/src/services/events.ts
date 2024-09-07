export const EVENTS = {
  OFFER_CALL: 'offer_call'
}

export function dispatchOfferCall () {
  setTimeout(() => window.dispatchEvent(new CustomEvent(EVENTS.OFFER_CALL)), 3000)
}