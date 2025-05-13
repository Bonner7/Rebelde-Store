import db from "@/lib/db";
import Whatsapp from './whatsapp.js'
import Instagram from './instagram.js'

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
                            display: "flex", 
                            gap: "20px", 
                            justifyContent: "flex-start", 
                            marginLeft: "50px", 
                        }}
                    >

                         <Instagram />
                         
                        <div
                            style={{
                                width: "43px",
                                height: "42px",
                                backgroundColor: "#fff",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Whatsapp />
                           

                        </div>

                        <div
                            style={{
                                width: "43px",
                                height: "42px",
                                backgroundColor: "#fff",
                                borderRadius: "50%",
                            }}
                        />
                    </div>
                </div>

                <div 
                    style={{
                        width: "100%",
                        height: "118px",
                        backgroundColor: "#FFD7D7",
                    }}
                />
            </div>
        </>
    );
};
