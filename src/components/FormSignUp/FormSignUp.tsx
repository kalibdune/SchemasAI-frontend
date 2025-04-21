import { Button, Form, Input, type FormProps, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { ApiService } from "../../utils/auth.ts";
import { Link, useNavigate } from "react-router-dom";
import FormStyle from "../FormStyles/FormStyle.tsx";
import { UserCreateRequest } from "../../types/authTypes.ts";
import StorageService from "../../utils/storage.ts";

const api = new ApiService();

type FieldType = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function FormSignUp() {
    const [form] = useForm<FieldType>();
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        const { confirmPassword, ...dataToSubmit } = values;
        const storage = new StorageService()
        const payload: UserCreateRequest = {
            "email": dataToSubmit.email,
            "name": dataToSubmit.name,
            "password": dataToSubmit.password
        }

        if (values.password !== values.confirmPassword) {
            message.error("Пароли не совпадают")
            form.setFields([{
                name: 'email',
                errors: ["Пароли не совпадают"]
            }]);
            return
        }

        await api.createUser(payload)
            .then((user) => {
                message.success("Регистрация прошла успешно!");
                storage.setItem("user", user)
                storage.setItem('isLogged', true)
                navigate("/chat");
            })
            .catch((error) => {
                console.error(error)
            })
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
                        label="Имя"
                        rules={[
                            { required: true, message: "Введите имя" },
                            { min: 3, message: "Минимум 3 символа" },
                            { max: 20, message: "Максимум 20 символов" },
                        ]}
                    >
                        <Input size="large" placeholder="Ваше имя" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="email"
                        label="Почта"
                        rules={[
                            { required: true, message: "Введите почту" },
                            { type: "email", message: "Некорректный формат" },
                        ]}
                    >
                        <Input size="large" placeholder="example@mail.com" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        name="password"
                        label="Пароль"
                        rules={[
                            { required: true, message: "Введите пароль" },
                            { min: 6, message: "Минимум 6 символов" },
                        ]}
                    >
                        <Input.Password size="large" placeholder="••••••" />
                    </Form.Item>


                    <Form.Item<FieldType>
                        name="confirmPassword"
                        label="Подтверждение пароля"
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
                        <Input.Password size="large" placeholder="••••••" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                    >
                        Зарегистрироваться
                    </Button>

                    <div className="mt-4 text-center">
                        <Link to="/login">
                            Уже есть аккаунт? <span className="text-primary">Войти</span>
                        </Link>
                    </div>
                </Form>
            </FormStyle>
        </div>
    );
}
