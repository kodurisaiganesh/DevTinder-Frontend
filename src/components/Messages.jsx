import axios from "axios";
import React, { startTransition, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConversations = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/messages", {
        withCredentials: true
      });
      const nextConversations = response.data.conversations;
      setConversations(nextConversations);
      setError("");

      if (nextConversations.length > 0) {
        navigate(`/chat/${nextConversations[0].person._id}`, { replace: true });
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load messages.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    startTransition(() => fetchConversations());
    const intervalId = setInterval(fetchConversations, 5000);
    return () => clearInterval(intervalId);
  }, [fetchConversations]);

  if (isLoading) return <div className="chat-page-status">Loading messages...</div>;

  return (
    <section className="messages-page">
      <div className="messages-heading">
        <div>
          <p className="connections-eyebrow">MESSAGING</p>
          <h1>Messages</h1>
          <p className="messages-subtitle">Your professional conversations</p>
        </div>
        <span className="connections-count">{conversations.length}</span>
      </div>

      <div className="messages-panel">
        <div className="messages-panel-header">
          <h2>Recent conversations</h2>
          <span>{conversations.length} {conversations.length === 1 ? "chat" : "chats"}</span>
        </div>
        {error && <p className="chat-error">{error}</p>}
        {conversations.length === 0 ? (
          <div className="messages-empty">
            <h2>No conversations yet</h2>
            <p>Connect with someone to start messaging.</p>
            <button className="btn btn-primary mt-4" type="button" onClick={() => navigate("/connections")}>
              View connections
            </button>
          </div>
        ) : (
          conversations.map(({ person, lastMessage }) => (
            <button
              className="conversation-row message-entrance"
              key={person._id}
              type="button"
              onClick={() => navigate(`/chat/${person._id}`)}
            >
              <img className="conversation-avatar" src={person.photoUrl} alt="" />
              <span className="conversation-copy">
                <strong>{person.firstName} {person.lastName}</strong>
                <span>{lastMessage?.text || "Start a conversation"}</span>
              </span>
              <time>
                {lastMessage
                  ? new Date(lastMessage.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })
                  : ""}
              </time>
              <span className="conversation-arrow" aria-hidden="true">›</span>
            </button>
          ))
        )}
      </div>
    </section>
  );
};

export default Messages;
