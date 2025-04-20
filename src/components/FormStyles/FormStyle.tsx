import {ConfigProvider} from "antd";


export default function FormStyle({ children }: React.PropsWithChildren) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorText: "rgba(255,255,255,0.25)",
                    colorBgContainer: "#141414",
                    colorTextPlaceholder: "rgba(255,255,255,0.25)",
                    colorBorder: "#424242",
                    lineWidth: 1,
                    borderRadiusLG: 8,
                    colorPrimaryHover: "#424242"
                },
                components: {
                    Input: {
                        errorActiveShadow: "0 0 0 2px rgba(220, 68, 70, 0.2)",
                        hoverBorderColor: "#424242",
                    },
                    Button: {
                        colorPrimaryHover: "#2b83ff",
                    }
                }
            }}
        >
            {children}
        </ConfigProvider>
    )
}