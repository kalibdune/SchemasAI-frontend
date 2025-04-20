import {ConfigProvider, Input, Button} from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import './ChatInput.scss'
import { useRef, useState } from 'react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите сообщение..."
            />
            <button type="submit">Отправить</button>
        </form>
    );
}

    return (
        <div className="chat-input">
            <div>
                <ConfigProvider
                    theme={{
                        token: {
                            colorText: "rgba(255,255,255,0.85)",
                            colorBgContainer: "#141414",
                            colorTextPlaceholder: "rgba(255,255,255,0.25)",
                            colorBorder: "#424242",
                        },
                        components: {
                            Input: {
                                hoverBorderColor: "#424242",
                                activeBorderColor: "#424242",
                                activeShadow: "none",
                                hoverBg: "#141414",
                                activeBg: "#141414",
                                colorBgContainerDisabled: "#141414",
                                lineWidth: 0,
                                colorError: "#424242",
                                warningActiveShadow: "none",
                                errorActiveShadow: "none"
                            }
                        }
                    }}
                >
                    <Input.TextArea
                        autoSize={{maxRows: 8}}
                        size="large"
                        placeholder="Введите запрос"
                        style={{
                            outline: 'none',
                            boxShadow: 'none',
                            resize: 'none'
                        }}
                    />
                </ConfigProvider>
            </div>
            <div className="container-click">
                    <ConfigProvider theme={{
                        token: {
                            colorText: "rgba(255,255,255,0.25)",
                            colorBgContainer: "#141414",
                            colorTextPlaceholder: "rgba(255,255,255,0.25)",
                            colorBorder: "#424242",
                        }

                    }}>
                        <Button type="dashed">
                            <div className="flex justify-center content-center gap-2">
                                <PlusOutlined />
                                <span>Добавить Cubes</span>
                            </div>
                        </Button>
                    </ConfigProvider>
                <div className="container-buttons">
                    {file && (
                        <div className="file-preview">
                            <Button
                                type="text"
                                icon={<CloseOutlined />}
                                onClick={handleRemoveFile}
                                style={{ color: 'rgba(255,255,255,0.25)' }}
                                aria-label="Удалить файл"
                            />
                            <span style={{maxWidth: "100px", fontSize: "0.9rem"}}>{file.name}</span>
                        </div>
                    )}
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />

                        <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon"
                                onClick={handleIconClick}
                            >
                                <path
                                    d="M10.1147 4.66661L5.72405 9.05728C5.59671 9.18028 5.49513 9.3274 5.42525 9.49007C5.35537 9.65275 5.31859 9.82771 5.31705 10.0047C5.31551 10.1818 5.34925 10.3574 5.41629 10.5212C5.48333 10.6851 5.58234 10.8339 5.70753 10.9591C5.83272 11.0843 5.98159 11.1833 6.14545 11.2504C6.30931 11.3174 6.48488 11.3512 6.66192 11.3496C6.83896 11.3481 7.01392 11.3113 7.17659 11.2414C7.33926 11.1715 7.48639 11.07 7.60939 10.9426L11.8854 6.55195C12.3711 6.04901 12.6399 5.3754 12.6339 4.67621C12.6278 3.97702 12.3473 3.30819 11.8529 2.81376C11.3585 2.31934 10.6896 2.03889 9.99046 2.03282C9.29127 2.02674 8.61766 2.29552 8.11472 2.78128L3.83805 7.17128C3.08784 7.92149 2.66638 8.93899 2.66638 9.99995C2.66638 11.0609 3.08784 12.0784 3.83805 12.8286C4.58826 13.5788 5.60576 14.0003 6.66672 14.0003C7.72768 14.0003 8.74518 13.5788 9.49539 12.8286L13.6667 8.66661"
                                    stroke="white"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </label>
                    </div>

                    <ConfigProvider theme={{
                        token: {
                            colorText: "rgba(255,255,255,0.25)",
                            colorBgContainer: "#141414",
                            colorTextPlaceholder: "rgba(255,255,255,0.25)",
                            colorBorder: "#424242",
                        }
                    }}>
                        <Button type="primary">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon">
                                <path d="M16.1401 2.96004L7.11012 5.96004C1.04012 7.99004 1.04012 11.3 7.11012 13.32L9.79012 14.21L10.6801 16.89C12.7001 22.96 16.0201 22.96 18.0401 16.89L21.0501 7.87004C22.3901 3.82004 20.1901 1.61004 16.1401 2.96004ZM16.4601 8.34004L12.6601 12.16C12.5101 12.31 12.3201 12.38 12.1301 12.38C11.9401 12.38 11.7501 12.31 11.6001 12.16C11.3101 11.87 11.3101 11.39 11.6001 11.1L15.4001 7.28004C15.6901 6.99004 16.1701 6.99004 16.4601 7.28004C16.7501 7.57004 16.7501 8.05004 16.4601 8.34004Z" fill="#FFFFFF"/>
                            </svg>
                        </Button>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    )
}