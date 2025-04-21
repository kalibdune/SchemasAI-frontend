import { ConfigProvider, Input, Button } from "antd";
import './ChatInput.scss'
import { useState } from "react";

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
}

export default function ChatInput({ onSendMessage }: { onSendMessage: (message: Message) => void }) {
    const [inputValue, setInputValue] = useState('');

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            // Создаем объект сообщения
            const newMessage = {
                id: Date.now().toString(),
                text: inputValue,
                sender: 'user',
                timestamp: new Date().toISOString()
            };

            // Отправляем сообщение в родительский компонент
            onSendMessage(newMessage);

            // Очищаем поле ввода
            setInputValue('');
        }
    };

    // Обработка нажатия Enter для отправки
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

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
                        autoSize={{ maxRows: 8 }}
                        size="large"
                        placeholder="Введите запрос"
                        style={{
                            outline: 'none',
                            boxShadow: 'none',
                            resize: 'none'
                        }}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
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
                </ConfigProvider>
                <div className="container-buttons">

                    <ConfigProvider theme={{
                        token: {
                            colorText: "rgba(255,255,255,0.25)",
                            colorBgContainer: "#141414",
                            colorTextPlaceholder: "rgba(255,255,255,0.25)",
                            colorBorder: "#424242",
                        }
                    }}>
                        <Button
                            type="primary"
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon">
                                <path d="M16.1401 2.96004L7.11012 5.96004C1.04012 7.99004 1.04012 11.3 7.11012 13.32L9.79012 14.21L10.6801 16.89C12.7001 22.96 16.0201 22.96 18.0401 16.89L21.0501 7.87004C22.3901 3.82004 20.1901 1.61004 16.1401 2.96004ZM16.4601 8.34004L12.6601 12.16C12.5101 12.31 12.3201 12.38 12.1301 12.38C11.9401 12.38 11.7501 12.31 11.6001 12.16C11.3101 11.87 11.3101 11.39 11.6001 11.1L15.4001 7.28004C15.6901 6.99004 16.1701 6.99004 16.4601 7.28004C16.7501 7.57004 16.7501 8.05004 16.4601 8.34004Z" fill="#FFFFFF" />
                            </svg>
                        </Button>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    )
}