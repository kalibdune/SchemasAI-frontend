import { Button, Form, Input, type FormProps } from "antd";
import { useForm } from "antd/es/form/Form";
import { ApiService } from "../../utils/auth.ts";
import { Link } from "react-router-dom";
import FormStyle from "../FormStyles/FormStyle.tsx";

const api = new ApiService();

type FieldType = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function FormSignUp() {
    const [form] = useForm<FieldType>();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        const { confirmPassword, ...dataToSubmit } = values;
        try {
            const response = await api.createUser(dataToSubmit);
            console.log("Пользователь создан:", response);
        } catch (error) {
            console.error("Ошибка создания:", error);
        }
    };

    return (
        <div className="bg-black">
            <FormStyle>
                <Form
                    form={form}
                    name="form-registration"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    requiredMark={false}
                    className="flex flex-col"
                >
                    <Form.Item<FieldType>
                        name="name"
                        rules={[
                            { required: true, message: "Введите имя" },
                            { min: 3, message: "Минимум 3 символа" },
                            { max: 20, message: "Максимум 20 символов" },
                        ]}
                    >
                        <Input size="large" placeholder="Логин" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="email"
                        rules={[
                            { required: true, message: "Введите почту" },
                            { type: "email", message: "Некорректный формат почты" },
                        ]}
                    >
                        <Input size="large" placeholder="Почта" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="password"
                        rules={[
                            { required: true, message: "Введите пароль" },
                            { min: 6, message: "Пароль должен быть не менее 6 символов" },
                        ]}
                    >
                        <Input.Password size="large" placeholder="Пароль" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="confirmPassword"
                        dependencies={["password"]}
                        rules={[
                            { required: true, message: "Повторите пароль" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Пароли не совпадают"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password size="large" placeholder="Повторите пароль" />
                    </Form.Item>
                </Form>

                <div className="flex justify-end">
                    <Button size="small" type="link">
                        <Link to="/login">Уже есть аккаунт? Войти</Link>
                    </Button>
                </div>

                <Button
                    type="primary"
                    htmlType="submit"
                    form="form-registration"
                    className="flex items-center"
                    block
                >
                    Зарегистрироваться
                </Button>
            </FormStyle>
        </div>
    );
}
