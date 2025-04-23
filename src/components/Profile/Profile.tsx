import {CloseOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {useState} from "react";
import {ApiService} from "../../utils/auth.ts";
import { User } from "../../types/types.ts";


const api = new ApiService();

export default function Profile({ user, onLogout }: {
    user: User | null,
    onLogout: () => void
}) {
    const [profile, setProfile] = useState<boolean>(false);

    return (
        <div>
            {profile ? (
                <div style={{ display: "flex", flexDirection: "column", minWidth: "200px", alignItems: "center", position: "fixed", right: "32px", top: "32px", padding: "20px", backgroundColor: "#141414", borderRadius: "20px" }}>
                    <CloseOutlined style={{position: "relative", right: "-70px"}} onClick={() => setProfile(false)}/>
                    <div style={{ display: "flex", flexDirection: "column", borderBottom: "1px solid #fff", alignItems: "center" }}>
                        <div style={{ backgroundColor: "rgba(255,255,255,0.25)", border: "1px solid white", borderRadius: "50%", padding: "8px", cursor: "pointer", zIndex: 3 }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z" fill="white"/>
                                <path d="M17.0809 14.15C14.2909 12.29 9.74094 12.29 6.93094 14.15C5.66094 15 4.96094 16.15 4.96094 17.38C4.96094 18.61 5.66094 19.75 6.92094 20.59C8.32094 21.53 10.1609 22 12.0009 22C13.8409 22 15.6809 21.53 17.0809 20.59C18.3409 19.74 19.0409 18.6 19.0409 17.36C19.0309 16.13 18.3409 14.99 17.0809 14.15Z" fill="white"/>
                            </svg>
                        </div>
                        <h2 style={{ fontSize: "1rem", lineHeight: "24px", paddingTop: "10px" }}>{user?.name}</h2>
                        <p style={{ fontSize: "0.75rem", lineHeight: "20px", paddingBottom: "10px" }}>{user?.email}</p>
                    </div>
                    <Link to={"/login"}><div className="flex items-center cursor-pointer" style={{paddingTop: "10px"}} onClick={async () => {
                        try {
                            await api.logout();
                            onLogout();
                        } catch (error) {
                            console.error('Logout failed:', error);
                        }
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3C12.2549 3.00028 12.5 3.09788 12.6854 3.27285C12.8707 3.44782 12.9822 3.68695 12.9972 3.94139C13.0121 4.19584 12.9293 4.44638 12.7657 4.64183C12.6021 4.83729 12.3701 4.9629 12.117 4.993L12 5H7C6.75507 5.00003 6.51866 5.08996 6.33563 5.25272C6.15259 5.41547 6.03566 5.63975 6.007 5.883L6 6V18C6.00003 18.2449 6.08996 18.4813 6.25272 18.6644C6.41547 18.8474 6.63975 18.9643 6.883 18.993L7 19H11.5C11.7549 19.0003 12 19.0979 12.1854 19.2728C12.3707 19.4478 12.4822 19.687 12.4972 19.9414C12.5121 20.1958 12.4293 20.4464 12.2657 20.6418C12.1021 20.8373 11.8701 20.9629 11.617 20.993L11.5 21H7C6.23479 21 5.49849 20.7077 4.94174 20.1827C4.38499 19.6578 4.04989 18.9399 4.005 18.176L4 18V6C3.99996 5.23479 4.29233 4.49849 4.81728 3.94174C5.34224 3.38499 6.06011 3.04989 6.824 3.005L7 3H12ZM17.707 8.464L20.535 11.293C20.7225 11.4805 20.8278 11.7348 20.8278 12C20.8278 12.2652 20.7225 12.5195 20.535 12.707L17.707 15.536C17.5194 15.7235 17.2649 15.8288 16.9996 15.8287C16.7344 15.8286 16.48 15.7231 16.2925 15.5355C16.105 15.3479 15.9997 15.0934 15.9998 14.8281C15.9999 14.5629 16.1054 14.3085 16.293 14.121L17.414 13H12C11.7348 13 11.4804 12.8946 11.2929 12.7071C11.1054 12.5196 11 12.2652 11 12C11 11.7348 11.1054 11.4804 11.2929 11.2929C11.4804 11.1054 11.7348 11 12 11H17.414L16.293 9.879C16.1054 9.69149 15.9999 9.43712 15.9998 9.17185C15.9997 8.90658 16.105 8.65214 16.2925 8.4645C16.48 8.27686 16.7344 8.17139 16.9996 8.1713C17.2649 8.1712 17.5194 8.27649 17.707 8.464Z" fill="#FF4B4B"/>
                        </svg>
                        <span style={{ color: "#FF4B4B"}}>Выход</span>
                    </div>
                    </Link>
                </div>
            ) : (
                <div style={{ backgroundColor: "rgba(255,255,255,0.25)", border: "1px solid white", borderRadius: "50%", padding: "8px", cursor: "pointer", zIndex: 3 }} className="fixed top-1/32 right-1/32" onClick={() => setProfile(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z" fill="white"/>
                        <path d="M17.0809 14.15C14.2909 12.29 9.74094 12.29 6.93094 14.15C5.66094 15 4.96094 16.15 4.96094 17.38C4.96094 18.61 5.66094 19.75 6.92094 20.59C8.32094 21.53 10.1609 22 12.0009 22C13.8409 22 15.6809 21.53 17.0809 20.59C18.3409 19.74 19.0409 18.6 19.0409 17.36C19.0309 16.13 18.3409 14.99 17.0809 14.15Z" fill="white"/>
                    </svg>
                </div>
            )}
        </div>
    )
}