import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonThumbnail,
  IonTitle,
  useIonToast,
} from "@ionic/react";

import barberPerson from "../../assets/barber-person.png";

import React from "react";
import { Link } from "react-router-dom";

import supabase from "../../utils/supabase";
import { chevronBackOutline } from "ionicons/icons";
import { useAuth } from "../../contexts";

const Barbers = () => {
  const [showToast] = useIonToast();
  const { sessionUser } = useAuth();

  const [barbers, setBarbers] = React.useState<any>([]);

  const getBarbers = async () => {
    try {
      let { data: barbers, error } = await supabase.from("barbers").select("*");

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (barbers) {
        await setBarbers(barbers);
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
    getBarbers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      {sessionUser && (
        <>
          <IonContent>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/home"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">Barbeiros</IonTitle>
              </Link>
              {sessionUser?.user_metadata?.barber && (
                <div className="py-10 px-5">
                  <Link
                    to="/register-barber"
                    className="flex flex-col justify-center items-center h-32 col-span-2 shadow-lg rounded-3xl bg-gradient-to-l from-green-800 to-green-600"
                  >
                    {/* <IonIcon className="mb-5 w-8 h-8 text-white" src={bag} /> */}
                    <img className="w-16 h-16" src={barberPerson} alt="" />
                    <IonText className="text-white my-1">
                      Cadastrar novo barbeiro
                    </IonText>
                  </Link>
                </div>
              )}
              <div className="h-[34rem] overflow-auto">
                {barbers.map((barber: any, index: any) => (
                  <IonItem
                    key={index}
                    lines="none"
                    className="rounded-3xl mx-5 my-2 shadow-md"
                    onClick={() => {
                      document.location.replace(`/app/profile/${barber?.id}`);
                    }}
                  >
                    <IonThumbnail slot="start">
                      <img
                        alt="profilePicture"
                        className="rounded-full w-14 h-14"
                        src={`https://eikbnmphzjoeopujpnnt.supabase.co/storage/v1/object/public/avatar-images/public/${barber?.avatar_url}`}
                      />
                    </IonThumbnail>
                    <IonLabel>
                      <h2>{barber?.username}</h2>
                      {barber?.id === sessionUser?.id && <p>(eu)</p>}
                    </IonLabel>
                  </IonItem>
                ))}
              </div>
            </div>
          </IonContent>
        </>
      )}
      {sessionUser === undefined && (
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

export default Barbers;
