import "./SideBar.scss";
import { useState } from "react";
import SideBarHistory from "../SideBarHistory/SideBarHistory.tsx";
import { useNavigate } from "react-router-dom";

export default function SideBar() {
    const [active, setActive] = useState<boolean>(false);
    const navigate = useNavigate();

    function toggleActive() {
        setActive(!active);
    }

    async function handleNewChat() {
        try {
            const response = await fetch("/api/chat/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: "Новый чат" })
            });

            if (!response.ok) {
                throw new Error("Ошибка при создании чата");
            }

            const chatId = await response.json(); // потому что ответ — строка
            navigate(`/chat?chatId=${chatId}`);
        } catch (error) {
            console.error("Ошибка создания чата:", error);
        }
    }
    return (
        <div className={active ? "active-sidebar" : "inactive"}>
            <div className="sidebar-item-top-container">
                <div className="sidebar-item-top" onClick={handleNewChat}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar-icon">
                        <path
                            d="M16 2H8C4 2 2 4 2 8V21C2 21.55 2.45 22 3 22H16C20 22 22 20 22 16V8C22 4 20 2 16 2ZM15.5 12.75H12.75V15.5C12.75 15.91 12.41 16.25 12 16.25C11.59 16.25 11.25 15.91 11.25 15.5V12.75H8.5C8.09 12.75 7.75 12.41 7.75 12C7.75 11.59 8.09 11.25 8.5 11.25H11.25V8.5C11.25 8.09 11.59 7.75 12 7.75C12.41 7.75 12.75 8.09 12.75 8.5V11.25H15.5C15.91 11.25 16.25 11.59 16.25 12C16.25 12.41 15.91 12.75 15.5 12.75Z"
                            fill="white"
                            fillOpacity="1"
                        />
                    </svg>
                    {active && (<span>Новый чат</span>)}
                </div>
                <div className="sidebar-item-top">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar-icon">
                        <path
                            d="M18 11C18 11.9193 17.8189 12.8295 17.4672 13.6788C17.1154 14.5281 16.5998 15.2997 15.9497 15.9497C15.2997 16.5998 14.5281 17.1154 13.6788 17.4672C12.8295 17.8189 11.9193 18 11 18C10.0807 18 9.17049 17.8189 8.32122 17.4672C7.47194 17.1154 6.70026 16.5998 6.05025 15.9497C5.40024 15.2997 4.88463 14.5281 4.53284 13.6788C4.18106 12.8295 4 11.9193 4 11C4 9.14348 4.7375 7.36301 6.05025 6.05025C7.36301 4.7375 9.14348 4 11 4C12.8565 4 14.637 4.7375 15.9497 6.05025C17.2625 7.36301 18 9.14348 18 11Z"
                            fill="white"
                            fillOpacity="1"
                        />
                        <path
                            d="M20 20L18 18L20 20Z"
                            fill="white"
                            fillOpacity="1"
                        />
                        <path
                            d="M20 20L18 18"
                            stroke="white"
                            strokeOpacity="0.45"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                    {active && (<span>Поиск</span>)}
                </div>
            </div>
            {active && <SideBarHistory/>}
            <div>
                <div className={`sidebar-item ${active ? "active-icon" : ""}`} onClick={toggleActive}>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="sidebar-icon"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.416 3C5.2448 3 4.12158 3.46526 3.29342 4.29342C2.46526 5.12158 2 6.2448 2 7.416V16.249C1.99987 16.829 2.114 17.4033 2.33586 17.9392C2.55773 18.4751 2.88299 18.9621 3.29306 19.3722C3.70314 19.7824 4.19 20.1078 4.72584 20.3298C5.26168 20.5517 5.836 20.666 6.416 20.666H17.584C18.1641 20.666 18.7385 20.5517 19.2744 20.3297C19.8103 20.1076 20.2972 19.7822 20.7073 19.3719C21.1174 18.9616 21.4426 18.4745 21.6644 17.9385C21.8862 17.4025 22.0003 16.8281 22 16.248V7.416C22 6.2448 21.5347 5.12158 20.7066 4.29342C19.8784 3.46526 18.7552 3 17.584 3H6.416ZM9.644 4.767V18.899H17.584C18.2868 18.899 18.9609 18.6198 19.4578 18.1228C19.9548 17.6259 20.234 16.9518 20.234 16.249V7.416C20.234 6.71318 19.9548 6.03914 19.4578 5.54217C18.9609 5.0452 18.2868 4.766 17.584 4.766H9.644V4.767Z"
                            fill="white"
                            fillOpacity="1"
                        />
                    </svg>
                    {active && (<span>Свернуть</span>)}
                </div>
            </div>
        </div>
    )
}