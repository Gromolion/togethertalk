import { io, ManagerOptions, SocketOptions } from "socket.io-client";

export default function (
  namespace: string,
  options?: Partial<ManagerOptions & SocketOptions>
) {
  return io(`http://localhost:3000/${namespace}`, options);
}
