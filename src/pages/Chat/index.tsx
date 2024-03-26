// @flow
import * as React from "react";

import { IonContent, IonIcon, IonPage, IonTitle } from "@ionic/react";

import { Link } from "react-router-dom";

import { chevronBackOutline } from "ionicons/icons";
import { useAuth } from "../../contexts";

const Chat = () => {
  const { sessionUser } = useAuth();

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/home"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">Chat</IonTitle>
              </Link>
              <div className="flex items-center justify-center h-5/6 ">
                <p className="text-gray-600">Em breve..</p>
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

export default Chat;
