import React, { useState, useEffect, useRef } from "react";
import { View, Text, Alert, SafeAreaView, Modal, Image } from "react-native";
import firebase from "../../services/connectionFirebase";
import {
  RectButton,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
//import firestore from "@react-native-firebase/firestore";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import { v4 as uuidv4 } from "uuid";

console.disableYellowBox = true;

function Home() {
  const [usuarios, setUsuarios] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [id, setId] = useState("");
  const [nomeReceita, setNomeReceita] = useState("");
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [temPermissao, setTemPermissao] = useState(null);
  const camRef = useRef(null);
  const [foto, setFoto] = useState(null);
  const [openn, setopenn] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setTemPermissao(status === "granted");
      //console.log(status === "granted");
    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setTemPermissao(status === "granted");

      //console.log(status);
    })();

    //setopenn(false);

    (async () => {
      await firebase
        .auth()
        .signInWithEmailAndPassword("eu@gmail.com", "123456");
    })();
  }, []);

  if (temPermissao === null) {
    return <Text>null {temPermissao}</Text>;
  }

  if (temPermissao === false) {
    return <Text>sem permissao: {temPermissao}</Text>;
  }

  async function tirarfoto() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setFoto(data.uri);
      setopenn(true);
      console.log(data);
    }
  }

  async function salvar() {
    const asset = await MediaLibrary.createAssetAsync(foto)
      .then(() => {
        alert("salvo");
      })
      .catch((err) => {
        alert("erro: " + err);
      });
  }

  async function enviar() {
    /* const fileExtension = foto.split(".").pop();
    console.log("EXT: " + fileExtension);

    var uuid = uuidv4();

    const fileName = `${uuid}.${fileExtension}`;
    console.log(fileName); */

    /* const reference = await firebase.storage().ref(`icheff/images/${fileName}`);

    const task = await reference
      .putFile(foto)
      .on(firebase.storage.TaskEvent.STATE_CHANGED, (taskSnapshot) => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
        );
      });

    await task.then((imageSnapshot) => {
      alert("sucesso no envio");
    }); */

    /* const fileExtension = foto.split(".").pop();
    console.log("EXT: " + fileExtension);

    var uuid = uuidv4();

    const fileName = `${uuid}.${fileExtension}`;
    console.log(fileName);

    var storageRef = firebase.storage().ref(`foods/images/${fileName}`);

    storageRef.putFile(foto).on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        console.log("snapshot: " + snapshot.state);
        console.log(
          "progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
          console.log("Success");
        }
      },
      (error) => {
        unsubscribe();
        console.log("image upload error: " + error.toString());
      }
    ); */

    const fileExtension = foto.split(".").pop();
    console.log("EXT: " + fileExtension);

    var uuid = uuidv4();

    const fileName = `${uuid}.${fileExtension}`;
    console.log(fileName);

    const response = await fetch(foto);
    const blob = await response.blob();

    var storageRef = await firebase.storage().ref(`icheff/images/${fileName}`);

    await storageRef
      .put(blob)
      .then((value) => {
        alert("foi");
        console.log(value.downloadURL);
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
  }

  function consolar() {
    console.log(usuarios);
  }

  async function buscar() {
    //buscar dados
    await firebase
      .firestore()
      .collection("usuarios")
      //.doc("aa")
      .get()
      .then((querySnapshot) => {
        console.log("Total users: ", querySnapshot.size);
        setUsuarios([]);

        querySnapshot.forEach((documentSnapshot) => {
          console.log(
            "User ID: ",
            documentSnapshot.id,
            documentSnapshot.data()
          );
          setUsuarios((oldArray) => [
            ...oldArray,
            "User ID: " + documentSnapshot.id,
            documentSnapshot.data(),
          ]);
        });
      });

    /* console.log(users);
    setUsuarios(users); */
  }

  async function cadastrar() {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((value) => {
        //alert("User account created & signed in!");
        setId(value.user.uid);
        try {
          firebase.firestore().collection("usuarios").doc(value.user.uid).set({
            nome,
            email: value.user.email,
            user: "marcoant",
            bio: "master cheff da porraa todaaa meu pcr",
            cidade: "Duque Bacelar",
            nascimento: "23/03/1998",
            nome: "Marco Antônio",
            pais: "Brasil",
            telefone: "098982491476",
            uf: "MA",
          });

          alert("sucesso");
          setEmail("");
          setPassword("");
          setNome("");
        } catch (err) {
          alert(err);
        }
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          alert("That email address is invalid!");
        }

        console.error(error);
      });
  }

  async function addReceita() {
    try {
      //const chave = firebase.firestore().collection("receitas").;

      firebase.firestore().collection("receitas").add({
        nome: nomeReceita,
        usuario_id: id,
        ingredientes: "Milho, molho, malha, sal, suco",
        maisinfos: "rende 3 porções",
        preparo: "Faça isso, faça aquilo",
      });

      alert("sucesso");
      setNomeReceita("");
    } catch (err) {
      alert(err);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 90 }}>
      {/* <TextInput
          style={{
            height: 55,
            backgroundColor: "#ddd",
            width: 300,
            fontSize: 20,
            marginVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
          placeholder="nome"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={{
            height: 55,
            backgroundColor: "#ddd",
            width: 300,
            fontSize: 20,
            marginVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
          placeholder="email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={{
            height: 55,
            backgroundColor: "#ddd",
            width: 300,
            fontSize: 20,
            marginVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
          placeholder="senha"
          value={password}
          onChangeText={setPassword}
        />

        <RectButton
          onPress={cadastrar}
          style={{
            height: 50,
            width: 100,
            backgroundColor: "green",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5,
          }}
        >
          <Text style={{ fontSize: 20, color: "#fff" }}>Cadastrar</Text>
        </RectButton>

        <RectButton
          onPress={buscar}
          style={{
            height: 50,
            width: 100,
            backgroundColor: "blue",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5,
          }}
        >
          <Text style={{ fontSize: 20, color: "#fff" }}>Buscar</Text>
        </RectButton>

        <RectButton
          onPress={consolar}
          style={{
            height: 50,
            width: 100,
            backgroundColor: "#cc0000",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5,
          }}
        >
          <Text style={{ fontSize: 20, color: "#fff" }}>Consolar</Text>
        </RectButton>

        <TextInput
          style={{
            height: 55,
            backgroundColor: "#ddd",
            width: 300,
            fontSize: 20,
            marginVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
          placeholder="nome receita"
          value={nomeReceita}
          onChangeText={setNomeReceita}
        />

        <RectButton
          onPress={addReceita}
          style={{
            height: 50,
            width: 100,
            backgroundColor: "grey",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5,
          }}
        >
          <Text style={{ fontSize: 20, color: "#fff", textAlign: "center" }}>
            Add Receita
          </Text>
        </RectButton> */}
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Camera style={{ width: 300, height: 400 }} type={type} ref={camRef}>
          <RectButton
            onPress={() => {
              type === Camera.Constants.Type.back
                ? setType(Camera.Constants.Type.front)
                : setType(Camera.Constants.Type.back);
            }}
            style={{
              height: 50,
              width: 100,
              backgroundColor: "grey",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 5,
            }}
          >
            <Text style={{ fontSize: 20, color: "#fff", textAlign: "center" }}>
              Trocar
            </Text>
          </RectButton>
        </Camera>

        <RectButton
          onPress={tirarfoto}
          style={{
            height: 50,
            width: 100,
            backgroundColor: "#cc0000",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5,
          }}
        >
          <Text style={{ fontSize: 20, color: "#fff", textAlign: "center" }}>
            Tirar foto
          </Text>
        </RectButton>

        {openn && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              margin: 20,
            }}
          >
            <Image
              style={{ width: 300, height: 400, borderRadius: 10 }}
              source={{ uri: foto }}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <RectButton
                onPress={() => setopenn(false)}
                style={{
                  height: 50,
                  width: 100,
                  backgroundColor: "#cc0000",
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 5,
                }}
              >
                <Text
                  style={{ fontSize: 20, color: "#fff", textAlign: "center" }}
                >
                  Sair
                </Text>
              </RectButton>

              <RectButton
                onPress={salvar}
                style={{
                  height: 50,
                  width: 100,
                  backgroundColor: "#cc0000",
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 5,
                }}
              >
                <Text
                  style={{ fontSize: 20, color: "#fff", textAlign: "center" }}
                >
                  Salvar
                </Text>
              </RectButton>

              <RectButton
                onPress={enviar}
                style={{
                  height: 50,
                  width: 100,
                  backgroundColor: "blue",
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 5,
                }}
              >
                <Text
                  style={{ fontSize: 20, color: "#fff", textAlign: "center" }}
                >
                  Enviar
                </Text>
              </RectButton>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;
