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
  bagAdd,
  chatbox,
  chevronBackOutline,
  documentLock,
  people,
  peopleCircle,
  peopleCircleOutline,
  wallet,
  walletOutline,
} from "ionicons/icons";

const Reports = () => {
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
                  className="mt-5 mb-3 bg-white rounded-3xl shadow h-20 flex items-center"
                  lines="none"
                  onClick={() => {
                    router.push("/app/config/reports/balance");
                  }}
                >
                  <IonIcon src={wallet} />
                  <IonLabel className="ml-5">
                    <h2>Balanço Financeiro</h2>
                  </IonLabel>
                </IonItem>

                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow h-20 flex items-center"
                  lines="none"
                  onClick={() => {
                    router.push("/app/config/reports/balanceday");
                  }}
                >
                  <IonIcon src={walletOutline} />
                  <IonLabel className="ml-5">
                    <h2>Ganhos do Dia</h2>
                  </IonLabel>
                </IonItem>

                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow h-20 flex items-center"
                  lines="none"
                  onClick={() => {
                    router.push("/app/config/reports/number-clients-month");
                  }}
                >
                  <IonIcon src={people} />
                  <IonLabel className="ml-5">
                    <h2>Clientes do mês</h2>
                  </IonLabel>
                </IonItem>

                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow h-20 flex items-center"
                  lines="none"
                  onClick={() => {
                    router.push("/app/config/reports/number-clients-day");
                  }}
                >
                  <IonIcon src={peopleCircleOutline} />
                  <IonLabel className="ml-5">
                    <h2>Clientes do Dia</h2>
                  </IonLabel>
                </IonItem>

                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow h-20 flex items-center"
                  lines="none"
                  onClick={() => {
                    router.push("/app/config/reports/add-expenses");
                  }}
                >
                  <IonIcon src={bagAdd} />
                  <IonLabel className="ml-5">
                    <h2>Adicionar Despesa</h2>
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

export default Reports;
