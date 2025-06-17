import db from "@/lib/db";
import Instagram from './instagram.js';
import Whatsapp from './whatsapp.js';
import logo from './imagem/logo.png';
import Image from "next/image.js";

export default async () => {
    const usuario = await db.query("SELECT * FROM usuario");
    console.log(usuario);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* BARRA 1 */}
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
                    <div style={{ gap: "20px", display: "flex" }}>
                        <Instagram />
                        <Whatsapp />
                    </div>
                </div>

                {/* BARRA 2 */}
                <div
                    style={{
                        width: "100%",
                        height: "118px",
                        backgroundColor: "#FFD7D7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 20px",
                    }}
                >
                    <Image
                        src={logo}
                        width={211}
                        height={215}
                        alt="Logo da Loja"
                    />

                    <form method="post">
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            style={{
                                padding: "10px",
                                fontSize: "16px",
                                borderRadius: "70px",
                                border: "1px solid #ccc",
                                width: "517px"
                            }}
                        />
                    </form>
                </div>

                {/* BARRA 3 */}
                <div
                    style={{
                        width: "100%",
                        height: "296px",
                        backgroundColor: "#FFD7D7",
                    }}
                />

                {/* 6 Bolas Abaixo da Barra 3 */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between", // Espaçamento entre as bolas
                        gap: "10px", // Controle o espaçamento entre as bolas
                        padding: "50px", // Espacamento em torno das bolas
                    }}
                >
                    {/* Bola 1 */}
                    <div
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            backgroundColor: "#FF4791",
                        }}
                    ></div>

                    {/* Bola 2 */}
                    <div
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            backgroundColor: "#FF4791",
                        }}
                    ></div>

                    {/* Bola 3 */}
                    <div
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            backgroundColor: "#FF4791",
                        }}
                    ></div>

                    {/* Bola 4 */}
                    <div
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            backgroundColor: "#FF4791",
                        }}
                    ></div>

                    {/* Bola 5 */}
                    <div
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            backgroundColor: "#FF4791",
                        }}
                    ></div>

                    {/* Bola 6 */}
                    <div
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            backgroundColor: "#FF4791",
                        }}
                    ></div>
                </div>
            </div>
        </>
    );
};

