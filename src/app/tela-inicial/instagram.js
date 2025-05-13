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
                src="https://img.icons8.com/?size=100&id=BrU2BBoRXiWq&format=png&color=000000"
                style={{
                    position: 'absolute',  // <- permite posicionar manualmente
                    top: '1px',           // <- distância do topo
                    left: '127px',          // <- distância da esquerda
                    width: '42px',
                    height: '42px'
                }}
            />
        </div>
    );
}

