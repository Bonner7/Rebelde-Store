import db from "@/lib/db";
import Instagram from './instagram.js'
import Whatsapp from './whatsapp.js'

export default async () => {
    const usuario = await db.query("SELECT * FROM usuario");

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                <div
                    style={{                   //BARRA 1
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

                <div style={{ display: "flex", position: "center", flexDirection: "column", gap: "200px" }}>
                    <a href="tela-inicial"> Voltar </a>
                </div>
                    
</div>

        </>
    );
};