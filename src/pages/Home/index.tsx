import React from "react";

import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import {
  bag,
  calendar,
  checkmarkCircle,
  notifications,
  people,
  time,
} from "ionicons/icons";

import servicesIcon from "../../assets/barberServicesCut.png";

import { Link } from "react-router-dom";
import { useAuth } from "../../contexts";

import supabase from "../../utils/supabase";
import OneSignal from "onesignal-cordova-plugin";

const Home = () => {
  const [showToast] = useIonToast();
  const [schedulesToShow, setSchedulesToShow] = React.useState<Array<any>>([]);
  const [schedulesToShowOrdered, setSchedulesToShowOrdered] = React.useState<
    Array<any>
  >([]);
  const [currentName, setcurrentName] = React.useState(null);
  const [profileImage, setProfileImage] = React.useState<string>("");
  const [currentProfile, setCurrentProfile] = React.useState<any>([]);

  const [notification, setNotification] = React.useState<boolean>(false);

  const { sessionUser } = useAuth();
  // console.log(sessionUser);

  const router = useIonRouter();

  const getSchedulesToShow = async () => {
    let date = new Date();
    let currentDate = new Intl.DateTimeFormat("en-US").format(date);

    try {
      if (sessionUser?.user_metadata?.barber) {
        let { data, error } = await supabase
          .from("schedules")
          .select("*")

          .eq("date", currentDate)
          .eq("barber_id", sessionUser?.id)
          .neq("status", "canceled");

        if (error) {
          await showToast({
            position: "top",
            message: error.message,
            duration: 3000,
          });
          console.log(error);
        }

        if (data) {
          setSchedulesToShow(data);
        }
      } else {
        let { data, error } = await supabase
          .from("schedules")
          .select("*")

          .eq("date", currentDate)
          .eq("name", sessionUser?.user_metadata?.full_name);

        if (error) {
          await showToast({
            position: "top",
            message: error.message,
            duration: 3000,
          });
          console.log(error);
        }

        if (data) {
          setSchedulesToShow(data);
        }
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    }
  };

  const orderSchedulesByTime = () => {
    try {
      let orderArray = [];
      // console.log(schedulesToShow[0]?.times[0].slice(0, 2));
      console.log(sessionUser?.user_metadata?.client);

      for (let i = 0; i < 21; i++) {
        for (let s = 0; s < schedulesToShow.length; s++) {
          // console.log(
          //   `scheduletime: ${schedulesToShow[s]?.times[0].slice(
          //     0,
          //     2
          //   )} === other: ${i}`
          // );

          if (i == schedulesToShow[s]?.times[0].slice(0, 2)) {
            orderArray.push(schedulesToShow[s]);
          }
        }
      }

      console.log(orderArray);
      setSchedulesToShowOrdered(orderArray);
    } catch (error) {}
  };

  const getProfile = async () => {
    try {
      if (sessionUser?.user_metadata?.barber) {
        let { data, error } = await supabase
          .from("barbers")
          .select("*")

          .eq("id", sessionUser?.id);

        if (error) {
          await showToast({
            position: "top",
            message: error.message,
            duration: 3000,
          });
          console.log(error);
        }

        if (data) {
          setCurrentProfile(data);
          // console.log(data);
        }
      } else {
        let { data, error } = await supabase
          .from("clients")
          .select("*")

          .eq("id", sessionUser?.id);

        if (error) {
          await showToast({
            position: "top",
            message: error.message,
            duration: 3000,
          });
          console.log(error);
        }

        if (data) {
          setCurrentProfile(data);
          // console.log(data);
        }
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    } finally {
    }
  };

  const getAvatarUrl = async () => {
    const { publicURL, error } = supabase.storage
      .from("avatar-images")
      .getPublicUrl(`public/${currentProfile[0].avatar_url}`);

    if (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
      console.log(error);
    }
    if (publicURL) {
      // console.log(publicURL);
      setProfileImage(publicURL);
    }
  };

  const getNotifications = async () => {
    try {
      let { data: notifications, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("for", sessionUser?.id)
        .eq("status", "unread");

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
        console.log(error);
      }

      if (notifications) {
        if (notifications.length > 0) {
          setNotification(!notification);
        }
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

  const OneSignalNotifyInit = () => {
    OneSignal.setAppId("be52199d-a047-430a-b3fd-e3ba2cb55d6d");
    OneSignal.removeExternalUserId();

    OneSignal.setExternalUserId(`${sessionUser?.id}`);
    OneSignal.setNotificationOpenedHandler(function (jsondata) {
      console.log("new Notify ");
    });
  };

  React.useEffect(() => {
    getSchedulesToShow();
    getProfile();
    getNotifications();
    // OneSignalNotifyInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getAvatarUrl();
    orderSchedulesByTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]);

  React.useEffect(() => {
    orderSchedulesByTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedulesToShow]);

  React.useEffect(() => {
    const nameStr = sessionUser?.user_metadata?.full_name;
    const nameArray = nameStr.split(" ");
    setcurrentName(nameArray[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      {sessionUser && (
        <IonContent fullscreen>
          <div className="h-screen py-10 px-5 bg-gray-100">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <IonText className="text-sm text-gray-500 mb-1 font-light">
                  Bem vindo{"(a)"}
                </IonText>
                <IonText
                  onClick={() => {
                    document.location.reload();
                  }}
                  className="text-black-200 text-2xl font-bold uppercase"
                >
                  {currentName}
                </IonText>
              </div>
              <div className="flex items-center">
                <IonIcon
                  className={`w-5 h-5 mr-5 ${
                    notification ? "text-orange-500" : "text-gray-500"
                  }`}
                  src={notifications}
                  onClick={() => router.push("/app/notifications")}
                />
                <IonAvatar
                  onClick={() => {
                    document.location.replace(
                      `/app/profile/${sessionUser?.id}`
                    );
                  }}
                  className="flex items-center w-[70px] h-[70px] shadow-lg"
                >
                  <img
                    className="w-[70px] h-[70px] "
                    src={profileImage}
                    alt="profile"
                  />
                </IonAvatar>
              </div>
            </div>
            <div className={`grid grid-cols-4  gap-4 py-3`}>
              <div
                onClick={() => {
                  document.location.replace("/app/calendar");
                }}
                className="flex flex-col justify-center items-center h-32 col-span-2 shadow-lg rounded-3xl bg-gradient-to-l from-green-800 to-green-600"
              >
                <IonIcon className="mb-5 w-8 h-8 text-white" src={calendar} />

                {sessionUser?.user_metadata?.client ? (
                  <IonText className="text-white">Agendar</IonText>
                ) : (
                  <IonText className="text-white">Calendário</IonText>
                )}

                {/* {sessionUser?.user_metadata?.client && (
                  <IonText className="text-white">Agendar</IonText>
                )} : {sessionUser?.user_metadata?.barber && (
                  <IonText className="text-white">teste</IonText>
                )} */}

                {/* <IonText className="text-white">Calendário</IonText> */}
              </div>

              <Link
                to={"/app/barbers"}
                className="flex flex-col justify-center items-center col-span-2 h-32 shadow-lg rounded-3xl bg-gradient-to-r from-white to-white-200"
              >
                <IonIcon className="mb-5 w-8 h-8 text-gray-500" src={people} />

                <IonText className="text-gray-400 ">barbeiros</IonText>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3">
              <Link
                to="/app/products"
                className="flex flex-col justify-center items-center h-32 shadow-lg rounded-3xl bg-gradient-to-r from-white to-white-200"
              >
                <IonIcon className="mb-5 w-8 h-8 text-gray-500" src={bag} />

                <IonText className="text-gray-400">Produtos</IonText>
              </Link>
              <Link
                to="/app/services/"
                className="flex flex-col justify-center items-center h-32 col-span-2 shadow-lg rounded-3xl bg-gradient-to-l from-green-800 to-green-600"
              >
                {/* <IonIcon className="mb-5 w-8 h-8 text-white" src={cut} /> */}
                <img className="w-10 h-10" src={servicesIcon} alt="" />
                <IonText className="text-white my-1">Serviços</IonText>
              </Link>
            </div>

            <div className="w-full h-auto shadow-lg rounded-3xl py-5 bg-red">
              <div className="flex justify-start mx-5">
                <IonIcon className="mb-5 w-6 h-6 text-gray-500" src={time} />
                <IonText className="ml-2 text-gray-500">
                  Agendamentos hoje
                </IonText>
              </div>
              <div className="flex justify-center">
                <div className="h-[1px] w-4/5 bg-gray-500" />
              </div>
              <IonList className="w-full h-full p-5 rounded-3xl bg-transparent">
                {schedulesToShowOrdered.map((agendamento, index) => (
                  <div
                    onClick={() => {
                      document.location.replace(
                        `/app/edit-schedule/${agendamento.id}`
                      );
                    }}
                    key={index}
                    className="grid grid-cols-4 w-full py-2"
                  >
                    <div className="flex justify-start items-center">
                      <IonIcon
                        className={`w-7 h-7 ${
                          agendamento.status === "pending"
                            ? "text-orange-700"
                            : agendamento.status === "done"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                        src={checkmarkCircle}
                      />
                    </div>
                    <IonLabel className="text-gray-500">
                      {agendamento.name}
                    </IonLabel>
                    <div className="flex justify-end items-center">
                      <IonLabel className="mr-3 text-gray-500">
                        {agendamento.times[0].substring(0, 5)}
                      </IonLabel>
                    </div>
                    <div className="flex justify-end items-center">
                      <IonLabel className="mr-3 text-gray-500">
                        {agendamento.times[
                          agendamento.times.length - 1
                        ].substring(0, 5)}
                      </IonLabel>
                    </div>
                  </div>
                ))}
              </IonList>
            </div>
          </div>
        </IonContent>
      )}
      {sessionUser === null && (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
          <p className="text-black">você precisa estar logado</p>
          <Link to="/signup" className="text-cyan-500">
            Clique aqui
          </Link>
        </div>
      )}
    </IonPage>
  );
};

export default Home;
