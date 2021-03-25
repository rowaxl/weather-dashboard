import requestIP from 'request-ip'
import geoip from 'geoip-lite'

export default (req, res) => {
  const clientIp = requestIP.getClientIp(req)
    .replace('::1', '')
    .replace('127.0.0.1', '')

  if (!clientIp) return res.status(400).end()

  const geo = geoip.lookup(clientIp)

  console.log({geo})
  return res.status(200).json({ geo })
}
