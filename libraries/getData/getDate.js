const getDate = () => {
  
  let date = new Date()
  let dateStr = date.toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta'
  })
  console.log(dateStr)
  dateStr = dateStr.split(',')[0].split('/')
  return `${dateStr[2]}-${dateStr[0].padStart(2, 0)}-${dateStr[1].padStart(2, 0)}`
}

export default getDate()