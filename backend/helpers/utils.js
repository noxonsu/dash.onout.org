const getIP = (req) => {
  // req.connection is deprecated
  const conRemoteAddress = req.connection?.remoteAddress?.split(':')?.slice(-1)[0];
  // req.socket is said to replace req.connection
  const sockRemoteAddress = req.socket?.remoteAddress?.split(':')?.slice(-1)[0];
  // some platforms use x-real-ip
  const xRealIP = req.headers['x-real-ip']?.split(':')?.slice(-1)[0];
  // most proxies use x-forwarded-for
  const xForwardedForIP = (() => {
    const xForwardedFor = req.headers['x-forwarded-for']
    if (xForwardedFor) {
      // The x-forwarded-for header can contain a comma-separated list of
      // IP's. Further, some are comma separated with spaces, so whitespace is trimmed.
      const ips = xForwardedFor.split(',').map(ip => ip.trim())
      return ips[0]
    }
  })()
  // prefer x-forwarded-for and fallback to the others
  return xForwardedForIP || xRealIP || sockRemoteAddress || conRemoteAddress
}

module.exports = {
  getIP,
};