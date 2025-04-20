import { Button, Form, Input, type FormProps } from "antd";
import { useForm } from "antd/es/form/Form";
import FormStyle from "../FormStyles/FormStyle.tsx";
import { ApiService } from "../../utils/auth.ts";
import { useNavigate } from "react-router-dom";


const api = new ApiService();

type FieldType = {
    email: string;
    password: string;
};

export default function FormLogIn() {
    const [form] = useForm<FieldType>();
    const navigate = useNavigate();  // Хук для редиректа

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
        // 1. Выполняем вход и получаем пользователя
        const user = await api.login(values.email, values.password);
        console.log("Вход выполнен:", user);
        navigate('/');
    } catch (error) {
        console.error("Ошибка при входе:", error);
        // Здесь можно добавить отображение ошибки пользователю
        // Например, через message.error из antd
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
            </FormStyle>
        </div>
    );
}