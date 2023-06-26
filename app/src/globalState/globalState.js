import createGlobalState from "react-create-global-state";

export const [useGlobalState, Provider] = createGlobalState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {
    id: "",
    nome: "",
    imagem: "",
    gmail: "",
    loged: false
})

export const [useGlobalModal, ModalProvider] = createGlobalState([]);

export const [useGlobalIndexModal, IndexModalProvider] = createGlobalState(false);

export const [useGlobalIndex, IndexProvider] = createGlobalState()

export const [useGlobalLoading, LoadinProvider] = createGlobalState(false)

export const [useGoogleCredentials, GoogleProvider] = createGlobalState(localStorage.getItem("google") ? JSON.parse(localStorage.getItem("google")) : {
   loged: false
})


