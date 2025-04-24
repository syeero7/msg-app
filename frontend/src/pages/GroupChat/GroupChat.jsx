import { useMatch } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Groups from "../../components/Groups";
import Chat from "../../components/Chat";

function GroupChat() {
  const match = useMatch("/chat/groups/:groupId");
  const hasGroupId = /^[0-9]+$/.test(match?.params.groupId);

  return (
    <div className={`chat-layout ${hasGroupId ? "reverse" : ""}`}>
      <div>
        <Navbar />

        <div className={`chat-contacts ${hasGroupId ? "hide-element" : ""}`}>
          <Groups />
        </div>
      </div>

      <div className={`chat-box-container ${hasGroupId ? "show-element" : ""}`}>
        {hasGroupId && <Chat messageType="group" />}
      </div>
    </div>
  );
}

export default GroupChat;
