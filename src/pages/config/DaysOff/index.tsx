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
  useIonToast,
} from "@ionic/react";

import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts";
import { beer, chevronBackOutline, restaurant, time } from "ionicons/icons";
import supabase from "../../../utils/supabase";

const DaysOff = () => {
  const { sessionUser } = useAuth();

  const [showToast] = useIonToast();
  const router = useIonRouter();

  const [currentProfile, setcurrentProfile] = React.useState<Array<any>>([]);

  const handleGetOffWork = async () => {
    try {
      let { data: offWork, error } = await supabase
        .from("barbers")
        .select("off_work")

        .eq("id", sessionUser?.id);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (offWork) {
        setcurrentProfile(offWork);
        // console.log(offWork);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  const handleChangeOffWorkDB = async () => {
    try {
      const { data: offWork, error } = await supabase
        .from("barbers")
        .update({ off_work: !currentProfile[0]?.off_work })
        .eq("id", sessionUser?.id);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (offWork) {
        await showToast({
          position: "top",
          message: "Alterado com sucesso",
          duration: 3000,
        });

        setcurrentProfile(offWork);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  const handleChangeOffWorkUserMeta = async () => {
    try {
      const { user, error } = await supabase.auth.update({
        data: { off_work: !currentProfile[0]?.off_work },
      });

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (user) {
        handleChangeOffWorkDB();
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  React.useEffect(() => {
    handleGetOffWork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <IonContent>
        {sessionUser && (
          <>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/config/"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">Day Off</IonTitle>
              </Link>
              <div className="py-10 px-5">
                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow h-20 flex items-center"
                  lines="none"
                  id="open-modal"
                  key={"LunchTime"}
                  onClick={() => {
                    router.push("/app/config/daysoff/lunch-time");
                  }}
                >
                  <IonIcon src={restaurant} />
                  <IonLabel className="ml-5">
                    <h2>Meu horário de almoço</h2>
                  </IonLabel>
                </IonItem>
                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow h-20 flex items-center"
                  lines="none"
                  id="open-modal"
                  key={"BlockTimes"}
                  onClick={() => {
                    router.push("/app/config/daysoff/block-times");
                  }}
                >
                  <IonIcon src={time} />

                  <IonLabel className="ml-5">
                    <h2>Bloqueio de horários</h2>
                  </IonLabel>
                </IonItem>
                <IonItem
                  className="mt-5 mb-3 bg-white rounded-3xl shadow h-20 flex items-center"
                  lines="none"
                  id="open-modal"
                  key={"Especialidades"}
                  onClick={() => {
                    handleChangeOffWorkUserMeta();
                  }}
                >
                  <IonIcon src={beer} />
                  <IonLabel className="ml-5">
                    {sessionUser?.user_metadata?.off_work
                      ? "Sair de Folga"
                      : "Entrar de Folga"}
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

export default DaysOff;
