const format = (givenDate: Date) => {
  var currentDate = new Date()

  var timeDiff = currentDate.getTime() - givenDate.getTime()

  var seconds = Math.floor(timeDiff / 1000)
  var minutes = Math.floor(seconds / 60)
  var hours = Math.floor(minutes / 60)
  var days = Math.floor(hours / 24)

  if (days > 0) {
    return days + ' days ago.'
  } else if (hours > 0) {
    return hours + ' hours ago.'
  } else if (minutes > 0) {
    return minutes + ' min ago.'
  }
  return 'now'
}
export default format
