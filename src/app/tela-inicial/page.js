import db from "@/lib/db";
import Instagram from './instagram.js'
import Whatsapp from './whatsapp.js'
import Logo from './logo.js'

export default async () => {
    const usuario = await db.query("SELECT * FROM usuario");

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                <div
                    style={{
                        width: "100%",
                        height: "84px",
                        backgroundColor: "#FF4791",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "20px", 
                    }}
                >
                    <div 
                        style={{
                            gap: "20px",
                            display: "flex" 
                        }}
                    >
                         <Instagram />
                         <Whatsapp />

                    </div>
                </div>

                <div 
                    style={{
                        width: "100%",
                        height: "118px",
                        backgroundColor: "#FFD7D7",
                    }}
                >
                    <Logo />

                </div>

                <div
             style={{
                        width: "1583%",
                        height: "296px",
                        backgroundColor: "#FFD7D7",
                    }}
                />
            </div>
        </>
    );
};
