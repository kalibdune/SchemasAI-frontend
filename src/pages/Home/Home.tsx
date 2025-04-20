import {Link} from "react-router-dom";


export default function Home() {
    return (
        // <div className="flex flex-col m-w-[550] bg-black rounded-[20px] pt-">
        //     <nav>
        //         <ul className="flex flex-row justify-around">
        //             <li>
        //                 <Link to={`/signup`}>Регистрация</Link>
        //             </li>
        //             <li>
        //                 <Link to={`/login`}>Вход</Link>
        //             </li>
        //         </ul>
        //     </nav>
        //     <Outlet/>
        // </div>
        <>
            <Link to={'/chat'}>Чат</Link>
        </>
    )
}