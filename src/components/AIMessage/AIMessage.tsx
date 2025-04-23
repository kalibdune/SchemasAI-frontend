import ReactMarkdown from "react-markdown";
// @ts-expect-error: no types for style module
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-expect-error: no types for style module
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./AIMessage.scss";

interface AIMessageProps {
    content: string;
}

function CodeBlock({ className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "");
    const codeString = String(children).replace(/\n$/, "");
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    return !match ? (
        <code className={className} {...props}>
            {children}
        </code>
    ) : (
        <div className="code-block-wrapper">
            <button
                className="copy-button"
                onClick={handleCopy}
                aria-label="Скопировать код"
            >
                <CopyOutlined />
                {copied && <span className="copied-label">Скопировано!</span>}
            </button>
            <SyntaxHighlighter
                style={dracula}
                language={match[1]}
                PreTag="div"
                {...props}
            >
                {codeString}
            </SyntaxHighlighter>
        </div>
    );
}

export default function AIMessage({ content }: AIMessageProps) {
    return (
        <div className="ai-message" style={{ marginLeft: "40px" }}>
            <ReactMarkdown
                components={{
                    code: CodeBlock,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
