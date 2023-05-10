import { crearEmailPassword } from "../../Firebase/config";
import Swal from 'sweetalert2'
import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { saveUsuario } from "../../Firebase/api";
import BlockUI from "../../components/BlockUi";



function Registrar() {

  const [loading, setLoading] = useState(false);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [selectedImage, setSelectedImage] = useState("");

  async function guardarUsuario(url){

      let user = {
          nombre: nombre,
          email: email,
          perfil: url
      }
      
      try {
        await saveUsuario(user);
        await crearEmailPassword(email, password);
        setLoading(false);
        limpiar();
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Bienvenido a la plataforma',
          confirmButtonText: 'Ok'
        });
      }
       catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          })
      }
  }

  const sigIn = (e) => {
    e.preventDefault()

    if(nombre === "" || email === "" || password === "" || password2 === "" || selectedImage === ""){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos son obligatorios',
        })
    }else{
      if(password !== password2){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Las contraseñas no coinciden',
          })
      }else{
        setLoading(true);
        const storage = getStorage();
        const storageRef = ref(storage, selectedImage.name);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);
    
        uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
         },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
            })
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
             guardarUsuario(downloadURL);
          });
        });
      }
    }
  };


  const limpiar = () => {
    setLoading(false);
    setNombre("");
    setEmail("");
    setPassword("");
    setPassword2("");
    setSelectedImage("");
  };  

    return (
      <div className="Login">
        <div className="login-card">
        <h2>Registro</h2>
        <form className="login-form" onSubmit={sigIn}>
          <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required/>
          <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required/>
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}/>
          <input type="password" placeholder="Repite la contraseña" value={password2} onChange={e => setPassword2(e.target.value)} required minLength={6}/>
         
          <label htmlFor="portada" className="form-label">Foto de perfil:</label>
          <input type="file" className="form-control" id="portada" accept="image/*" onChange={e => setSelectedImage(e.target.files[0])} required/>
           
          <a href="/">¿Ya tienes una cuenta? Inicia sesión aqui!</a>
          <button type="submit" className="login-btn">REGISTRARTE</button>
        </form>
      </div>

      <BlockUI  blocking={loading} />

      </div>
    );
  }
  
  export default Registrar;
  