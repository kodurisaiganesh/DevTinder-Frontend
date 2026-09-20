import axios from "axios";
import React, { startTransition, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((store) => store.user);
  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(368);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const messagesEndRef = useRef(null);

  const getPresenceLabel = (isOnline, lastActiveAt, lastSeenAt, updatedAt) => {
    const activeAt = new Date(lastActiveAt || updatedAt);
    if (Number.isNaN(activeAt.getTime())) return "Offline";
    if (isOnline && currentTime - activeAt.getTime() < 120000) return "Active now";
    if (!lastSeenAt) return "Last seen unavailable";
    const seenAt = new Date(lastSeenAt);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const seenDayStart = new Date(seenAt.getFullYear(), seenAt.getMonth(), seenAt.getDate());
    const dayDifference = Math.round((todayStart - seenDayStart) / 86400000);
    const dayLabel = dayDifference === 0
      ? "today"
      : dayDifference === 1
        ? "yesterday"
        : seenAt.toLocaleDateString([], { day: "numeric", month: "short" });
    const timeLabel = seenAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    return `Last seen ${dayLabel} at ${timeLabel}`;
  };

  const formatMessageTime = (date) => new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(new Date(date));

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  const fetchMessages = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/messages/${userId}`, {
        withCredentials: true
      });
      const conversationsResponse = await axios.get("http://localhost:3000/messages", {
        withCredentials: true
      });
      setChatUser(response.data.user);
      setMessages(response.data.messages);
      setConversations(conversationsResponse.data.conversations);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load this chat.");
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    startTransition(() => fetchMessages(true));
    const intervalId = setInterval(() => fetchMessages(), 4000);
    return () => clearInterval(intervalId);
  }, [fetchMessages]);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (!isResizingSidebar) return undefined;

    const handlePointerMove = (event) => {
      setSidebarWidth(Math.min(520, Math.max(280, event.clientX)));
    };
    const handlePointerUp = () => setIsResizingSidebar(false);

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.body.classList.add("is-resizing-chat-sidebar");

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.body.classList.remove("is-resizing-chat-sidebar");
    };
  }, [isResizingSidebar]);

  const handleSend = async (event) => {
    event.preventDefault();
    const messageText = text.trim();
    if (!messageText) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/messages/${userId}`,
        { text: messageText },
        { withCredentials: true }
      );
      setMessages((previousMessages) => [...previousMessages, response.data]);
      setText("");
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Message could not be sent.");
    }
  };

  if (isLoading) {
    return <div className="chat-page-status">Loading conversation...</div>;
  }

  if (!chatUser) {
    return (
      <div className="chat-page-status">
        <p>{error || "This conversation is unavailable."}</p>
        <Link className="btn btn-primary mt-4" to="/connections">Back to connections</Link>
      </div>
    );
  }

  return (
    <section className="chat-page">
      <div className="chat-page-heading">
        <div>
          <p className="connections-eyebrow">MESSAGING</p>
          <h1>Messages</h1>
        </div>
        <Link className="chat-back-link" to="/messages">All messages</Link>
      </div>
      <div
        className={`chat-shell ${isSidebarCollapsed ? "is-sidebar-collapsed" : ""}`}
        style={!isSidebarCollapsed ? { gridTemplateColumns: `${sidebarWidth}px 6px minmax(0, 1fr)` } : undefined}
      >
        <aside className="chat-sidebar">
          <div className="chat-sidebar-heading">
            <h2>Chats</h2>
            <div className="chat-sidebar-tools">
              <Link to="/messages" aria-label="View all messages">•••</Link>
              <button
                type="button"
                aria-label="Maximize conversation"
                onClick={() => setIsSidebarCollapsed(true)}
              >
                ›
              </button>
            </div>
          </div>
          <label className="chat-sidebar-search">
            <span aria-hidden="true">⌕</span>
            <input placeholder="Search chats" aria-label="Search chats" />
          </label>
          <div className="chat-conversation-list">
            {conversations.map(({ person, lastMessage, unreadCount }) => {
              const isActive = Boolean(person.isOnline) &&
                currentTime - new Date(person.lastActiveAt).getTime() < 120000;

              return (
              <button
                className={`chat-conversation-item ${String(person._id) === String(userId) ? "is-active" : ""}`}
                key={person._id}
                type="button"
                onClick={() => navigate(`/chat/${person._id}`)}
              >
                <span className="chat-list-avatar-wrap">
                  {person.photoUrl ? (
                    <img src={person.photoUrl} alt="" />
                  ) : (
                    <span className="chat-list-avatar-fallback">{person.firstName?.charAt(0)}</span>
                  )}
                  {isActive && <span className="chat-list-online-dot" aria-label="Active now" />}
                </span>
                <span className="chat-conversation-copy">
                  <strong>{person.firstName} {person.lastName}</strong>
                  <span className="chat-list-preview">{lastMessage?.text || "Start a conversation"}</span>
                </span>
                <span className="chat-list-meta">
                  {lastMessage && <time>{new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>}
                  {unreadCount > 0 && <strong className="chat-unread-count">{unreadCount > 99 ? "99+" : unreadCount}</strong>}
                </span>
              </button>
              );
            })}
          </div>
        </aside>

        {!isSidebarCollapsed && (
          <button
            className="chat-sidebar-resizer"
            type="button"
            aria-label="Resize chat list"
            onPointerDown={() => setIsResizingSidebar(true)}
          />
        )}

        <div className="chat-conversation">
          <header className="chat-header">
            {isSidebarCollapsed && (
              <button
                className="chat-open-sidebar btn btn-ghost btn-sm"
                type="button"
                aria-label="Show chats"
                onClick={() => setIsSidebarCollapsed(false)}
              >
                ‹ Chats
              </button>
            )}
            <button className="chat-back-button btn btn-ghost btn-sm" type="button" onClick={() => navigate("/messages")}>
              <span aria-hidden="true">‹</span>
              <span className="chat-back-label">Back</span>
            </button>
            {chatUser.photoUrl ? (
              <img className="chat-avatar" src={chatUser.photoUrl} alt="" />
            ) : (
              <span className="chat-avatar chat-avatar-fallback" aria-hidden="true">
                {chatUser.firstName?.charAt(0)}{chatUser.lastName?.charAt(0)}
              </span>
            )}
            <div className="chat-contact-copy">
              <h1 className="font-semibold">{chatUser.firstName} {chatUser.lastName}</h1>
              <p className={`chat-presence ${getPresenceLabel(chatUser.isOnline, chatUser.lastActiveAt, chatUser.lastSeenAt, chatUser.updatedAt) === "Active now" ? "is-active" : ""}`}>
                {getPresenceLabel(chatUser.isOnline, chatUser.lastActiveAt, chatUser.lastSeenAt, chatUser.updatedAt)}
              </p>
            </div>
          </header>

          <div className="chat-messages" aria-live="polite">
        {messages.length === 0 && (
          <p className="chat-empty">Start the conversation with {chatUser.firstName}.</p>
        )}
        {messages.map((message) => {
          const isMine = String(message.senderId) === String(currentUser?._id);
          return (
            <div className={`chat-row chat-message-entrance ${isMine ? "chat-row-mine" : "chat-row-theirs"}`} key={message._id}>
              <div className={`chat-bubble ${isMine ? "chat-bubble-mine" : "chat-bubble-theirs"}`}>
                <p>{message.text}</p>
                <time className="chat-time" dateTime={message.createdAt}>
                  {formatMessageTime(message.createdAt)}
                  {String(message.senderId) === String(currentUser?._id) && (
                    <span className={`chat-receipt ${message.readAt ? "is-read" : ""}`} aria-label={message.readAt ? "Read" : "Sent"}>
                      {message.readAt ? "✓✓" : "✓"}
                    </span>
                  )}
                </time>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
          </div>

          {error && <p className="chat-error">{error}</p>}
          <form className="chat-composer" onSubmit={handleSend}>
            <button className="chat-tool-button" type="button" aria-label="Add attachment">+</button>
            <input
              className="input input-bordered chat-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type a message"
              maxLength={2000}
              aria-label="Message"
            />
            <button className="chat-send-button" type="submit" disabled={!text.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Chat;
