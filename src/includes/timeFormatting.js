export default {
  // this helper function accepts time data in seconds, transforms it and returns formatted time
  formatTime(time) {
    // how many minutes are in the 'time'
    const minutes = Math.floor(time / 60) || 0;
    // how many seconds leftover, after minutes are taken out
    const seconds = Math.round((time - minutes * 60) || 0);
    
    // we need to display a '0' in front of seconds if there are less than 10 seconds left
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}