import createGlobalState from "react-create-global-state";

export const [useGlobalState, Provider] = createGlobalState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {
    id: "",
    nome: "",
    imagem: "",
    gmail: "",
    schedulerKey: "",
    loged: false,
    zoneId: "America/Sao_Paulo"
})


export const [useGlobalModal, ModalProvider] = createGlobalState([]);

export const [useGlobalIndexesModal, IndexesModalProvider] = createGlobalState(false);

export const [useGlobalIndex, IndexProvider] = createGlobalState()

export const [useGlobalChangeProfile, ChangeProfileProvider] = createGlobalState()

export const [useGlobalLoading, LoadingProvider] = createGlobalState(false)

export const [useGoogleCredentials, GoogleProvider] = createGlobalState()

export const [useClassroomToken, ClassroomTokenProvider] = createGlobalState()

export const [useClassroomUtils, ClassroomUtilsProvider] = createGlobalState({ courses: null, monthWorks: null})

export const [useClassroomSelectedWork, ClassroomSelectedWorkProvider] = createGlobalState()

export const [useAnexoModal, AnexoProvider] = createGlobalState()

export const [useLoadCalendar, LoadCalendarProvider] = createGlobalState()

export const [useGlobalEvent, EventProvider] = createGlobalState({
    visualization: false,
    load: false,
    event : null,
    mode: 0
})

export const [useGlobalCalendar, CalendarProvider] = createGlobalState()


