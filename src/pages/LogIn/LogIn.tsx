import FormLogIn from "../../components/FormLogIn/FormLogIn.tsx";

export default function LogIn() {

    return (
        <div className="bg-black flex flex-col rounded-[20px] gap-8 max-w-[420px]" style={{padding: "40px"}}>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                    <h2 className="text-4xl">Вход</h2>
                    <p>Для использования нашего сервиса вам необходимо авторизоваться</p>
                </div>
                <FormLogIn/>
            </div>
        </div>
    )
}