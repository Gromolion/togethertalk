import { io, ManagerOptions, SocketOptions } from "socket.io-client";

export default function (
  namespace: string,
  options?: Partial<ManagerOptions & SocketOptions>
) {
  return io(`http://192.168.1.66:3000/${namespace}`, options);
}
