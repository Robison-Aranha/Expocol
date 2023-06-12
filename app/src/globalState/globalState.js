import createGlobalState from "react-create-global-state";

export const [useGlobalState, Provider] = createGlobalState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {
    id: "",
    nome: "",
    imagem: "",
    gmail: "",
    loged: false
})

export const [useGlobalModal, ModalProvider] = createGlobalState([]);



