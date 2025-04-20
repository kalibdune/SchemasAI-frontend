import FormSignUp from "../../components/FormSignUp/FormSignUp.tsx";

export default function SignUp() {
    return (
        <div>
            <div className="bg-black flex flex-col m-5 rounded-[20px] gap-8 max-w-[420px]" style={{padding: "40px"}}>
                <div className="flex flex-col gap-3">
                    <h2 className="text-4xl">Регистрация</h2>
                    <p>
                        Для использования нашего сервиса вам необходимо пройти регистрацию
                    </p>
                </div>
                <FormSignUp/>
            </div>
        </div>
    );
}