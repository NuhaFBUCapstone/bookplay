import * as React from "react";
import { useState } from "react";
import "./LiveChat.css";
import {initializeParse} from "@parse/react"
import Parse from "parse";
import { useParseQuery } from "@parse/react";

const PARSE_APPLICATION_ID = "3PRkrcUCakVV2GzHDYS5svrNa7CK5TBD7WfiNogY";
const PARSE_LIVE_QUERY_URL = "https://nuhacapstone.b4a.io/";
const PARSE_JAVASCRIPT_KEY = "QThaAFJyq0JMnn4yytCSPJUt9kdFqffclXAZeYBA";
initializeParse(
    PARSE_LIVE_QUERY_URL,
    PARSE_APPLICATION_ID,
    PARSE_JAVASCRIPT_KEY
  );

export default function LiveChat(props) {
  const [messageInput, setMessageInput] = useState("");
  console.log(props.sender)

  const parseQuery = new Parse.Query("Messages");
  parseQuery.containedIn("sender", [
    props.sender,
    props.receiver,
  ]);
  parseQuery.containedIn("receiver", [
    props.sender,
    props.receiver,
  ]);
  parseQuery.ascending("createdAt");
  parseQuery.includeAll();

  // Declare hook and variables to hold hook responses
  const { isLive, isLoading, isSyncing, results, count, error, reload } =
    useParseQuery(parseQuery, {
      enableLocalDatastore: true,
      enableLiveQuery: true,
    });

  async function sendMessage() {
    try {
        if (!messageInput) return;
        const messageText = messageInput;
        // Create new Message object and save to Parse
        let message = new Parse.Object("Messages");
        message.set("text", messageText);
        message.set("sender", props.sender);
        message.set("receiver", props.receiver);
        message.save();
        setMessageInput("");
        reload()
    } catch (error) {
      alert(error);
    }
  };

  //format createdAt value on Message
  const formatDateToTime = (date) => {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  return (
    <div className="livechat">
      {/* <div className="flex_between">
          <button
            onClick={reload}>reload         
            </button>
      </div> */}
      {results && (
        <div className="messages">
          {results
            .sort((a, b) => a.get("createdAt") > b.get("createdAt"))
            .map((result) => (
              <div
                key={result.id}
                className={
                  result.get("sender") === props.sender
                    ? "message_sent"
                    : "message_received"
                }
              >
                <p className="message_bubble">{result.get("text")}</p>
                <p className="message_time">
                  {formatDateToTime(result.get("createdAt"))}
                </p>
                <p className="message_name">
                  {result.get("sender")}
                </p>
              </div>
            ))}
        </div>
      )}
      <div className="new_message">
        <h2 className="new_message_title">Send New Message</h2>
        <input
          className="form_input"
          value={messageInput}
          onChange={(event) => setMessageInput(event.target.value)}
          placeholder="Type here..."
          size="large"
        />
        <input
          type="submit"
          className="form_button"
          onClick={sendMessage}
          value="Send message"
        />
      </div>
      <div>
        {isLoading && <p>{"Loading…"}</p>}
        {isSyncing && <p>{"Syncing…"}</p>}
        {isLive ? <p>{"Status: Live"}</p> : <p>{"Status: Offline"}</p>}
        {error && <p>{error.message}</p>}
        {count && <p>{`Count: ${count}`}</p>}
      </div>
    </div>
  );
};