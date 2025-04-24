import { useMatch } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Users from "../../components/Users";
import Chat from "../../components/Chat";

function UserChat() {
  const { params } = useMatch("/chat/users/:userId");
  const hasUserId = /^[0-9]+$/.test(params.userId);

  return (
    <div className={`chat-layout ${hasUserId ? "reverse" : ""}`}>
      <div>
        <Navbar />

        <div className={`chat-contacts ${hasUserId ? "hide-element" : ""}`}>
          <Users />
        </div>
      </div>

      <div className={`chat-box-container ${hasUserId ? "show-element" : ""}`}>
        {hasUserId && <Chat messageType="direct" />}
      </div>
    </div>
  );
}

export default UserChat;
