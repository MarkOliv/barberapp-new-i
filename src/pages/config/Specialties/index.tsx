// @flow
import * as React from "react";

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  useIonRouter,
} from "@ionic/react";

import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts";
import {
  bag,
  build,
  chevronBackOutline,
  cut,
  person,
  wallet,
} from "ionicons/icons";

const Specialties = () => {
  const { sessionUser } = useAuth();

  const router = useIonRouter();

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

                <IonTitle className="font-bold">Relatórios</IonTitle>
              </Link>
              <div className="py-10 px-5">
                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow"
                  lines="none"
                  id="open-modal"
                  onClick={() => {
                    router.push("/app/config/register-specialties");
                  }}
                >
                  <IonIcon src={cut} />
                  <IonLabel className="ml-5">
                    <h2>Cadastrar Especialidades</h2>
                    <p>cadastro e remoção de especialidades</p>
                  </IonLabel>
                </IonItem>

                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow"
                  lines="none"
                  id="open-modal"
                  onClick={() => {
                    router.push("/app/config/edit-my-specialties");
                  }}
                >
                  <IonIcon src={person} />
                  <IonLabel className="ml-5">
                    <h2>Editar minhas especialidades</h2>
                    <p>Especialidades para o seu perfil</p>
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

export default Specialties;
