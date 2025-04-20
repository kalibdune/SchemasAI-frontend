import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./AIMessage.scss";

interface AIMessageProps {
    content: string;
}

export default function AIMessage({ content }: AIMessageProps) {
    return (
        <div className="ai-message" style={{marginLeft:'40px'}}>
            <ReactMarkdown
                components={{
                    code({ node, inline, className, children, ...props }) {
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

                        return !inline && match ? (
                            <div className="code-block-wrapper">
                                <button className="copy-button" onClick={handleCopy}>
                                    <CopyOutlined />
                                    {copied && <span className="copied-label">Скопировано!</span>}
                                </button>
                                <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {codeString}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
