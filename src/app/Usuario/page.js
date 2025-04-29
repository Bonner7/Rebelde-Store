import db from "@/lib/db"
export default async () => {
    const usuario = await db.query("select * from usuario")
 return (<>
    <h1>Lista de alunos</h1>
    <div>
      {
         usuario.rows.map( 
            a => (
               <div key={a.id}> 
                  {a.nome} é a(o) {a.cargo} do projeto
               </div>        
            ) 
         )
      }
   </div>
 </>);
}
    
