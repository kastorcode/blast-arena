interface ActionProps {
  onTouchStart : () => void
}

export function Action ({onTouchStart}:ActionProps) {
  return (
    <svg onTouchStart={onTouchStart} version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%"><style></style><path  d="m50 1.6c-3 0.8-8 2.5-11 3.7-3 1.3-8.2 4-11.4 6.2-3.3 2.2-8 6.3-10.5 9.1-2.5 2.8-6.1 7.5-7.8 10.5-1.8 3-4.5 8.8-6 12.9-2.3 6.5-2.7 9.1-2.7 19.5-0.1 9.7 0.3 13.3 2.1 19 1.2 3.8 3.9 9.9 6 13.5 2.1 3.6 6.7 9.5 10.3 13.1 3.6 3.6 9.4 8.2 13 10.1 3.6 2 9.6 4.6 13.5 5.9 5.8 2 9.1 2.4 18.5 2.4 9.9 0 12.6-0.4 19.5-2.7 4.4-1.5 11.4-4.9 15.5-7.6 4.1-2.6 9.9-7.5 12.8-10.8 2.9-3.2 7-9.5 9.2-13.9 2.2-4.4 4.7-11.2 5.5-15 0.8-3.9 1.5-10.2 1.5-14 0-3.9-0.7-9.9-1.5-13.5-0.9-3.6-3.3-10.1-5.5-14.5-2.2-4.4-6.3-10.7-9.2-13.9-2.9-3.3-8.5-8-12.3-10.6-3.9-2.5-10.6-5.9-15-7.4-6.3-2.2-10.3-2.9-18.5-3.2-7.5-0.3-12.1 0.1-16 1.2z"/></svg>
  )
}

export function Down () {
  return (
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 180" width="100%" height="100%"><style></style><path  d="m31.7 32.1l-31.7 31.9v116h128v-116c-49.6-49.6-64.1-64-64.3-63.9-0.1 0-14.5 14.4-32 32z"/></svg>
  )
}

export function Left () {
  return (
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 128" width="100%" height="100%"><style></style><path  d="m0 64v64h116.3l63.7-64-64-64h-116z"/></svg>
  )
}

export function Right () {
  return (
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 128" width="100%" height="100%"><style></style><path  d="m32.1 32l-32.1 32 64 64h116v-128h-115.9z"/></svg>
  )
}

export function Up () {
  return (
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 180" width="100%" height="100%"><style></style><path  d="m0 58v58l64 64 64-64v-116h-128z"/></svg>
  )
}