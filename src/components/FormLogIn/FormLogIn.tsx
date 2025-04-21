import { Button, Form, Input, type FormProps } from "antd";
import { useForm } from "antd/es/form/Form";
import FormStyle from "../FormStyles/FormStyle.tsx";
import { ApiService } from "../../utils/auth.ts";
import { Link, useNavigate } from "react-router-dom";
import StorageService from "../../utils/storage.ts";



const api = new ApiService();

type FieldType = {
    email: string;
    password: string;
};

export default function FormLogIn() {
    const [form] = useForm<FieldType>();
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        const storage = new StorageService()
        try {
            await api.login(values.email, values.password).
                then((user) => {
                    storage.setItem("user", user)
                    storage.setItem('isLogged', true)
                    navigate("/chat");
                    console.log("Вход выполнен:", user);
                }).
                catch((error) => {
                    form.setFields([
                        {
                            name: "password",
                            errors: ["Неверные учетные данные"]
                        }
                    ]);
                    console.error("Ошибка входа:", error);
                });
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    return (
        <div>
            <FormStyle>
                <Form
                    form={form}
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    requiredMark={false}
                    className="flex flex-col min-w-[280px]"
                >
                    <Form.Item<FieldType>
                        name="email"
                        rules={[
                            { required: true, message: "Пожалуйста, введите вашу почту" },
                            { type: "email", message: "Некорректный формат почты" }
                        ]}
                    >
                        <Input placeholder="Почта" size="large" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="password"
                        rules={[
                            { required: true, message: "Пожалуйста, введите пароль" },
                            { min: 6, message: "Пароль должен быть не менее 6 символов" }
                        ]}
                    >
                        <Input.Password size="large" placeholder="Пароль" />
                    </Form.Item>
                </Form>
                <Button
                    type="primary"
                    htmlType="submit"
                    form="login"
                    block
                >
                    Войти
                </Button>
                <div className="mt-4 text-center">
                    <Link to="/signup">
                        Нет аккаунта? <span className="text-primary">Зарегистрироваться</span>
                    </Link>
                </div>
            </FormStyle>
        </div>
    );
}