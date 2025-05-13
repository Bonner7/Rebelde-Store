export default function App() {
    return (
        <div
            style={{
                position: 'relative',     // <- ESSENCIAL para usar 'absolute' dentro
                width: '43px',
                height: '43px',         // altura do contêiner
            }}
        >
            <img
                src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000"
                style={{
                    position: 'absolute',  // <- permite posicionar manualmente
                    top: '1px',           // <- distância do topo
                    left: '1px',          // <- distância da esquerda
                    width: '42px',
                    height: '42px'
                }}
            />
        </div>
    );
}