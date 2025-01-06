import "./modal-welcome.style.css";
import CatImage from "../../assets/account/gato_poggers.jpg";

export const ModalWelcome = (props) => {
  return (
    <div className={"ModalWelcome-section" + (props.modal ? " modal" : "")}>
      <div className="ModalWelcome-container">
        <div className="ModalWelcome-exit">
          <h4 className="ModalWelcome-title">
            <strong>Bem vindo(a)!!!</strong>
          </h4>
          <button
            className="ModalWelcome-exit-button button-black button-small"
            onClick={() => props.setModal()}
          >
            {" "}
            X{" "}
          </button>
        </div>
        <div className="ModalWelcome-content">
          <h5> Obrigado por se cadastrar!! </h5>
          <h6> Boa apresentação </h6>
          <img src={CatImage} />
        </div>
      </div>
    </div>
  );
};
