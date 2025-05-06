import db from "@/lib/db";

export default async () => {
    const usuario = await db.query("select * from usuario");

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Barra 1 */}
                <div style={{ width: "100%", height: "50px", backgroundColor: "#3498db" }}>
                    Barra 1
                </div>

                {/* Barra 2 */}
                <div style={{ width: "100%", height: "50px", backgroundColor: "#e74c3c" }}>
                    Barra 2
                </div>
            </div>
        </>
    );
};

    
