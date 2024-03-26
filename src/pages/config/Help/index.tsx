// @flow
import * as React from "react";

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
} from "@ionic/react";

import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts";
import { chatbox, chevronBackOutline, documentLock } from "ionicons/icons";

const Help = () => {
  const { sessionUser } = useAuth();

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/config"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">Ajuda</IonTitle>
              </Link>
              <div className="py-10 px-5">
                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow h-20 flex items-center"
                  lines="none"
                  id="open-modal"
                  key={"Categorias"}
                >
                  <IonIcon src={documentLock} />
                  <IonLabel className="ml-5">
                    <h2>Termos e Política de Privacidade</h2>
                  </IonLabel>
                </IonItem>
                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow h-20 flex items-center"
                  lines="none"
                  id="open-modal"
                  key={"Especialidades"}
                >
                  <IonIcon src={chatbox} />
                  <IonLabel className="ml-5">
                    <a href="mailto:marcosgarcia.oliveira02@gmail.com">
                      Fale Conosco
                    </a>
                  </IonLabel>
                </IonItem>
              </div>
            </div>
          </>
        )}
        {sessionUser === null && (
          <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <p className="text-black">você precisa estar logado</p>
            <Link to="/signup" className="text-cyan-500">
              Clique aqui
            </Link>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Help;
