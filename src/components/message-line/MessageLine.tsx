
type MessageProps = {
    text: string | undefined;
  };

export const MessageLine: React.FC<MessageProps>= ({text}) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, index) => {
      if (/^\*\*(.*)\*\*$/.test(line)) {
        const title = line.replace(/\*\*/g, "");
        return (
          <h2 key={index} className="message-title">
            {title}
          </h2>
        );
      }
      if (/^[-*]\s/.test(line)) {
        return (
          <li key={index} className="message-list-item">
            {line.replace(/^[-*]\s/, "")}
          </li>
        );
      }
      return (
        <p key={index} className="message-paragraph">
          {line}
        </p>
      );
    });
  };