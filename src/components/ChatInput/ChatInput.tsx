import { ConfigProvider, Input, Button } from "antd";
import './ChatInput.scss';
import { useState } from "react";
import { SendOutlined } from "@ant-design/icons";

interface ChatInputProps {
    onSendMessage: (message: { text: string }) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSendMessage = () => {
        if (inputValue.trim() && !isSubmitting) {
            setIsSubmitting(true);

            // Отправляем сообщение
            onSendMessage({ text: inputValue.trim() });

            // Очищаем поле ввода и снимаем флаг отправки
            setInputValue('');
            setIsSubmitting(false);
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
            <ConfigProvider
                theme={{
                    components: {
                        Input: {
                            activeBorderColor: 'rgba(5, 5, 5, 0.06)',
                            hoverBorderColor: 'rgba(5, 5, 5, 0.06)',
                        },
                    },
                }}
            >
                <Input.TextArea
                    className="chat-input__textarea"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Напишите сообщение..."
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    bordered={false}
                />
            </ConfigProvider>

            <Button
                type="primary"
                shape="circle"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                className="chat-input__send-button"
                disabled={!inputValue.trim() || isSubmitting}
            />
        </div>
    );
}