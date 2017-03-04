export default function formatEventName(name) {
  if (name.includes(':all')) {
    return name.replace(':all', ':_all');
  }

  return name;
}
