import { io, Socket } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3080";

interface NotificationPayload {
  type: string;
  message: string;
  data?: any;
  userId?: string;
}

class WebSocketClient {
  private socket: Socket | null = null;
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(WS_URL, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        auth: {
          token: this.token,
        },
      });

      this.socket.on("connect", () => console.log("Connected to WebSocket"));
      this.socket.on("disconnect", () =>
        console.log("Disconnected from WebSocket")
      );
      this.socket.on("error", (error) =>
        console.error("WebSocket error:", error)
      );

      // Set up notification handler
      this.socket.on("notification", (notification: NotificationPayload) => {
        this.handleNotification(notification);
      });
    }
  }

  private handleNotification(notification: NotificationPayload) {
    switch (notification.type) {
      case "transaction":
        console.log("New transaction:", notification.data);
        break;
      case "group":
        console.log("Group update:", notification.data);
        break;
      case "payment":
        console.log("Payment update:", notification.data);
        break;
      case "system":
        console.log("System message:", notification.message);
        break;
      case "user":
        console.log("User notification:", notification.message);
        break;
      default:
        console.log("Received notification:", notification);
    }
  }

  send(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  listen(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

// Create a singleton instance
export const createWsClient = (token: string) => new WebSocketClient(token);
