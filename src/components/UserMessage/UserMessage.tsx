import "./UserMessage.scss";

interface UserMessageProps {
    content: string;
    timestamp?: string;
    style?: React.CSSProperties;
}

export default function UserMessage({ content, timestamp, style }: UserMessageProps) {
    return (
        <div className="user-message" style={{ marginRight: '40px', ...style }}>
            <div className="message-content">
                {content}
            </div>
            {timestamp && (
                <div className="message-timestamp">
                    {timestamp}
                </div>
            )}
        </div>
    );
}
