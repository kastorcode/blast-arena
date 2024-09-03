interface Props {
  onClick : () => void
}

export function Back ({onClick}:Props) {
  return (
    <svg className="svgHover" onClick={onClick} width="100%" height="100%" version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 406 451"><style></style><path d="m6.3 204.7c3.8-6.6 9.3-12.1 15.9-15.9l319.3-182.5c20.5-11.7 46.5-4.6 58.2 15.9 3.7 6.5 5.6 13.8 5.6 21.2v364.9c0 23.6-19.1 42.7-42.6 42.7-7.4 0-14.7-1.9-21.2-5.6l-319.3-182.5c-20.5-11.7-27.6-37.8-15.9-58.2z"/></svg>
  )
}