import {Input, Button, ConfigProvider} from "antd";
import {z} from "zod";
import {useState} from "react";
import {ApiService} from "../../utils/auth.ts";

const api = new ApiService();

const formLoginSchema = z
    .object({
        email: z.string().email("Некорректная почта"),
        password: z.string()
    })

export default function LogIn() {
    const [logData, setLogData] = useState({
        email: "",
        password: "",
    })

    const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLogData({...logData, [name]: value});
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = formLoginSchema.safeParse(logData);

        if (!result.success) {
            console.log("Validation error", result.error.format());
            return;
        }

        try {
            const user = await api.login(logData.email, logData.password);
            console.log("Вход выполнен:", user);
        } catch (error) {
            console.error("Ошибка входа:", error);
        }
    };

    return (
        <div>
            <div>
                <h1>Вход</h1>
            </div>
            <div>
                <form id="logInForm" onSubmit={handleSubmit} noValidate>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorText: "rgba(255,255,255,0.25)",
                                colorBgContainer: "#141414",
                                colorTextPlaceholder: "rgba(255,255,255,0.25)",
                                colorBorder: "#424242",
                                lineWidth: 1,
                                borderRadiusLG: 8,
                            }
                        }}
                    >
                        <div className="flex flex-col gap-2">
                            <Input name="email" type="email" placeholder="Почта" value={logData.email} onChange={handleClick} required/>
                            <Input name="password" type="password" placeholder="Пароль" value={logData.password} onChange={handleClick} required/>
                        </div>
                    </ConfigProvider>
                </form>
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: "#00b96b",
                        }
                    }}
                >
                    <Button htmlType="submit" form="logInForm" type="primary">Войти</Button>
                </ConfigProvider>
            </div>
        </div>
    )
}