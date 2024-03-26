// @flow
import * as React from "react";

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  useIonToast,
} from "@ionic/react";

import { Link } from "react-router-dom";
import { chevronBackOutline, mailOpen, mailUnread } from "ionicons/icons";
import { useAuth } from "../../contexts";
import supabase from "../../utils/supabase";

const Notifications = () => {
  const { sessionUser } = useAuth();
  const [showToast] = useIonToast();

  const [allNotifications, setAllNotifications] = React.useState<Array<any>>(
    []
  );

  const getNotifications = async () => {
    try {
      let { data: notifications, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("for", sessionUser?.id);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (notifications) {
        setAllNotifications(notifications);
      }
    } catch (error) {
      if (error) {
        await showToast({
          position: "top",
          message: `${error}`,
          duration: 3000,
        });
        console.log(error);
      }
    }
  };

  const handleChangeStatusNotification = async (id: string) => {
    try {
      let { data: notifications, error } = await supabase
        .from("notifications")
        .update({ status: "read" })
        .eq("id", id);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (notifications) {
        getNotifications();
      }
    } catch (error) {
      if (error) {
        await showToast({
          position: "top",
          message: `${error}`,
          duration: 3000,
        });
        console.log(error);
      }
    }
  };

  const handleCleanAll = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .delete()
        .eq("for", sessionUser?.id);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (data) {
        await showToast({
          position: "top",
          message: "Excluidas com sucesso",
          duration: 3000,
        });
        getNotifications();
      }
    } catch (error) {
      if (error) {
        await showToast({
          position: "top",
          message: `${error}`,
          duration: 3000,
        });
        console.log(error);
      }
    }
  };

  React.useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    console.log("lets go");
    const mySubscription = supabase
      .from("notifications")
      .on("*", (payload) => {
        console.log(payload);
        if (payload?.eventType === "UPDATE") {
          getNotifications();
        } else if (payload?.eventType === "INSERT") {
          setAllNotifications((current) => [...current, payload.new]);
        } else {
          return null;
        }
      })
      .subscribe();
  }, []);

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

                <IonTitle className="font-bold">Notificações</IonTitle>
              </Link>
              <div className="py-10 px-5">
                {allNotifications.length > 0 && (
                  <p
                    onClick={handleCleanAll}
                    className="text-sm font-medium text-gray-600 text-right"
                  >
                    Limpar Todas
                  </p>
                )}
                {allNotifications.map((notification, index) => (
                  <div key={index}>
                    {notification?.status === "read" && (
                      <IonItem
                        className="mt-5 mb-3 bg-white rounded-3xl shadow-md border-b border-r border-green-500 h-20 flex items-center"
                        lines="none"
                        id="open-modal"
                      >
                        <IonIcon className="text-green-500" src={mailOpen} />
                        <IonLabel className="ml-5">
                          <p>
                            {notification?.type === "schedule"
                              ? `Novo agendamento ${notification?.message}`
                              : notification?.type === "canceled"
                              ? `Agendamento ${notification?.message} cancelado`
                              : `Nova mensagem ${notification?.message}`}
                          </p>
                        </IonLabel>
                      </IonItem>
                    )}
                  </div>
                ))}

                {/* UNREAD */}
                {allNotifications.length > 0 && (
                  <IonTitle className="text-gray-500">Não lidas</IonTitle>
                )}

                {allNotifications.map((notification, index) => (
                  <div key={index}>
                    {notification?.status === "unread" && (
                      <IonItem
                        className="mt-5 mb-3 bg-white rounded-3xl shadow-md border-b border-r border-orange-500 h-20 flex items-center"
                        lines="none"
                        id="open-modal"
                        onClick={() => {
                          handleChangeStatusNotification(notification?.id);
                        }}
                      >
                        <IonIcon className="text-orange-500" src={mailUnread} />
                        <IonLabel className="ml-5">
                          <p>
                            {notification?.type === "schedule"
                              ? `Novo agendamento ${notification?.message}`
                              : notification?.type === "canceled"
                              ? `Agendamento ${notification?.message} cancelado`
                              : `Nova mensagem ${notification?.message}`}
                          </p>
                        </IonLabel>
                      </IonItem>
                    )}
                  </div>
                ))}
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

export default Notifications;
