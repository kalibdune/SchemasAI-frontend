import { useState } from "react";
import { z } from "zod";
import React from "react";
import {Input, Button} from "antd";
import "./SignUp.scss"
import {ApiService} from "../../utils/auth.ts";

const api = new ApiService();

const formSchema = z
    .object({
        name: z.string().min(3, {message: "Min length: 3 symbols"}).max(20, {message: "Maximum length: 20 symbols"}),
        email: z.string().email("Email is not correct"),
        password: z.string().min(6, {message: "Min length: 6 symbols"}),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export default function SignUp() {
    const [regData, setRegData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<
    z.ZodFormattedError<
        {
            name: string;
            email: string;
            password: string;
            confirmPassword: string;
            },
        string
        >
    >({ _errors: [] });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const result = formSchema.safeParse(regData);

        if (!result.success) {
            const errors = result.error.format();
            setErrors(errors);
        } else {
            const { confirmPassword, ...dataToSubmit } = regData;
            try {
                const response = await api.createUser(dataToSubmit);
                console.log(response);
            } catch (error) {
                console.error(error);
            }
        }
    }

    function handleClick(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setRegData(prev => ({ ...prev, [name]: value }));
    }

    return (
        <div>
            <div>
                <div>
                    <h2>Регистрация</h2>
                    <p>
                        Для использования нашего сервиса вам необходимо пройти регистрацию
                    </p>
                </div>
                <div>
                    <form id="form-registration" onSubmit={handleSubmit} noValidate>
                        <label>
                            <Input
                                placeholder="Логин"
                                type="text"
                                name="name"
                                value={regData.name}
                                onChange={handleClick}
                                required
                            />
                            {errors.name?._errors && (
                                <span>{errors.name._errors[0]}</span>
                            )}
                        </label>
                        <label>
                            <Input
                                placeholder="Почта"
                                type="email"
                                name="email"
                                value={regData.email}
                                onChange={handleClick}
                                required
                            />
                            {errors.email?._errors && (
                                <span>{errors.email._errors[0]}</span>
                            )}
                        </label>
                        <label>
                            <Input
                                placeholder="Пароль"
                                type="password"
                                name="password"
                                value={regData.password}
                                onChange={handleClick}
                                required
                            />
                            {errors.password?._errors && (
                                <span className="accent-red-500">{errors.password._errors[0]}</span>
                            )}
                        </label>
                        <label>
                            <Input
                                placeholder="Повторите пароль"
                                type="password"
                                name="confirmPassword"
                                value={regData.confirmPassword}
                                onChange={handleClick}
                                required
                            />
                            {errors.confirmPassword?._errors && (
                                <span>{errors.confirmPassword._errors[0]}</span>
                            )}
                        </label>
                    </form>
                    <div>
                        <Button size="small" type="link">
                            Уже есть аккаунт? Войти
                        </Button>
                    </div>
                    <Button htmlType="submit" form="form-registration" type="primary">
                        Зарегистрироваться
                    </Button>
                </div>
            </div>
        </div>
    );

}