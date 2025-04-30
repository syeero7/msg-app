import GroupMembers from "../../components/GroupMembers";
import Navbar from "../../components/Navbar";
import styles from "./GroupSettings.module.css";

function GroupSettings() {
  return (
    <div className={`chat-layout ${styles.reverse}`}>
      <div>
        <div className={styles.container}>
          <Navbar />
        </div>
        <div className="chat-contacts hide-element"></div>
      </div>

      <div className="chat-box-container show-element">
        <GroupMembers />
      </div>
    </div>
  );
}

export default GroupSettings;
