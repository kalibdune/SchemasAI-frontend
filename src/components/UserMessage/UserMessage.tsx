import "./UserMessage.scss"


interface UserMessageProps {
    content: string;
}

export default function UserMessage({ content }: UserMessageProps) {
    return (
        <div className="user-message" style={{marginRight:'40px'}}>
            {content}
        </div>
    );
}
