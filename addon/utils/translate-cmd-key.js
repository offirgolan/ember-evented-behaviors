export default function translateCmdKey(platform=navigator.platform) {
  if (platform.indexOf('Mac') > -1) {
    return 'meta';
  } else {
    return 'ctrl';
  }
}
