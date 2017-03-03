export default function formatEventName(name) {
  if (!name.includes(':')) {
     return `${name}:_all`;
  }

  return name;
}
