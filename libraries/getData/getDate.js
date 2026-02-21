const getDate = () => {
  
  let date = new Date()
  let dateStr = date.toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta'
  })
  dateStr = dateStr.split(',')[0].split('/')
  console.log(dateStr)
  return `${dateStr[2]}-${dateStr[0].padStart(2, 0)}-${dateStr[1].padStart(2, 0)}`

}

export default getDate()