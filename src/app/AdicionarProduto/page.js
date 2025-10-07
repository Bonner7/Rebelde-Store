"use client";

import seta from './imagem/seta.png';
import { useState, useEffect, useRef } from "react";
import Instagram from './instagram.js';
import Whatsapp from './whatsapp.js';
import Link from "next/link";
import Image from "next/image";

export default function AdicionarProduto() {
  const [titulo,setTitulo]=useState("");
  const [valor,setValor]=useState("");
  const [categoriaSelecionada,setCategoriaSelecionada]=useState("");
  const [novaCategoria,setNovaCategoria]=useState("");
  const [categorias,setCategorias]=useState([]);
  const [estoque,setEstoque]=useState("");
  const [descricao,setDescricao]=useState("");

  const [imagemPrincipal,setImagemPrincipal]=useState(null);
  const [imagemPrincipalBase64,setImagemPrincipalBase64]=useState(null);
  const [imagensExtras,setImagensExtras]=useState([null,null,null]);
  const [imagensExtrasBase64,setImagensExtrasBase64]=useState([null,null,null]);

  // Cores
  const coresMaisUsadas=["#FF0000","#00FF00","#0000FF","#FFFF00","#FFA500","#800080","#00FFFF","#FFC0CB","#A52A2A","#808080","#000000","#FFFFFF"];
  const [abrirPopoverCores,setAbrirPopoverCores]=useState(false);
  const [corSelecionada,setCorSelecionada]=useState("");
  const [codigoCor,setCodigoCor]=useState("");

  // Tamanhos
  const tamanhosDisponiveis=["PP","P","M","G","GG","36","38","40","42","44"];
  const [tamanhoSelecionado,setTamanhoSelecionado]=useState("");

  const refPopover=useRef();

  useEffect(()=>{
    // Buscar categorias
    const buscarCategorias=async()=>{
      const res=await fetch("/api/categorias");
      const data=await res.json();
      setCategorias(data);
    };
    buscarCategorias();

    // Fechar popover clicando fora
    const handleClickFora=(e)=>{
      if(refPopover.current && !refPopover.current.contains(e.target)){
        setAbrirPopoverCores(false);
      }
    };
    document.addEventListener("mousedown",handleClickFora);
    return ()=>document.removeEventListener("mousedown",handleClickFora);
  },[]);

  const converterBase64=(file)=>{
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onloadend=()=>resolve(reader.result);
      reader.onerror=reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImagemPrincipal=async(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    setImagemPrincipal(file);
    const base64=await converterBase64(file);
    setImagemPrincipalBase64(base64);
  };

  const handleImagemExtra=(index)=>(async(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    const novas=[...imagensExtras]; novas[index]=file; setImagensExtras(novas);
    const novasBase64=[...imagensExtrasBase64]; novasBase64[index]=await converterBase64(file); setImagensExtrasBase64(novasBase64);
  });

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const categoriaFinal=novaCategoria.trim()||categoriaSelecionada;
    if(!categoriaFinal){ alert("Selecione ou adicione uma categoria."); return; }

    try{
      if(novaCategoria.trim()){
        const resCategoria=await fetch("/api/categorias",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nome:novaCategoria.trim()})});
        if(!resCategoria.ok) throw new Error("Erro ao salvar nova categoria.");
      }

      const produto={
        titulo,valor,categoria:categoriaFinal,estoque,descricao,
        imagemPrincipalBase64,imagensExtrasBase64,
        cor:codigoCor, tamanho:tamanhoSelecionado
      };

      const response=await fetch("/api/produtos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(produto)});
      if(response.ok){
        alert("Produto adicionado com sucesso!");
        setTitulo(""); setValor(""); setCategoriaSelecionada(""); setNovaCategoria("");
        setEstoque(""); setDescricao(""); setImagemPrincipal(null); setImagemPrincipalBase64(null);
        setImagensExtras([null,null,null]); setImagensExtrasBase64([null,null,null]);
        setCorSelecionada(""); setCodigoCor(""); setAbrirPopoverCores(false);
        setTamanhoSelecionado("");
        window.location.href="/GerenciamentoEstoque";
      } else alert("Erro ao adicionar produto");
    }catch(err){ console.error(err); alert("Erro no envio"); }
  };

  const handleCancelar=()=>{ window.location.href="/GerenciamentoEstoque"; };

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      {/* Barra superior */}
      <div style={{width:"100%",height:"84px",backgroundColor:"#FF4791",display:"flex",alignItems:"center",paddingLeft:"20px"}}>
        <Instagram/><Whatsapp/>
      </div>

      {/* Botão Voltar */}
      <div style={{marginRight:"94%",marginTop:"1%",display:"flex",alignItems:"center",gap:10}}>
        <Link href="/GerenciamentoEstoque" style={{display:"flex",alignItems:"center",textDecoration:"none"}}>
          <Image src={seta} alt="Voltar" style={{cursor:"pointer"}}/>
          <span style={{fontSize:20,fontFamily:"Roboto, sans-serif",color:"#000",fontWeight:"bold"}}>VOLTAR</span>
        </Link>
      </div>

      {/* Título */}
      <div style={{width:"758px",height:"80px",backgroundColor:"#E5D7E1",borderRadius:"74px",display:"flex",justifyContent:"center",alignItems:"center",fontFamily:"Lustria, serif",fontSize:"36px",marginTop:"40px"}}>
        ADICIONAR PRODUTO
      </div>

      {/* Corpo */}
      <div style={{display:"flex",justifyContent:"center",alignItems:"flex-start",marginTop:"60px",gap:"60px"}}>
        {/* Imagens */}
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          <label style={estiloImagem}>
            {imagemPrincipal ? <img src={URL.createObjectURL(imagemPrincipal)} alt="Principal" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"20px"}}/> : "Clique para adicionar imagem"}
            <input type="file" accept="image/*" onChange={handleImagemPrincipal} style={{display:"none"}}/>
          </label>
          <div style={{display:"flex",gap:"10px"}}>
            {imagensExtras.map((img,i)=>(
              <label key={i} style={{...estiloImagem,width:"90px",height:"90px"}}>
                {img ? <img src={URL.createObjectURL(img)} alt={`Extra ${i}`} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"10px"}}/> : "➕"}
                <input type="file" accept="image/*" onChange={handleImagemExtra(i)} style={{display:"none"}}/>
              </label>
            ))}
          </div>
        </div>

        {/* Linha divisória */}
        <div style={{width:"2px",height:"550px",backgroundColor:"#000"}}/>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"16px",width:"400px"}}>
          <input type="text" placeholder="Título" value={titulo} onChange={(e)=>setTitulo(e.target.value)} style={estiloInput} required/>
          <input type="number" placeholder="Valor" value={valor} onChange={(e)=>setValor(e.target.value)} style={estiloInput} required/>

          {/* Campos Cor e Tamanho lado a lado */}
          <div style={{display:"flex",gap:"10px"}}>
            {/* Cor */}
            <div style={{position:"relative",flex:1}}>
              <input type="text" placeholder="Escolha a cor" value={corSelecionada} onFocus={()=>setAbrirPopoverCores(true)}
                readOnly style={estiloInput}/>
              {abrirPopoverCores && (
                <div ref={refPopover} style={{position:"absolute",top:"45px",left:0,width:"100%",backgroundColor:"#fff",border:"1px solid #000",borderRadius:"10px",padding:"8px",zIndex:10}}>
                  {/* Bolinhas cores */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"5px",marginBottom:"5px"}}>
                    {coresMaisUsadas.slice(0,6).map(cor=>(
                      <div key={cor} style={{width:"20px",height:"20px",borderRadius:"50%",backgroundColor:cor,position:"relative",cursor:"pointer"}}
                        onClick={()=>{setCorSelecionada(cor); setCodigoCor(cor);}}>
                        {corSelecionada===cor && (
                          <div style={{position:"absolute",top:"-5px",right:"-5px",width:"16px",height:"16px",backgroundColor:"#dc3545",color:"#fff",borderRadius:"50%",display:"flex",justifyContent:"center",alignItems:"center",fontSize:"10px",cursor:"pointer"}}
                            onClick={e=>{ e.stopPropagation(); setCorSelecionada(""); setCodigoCor(""); }}>
                            X
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"5px",marginBottom:"5px"}}>
                    {coresMaisUsadas.slice(6,12).map(cor=>(
                      <div key={cor} style={{width:"20px",height:"20px",borderRadius:"50%",backgroundColor:cor,position:"relative",cursor:"pointer"}}
                        onClick={()=>{setCorSelecionada(cor); setCodigoCor(cor);}}>
                        {corSelecionada===cor && (
                          <div style={{position:"absolute",top:"-5px",right:"-5px",width:"16px",height:"16px",backgroundColor:"#dc3545",color:"#fff",borderRadius:"50%",display:"flex",justifyContent:"center",alignItems:"center",fontSize:"10px",cursor:"pointer"}}
                            onClick={e=>{ e.stopPropagation(); setCorSelecionada(""); setCodigoCor(""); }}>
                            X
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Campo HEX */}
                  <input type="text" placeholder="#HEX da cor" value={codigoCor} onChange={(e)=>{setCodigoCor(e.target.value); setCorSelecionada(e.target.value);}}
                    style={{marginTop:"5px",height:"25px",border:"1px solid #000",borderRadius:"8px",paddingLeft:"5px",fontSize:"14px"}}/>
                </div>
              )}
            </div>

            {/* Tamanho */}
            <select value={tamanhoSelecionado} onChange={(e)=>setTamanhoSelecionado(e.target.value)} style={{...estiloInput,flex:1}}>
              <option value="">Selecione tamanho</option>
              {tamanhosDisponiveis.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Categoria */}
          <select value={categoriaSelecionada} onChange={(e)=>setCategoriaSelecionada(e.target.value)} style={estiloInput} required={!novaCategoria}>
            <option value="">Selecione uma categoria</option>
            {categorias.map(cat=><option key={cat.id||cat.nome} value={cat.nome}>{cat.nome}</option>)}
            <option value="nova">➕ Adicionar nova categoria...</option>
          </select>
          {categoriaSelecionada==="nova" && <input type="text" placeholder="Digite a nova categoria" value={novaCategoria} onChange={(e)=>setNovaCategoria(e.target.value)} style={estiloInput} required/>}

          <input type="number" placeholder="Estoque" value={estoque} onChange={(e)=>setEstoque(e.target.value)} style={estiloInput} required/>
          <textarea placeholder="Descrição" value={descricao} onChange={(e)=>setDescricao(e.target.value)} style={estiloTextArea} required/>

          <div style={{display:"flex",justifyContent:"flex-end",gap:"16px",marginTop:"20px"}}>
            <button type="submit" style={botaoVerde}>Salvar</button>
            <button type="button" onClick={handleCancelar} style={botaoVermelho}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Estilos
const estiloInput={height:"40px",border:"1px solid #000",borderRadius:"40px",paddingLeft:"15px",fontSize:"16px"};
const estiloTextArea={height:"80px",border:"1px solid #000",borderRadius:"40px",padding:"10px 15px",fontSize:"16px",resize:"none"};
const botaoVerde={backgroundColor:"#28a745",color:"#fff",border:"none",borderRadius:"40px",padding:"10px 30px",fontSize:"16px",cursor:"pointer"};
const botaoVermelho={backgroundColor:"#dc3545",color:"#fff",border:"none",borderRadius:"40px",padding:"10px 30px",fontSize:"16px",cursor:"pointer"};
const estiloImagem={width:"300px",height:"300px",border:"2px dashed #aaa",borderRadius:"20px",display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer",fontSize:"16px",color:"#666",overflow:"hidden",position:"relative"};
