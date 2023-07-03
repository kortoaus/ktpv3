const fs = require('fs')
const {networkInterfaces} = require('os')
const interfaces = networkInterfaces()

let addresses = [];

for (let k in interfaces){
  for(let k2 in interfaces[k]){
    let address = interfaces[k][k2]
    if(address.family === 'IPv4' && address.address.startsWith(`192.168`) && !address.internal){
      addresses.push(address.address)
    }
  }
}
const hostIP = addresses.join('')

const data = `API_URL="http://localhost:3000/api"
NEXT_PUBLIC_SOCKET_URL="http://${hostIP}:3000"
`

fs.writeFile(`kiosk_server/.env`, data, ()=>console.log('done'))
fs.writeFile(`pos_server/.env`, data, ()=>console.log('done'))
fs.writeFile(`client/.env`, data, ()=>console.log('done'))