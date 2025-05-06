import db from "@/lib/db";

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
                        padding: "0 20px", 
                    }}
                >
                    <div style={{ display: "flex", gap: "10px" }}>
                        <div
                            style={{
                                width: "43px",
                                height: "42px",
                                backgroundColor: "#fff",
                                borderRadius: "50%",
                            }}
                        ></div>
                        <div
                            style={{
                                width: "43px",
                                height: "42px",
                                backgroundColor: "#fff",
                                borderRadius: "50%", 
                            }}
                        ></div>
                    </div>
                </div>

                <div 
                    style={{
                        width: "100%",
                        height: "118px",
                        backgroundColor: "#FFD7D7",
                    }}
                >
                </div>

            </div>
        </>
    );
};




