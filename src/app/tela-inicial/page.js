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
                        justifyContent: "space-between", 
                        gap: "20px", 
                        padding: "20px", 
                    }}
                >
                    {/* Bola 1 */}
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                backgroundColor: "#FF4791",
                                marginBottom: "10px", 
                            }}
                        ></div>
                        <p>Cosméticos</p>
                    </div>

                    {/* Bola 2 */}
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                backgroundColor: "#FF4791",
                                marginBottom: "10px", 
                            }}
                        ></div>
                        <p>Blusas</p>
                    </div>

                    {/* Bola 3 */}
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                backgroundColor: "#FF4791",
                                marginBottom: "10px", 
                            }}
                        ></div>
                        <p>Calças</p>
                    </div>

                    {/* Bola 4 */}
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                backgroundColor: "#FF4791",
                                marginBottom: "10px", 
                            }}
                        ></div>
                        <p>Saias</p>
                    </div>

                    {/* Bola 5 */}
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                backgroundColor: "#FF4791",
                                marginBottom: "10px", 
                            }}
                        ></div>
                        <p>Vestidos</p>
                    </div>

                    {/* Bola 6 */}
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                backgroundColor: "#FF4791",
                                marginBottom: "10px", 
                            }}
                        ></div>
                        <p>Short</p>
                    </div>
                </div>

                {/* Texto "LANÇAMENTO" com Linha Abaixo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between", 
                        width: "100%",
                        padding: "20px",
                    }}
                >
                    {/* LANÇAMENTO */}
                    <h2
                        style={{
                            fontFamily: "Lalezar, regular", 
                            fontSize: "36px",
                            margin: "0", 
                        }}
                    >
                        LANÇAMENTO
                    </h2>

                    {/* Linha */}
                    <div
                        style={{
                            height: "2px", 
                            backgroundColor: "black", 
                            width: "80%", 
                            marginLeft: "20px", 
                        }}
                    />
                </div>

                {/* Espaço Abaixo do Texto e Linha */}
                <div style={{ padding: "20px 0" }} />

                {/* 5 Quadrados com borda preta */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between", 
                        gap: "20px",
                        padding: "0 20px", 
                    }}
                >
                    {/* Quadrado 1 */}
                    <div
                        style={{
                            width: "200px",
                            height: "266px",
                            border: "2px solid black", 
                            backgroundColor: "transparent", 
                        }}
                    ></div>

                    {/* Quadrado 2 */}
                    <div
                        style={{
                            width: "200px",
                            height: "266px",
                            border: "2px solid black", 
                            backgroundColor: "transparent",
                        }}
                    ></div>

                    {/* Quadrado 3 */}
                    <div
                        style={{
                            width: "200px",
                            height: "266px",
                            border: "2px solid black",
                            backgroundColor: "transparent", 
                        }}
                    ></div>

                    {/* Quadrado 4 */}
                    <div
                        style={{
                            width: "200px",
                            height: "266px",
                            border: "2px solid black", 
                            backgroundColor: "transparent", 
                        }}
                    ></div>

                    {/* Quadrado 5 */}
                    <div
                        style={{
                            width: "200px",
                            height: "266px",
                            border: "2px solid black", 
                            backgroundColor: "transparent", 
                        }}
                    ></div>
                </div>
            </div>
        </>
    );
};